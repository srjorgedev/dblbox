PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS color (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS type (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS chapter (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS tag (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS rarity (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS lang (
    _code TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ability_type (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ability (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER NOT NULL,
    ability_type INTEGER NOT NULL,
    FOREIGN KEY (ability_type) REFERENCES ability_type (_id)
);

CREATE TABLE IF NOT EXISTS ability_texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ability INTEGER NOT NULL,
    lang TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (ability) REFERENCES ability (_id),
    FOREIGN KEY (lang) REFERENCES lang (_code)
);

CREATE TABLE IF NOT EXISTS unit (
    _id TEXT PRIMARY KEY,
    _num INTEGER,
    color INTEGER,
    type INTEGER,
    chapter INTEGER,
    FOREIGN KEY (chapter) REFERENCES chapter (_id),
    FOREIGN KEY (color) REFERENCES color (_id),
    FOREIGN KEY (type) REFERENCES type (_id)
);

CREATE TABLE IF NOT EXISTS name (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter INTEGER NOT NULL,
    FOREIGN KEY (chapter) REFERENCES chapter (_id)
);

CREATE TABLE IF NOT EXISTS unit_tag (
    unit TEXT,
    tag INTEGER,
    PRIMARY KEY (unit, tag),
    FOREIGN KEY (unit) REFERENCES unit (_id),
    FOREIGN KEY (tag) REFERENCES tag (_id)
);

CREATE TABLE IF NOT EXISTS unit_ability (
    unit TEXT,
    ability INTEGER,
    PRIMARY KEY (unit, ability),
    FOREIGN KEY (unit) REFERENCES unit (_id),
    FOREIGN KEY (ability) REFERENCES ability (_id)
);

CREATE TABLE IF NOT EXISTS tag_texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag INTEGER NOT NULL,
    lang TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (tag) REFERENCES tag (_id),
    FOREIGN KEY (lang) REFERENCES lang (_code)
);

CREATE TABLE IF NOT EXISTS rarity_texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rarity INTEGER NOT NULL,
    lang TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (rarity) REFERENCES rarity (_id),
    FOREIGN KEY (lang) REFERENCES lang (_code)
);

CREATE TABLE IF NOT EXISTS chapter_texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter INTEGER NOT NULL,
    lang TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (chapter) REFERENCES chapter (_id),
    FOREIGN KEY (lang) REFERENCES lang (_code)
);

CREATE TABLE IF NOT EXISTS name_texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name INTEGER NOT NULL,
    lang TEXT NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY (name) REFERENCES name (_id),
    FOREIGN KEY (lang) REFERENCES lang (_code)
);

CREATE TABLE IF NOT EXISTS color_texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    color INTEGER NOT NULL,
    lang TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (color) REFERENCES color (_id),
    FOREIGN KEY (lang) REFERENCES lang (_code)
);

CREATE TABLE IF NOT EXISTS type_texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type INTEGER NOT NULL,
    lang TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (type) REFERENCES type (_id),
    FOREIGN KEY (lang) REFERENCES lang (_code)
);
