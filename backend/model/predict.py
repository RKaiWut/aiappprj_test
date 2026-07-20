from pathlib import Path

import numpy as np
import shap
import xgboost as xgb

from .preprocess import preprocess

# 1.0 Set probability callibration
predicted = [0.0785534, 0.14662599, 0.2488242, 0.34694082, 0.44643557, 0.54862061, 0.65373713, 0.74864547, 0.85772489, 0.92538421]
actual    = [0.04347826, 0.08247423, 0.3015873, 0.34782609, 0.41463415, 0.52083333, 0.68181818, 0.77777778, 0.88636364, 0.9379845]

def load_model() -> xgb.XGBClassifier:
    model = xgb.XGBClassifier()

    candidate_paths = [
        Path(__file__).resolve().parents[2] / 'models' / 'exported_model2.ubj',
        Path(__file__).resolve().parents[1] / 'exported_model2.ubj',
        Path(__file__).resolve().parents[2] / 'models' / 'exported_model.ubj'
    ]

    for candidate in candidate_paths:
        if candidate.exists():
            model.load_model(str(candidate))
            return model

    searched_paths = '\n'.join(str(path) for path in candidate_paths)
    raise FileNotFoundError(f'Could not find an XGBoost model file. Searched:\n{searched_paths}')


# 1.1 Load model
model = load_model()

# 1.2 SHAP explainer
explainer = shap.TreeExplainer(model)

def predict_from_preprocessed(X):
    prediction = int(model.predict(X)[0])
    raw_probability = float(model.predict_proba(X)[0][1])
    probability = float(np.interp(raw_probability, predicted, actual))

    shap_values = explainer.shap_values(X)[0]
    raw_shap = dict(zip(X.columns, shap_values))

    return {
        'prediction': prediction,
        'raw_probability': raw_probability,
        'risk_probability': probability,
        'risk_percent': round(probability * 100, 1),
        'shap_values': raw_shap
    }


# 2. Predict
def predict(patient):
    X = preprocess(patient)
    return predict_from_preprocessed(X)