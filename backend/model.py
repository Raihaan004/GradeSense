import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import matplotlib.pyplot as plt
import os

def generate_mock_data(num_students=1000):
    np.random.seed(42)
    data = []
    for i in range(num_students):
        # Generate random marks based on the frontend structure
        # Assignments: 5 assignments, up to 10 marks each
        assignments = np.random.randint(0, 11, size=5)
        # CATs: 5 internal exams, up to 50 marks each
        cats = np.random.randint(10, 51, size=5)
        # Cycle Tests: 3 tests, up to 100 marks each
        cycle_tests = np.random.randint(20, 101, size=3)
        
        # Calculate total marks (Max: 50 + 250 + 300 = 600)
        total_marks = sum(assignments) + sum(cats) + sum(cycle_tests)
        percentage = (total_marks / 600) * 100
        
        # Define 'At Risk' logic (e.g., if scoring below 45% overall)
        # We also introduce some randomness so the model has to learn the patterns
        is_at_risk = 1 if percentage < 45 else 0
        
        # Add some edge cases: if CT3 is very low, they might be at risk regardless
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

def train_and_visualize():
    print("1. Generating mock student data...")
    df = generate_mock_data(1000)
    
    X = df.drop('Risk', axis=1)
    y = df['Risk']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("2. Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    predictions = model.predict(X_test)
    print("\nClassification Report (Accuracy of Risk Prediction):")
    print(classification_report(y_test, predictions))
    
    # Generate Feature Importance Graph
    print("3. Generating analysis graph...")
    importances = model.feature_importances_
    features = X.columns
    indices = np.argsort(importances)
    
    plt.figure(figsize=(12, 8))
    
    # Use a custom style to match the Next.js dark theme
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(10, 6))
    fig.patch.set_facecolor('#0f172a') # matches tailwind slate-900
    ax.set_facecolor('#0f172a')
    
    colors = ['#8b5cf6' if 'CT' in features[i] else '#6366f1' if 'CAT' in features[i] else '#3b82f6' for i in indices]
    
    ax.barh(range(len(indices)), importances[indices], color=colors, align='center')
    ax.set_yticks(range(len(indices)))
    ax.set_yticklabels([features[i] for i in indices], color='white')
    ax.tick_params(axis='x', colors='white')
    ax.set_xlabel('Relative Importance in Predicting Risk', color='white')
    ax.set_title('Student Risk Analyzer - Feature Importances', color='white', pad=20, fontsize=16, fontweight='bold')
    
    # Hide top and right spines
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('#334155')
    ax.spines['left'].set_color('#334155')
    
    plt.tight_layout()
    
    # Save the graph
    output_path = os.path.join(os.path.dirname(__file__), 'risk_factors_graph.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor())
    print(f"\n✅ Graph successfully generated and saved to: {output_path}")

if __name__ == "__main__":
    train_and_visualize()
