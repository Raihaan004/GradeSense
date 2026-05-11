from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union, Optional
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from dotenv import load_dotenv
import os
import io
import base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

load_dotenv()

app = FastAPI(title="GradeSense ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = RandomForestClassifier(n_estimators=100, random_state=42)

def generate_mock_data(num_students=1000):
    np.random.seed(42)
    data = []
    for i in range(num_students):
        assignments = np.random.randint(0, 11, size=5)
        cats = [np.random.randint(10, 51), np.random.randint(5, 26), np.random.randint(10, 51)]
        cycle_tests = np.random.randint(20, 101, size=3)
        lab_cycle_tests = np.random.randint(20, 101, size=3)
        
        total_marks = sum(assignments) + sum(cats) + sum(cycle_tests) + sum(lab_cycle_tests)
        percentage = (total_marks / 775) * 100
        
        is_at_risk = 1 if percentage < 45 else 0
        if cycle_tests[2] < 30:
            is_at_risk = 1
            
        student = {
            'A1': assignments[0], 'A2': assignments[1], 'A3': assignments[2], 'A4': assignments[3], 'A5': assignments[4],
            'CAT1': cats[0], 'CAT2': cats[1], 'CAT3': cats[2],
            'CT1': cycle_tests[0], 'CT2': cycle_tests[1], 'CT3': cycle_tests[2],
            'LCT1': lab_cycle_tests[0], 'LCT2': lab_cycle_tests[1], 'LCT3': lab_cycle_tests[2],
            'Risk': is_at_risk
        }
        data.append(student)
    return pd.DataFrame(data)

@app.on_event("startup")
def startup_event():
    print("🚀 Starting FastAPI Server...")
    print("🧠 Training Random Forest Model...")
    df = generate_mock_data(1000)
    X = df.drop('Risk', axis=1)
    y = df['Risk']
    model.fit(X, y)
    print("✅ Model training complete and ready for predictions!")

class SubjectMarks(BaseModel):
    name: str
    hasLab: bool
    assignments: List[Union[float, int, str]] = []
    cats: List[Union[float, int, str]] = []
    cycleTests: List[Union[float, int, str]] = []
    labCycleTests: Optional[List[Union[float, int, str]]] = []

class PredictRequest(BaseModel):
    subjects: List[SubjectMarks]

def extract_features(subjects):
    a_totals = [0]*5
    c_totals = [0]*3
    ct_totals = [0]*3
    lct_totals = [0]*3
    
    count = len(subjects)
    lab_count = sum(1 for s in subjects if s.hasLab)
    
    if count == 0:
         return None
         
    for subj in subjects:
        for i in range(5):
            val = subj.assignments[i] if i < len(subj.assignments) else 0
            a_totals[i] += float(val) if val != "" else 0
        for i in range(3):
            val = subj.cats[i] if i < len(subj.cats) else 0
            c_totals[i] += float(val) if val != "" else 0
        for i in range(3):
            val = subj.cycleTests[i] if i < len(subj.cycleTests) else 0
            ct_totals[i] += float(val) if val != "" else 0
        if subj.hasLab and subj.labCycleTests:
            for i in range(3):
                val = subj.labCycleTests[i] if i < len(subj.labCycleTests) else 0
                lct_totals[i] += float(val) if val != "" else 0
            
    return {
        'A1': a_totals[0]/count, 'A2': a_totals[1]/count, 'A3': a_totals[2]/count, 'A4': a_totals[3]/count, 'A5': a_totals[4]/count,
        'CAT1': c_totals[0]/count, 'CAT2': c_totals[1]/count, 'CAT3': c_totals[2]/count,
        'CT1': ct_totals[0]/count, 'CT2': ct_totals[1]/count, 'CT3': ct_totals[2]/count,
        'LCT1': lct_totals[0]/lab_count if lab_count > 0 else 0,
        'LCT2': lct_totals[1]/lab_count if lab_count > 0 else 0,
        'LCT3': lct_totals[2]/lab_count if lab_count > 0 else 0,
    }

@app.post("/api/predict")
def predict_risk(req: PredictRequest):
    features = extract_features(req.subjects)
    if not features: return {"error": "No subjects provided"}
    
    df_input = pd.DataFrame([features])
    prediction = model.predict(df_input)[0]
    probabilities = model.predict_proba(df_input)[0]
    risk_prob = probabilities[1] * 100
    
    return {
        "is_at_risk": bool(prediction == 1),
        "risk_probability": round(risk_prob, 2),
        "message": "Student requires immediate intervention" if prediction == 1 else "Student is performing adequately"
    }

class AnalyzeRequest(BaseModel):
    subjects: List[SubjectMarks]
    student_name: str

@app.post("/api/analyze")
def analyze_student_deep(req: AnalyzeRequest):
    features = extract_features(req.subjects)
    if not features: return {"error": "No subjects"}
    
    df_input = pd.DataFrame([features])
    prediction = model.predict(df_input)[0]
    probabilities = model.predict_proba(df_input)[0]
    risk_prob = probabilities[1] * 100
    
    fig, ax = plt.subplots(figsize=(10, 5), facecolor='#0f172a')
    ax.set_facecolor('#0f172a')
    
    categories = ['Assignments', 'CATs', 'Cycle Tests', 'Lab Tests']
    
    # Scale to percentage for visual graphing
    a_pct = (sum(features[f'A{i}'] for i in range(1,6)) / 50) * 100
    cat_pct = (sum(features[f'CAT{i}'] for i in range(1,4)) / 125) * 100
    ct_pct = (sum(features[f'CT{i}'] for i in range(1,4)) / 300) * 100
    lct_pct = (sum(features[f'LCT{i}'] for i in range(1,4)) / 300) * 100
    
    scores = [a_pct, cat_pct, ct_pct, lct_pct]
    thresholds = [50, 45, 40, 50]
    
    x = np.arange(len(categories))
    width = 0.35
    
    ax.bar(x - width/2, scores, width, label=f"{req.student_name}'s Score", color='#6366f1')
    ax.bar(x + width/2, thresholds, width, label='Minimum Required', color='#334155')
    
    ax.set_ylabel('Percentage (%)', color='#94a3b8')
    ax.set_title(f"Risk Factor Breakdown for {req.student_name}", color='white', pad=20, fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(categories, color='#cbd5e1')
    ax.tick_params(axis='y', colors='#94a3b8')
    ax.spines['bottom'].set_color('#334155')
    ax.spines['left'].set_color('#334155')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    ax.legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white')
    
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=100)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    
    return {
        "is_at_risk": bool(prediction == 1),
        "risk_probability": round(risk_prob, 2),
        "graph": f"data:image/png;base64,{img_base64}"
    }

@app.get("/")
def health_check():
    return {"status": "GradeSense ML Backend is running!"}
