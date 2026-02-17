import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Synthetic Data Generation
np.random.seed(42)
num_samples = 1000

data = {
    'assignment_1': np.random.randint(0, 101, num_samples),
    'assignment_2': np.random.randint(0, 101, num_samples),
    'assignment_3': np.random.randint(0, 101, num_samples),
    'assignment_4': np.random.randint(0, 101, num_samples),
    'assignment_5': np.random.randint(0, 101, num_samples),
    'cycle_test_1': np.random.randint(0, 101, num_samples),
    'cycle_test_2': np.random.randint(0, 101, num_samples),
    'cycle_test_3': np.random.randint(0, 101, num_samples),
    'cat_1': np.random.randint(0, 101, num_samples),
    'cat_2': np.random.randint(0, 101, num_samples),
    'cat_3': np.random.randint(0, 101, num_samples),
    'attendance': np.random.randint(50, 101, num_samples),
    'lab_marks': np.random.randint(0, 101, num_samples)
}

df = pd.DataFrame(data)

# Calculate weighted average for Risk Assessment Logic (Features -> Risk)
# Assignments: 10%, Cycle Tests: 20%, CAT: 30%, Attendance: 15%, Lab: 25% (Arbitrary weights for logic)
# This logic is just to assign labels ensuring the model learns something feasible.

# Average calculations
avg_assignment = df[['assignment_1', 'assignment_2', 'assignment_3', 'assignment_4', 'assignment_5']].mean(axis=1)
avg_cycle_test = df[['cycle_test_1', 'cycle_test_2', 'cycle_test_3']].mean(axis=1)
avg_cat = df[['cat_1', 'cat_2', 'cat_3']].mean(axis=1)

# Weighted Score (out of 100)
# Adjust these weights if necessary. Make sure they sum to roughly 1 or handle scaling.
# Here we just take a weighted sum for the *label generation*.
weighted_score = (
    (avg_assignment * 0.15) + 
    (avg_cycle_test * 0.15) + 
    (avg_cat * 0.30) + 
    (df['attendance'] * 0.20) + 
    (df['lab_marks'] * 0.20)
)

# Define Risk Levels based on weighted score
# < 50: High Risk
# 50 - 75: Medium Risk
# > 75: Low Risk

def get_risk_level(score):
    if score < 50:
        return 'High Risk'
    elif score < 75:
        return 'Medium Risk'
    else:
        return 'Low Risk'

df['risk_level'] = weighted_score.apply(get_risk_level)

print("Dataset generated with shape:", df.shape)
print(df['risk_level'].value_counts())

# Save dataset
df.to_csv('student_performance_dummy_data.csv', index=False)

# Machine Learning - Train Model
X = df.drop(columns=['risk_level'])
y = df['risk_level']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest Classifier
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train_scaled, y_train)

# Evaluate
y_pred = clf.predict(X_test_scaled)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Save Model and Scaler
joblib.dump(clf, 'student_risk_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
print("Model and Scaler saved successfully.")