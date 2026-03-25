import pandas as pd
import numpy as np

def generate_demo_data(num_records=100):
    departments = ['Computer Science and Engineering', 'Information Technology', 'Electronics and Communication', 'Mechanical Engineering']
    sections = ['A', 'B', 'C']
    risk_levels = ['Low Risk', 'Medium Risk', 'High Risk']
    
    data = []
    
    for i in range(num_records):
        roll_no = 211723002200 + i
        dept = np.random.choice(departments)
        sec = np.random.choice(sections)
        
        # Randomly decide a performance profile
        profile = np.random.choice(['High', 'Mid', 'Low'], p=[0.3, 0.4, 0.3])
        
        if profile == 'High':
            scores = np.random.randint(80, 101, size=13) # assignments(5), cycle(3), cats(3), attendance, lab
            risk = 'Low Risk'
        elif profile == 'Mid':
            scores = np.random.randint(60, 81, size=13)
            risk = 'Medium Risk'
        else:
            scores = np.random.randint(0, 60, size=13)
            risk = 'High Risk'
            
        record = {
            'Name': f'Student_{i}',
            'RollNo': str(roll_no),
            'Department': dept,
            'Section': sec,
            'assignment_1': scores[0],
            'assignment_2': scores[1],
            'assignment_3': scores[2],
            'assignment_4': scores[3],
            'assignment_5': scores[4],
            'cycle_test_1': scores[5],
            'cycle_test_2': scores[6],
            'cycle_test_3': scores[7],
            'cat_1': scores[8],
            'cat_2': scores[9],
            'cat_3': scores[10],
            'attendance': scores[11],
            'lab_marks': scores[12],
            'Risk_Level': risk
        }
        data.append(record)
        
    df = pd.DataFrame(data)
    df.to_csv('backend/large_demo_students.csv', index=False)
    print(f"Generated {num_records} records in backend/large_demo_students.csv")

if __name__ == "__main__":
    generate_demo_data(50) # Generate 50 demo records
