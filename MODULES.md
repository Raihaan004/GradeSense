# GradeSense - Project Modules & Dependencies

This document provides a comprehensive list of modules and dependencies used in the GradeSense project, categorized by their purpose and role in the system.

## 1. Backend (Python/Flask)
The backend is responsible for data processing, machine learning model inference, and providing APIs to the frontend.

| Module | Category | Description |
| :--- | :--- | :--- |
| **Flask** | Web | Micro web framework for building the API endpoints. |
| **flask-cors** | Web | Handles Cross-Origin Resource Sharing (CORS) for frontend communication. |
| **Pandas** | Data Management | Used for data manipulation, reading CSV files, and preprocessing student data. |
| **NumPy** | Mathematics | Used for numerical operations and array processing. |
| **Scikit-learn** | Machine Learning | Provides the algorithms for student risk prediction (classification) and data scaling. |
| **Joblib** | Serialization | Used to save and load the trained machine learning models (`.pkl` files). |
| **Matplotlib** | Visualization | Generates performance graphs for students. |
| **Seaborn** | Visualization | Statistical data visualization built on top of Matplotlib. |

## 2. Frontend (Next.js/React)
The frontend provides the user interface for teachers and administrators.

| Dependency | Category | Description |
| :--- | :--- | :--- |
| **Next.js (v16+)** | Framework | The React framework for server-side rendering and static site generation. |
| **React (v19+)** | UI Library | Core library for building interactive user interfaces. |
| **Tailwind CSS** | Styling | Utility-first CSS framework for rapid and responsive UI design. |
| **TypeScript** | Language | Adds static typing to JavaScript for better developer experience and code quality. |

## 3. Environment Details
- **Python Version:** 3.x (Virtual Environment recommended)
- **Node.js Version:** Latest LTS recommended
- **Database:** Flat-file CSV storage ([backend/students.csv](backend/students.csv))
- **Models:** Scikit-learn pickled models ([backend/student_risk_model.pkl](backend/student_risk_model.pkl))
