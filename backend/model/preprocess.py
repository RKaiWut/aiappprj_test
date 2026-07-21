from pathlib import Path

import numpy as np
import pandas as pd
import joblib

EXPECTED_FEATURES = [
    'age',
    'sex',
    'trestbps',
    'chol',
    'fbs',
    'thalach',
    'exang',
    'oldpeak',
    'slope',
    'ca',
    'thal',
    'cp_2.0',
    'cp_3.0',
    'cp_4.0',
    'restecg_1.0',
    'restecg_2.0'
]


def load_artifacts():
    candidates = [
        Path('models/production_bundle.pkl'),
        Path('../models/production_bundle.pkl')
    ]

    for candidate in candidates:
        if candidate.exists():
            artifacts = joblib.load(candidate)
            return artifacts.get('imputer'), artifacts.get('features', EXPECTED_FEATURES)

    return None, EXPECTED_FEATURES


loaded_imputer, expected_features = load_artifacts()


def predict_clean_imputation(production_df: pd.DataFrame) -> pd.DataFrame:
    df_aligned = production_df.reindex(columns=expected_features)
    df_aligned = df_aligned.astype(float)

    if loaded_imputer is None:
        return df_aligned.fillna(0.0)

    raw_matrix = df_aligned.to_numpy(dtype=np.float64)
    imputed_array = loaded_imputer.transform(raw_matrix)
    return pd.DataFrame(imputed_array, columns=expected_features)


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df.replace(['?', ''], np.nan)

    for column in df.columns:
        df[column] = pd.to_numeric(df[column], errors='coerce')

    if 'chol' in df.columns:
        df['chol'] = df['chol'].replace(0, np.nan)

    return df


def encode_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    cp_categories = [1.0, 2.0, 3.0, 4.0]
    restecg_categories = [0.0, 1.0, 2.0]

    if 'cp' in df.columns:
        df['cp'] = pd.Categorical(df['cp'], categories=cp_categories)
    if 'restecg' in df.columns:
        df['restecg'] = pd.Categorical(df['restecg'], categories=restecg_categories)

    return pd.get_dummies(
        df,
        columns=['cp', 'restecg'],
        drop_first=True,
        dtype=float
    )


def normalize_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    return df.replace([np.inf, -np.inf], np.nan)


def preprocess(patient: dict) -> pd.DataFrame:
    df = pd.DataFrame([patient])
    df = clean_data(df)
    df = encode_data(df)
    df = normalize_missing_values(df)
    return predict_clean_imputation(df)

