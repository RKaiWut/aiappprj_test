from predict import predict
from formatter import format_prediction, pretty_print

patient = {
    "age": 65,
    "sex": 1,
    "cp": 4,
    "trestbps": 155,
    "chol": 0,
    "fbs": "?",
    "restecg": 0,
    "thalach": 154,
    "exang": 0,
    "oldpeak": 1,
    "slope": 1,
    "ca": "?",
    "thal": "?"
}

# 2	65.0	1.0	4.0	155	0	?	0	154	0	1	1	?	?	0
raw = predict(patient)

formatted = format_prediction(raw, patient)

pretty_print(formatted)