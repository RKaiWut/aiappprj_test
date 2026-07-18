import numpy as np
import pandas as pd
import joblib

# Load artifacts
artifacts = joblib.load('../exports/production_bundle.pkl')
loaded_imputer = artifacts['imputer']
expected_features = artifacts['features']

def predict_clean_imputation(production_df):
    # Ensure production columns match the exact sequence used in training
    df_aligned = production_df.reindex(columns=expected_features)
    
    # If processing a single row, scikit-learn's initial imputer needs an array structure
    # Convert directly to numpy matrix to avoid internal data-type mapping alignment slips
    raw_matrix = df_aligned.to_numpy(dtype=np.float64)
    
    # Transform safely
    imputed_array = loaded_imputer.transform(raw_matrix)
    
    return pd.DataFrame(imputed_array, columns=expected_features)


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
    df = df.copy()
    
    # 1. Explicitly define ALL possible categories from your training set
    cp_categories = [1.0, 2.0, 3.0, 4.0]        # 1.0 will be dropped by drop_first
    restecg_categories = [0.0, 1.0, 2.0]     # 0.0 will be dropped by drop_first
    
    # 2. Force the columns to use these categorical structures
    if "cp" in df.columns:
        df["cp"] = pd.Categorical(df["cp"], categories=cp_categories)
    if "restecg" in df.columns:
        df["restecg"] = pd.Categorical(df["restecg"], categories=restecg_categories)
        
    # 3. get_dummies will now consistently output all expected structural flags
    df = pd.get_dummies(
        df,
        columns=["cp", "restecg"],
        drop_first=True,
        dtype=float # Generates numeric 1.0/0.0 flags directly instead of booleans
    )

    return df


# Process JSON into input
def preprocess(patient: dict) -> pd.DataFrame:
    df = pd.DataFrame([patient])
    df = clean_data(df)
    df = encode_data(df)
    
    # Let the imputation tool handle the final feature layout validation directly
    df = predict_clean_imputation(df)
    
    pd.set_option('display.max_columns', None)
    print(df)
    return df

