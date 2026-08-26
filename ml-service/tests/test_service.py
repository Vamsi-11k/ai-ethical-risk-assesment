import os
import sys
import json
import pytest

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
from features.extractor import extract_features
from scoring.score_converter import convert_score

client = TestClient(app)

def test_feature_extractor_keys():
    """
    Verifies that the feature extractor returns all 30 expected feature columns
    corresponding to the trained model's feature set.
    """
    url = "https://example.com"
    result = extract_features(url)
    features = result["features"]
    
    # Load the expected columns from JSON
    features_json_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "model",
        "feature_columns.json"
    )
    
    assert os.path.exists(features_json_path), "Please run training first before running tests."
    
    with open(features_json_path, "r") as f:
        expected_cols = json.load(f)
        
    # Check that all expected columns are present in extracted features
    for col in expected_cols:
        assert col in features, f"Feature column '{col}' is missing in extractor output."
        assert features[col] in (-1, 0, 1), f"Feature column '{col}' has invalid value: {features[col]}"

def test_score_converter():
    """
    Verifies the probability to score and risk classification conversions.
    """
    # Test High Trust / Low Risk
    res_low = convert_score(0.95)
    assert res_low["trust_score"] == 95
    assert res_low["risk_score"] == 5
    assert res_low["risk_level"] == "Low"
    
    # Test Medium Trust / Medium Risk
    res_med = convert_score(0.60)
    assert res_med["trust_score"] == 60
    assert res_med["risk_score"] == 40
    assert res_med["risk_level"] == "Medium"
    
    # Test Low Trust / High Risk
    res_high = convert_score(0.20)
    assert res_high["trust_score"] == 20
    assert res_high["risk_score"] == 80
    assert res_high["risk_level"] == "High"

def test_health_check():
    """
    Verifies that the API health check endpoint returns 200 OK.
    """
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "OK"
    assert json_data["service"] == "ethicalai-ml-service"

def test_score_endpoint():
    """
    Verifies that the /score endpoint computes the scores and return SHAP explanations.
    """
    response = client.post("/score", json={"url": "google.com"})
    assert response.status_code == 200
    json_data = response.json()
    
    assert "trust_score" in json_data
    assert "risk_score" in json_data
    assert "risk_level" in json_data
    assert "features" in json_data
    assert "reasons" in json_data
    assert "suggestions" in json_data
    assert "confidence" in json_data
    assert "confidence_score" in json_data
    
    assert isinstance(json_data["trust_score"], int)
    assert isinstance(json_data["risk_score"], int)
    assert json_data["risk_level"] in ("Low", "Medium", "High")
    assert len(json_data["features"]) == 30
    assert len(json_data["reasons"]) > 0
    assert len(json_data["suggestions"]) > 0
    assert isinstance(json_data["confidence_score"], int)
