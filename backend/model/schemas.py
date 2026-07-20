from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, conint, confloat

ChestPainType = Literal[1, 2, 3, 4]
SexType = Literal[0, 1]
BinaryType = Literal[0, 1]
RestEcgType = Literal[0, 1, 2]
SlopeType = Literal[1, 2, 3]
CaType = Literal[0, 1, 2, 3, 4]
ThalType = Literal[3, 6, 7]


class AssessmentRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')

    age: conint(ge=18, le=100) = Field(..., description='Patient age in years')
    sex: SexType = Field(..., description='Biological sex used by the trained model')
    cp: ChestPainType = Field(..., description='Chest pain category')
    trestbps: conint(ge=50, le=250) = Field(..., description='Resting blood pressure in mmHg')
    chol: conint(ge=100, le=700) = Field(..., description='Serum cholesterol in mg/dL')
    fbs: BinaryType = Field(..., description='Fasting blood sugar above 120 mg/dL')
    restecg: RestEcgType = Field(..., description='Resting ECG category')
    thalach: conint(ge=60, le=250) = Field(..., description='Maximum heart rate achieved')
    exang: BinaryType = Field(..., description='Exercise induced angina')
    oldpeak: confloat(ge=0.0, le=10.0) = Field(..., description='ST depression induced by exercise')
    slope: SlopeType = Field(..., description='ST segment slope')
    ca: CaType = Field(..., description='Number of major vessels colored by fluoroscopy')
    thal: ThalType = Field(..., description='Thalassemia category')


class PredictionFactor(BaseModel):
    feature: str
    impact: float
    direction: Literal['increase', 'decrease']


class PredictionResponse(BaseModel):
    prediction: int
    raw_probability: float
    risk_probability: float
    risk_percent: float
    risk_level: str
    top_factors: list[PredictionFactor]
    lifestyle_advice: list[str]
    medical_disclaimer: str
