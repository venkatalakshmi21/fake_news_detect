"""Automated tests for YO G News Flask backend."""
from pathlib import Path
import sys
import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / 'backend'))
try:
    from backend.app import app
except ModuleNotFoundError:
    from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as c:
        yield c

def test_root(client):
    r = client.get('/')
    assert r.status_code == 200

def test_health(client):
    r = client.get('/api/health')
    assert r.status_code == 200
    data = r.get_json()
    assert isinstance(data, dict)
    assert 'model_loaded' in data

def test_news(client):
    r = client.get('/api/news')
    assert r.status_code == 200
    data = r.get_json()
    articles = data.get('articles', data.get('news', data)) if isinstance(data, dict) else data
    assert isinstance(articles, list)
    assert articles
    assert 'title' in articles[0]
    assert 'content' in articles[0]

def test_analyze_requires_input(client):
    r = client.post('/api/analyze', json={})
    assert r.status_code in (400, 422)

def test_analyze(client):
    r = client.post('/api/analyze', json={
        'title': 'Researchers publish a new water purification method',
        'content': 'Researchers published a study describing a water purification method and experimental results.'
    })
    assert r.status_code == 200, r.get_data(as_text=True)
    data = r.get_json()
    for key in ('prediction', 'confidence', 'probabilities', 'explanation', 'disclaimer'):
        assert key in data
    assert isinstance(data['prediction'], str)
    assert 0 <= float(data['confidence']) <= 1
    assert isinstance(data['probabilities'], dict)
    assert all(0 <= float(v) <= 1 for v in data['probabilities'].values())
    assert sum(float(v) for v in data['probabilities'].values()) == pytest.approx(1.0, abs=0.02)

def test_frontend_hooks():
    html = ROOT / 'frontend' / 'index.html'
    script = ROOT / 'frontend' / 'script.js'
    if not html.exists() or not script.exists():
        pytest.skip('Frontend files are not present.')
    h = html.read_text(encoding='utf-8')
    s = script.read_text(encoding='utf-8')
    assert 'id="newsGrid"' in h
    assert 'id="analyzeBtn"' in h
    assert 'id="result"' in h
    assert 'api/analyze' in s or '/api/analyze' in s
    assert 'api/news' in s or '/api/news' in s
