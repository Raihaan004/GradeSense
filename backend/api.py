from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Union
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

# Enable CORS so Next.js can talk to it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model = RandomForestClassifier(n_estimators=100, random_state=42)

def generate_mock_data(num_students=1000):
    np.random.seed(42)
    data = []
    for i in range(num_students):
        assignments = np.random.randint(0, 11, size=5)
        cats = np.random.randint(10, 51, size=5)
        cycle_tests = np.random.randint(20, 101, size=3)
        
        total_marks = sum(assignments) + sum(cats) + sum(cycle_tests)
        percentage = (total_marks / 600) * 100
        
        is_at_risk = 1 if percentage < 45 else 0
        if cycle_tests[2] < 30:
            is_at_risk = 1
            
        student = {
            'A1': assignments[0], 'A2': assignments[1], 'A3': assignments[2], 'A4': assignments[3], 'A5': assignments[4],
            'CAT1': cats[0], 'CAT2': cats[1], 'CAT3': cats[2], 'CAT4': cats[3], 'CAT5': cats[4],
            'CT1': cycle_tests[0], 'CT2': cycle_tests[1], 'CT3': cycle_tests[2],
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

# Pydantic models for incoming data validation
class SubjectMarks(BaseModel):
    name: str
    hasLab: bool
    assignments: List[Union[int, str]]
    cats: List[Union[int, str]]
    cycleTests: List[Union[int, str]]

class PredictRequest(BaseModel):
    subjects: List[SubjectMarks]

@app.post("/api/predict")
def predict_risk(req: PredictRequest):
    # Aggregate marks across all subjects to match the 13 feature format
    a_totals = [0]*5
    c_totals = [0]*5
    ct_totals = [0]*3
    count = len(req.subjects)
    
    if count == 0:
         return {"error": "No subjects provided"}
         
    for subj in req.subjects:
        for i in range(5):
            val = subj.assignments[i] if i < len(subj.assignments) else 0
            a_totals[i] += int(val) if val != "" else 0
        for i in range(5):
            val = subj.cats[i] if i < len(subj.cats) else 0
            c_totals[i] += int(val) if val != "" else 0
        for i in range(3):
            val = subj.cycleTests[i] if i < len(subj.cycleTests) else 0
            ct_totals[i] += int(val) if val != "" else 0
            
    # Calculate average scores across all subjects
    input_features = {
        'A1': a_totals[0]/count, 'A2': a_totals[1]/count, 'A3': a_totals[2]/count, 'A4': a_totals[3]/count, 'A5': a_totals[4]/count,
        'CAT1': c_totals[0]/count, 'CAT2': c_totals[1]/count, 'CAT3': c_totals[2]/count, 'CAT4': c_totals[3]/count, 'CAT5': c_totals[4]/count,
        'CT1': ct_totals[0]/count, 'CT2': ct_totals[1]/count, 'CT3': ct_totals[2]/count,
    }
    
    df_input = pd.DataFrame([input_features])
    
    # Get Prediction
    prediction = model.predict(df_input)[0]
    probabilities = model.predict_proba(df_input)[0]
    
    risk_prob = probabilities[1] * 100  # Probability of being class '1' (At Risk)
    
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
    # Same aggregation logic
    a_totals = [0]*5
    c_totals = [0]*5
    ct_totals = [0]*3
    count = len(req.subjects)
    
    if count == 0:
         return {"error": "No subjects provided"}
         
    for subj in req.subjects:
        for i in range(5):
            val = subj.assignments[i] if i < len(subj.assignments) else 0
            a_totals[i] += int(val) if val != "" else 0
        for i in range(5):
            val = subj.cats[i] if i < len(subj.cats) else 0
            c_totals[i] += int(val) if val != "" else 0
        for i in range(3):
            val = subj.cycleTests[i] if i < len(subj.cycleTests) else 0
            ct_totals[i] += int(val) if val != "" else 0
            
    avg_a = [t/count for t in a_totals]
    avg_cat = [t/count for t in c_totals]
    avg_ct = [t/count for t in ct_totals]
    
    input_features = {
        'A1': avg_a[0], 'A2': avg_a[1], 'A3': avg_a[2], 'A4': avg_a[3], 'A5': avg_a[4],
        'CAT1': avg_cat[0], 'CAT2': avg_cat[1], 'CAT3': avg_cat[2], 'CAT4': avg_cat[3], 'CAT5': avg_cat[4],
        'CT1': avg_ct[0], 'CT2': avg_ct[1], 'CT3': avg_ct[2],
    }
    
    df_input = pd.DataFrame([input_features])
    prediction = model.predict(df_input)[0]
    probabilities = model.predict_proba(df_input)[0]
    risk_prob = probabilities[1] * 100
    
    # Generate ML Analysis Graph
    fig, ax = plt.subplots(figsize=(10, 5), facecolor='#0f172a') # Match Next.js slate-900 background
    ax.set_facecolor('#0f172a')
    
    categories = ['Assignments (Avg)', 'CATs (Avg)', 'Cycle Tests (Avg)']
    
    # Scale to percentage for comparison
    a_pct = (sum(avg_a) / 50) * 100
    cat_pct = (sum(avg_cat) / 250) * 100
    ct_pct = (sum(avg_ct) / 300) * 100
    
    scores = [a_pct, cat_pct, ct_pct]
    thresholds = [50, 45, 40] # Arbitrary passing thresholds for visual effect
    
    x = np.arange(len(categories))
    width = 0.35
    
    rects1 = ax.bar(x - width/2, scores, width, label=f"{req.student_name}'s Score", color='#6366f1') # Indigo 500
    rects2 = ax.bar(x + width/2, thresholds, width, label='Minimum Required', color='#334155') # Slate 700
    
    ax.set_ylabel('Percentage (%)', color='#94a3b8')
    ax.set_title(f"Risk Factor Breakdown for {req.student_name}", color='white', pad=20, fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(categories, color='#cbd5e1')
    ax.tick_params(axis='y', colors='#94a3b8')
    ax.spines['bottom'].set_color('#334155')
    ax.spines['left'].set_color('#334155')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    legend = ax.legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white')
    
    plt.tight_layout()
    
    # Convert plot to Base64
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
