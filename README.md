# 🧠 Student Mental Health Prediction

A full-stack Machine Learning web application that predicts students' mental health scores using social media usage, academic, and lifestyle data. Built with **Python, Scikit-learn, FastAPI, HTML, CSS, and JavaScript**.

---

## 📌 Project Overview

Student mental health is influenced by multiple factors, including social media usage, academic workload, stress levels, sleep quality, and physical activity. This project leverages Machine Learning to analyze these factors and predict a student's mental health score through an intuitive web interface.

The application features a **FastAPI-powered REST API** connected to a responsive frontend, allowing users to enter their details and receive instant predictions.

---

## 🚀 Features

* 🤖 Machine Learning-based mental health score prediction
* ⚡ FastAPI REST API backend
* 🎨 Responsive and modern user interface
* 📱 Social media usage analysis
* 📚 Academic and lifestyle factor analysis
* 🧠 Instant mental health score prediction
* 🔄 Real-time API integration
* 📊 Clean and interactive prediction results

---

## 🛠️ Tech Stack

### Machine Learning

* Python
* Scikit-learn
* Pandas
* NumPy
* Joblib

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

---

## 📂 Dataset Features

The model predicts the **Mental Health Score** using the following features:

| Feature                         | Description                                |
| ------------------------------- | ------------------------------------------ |
| Age                             | Student's age                              |
| Gender                          | Gender                                     |
| Country                         | Country of residence                       |
| Academic_Level                  | Current academic level                     |
| Most_Used_Platform              | Most frequently used social media platform |
| Purpose_Of_Use                  | Primary purpose of social media usage      |
| Avg_Daily_Usage_Hours           | Average daily social media usage           |
| Daily_Unlocks                   | Number of phone unlocks per day            |
| Study_Hours                     | Daily study duration                       |
| Physical_Activity_Hours         | Daily physical activity                    |
| Sleep_Hours_Per_Night           | Average sleep duration                     |
| Stress_Level                    | Self-reported stress level                 |
| Grouped_country                 | Country category                           |
| **Target:** Mental_Health_Score | Predicted mental health score              |

---

## 📁 Project Structure

```text
Student-Mental-Health-Prediction/
│
├── index.html
├── style.css
├── script.js
├── main.py
├── Mental_Health_Model.pkl
├── ML_Project.ipynb
├── Student Social Media And Mental Health Impact.csv
├── requirements.txt
├── README.md
└── .gitignore
```
---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ankit-Singh-AI/Student-Mental-Health-Prediction.git
```

### 2. Navigate to the Project Directory

```bash
cd Student-Mental-Health-Prediction
```

### 3. Create a Virtual Environment

**Windows**
```bash
python -m venv .venv
```

**macOS / Linux**
```bash
python3 -m venv .venv
```

### 4. Activate the Virtual Environment

**Windows (PowerShell)**
```bash
.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt)**
```bash
.venv\Scripts\activate
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```
---

### 6. Run the Application

#### Start the FastAPI Backend

```bash
uvicorn main:app --reload
```

Backend API:
```text
http://127.0.0.1:8000
```

Swagger Documentation:
```text
http://127.0.0.1:8000/docs
```

#### Start the Frontend

Open `index.html` in your browser or run it using the **Live Server** extension in Visual Studio Code.
---

## 💻 Application Workflow

1. Open the web application.
2. Enter student information.
3. Fill in social media usage details.
4. Provide academic and lifestyle information.
5. Submit the form.
6. The FastAPI backend processes the request.
7. The trained Machine Learning model predicts the Mental Health Score.
8. The prediction is displayed instantly.

---

## 📊 Model Input Features

* Age
* Gender
* Country
* Academic Level
* Most Used Platform
* Purpose of Use
* Average Daily Usage Hours
* Daily Unlocks
* Study Hours
* Physical Activity Hours
* Sleep Hours Per Night
* Stress Level
* Grouped Country

### Output

* Mental Health Score


---

## 🔮 Future Improvements

* User authentication
* Prediction history
* Data visualization dashboard
* Explainable AI (SHAP)
* Model performance comparison
* Cloud deployment
* Mobile-friendly improvements

---


