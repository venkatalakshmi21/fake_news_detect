from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "yog_news_model.pkl")

model = None

try:
    model = joblib.load(MODEL_PATH)
    print("YO G News model loaded successfully.")
except Exception as e:
    print("Model loading warning:", e)


NEWS_ARTICLES = [
    {
        "id": 1,
        "title": "Scientists Develop New Water Purification Technology",
        "content": "Researchers announced preliminary progress on a new water purification technology undergoing laboratory testing.",
        "category": "Science"
    },
    {
        "id": 2,
        "title": "Government Launches Digital Scholarship Portal",
        "content": "The education department announced an online portal for scholarship applications.",
        "category": "Education"
    }
]


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to YO G News API",
        "status": "running"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })


@app.route("/api/news", methods=["GET"])
def get_news():
    return jsonify({
        "success": True,
        "articles": NEWS_ARTICLES
    })


@app.route("/api/analyze", methods=["POST"])
def analyze_news():
    if model is None:
        return jsonify({
            "success": False,
            "message": "ML model is not loaded."
        }), 500

    data = request.get_json(silent=True) or {}

    title = data.get("title", "")
    content = data.get("content", "")

    if not title and not content:
        return jsonify({
            "success": False,
            "message": "Please provide a news title or content."
        }), 400

    text = f"{title} {content}".strip()

    try:
        prediction = model.predict([text])[0]
        probabilities = model.predict_proba([text])[0]
        confidence = round(float(max(probabilities)) * 100, 2)

        probability_data = {
            label: round(float(probability) * 100, 2)
            for label, probability in zip(model.classes_, probabilities)
        }

        explanations = {
            "Likely Reliable": "The model detected patterns associated with relatively reliable news.",
            "Needs Verification": "The model cannot confidently determine reliability. Please verify with trusted sources.",
            "Potentially Misleading": "The model detected patterns associated with potentially misleading information."
        }

        return jsonify({
            "success": True,
            "prediction": prediction,
            "confidence": confidence,
            "probabilities": probability_data,
            "explanation": explanations.get(prediction, "No explanation available."),
            "disclaimer": "This AI prediction is not definitive proof that news is true or false."
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "message": "Analysis failed.",
            "error": str(error)
        }), 500


if __name__ == "__main__":
    print("YO G News Backend running at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
