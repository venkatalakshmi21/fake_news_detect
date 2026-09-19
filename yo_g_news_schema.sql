CREATE TABLE categories (
 category_id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL UNIQUE
);

CREATE TABLE news_articles (
 article_id INTEGER PRIMARY KEY,
 title TEXT NOT NULL,
 content TEXT NOT NULL,
 category_id INTEGER,
 credibility_label TEXT NOT NULL,
 source_url TEXT,
 author TEXT,
 published_at TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 notes TEXT,
 FOREIGN KEY(category_id) REFERENCES categories(category_id)
);

CREATE TABLE analysis_history (
 analysis_id INTEGER PRIMARY KEY AUTOINCREMENT,
 article_id INTEGER,
 title TEXT NOT NULL,
 content TEXT NOT NULL,
 prediction TEXT NOT NULL,
 confidence REAL,
 probabilities_json TEXT,
 explanation TEXT,
 analyzed_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(article_id) REFERENCES news_articles(article_id)
);