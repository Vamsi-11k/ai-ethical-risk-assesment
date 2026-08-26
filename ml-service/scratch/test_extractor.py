import sys
import os
# Add root path to PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from features.extractor import extract_features
import json

urls = [
    "https://google.com",
    "https://github.com",
    "http://example.com"
]

print("Running feature extractor test on known URLs...")
for url in urls:
    print(f"\nScanning: {url}")
    try:
        features = extract_features(url)
        print(json.dumps(features, indent=2))
        
        # Verify all values are in {-1, 0, 1}
        invalid_features = {k: v for k, v in features.items() if v not in (-1, 0, 1)}
        if invalid_features:
            print(f"ERROR: Found invalid feature values: {invalid_features}")
        else:
            print("Sanity check passed: All feature values are within range (-1, 0, 1)")
    except Exception as e:
        print(f"FAIL: Extraction failed with error: {e}")
