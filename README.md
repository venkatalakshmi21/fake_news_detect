# YO G News — AI-Assisted News Reading & Credibility Detection Platform

> **Read it. Understand it. Question it.**

YO G News is a web-based news reading and credibility analysis platform that combines a simple news portal with a machine-learning-based text classification system.

Instead of making users visit a separate fake-news checker, YO G News integrates the analysis directly into the news-reading experience. A user can read an article, submit its title and content, and receive a model-generated credibility classification, confidence information, class probabilities, and an explanation/disclaimer.

---

## 1. Project Overview

The rapid spread of misleading and fabricated information through websites and social media makes it difficult for readers to judge the credibility of online content.

YO G News is designed as an educational/prototype solution for this problem.

The system has two connected parts:

1. **News Reading Platform** — displays news articles by category.
2. **Credibility Detection System** — analyzes submitted news text using a machine-learning model.

The platform is intended to help users **question and verify information**, rather than treating an automated prediction as a final fact-check.

### Main workflow

```text
User reads news
      ↓
Selects / enters article
      ↓
Title + Content
      ↓
Text preprocessing
      ↓
TF-IDF feature extraction
      ↓
Machine Learning Classifier
      ↓
Credibility prediction
      ↓
Confidence + probabilities
      ↓
User reviews the result
      ↓
Verify using trustworthy sources
```

---

## 2. Objectives

The main objectives of YO G News are:

- Provide a simple news-reading interface.
- Organize articles by category.
- Allow users to analyze news articles directly from the platform.
- Use machine learning to classify submitted text.
- Display prediction confidence and class probabilities.
- Provide an explanation/disclaimer with the result.
- Maintain analysis history through the database layer.
- Provide automated tests for the backend.
- Provide a modular structure that can later support larger and better datasets.

---

## 3. Key Features

### 📰 News Reading

Users can view available articles through the Latest News section.

Each article can contain:

- Title
- Content
- Category
- Credibility label where available
- Verification/analyze action

### 🔎 News Credibility Analysis

Users can enter:

- News title
- News content

The backend sends the text to the trained machine-learning model and returns a prediction.

### 📊 Prediction Information

The application can display:

- Predicted credibility class
- Confidence
- Probability for each available class
- Explanation
- Disclaimer

The probability output comes from the classifier's probability-estimation functionality. In scikit-learn, `LogisticRegression.predict_proba()` returns probability estimates for the classes.

### 🗂️ Category Filtering

The news interface supports category-based browsing, allowing users to narrow the displayed articles.

### 💾 Database Layer

The project includes an SQLite database for application data such as:

- Categories
- News articles
- Analysis history

### 🧪 Automated Testing

The project contains tests for:

- Backend health
- News API
- Analysis API
- Input validation
- Prediction response structure
- Confidence/probability values
- Frontend/backend integration hooks

---

## 4. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Python, Flask |
| API | REST-style JSON endpoints |
| Machine Learning | Scikit-learn |
| Text Features | TF-IDF |
| Classifier | Logistic Regression |
| Data Processing | Pandas, NumPy |
| Model Storage | Joblib |
| Database | SQLite |
| Testing | Pytest |
| Development | Jupyter Notebook / VS Code |

TF-IDF converts a collection of raw documents into a numerical feature matrix that can be used by a machine-learning model. Logistic Regression can work with sparse input such as text feature matrices.

---

## 5. Machine Learning Workflow

```text
Dataset
   ↓
Data Exploration
   ↓
Data Cleaning
   ↓
Combine Title + Content
   ↓
Train/Test Split
   ↓
TF-IDF Vectorization
   ↓
Logistic Regression
   ↓
Model Evaluation
   ↓
Save Trained Model
   ↓
Flask API
   ↓
Frontend
```

### Step 1 — Data Collection

The model requires labeled news data containing text and a credibility-related target label.

Typical fields can include:

```text
title
content
category
credibility_label
```

### Step 2 — Data Preprocessing

The text is cleaned and prepared before training. Typical operations include:

- Removing unnecessary whitespace
- Handling missing values
- Removing duplicate records
- Combining title and article content
- Separating features and labels

### Step 3 — TF-IDF

The combined article text is converted into numerical features using TF-IDF.

TF-IDF gives numerical importance to terms based on their occurrence across documents. Scikit-learn's `TfidfVectorizer` provides this document-to-feature-matrix transformation.

### Step 4 — Classification

The project uses **Logistic Regression** as the classification algorithm.

```text
Article Text
     ↓
TF-IDF Vector
     ↓
Logistic Regression
     ↓
Class Prediction
     +
Probability Estimates
```

### Step 5 — Model Saving

The trained model is saved as:

```text
backend/model/yog_news_model.pkl
```

The Flask application loads this saved model when the backend starts.

---

## 6. Credibility Classes

The project can work with the following credibility-oriented labels:

```text
Likely Reliable
Needs Verification
Potentially Misleading
```

These labels should be understood as **machine-learning classifications**, not definitive statements that an article is true or false.

For example:

```text
Prediction:
Needs Verification

Confidence:
78%

Interpretation:
The model has classified the submitted text into the
"Needs Verification" category based on patterns learned
from its training data.
```

A model prediction should not replace independent fact-checking.

---

## 7. System Architecture

```text
                    YO G NEWS
                       │
          ┌────────────┴────────────┐
          │                         │
      Frontend                  Backend
   HTML/CSS/JS                   Flask
          │                         │
          │              ┌──────────┴──────────┐
          │              │                     │
          │          News API             Analyze API
          │                                    │
          │                              ML Model
          │                                    │
          │                         TF-IDF + Logistic
          │                              Regression
          │
          └────────────── JSON API ─────────────┘
                            │
                         Database
                          SQLite
```

---

## 8. Project Structure

```text
YO_G_News/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── model/
│       └── yog_news_model.pkl
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── dataset/
│   └── news_dataset.csv
│
├── notebooks/
│   ├── 01_Data_Exploration.ipynb
│   ├── 02_Data_Preprocessing.ipynb
│   ├── 03_Model_Training.ipynb
│   └── 04_Model_Evaluation.ipynb
│
├── tests/
│   ├── test_app.py
│   └── README.md
│
├── database/
│   ├── yo_g_news.db
│   └── yo_g_news_schema.sql
│
├── requirements-all.txt
└── README.md
```

> Folder names can be adjusted to match the actual location of your database and dataset files.

---

## 9. Backend API

### `GET /`

Checks the backend root endpoint.

### `GET /api/health`

Checks whether the backend and model are available.

### `GET /api/news`

Returns the news articles available to the application.

### `POST /api/analyze`

Analyzes submitted news content.

Example request:

```json
{
  "title": "Example News Title",
  "content": "Example news article content..."
}
```

Example response structure:

```json
{
  "prediction": "Needs Verification",
  "confidence": 0.78,
  "probabilities": {
    "Likely Reliable": 0.12,
    "Needs Verification": 0.78,
    "Potentially Misleading": 0.10
  },
  "explanation": "...",
  "disclaimer": "..."
}
```

The exact prediction and probability values depend on the trained model and input text.

---

## 10. Database

The project includes an SQLite database for storing application-related information.

### `categories`

Stores news categories.

```text
category_id
name
```

### `news_articles`

Stores article information.

```text
article_id
title
content
category_id
credibility_label
source_url
author
published_at
created_at
notes
```

### `analysis_history`

Stores analysis results.

```text
analysis_id
article_id
title
content
prediction
confidence
probabilities_json
explanation
analyzed_at
```

The database is primarily the **application/data-storage layer**. It should not be confused with the labeled dataset used to train a production-quality ML model.

---

## 11. Notebooks

The project contains four notebooks.

### `01_Data_Exploration.ipynb`

Used to inspect:

- Dataset shape
- Columns
- Data types
- Missing values
- Duplicate records
- Label distribution
- Content length

### `02_Data_Preprocessing.ipynb`

Used to:

- Clean text
- Combine title and content
- Remove invalid/duplicate records
- Create training and testing data

### `03_Model_Training.ipynb`

Used to:

- Create TF-IDF features
- Train Logistic Regression
- Generate predictions
- Save the trained model

### `04_Model_Evaluation.ipynb`

Used to evaluate the model using metrics such as:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix

---

## 12. Testing

The project contains:

```text
tests/test_app.py
```

Run the tests from the project root:

```bash
python -m pytest tests/test_app.py -v
```

Or:

```bash
pytest tests/test_app.py -v
```

The tests check whether the backend APIs respond correctly and whether the returned analysis data has the expected structure.

---

## 13. Installation

### Step 1 — Open the project folder

```bash
cd YO_G_News
```

### Step 2 — Create a virtual environment

Windows:

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### Step 3 — Install requirements

Using the complete requirements file:

```bash
pip install -r requirements-all.txt
```

Or install backend requirements:

```bash
pip install -r backend/requirements.txt
```

And testing requirements:

```bash
pip install -r requirements-test.txt
```

---

## 14. Running the Backend

From the project root:

```bash
python backend/app.py
```

The Flask server should start on the configured local address, commonly:

```text
http://127.0.0.1:5000
```

Check:

```text
http://127.0.0.1:5000/api/health
```

---

## 15. Running the Frontend

Open:

```text
frontend/index.html
```

in a browser, or use a local development server such as VS Code Live Server.

Make sure the Flask backend is running before using features that require the API.

---

## 16. How a User Uses YO G News

```text
1. Open YO G News
        ↓
2. Browse latest news
        ↓
3. Select an article
        ↓
4. Click "Verify this article"
        ↓
5. Article title/content is loaded
        ↓
6. Click "Analyze"
        ↓
7. Backend processes the text
        ↓
8. ML model generates prediction
        ↓
9. Result displays confidence/probabilities
        ↓
10. User independently verifies important claims
```

---

## 17. Example Use Cases

### Use Case 1 — News Reader

A student wants to read categorized news from a single interface.

### Use Case 2 — Article Analysis

A user sees a suspicious article and submits its title and content for model analysis.

### Use Case 3 — Educational Demonstration

Students can learn how:

```text
Text → Preprocessing → TF-IDF → ML Model → Prediction
```

works in a real web application.

### Use Case 4 — ML Project Demonstration

The project demonstrates the integration of:

- Machine learning
- Natural language processing
- Flask API
- JavaScript frontend
- Database
- Automated testing

---

## 18. Advantages

- Simple and user-friendly interface.
- Combines news reading and analysis in one platform.
- Uses machine learning rather than only manually written rules.
- Provides probability information along with classification.
- Modular frontend/backend architecture.
- Includes database support.
- Includes automated backend tests.
- Can be extended with larger datasets and more advanced models.

---

## 19. Limitations

YO G News is a **prototype/educational credibility-assistance system**, not a replacement for professional fact-checking.

Important limitations include:

- Model predictions depend heavily on the quality and representativeness of the training data.
- Text classification cannot independently establish whether a real-world claim is true.
- A high model confidence does not guarantee factual correctness.
- The current demo dataset/model should not be treated as a production-grade fact-checking system.
- New topics, writing styles, languages, and events may behave differently from the training data.
- Source verification is still necessary for important claims.

Therefore:

> **YO G News should be used to assist critical reading, not to declare an article definitively true or false.**

---

## 20. Future Enhancements

Possible future improvements include:

- Larger, properly sourced labeled datasets.
- Real-time news ingestion.
- Source credibility analysis.
- URL-based article extraction.
- Claim-level detection instead of only whole-article classification.
- Evidence retrieval from trusted sources.
- Multilingual news analysis.
- Explainable AI techniques.
- User accounts and personalized history.
- Advanced database integration.
- Model comparison using multiple classifiers.
- Continuous model evaluation.
- Human-in-the-loop verification.
- Improved security and API validation.
- Deployment to a cloud platform.

---

## 21. Recommended ML Improvements

For a stronger future version, the project can compare several approaches:

```text
TF-IDF + Logistic Regression
          ↓
TF-IDF + Naive Bayes
          ↓
TF-IDF + Linear SVM
          ↓
Transformer-based NLP models
```

The models should be compared using the same evaluation dataset and appropriate metrics rather than choosing a model based only on accuracy.

---

## 22. Disclaimer

**YO G News is an educational/prototype project for assisting users in evaluating news content. Its predictions are generated by a machine-learning model and may be incorrect. A prediction or confidence score must not be treated as proof that a news article is true, false, reliable, or misleading. Users should verify important claims using credible primary sources and independent fact-checking resources.**

---

## 23. Conclusion

YO G News demonstrates how a machine-learning model can be integrated into a complete web application to assist users while they consume online news.

The project combines:

```text
News Reading
     +
Text Processing
     +
Machine Learning
     +
REST API
     +
Database
     +
Automated Testing
     =
YO G NEWS
```

The central idea is simple:

> **Read it. Understand it. Question it.**
