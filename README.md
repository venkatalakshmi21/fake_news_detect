# YO G News Tests

Automated tests for the YO G News fake/misleading-news detection project.

## Run

From the project root:

```bash
pip install pytest
python -m pytest tests/test_app.py -v
```

The tests check the Flask root/health/news endpoints, analysis validation and response structure, confidence/probability ranges, and basic frontend/backend integration hooks.

These tests verify application behavior; they do **not** prove that an ML prediction is factually correct. For model evaluation, use a properly sourced labeled dataset and metrics such as precision, recall, F1-score, and a confusion matrix. Scikit-learn documents these evaluation measures. 
