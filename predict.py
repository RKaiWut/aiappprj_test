from preprocess import preprocess
import xgboost as xgb
import shap
import numpy as np

# 1.0 Set probability callibration
predicted = [0.06, 0.14, 0.25, 0.35, 0.46, 0.55, 0.65, 0.75, 0.86, 0.94]
actual    = [0.06, 0.12, 0.16, 0.35, 0.41, 0.54, 0.62, 0.81, 0.89, 0.95]

# 1.1 Load model
model = xgb.XGBClassifier()
model.load_model("models/exported_model2.ubj")

# 1.2 SHAP explainer
explainer = shap.TreeExplainer(model)

# 2. Predict
def predict(patient):

    X = preprocess(patient)

    # 2.1 Prediction step
    prediction = int(model.predict(X)[0])
    probability = np.interp(float(model.predict_proba(X)[0][1]), predicted, actual)
    
    # 2.2 SHAP output
    shap_values = explainer.shap_values(X)[0]
    raw_shap = dict(zip(X.columns, shap_values))

    return {
        "prediction": prediction,
        "risk_probability": probability,
        "risk_percent": round(probability * 100, 1),
        "shap_values": raw_shap
    }