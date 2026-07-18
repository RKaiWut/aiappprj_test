from predict import predict
from formatter import format_prediction, pretty_print

patient = {
    "age": 69.0,
    "sex": 1.0,
    "cp": 4.0,
    "trestbps": "?",
    "chol": "?",
    "fbs": 0.0,
    "restecg": 1.0,
    "thalach": "?",
    "exang": "?",
    "oldpeak": "?",
    "slope": "?",
    "ca": "?",
    "thal": 7.0
}

# 2	65.0	1.0	4.0	155	0	?	0	154	0	1	1	?	?	0
raw = predict(patient)
print("Raw", raw["raw_probability"])
formatted = format_prediction(raw, patient)

pretty_print(formatted)