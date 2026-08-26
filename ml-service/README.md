# EthicalAI ML Trust & Risk Assessment Microservice

This is a standalone Python microservice built using FastAPI, scikit-learn, and SHAP. Given a website URL, it extracts 30 security and trust features in real-time, classifies them using a trained Random Forest model (trained on the Kaggle Phishing Dataset), and provides SHAP-based explanations of the score.

## Directory Structure

```text
/ml-service
  ├── features/
  │     └── extractor.py        # Real-time feature extraction from a URL
  ├── model/
  │     ├── train.py            # Dataset downloader and classifier trainer
  │     ├── Phishing.csv        # Local cached dataset (git-ignored/downloaded)
  │     ├── trust_model.pkl     # Saved Random Forest classifier model
  │     ├── feature_columns.json # Saved model input features sequence
  │     └── label_encoding.json  # Classification encoding reference
  ├── scoring/
  │     └── score_converter.py  # Maps model probability to Trust Score/Risk Level
  ├── explain/
  │     ├── feature_meanings.py # Human-readable reason & suggestion maps
  │     └── shap_explain.py     # Computes local SHAP values for prediction drivers
  ├── tests/
  │     └── test_service.py     # Unit and integration test suite
  ├── requirements.txt          # Python package requirements
  └── main.py                   # FastAPI service router and runner
```

---

## Getting Started

### 1. Requirements
Ensure Python 3.10+ is installed on your system.

### 2. Setup Virtual Environment & Install Packages
Navigate to the `ml-service` directory:
```bash
cd ml-service
python -m venv .venv
```

Activate the virtual environment:
- **Windows**:
  ```bash
  .venv\Scripts\activate
  ```
- **macOS/Linux**:
  ```bash
  source .venv/bin/activate
  ```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Model Training
Run the training script to download the Kaggle dataset and train/save the models:
```bash
python model/train.py
```
This script trains Logistic Regression, Random Forest, and XGBoost models, validates them using Accuracy/Precision/Recall/F1/ROC-AUC, and automatically saves the best performing classifier (which is **Random Forest** with a test F1-score of **97.70%**).

### 4. Running the API Locally
Start the FastAPI server:
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

---

## API Endpoints

### 1. Health Check
* **Endpoint**: `GET /health`
* **Response**:
  ```json
  {
    "status": "OK",
    "model_loaded": true,
    "service": "ethicalai-ml-service"
  }
  ```

### 2. Score Website URL
* **Endpoint**: `POST /score`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "url": "google.com"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "trust_score": 96,
    "risk_score": 4,
    "risk_level": "Low",
    "features": {
      "having_IP_Address": 1,
      "URL_Length": 1,
      "SSLfinal_State": 1,
      ...
    },
    "reasons": [
      {
        "label": "SSL/TLS Security: Website enforces a valid, trusted SSL/TLS certificate over HTTPS.",
        "passed": true
      },
      ...
    ],
    "suggestions": [
      "No critical issues found. Maintain current configuration and monitor SSL certificates."
    ]
  }
  ```

* **Error Responses**:
  - `400 Bad Request`: If the input URL is invalid or malformed.
  - `502 Bad Gateway`: If the target website is unreachable or DNS resolution fails.
  - `500 Internal Server Error`: If there is an issue with the inference engine.

---

## Running Tests
To run unit and integration tests:
```bash
pytest tests/
```
