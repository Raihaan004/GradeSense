from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import base64
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load model and scaler
MODEL_PATH = 'student_risk_model.pkl'
SCALER_PATH = 'scaler.pkl'
CSV_PATH = 'students.csv'

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("Model and scaler loaded successfully.")
except Exception as e:
    print(f"Error loading model/scaler: {e}")
    model = None
    scaler = None

def generate_performance_graph(data):
    """
    Generate a base64 encoded image of the student's performance graph.
    """
    categories = ['Assignments', 'Cycle Tests', 'CATs', 'Attendance', 'Lab']
    
    # Calculate averages for the graph
    avg_assignment = np.mean([data['assignment_1'], data['assignment_2'],
                              data['assignment_3'], data['assignment_4'], data['assignment_5']])
    avg_cycle = np.mean([data['cycle_test_1'], data['cycle_test_2'], data['cycle_test_3']])
    avg_cat = np.mean([data['cat_1'], data['cat_2'], data['cat_3']])
    attendance = data['attendance']
    lab = data['lab_marks']
    
    values = [avg_assignment, avg_cycle, avg_cat, attendance, lab]
    
    plt.figure(figsize=(8, 6))
    bars = plt.bar(categories, values, color=['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC'])
    
    plt.title('Student Performance Overview')
    plt.xlabel('Metrics')
    plt.ylabel('Score / Percentage')
    plt.ylim(0, 100)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    
    # Add value labels
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                 f'{height:.1f}',
                 ha='center', va='bottom')
    
    # Save to buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    
    return image_base64

@app.route('/predict', methods=['POST'])
def predict_risk():
    try:
        data = request.json
        
        # Prepare data for prediction (must match training feature order/names)
        # Expected keys from frontend: same as generate_model.py
        input_data = {
            'assignment_1': float(data.get('assignment_1', 0)),
            'assignment_2': float(data.get('assignment_2', 0)),
            'assignment_3': float(data.get('assignment_3', 0)),
            'assignment_4': float(data.get('assignment_4', 0)),
            'assignment_5': float(data.get('assignment_5', 0)),
            'cycle_test_1': float(data.get('cycle_test_1', 0)),
            'cycle_test_2': float(data.get('cycle_test_2', 0)),
            'cycle_test_3': float(data.get('cycle_test_3', 0)),
            'cat_1': float(data.get('cat_1', 0)),
            'cat_2': float(data.get('cat_2', 0)),
            'cat_3': float(data.get('cat_3', 0)),
            'attendance': float(data.get('attendance', 0)),
            'lab_marks': float(data.get('lab_marks', 0))
        }
        
        # Create DataFrame for prediction
        df_input = pd.DataFrame([input_data])
        
        if model and scaler:
            # Scale features
            input_scaled = scaler.transform(df_input)
            # Predict
            risk_prediction = model.predict(input_scaled)[0]
            # Get probabilities (optional, for confidence)
            # probabilities = model.predict_proba(input_scaled)
        else:
            risk_prediction = "Model not loaded"

        # Generate Graph
        graph_base64 = generate_performance_graph(input_data)
        
        # Append Student Details + Prediction to CSV
        student_record = {
            'Name': data.get('name', ''),
            'RollNo': data.get('roll_no', ''),
            'Department': data.get('department', ''),
            'Section': data.get('section', ''),
            **input_data,  # unpacking marks
            'Risk_Level': risk_prediction
        }
        
        df_record = pd.DataFrame([student_record])
        
        if not os.path.isfile(CSV_PATH):
            df_record.to_csv(CSV_PATH, index=False)
        else:
            df_record.to_csv(CSV_PATH, mode='a', header=False, index=False)
            
        return jsonify({
            'status': 'success',
            'risk_level': risk_prediction,
            'graph_image': graph_base64,
            'message': 'Prediction successful and data saved.'
        })

    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
