import numpy as np
import pandas as pd

# Feature order expected by the trained model
expected_columns = [
    "age",
    "sex",
    "trestbps",
    "chol",
    "fbs",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal",
    "cp_2.0",
    "cp_3.0",
    "cp_4.0",
    "restecg_1.0",
    "restecg_2.0"
]

# Clean data
def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Replace '?' with NaN
    df = df.replace("?", np.nan)

    # Cholesterol of 0 is considered missing
    if "chol" in df.columns:
        df["chol"] = df["chol"].replace(0, np.nan)

    # Convert everything to float
    df = df.astype(float)

    return df


# One Hot Encoding
def encode_data(df: pd.DataFrame) -> pd.DataFrame:
    df = pd.get_dummies(
        df,
        columns=["cp", "restecg"],
        drop_first=True
    )

    return df

# Process JSON into input
def preprocess(patient: dict) -> pd.DataFrame:

    df = pd.DataFrame([patient])
    df = encode_data(clean_data(df))
    # Rename columns to expected 
    df = df.reindex(columns=expected_columns, fill_value=0)

    return df