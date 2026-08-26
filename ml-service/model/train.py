import os
import json
import urllib.request
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from xgboost import XGBClassifier
import joblib

DATASET_URL = "https://raw.githubusercontent.com/sayakpaul/Phishing-Websites-Detection/master/Phishing.csv"
DATASET_PATH = "model/Phishing.csv"

def download_dataset():
    if not os.path.exists("model"):
        os.makedirs("model")
    if not os.path.exists(DATASET_PATH):
        print(f"Downloading dataset from {DATASET_URL}...")
        # Configure headers to prevent block
        req = urllib.request.Request(
            DATASET_URL, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req) as response:
            with open(DATASET_PATH, 'wb') as out_file:
                out_file.write(response.read())
        print("Download complete.")
    else:
        print("Dataset already exists locally.")

def train():
    download_dataset()
    
    # Load dataset
    df = pd.read_csv(DATASET_PATH)
    
    # The dataset has an index column 'id' which we should drop
    if 'id' in df.columns:
        df = df.drop(columns=['id'])
        
    print(f"Dataset shape: {df.shape}")
    
    # Target column name
    target_col = 'Result'
    if target_col not in df.columns:
        for col in df.columns:
            if col.lower() in ['result', 'class', 'target']:
                target_col = col
                break
                
    print(f"Target column identified: {target_col}")
    class_counts = df[target_col].value_counts().to_dict()
    print(f"Class balance: {class_counts}")
    
    # Check encoding
    unique_vals = df[target_col].unique()
    print(f"Unique values in target: {unique_vals}")
    
    # Split features and target
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    feature_cols = list(X.columns)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Map -1 to 0 and 1 to 1 for XGBoost and consistency
    mapping_to_binary = { -1: 0, 1: 1 }
    y_train_mapped = y_train.map(mapping_to_binary)
    y_test_mapped = y_test.map(mapping_to_binary)
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(random_state=42),
        "XGBoost": XGBClassifier(eval_metric='logloss', random_state=42)
    }
    
    best_name = None
    best_model = None
    best_f1 = -1
    
    for name, clf in models.items():
        print(f"\nTraining {name}...")
        clf.fit(X_train, y_train_mapped)
        
        # Predict
        preds = clf.predict(X_test)
        preds_proba = clf.predict_proba(X_test)[:, 1]
        
        # Metrics
        acc = accuracy_score(y_test_mapped, preds)
        prec = precision_score(y_test_mapped, preds)
        rec = recall_score(y_test_mapped, preds)
        f1 = f1_score(y_test_mapped, preds)
        roc = roc_auc_score(y_test_mapped, preds_proba)
        
        print(f"{name} Metrics:")
        print(f"  Accuracy:  {acc:.4f}")
        print(f"  Precision: {prec:.4f}")
        print(f"  Recall:    {rec:.4f}")
        print(f"  F1-Score:  {f1:.4f}")
        print(f"  ROC-AUC:   {roc:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_name = name
            best_model = clf
            
    print(f"\nSelected Model: {best_name} with F1-Score {best_f1:.4f}")
    
    model_dir = "model"
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        
    model_path = os.path.join(model_dir, "trust_model.pkl")
    joblib.dump(best_model, model_path)
    print(f"Saved model to {model_path}")
    
    features_path = os.path.join(model_dir, "feature_columns.json")
    with open(features_path, 'w') as f:
        json.dump(feature_cols, f, indent=2)
    print(f"Saved feature columns to {features_path}")
    
    encoding_path = os.path.join(model_dir, "label_encoding.json")
    encoding_info = {
        "original_target": target_col,
        "phishing_value": -1,
        "legitimate_value": 1,
        "mapped_binary": {
            "-1": 0,
            "1": 1
        }
    }
    with open(encoding_path, 'w') as f:
        json.dump(encoding_info, f, indent=2)
    print(f"Saved label encoding to {encoding_path}")

if __name__ == "__main__":
    train()
