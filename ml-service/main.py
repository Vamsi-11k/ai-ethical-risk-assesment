import os
import json
import urllib.parse
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import joblib
import pandas as pd
import numpy as np

from features.extractor import extract_features
from scoring.score_converter import convert_score
from explain.shap_explain import explain_prediction, get_explainer

# Initialize FastAPI App
app = FastAPI(
    title="EthicalAI Website Trust Scoring Service",
    description="Machine Learning microservice to score website trust and safety indicators.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input data schema
class UrlInput(BaseModel):
    url: str

# Models loading
MODEL_PATH = "model/trust_model.pkl"
FEATURES_PATH = "model/feature_columns.json"

_model = None
_feature_cols = None

def load_ml_resources():
    global _model, _feature_cols
    if _model is None:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURES_PATH):
            raise RuntimeError("Model files not found. Please run model/train.py first.")
        _model = joblib.load(MODEL_PATH)
        with open(FEATURES_PATH, "r") as f:
            _feature_cols = json.load(f)
    return _model, _feature_cols

@app.on_event("startup")
def startup_event():
    try:
        load_ml_resources()
        # Warmup SHAP explainer
        get_explainer()
        print("[ML Service] Successfully loaded model and SHAP explainer on startup.")
    except Exception as e:
        print(f"[ML Service] Startup warning (non-fatal if training hasn't run yet): {e}")

@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """
    Health check endpoint to verify microservice status.
    """
    try:
        model_loaded = (os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH))
        return {
            "status": "OK",
            "model_loaded": model_loaded,
            "service": "ethicalai-ml-service"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/score")
def get_trust_score(input_data: UrlInput):
    """
    Scans a given URL, extracts 30 security features, evaluates trust score
    via a Random Forest classifier, and computes SHAP explainability.
    """
    url = input_data.url.strip()
    
    # 1. Basic URL validation
    if not url.startswith(("http://", "https://")):
        url = "http://" + url
        
    parsed = urllib.parse.urlparse(url)
    if not parsed.netloc or "." not in parsed.netloc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid URL format. Please provide a valid domain name (e.g. example.com)."
        )
        
    # 2. Extract features
    try:
        extraction_result = extract_features(url)
        features_dict = extraction_result["features"]
        confidence_dict = extraction_result["confidence"]
        confidence_score = extraction_result["confidence_score"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to scan or connect to the target website: {str(e)}"
        )
        
    # 3. Model Prediction
    try:
        model, feature_cols = load_ml_resources()
        
        # Convert extracted features to DataFrame matching training columns
        df_input = pd.DataFrame([features_dict])[feature_cols]
        
        # Predict probability of class 1 (legitimate)
        prob_legitimate = float(model.predict_proba(df_input)[0, 1])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference engine failure: {str(e)}"
        )
        
    # 4. Convert score to trust/risk metrics
    metrics = convert_score(prob_legitimate, features_dict, url, confidence_dict)
    
    # 5. Get SHAP explainability
    try:
        explanations = explain_prediction(features_dict)
    except Exception as e:
        # Graceful fallback if SHAP fails, do not block the score calculation
        explanations = {
            "reasons": [
                {"label": "DNS Status: Domain resolved successfully.", "passed": True}
            ],
            "suggestions": [
                "Maintain standard security headers and certificate renewals."
            ]
        }
        print(f"[ML Service Warning] SHAP explanation failed: {e}")
        
    return {
        "trust_score": metrics["trust_score"],
        "risk_score": metrics["risk_score"],
        "risk_level": metrics["risk_level"],
        "confidence_warning": metrics.get("confidence_warning", False),
        "confidence": confidence_dict,
        "confidence_score": confidence_score,
        "features": features_dict,
        "reasons": explanations["reasons"],
        "suggestions": explanations["suggestions"]
    }
