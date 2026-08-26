import os
import json
import joblib
import pandas as pd
import numpy as np
import shap
from explain.feature_meanings import FEATURE_EXPLANATIONS

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "model", "trust_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "model", "feature_columns.json")

# Lazy loaded singletons
_explainer = None
_feature_cols = None

def get_explainer():
    global _explainer, _feature_cols
    if _explainer is None:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURES_PATH):
            raise FileNotFoundError(
                f"Model or features files not found at {MODEL_PATH} or {FEATURES_PATH}. Please run training first."
            )
        model = joblib.load(MODEL_PATH)
        with open(FEATURES_PATH, "r") as f:
            _feature_cols = json.load(f)
        
        # Use TreeExplainer for Random Forest / XGBoost models
        _explainer = shap.TreeExplainer(model)
    return _explainer, _feature_cols

def get_shap_contributions(df_input, feature_cols):
    explainer, _ = get_explainer()
    try:
        # Calculate SHAP values
        shap_vals = explainer.shap_values(df_input)
        
        # Handle list output (standard for scikit-learn RandomForestClassifier)
        if isinstance(shap_vals, list):
            # Class 1 (legitimate) is at index 1
            if len(shap_vals) == 2:
                return shap_vals[1][0]
            else:
                return shap_vals[0][0]
        # Handle 3D array (samples, features, classes)
        elif len(shap_vals.shape) == 3:
            return shap_vals[0, :, 1]
        # Handle 2D array (samples, features) (standard for XGBoost)
        elif len(shap_vals.shape) == 2:
            return shap_vals[0]
        else:
            return shap_vals
    except Exception as e:
        print(f"SHAP explanation calculation failed: {e}")
        # Fallback to dummy uniform contributions in case of failure
        return np.zeros(len(feature_cols))

def explain_prediction(features_dict: dict) -> dict:
    """
    Computes SHAP explanations for a single prediction and converts them
    to human-readable reasons and suggestions.
    """
    _, feature_cols = get_explainer()
    
    # Format input into a DataFrame with correct feature ordering
    df_input = pd.DataFrame([features_dict])[feature_cols]
    
    # Calculate shap values
    shap_contributions = get_shap_contributions(df_input, feature_cols)
    
    # Combine features with their values and contributions
    contributions = []
    for i, col in enumerate(feature_cols):
        contrib = float(shap_contributions[i])
        val = features_dict[col]
        # 1 means legitimate (passed security check), -1 or 0 means suspicious (failed)
        passed = (val == 1)
        
        contributions.append({
            "feature": col,
            "contribution": contrib,
            "abs_contribution": abs(contrib),
            "passed": passed,
            "value": val
        })
        
    # Sort features by absolute contribution to find the top drivers
    contributions.sort(key=lambda x: x["abs_contribution"], reverse=True)
    
    # Top 6 drivers of the classification
    top_features = contributions[:6]
    
    reasons = []
    suggestions = []
    
    for item in top_features:
        feat_name = item["feature"]
        passed = item["passed"]
        
        explanation = FEATURE_EXPLANATIONS.get(feat_name)
        if explanation:
            title = explanation["title"]
            state = "passed" if passed else "failed"
            reason_text = explanation[state]["reason"]
            suggestion_text = explanation[state]["suggestion"]
            
            # Form explanation statement
            reasons.append({
                "label": f"{title}: {reason_text}",
                "passed": passed
            })
            
            # Suggest remediation if it failed
            if not passed and suggestion_text != "No action needed.":
                suggestions.append(f"{title}: {suggestion_text}")
                
    # Fallback default suggestion if no vulnerabilities were identified
    if not suggestions:
        suggestions.append("No critical issues found. Maintain current configuration and monitor SSL certificates.")
        
    return {
        "reasons": reasons,
        "suggestions": suggestions
    }
