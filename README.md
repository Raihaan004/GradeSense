# Student Performance Risk Analyzer 🎓

A Machine Learning-based system designed to predict whether a student is at **Low**, **Medium**, or **High Risk** of poor academic performance based on their continuous assessment marks.

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Python%20%7C%20Flask-blue)

## 📌 Features

- **Predictive Analysis**: Uses a trained **Random Forest Classifier** to evaluate student risk levels.
- **Data Collection**: Gathers comprehensive academic data including:
  - 5 Assignment Marks
  - 3 Cycle Test Marks
  - 3 CAT (Continuous Assessment Test) Marks
  - Attendance Percentage
  - Lab Marks
- **Visual Insights**: Generates a performance bar graph for each student prediction.
- **Data Logging**: Automatically appends student details and prediction results to a CSV file (`backend/students.csv`) for future reference.
- **Interactive UI**: Clean, multi-step form interface built with Next.js and Tailwind CSS.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend
- **Server**: Flask (Python)
- **Machine Learning**: Scikit-Learn (Random Forest)
- **Data Processing**: Pandas, NumPy
- **Visualization**: Matplotlib

## 🚀 Installation & Setup

Follow these steps to run the application locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)

---

### 1. Backend Setup (Flask API)

Navigate to the `backend` folder, set up a virtual environment, and install dependencies.

```bash
# Go to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

**Initialize the Model:**
Before running the server, generate the dummy dataset and train the model.

```bash
python generate_model.py
```
*This will create `student_risk_model.pkl` and `scaler.pkl`.*

**Start the Server:**
```bash
python app.py
```
The backend API will now be running at `http://127.0.0.1:5000`.

---

### 2. Frontend Setup (Next.js)

Open a **new terminal** in the project root directory.

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📊 Project Structure

```
gradesense/
├── app/                  # Next.js Frontend Pages & Components
│   ├── page.tsx          # Main dashboard & form logic
│   ├── layout.tsx        # App layout structure
│   └── globals.css       # Global styles (Tailwind)
├── backend/              # Python Backend
│   ├── app.py            # Flask API Server
│   ├── generate_model.py # ML Model training script
│   ├── requirements.txt  # Python dependencies
│   ├── students.csv      # Generated file for student data
│   └── venv/             # Python Virtual Environment
├── public/               # Static assets
└── package.json          # Node.js dependencies
```

## 📝 Usage Guide

1.  **Launch the App**: Click **+ New Student Analysis** on the home screen.
2.  **Enter Details**: Fill in the student's Name, Roll Number, Department, and Section.
3.  **Input Marks**: Enter marks for all Assignments (1-5), Cycle Tests (1-3), CATs (1-3), Attendance, and Lab.
4.  **Analyze**: Click **Analyze Risk**.
5.  **View Results**: The system will display the predicted Risk Level (Low Risk, Medium Risk, or High Risk) along with a generated performance graph.

## 🤖 Future Improvements
- [ ] Implement authentication for faculty members.
- [ ] Connect to a real database (PostgreSQL/MongoDB) instead of CSV.
- [ ] Add bulk upload feature for analyzing multiple students via Excel.
- [ ] Improve model accuracy with real-world institutional data.

## 📄 License
This project is for educational purposes.
