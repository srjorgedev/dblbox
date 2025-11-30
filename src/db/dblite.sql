PRAGMA foreign_keys = ON;

CREATE TABLE ability (
    number INTEGER NOT NULL,
    lang TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
	ability_type INTEGER NOT NULL,
	unit TEXT NOT NULL,
	PRIMARY KEY(unit, ability_type, number, lang)
    FOREIGN KEY (lang) REFERENCES lang (_code),
	FOREIGN KEY (unit) REFERENCES unit (_id),
	FOREIGN KEY (ability_type) REFERENCES ability_type (_id)
);

CREATE TABLE ability_type (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
);

CREATE TABLE chapter (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE chapter_texts(
    chapter int,
	lang text,
	content text,
	PRIMARY KEY(chapter, lang),
	FOREIGN KEY (chapter) REFERENCES chapter(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE color (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE color_texts(
    color int,
	lang text,
	content text,
	PRIMARY KEY(color, lang),
	FOREIGN KEY (color) REFERENCES color(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE lang (
    _code TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE rarity (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE rarity_texts(
    rarity int,
	lang text,
	content text,
	PRIMARY KEY(rarity, lang),
	FOREIGN KEY (rarity) REFERENCES rarity(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE tag (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE tag_texts(
    tag int,
	lang text,
	content text,
	PRIMARY KEY(tag, lang),
	FOREIGN KEY (tag) REFERENCES tag(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE type (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE type_texts(
    type int,
	lang text,
	content text,
	PRIMARY KEY(type, lang),
	FOREIGN KEY (type) REFERENCES type(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE unit (
    _id TEXT PRIMARY KEY,
    _num INTEGER,
    type INTEGER,
    chapter INTEGER,
	rarity INTEGER,
	lf BOOLEAN,
	transform BOOLEAN, zenkai BOOLEAN, tagswitch BOOLEAN,
    FOREIGN KEY (chapter) REFERENCES chapter (_id),
    FOREIGN KEY (type) REFERENCES type (_id),
	FOREIGN KEY (rarity) REFERENCES rarity (_id) 
);

CREATE TABLE unit_color (
    number INTEGER NOT NULL,
    unit TEXT NOT NULL,
    color INTEGER NOT NULL,
    PRIMARY KEY (unit, color, number),
    FOREIGN KEY (unit) REFERENCES unit(_id),
    FOREIGN KEY (color) REFERENCES color(_id)
);

CREATE TABLE unit_name (
	num INTEGER NOT NULL,
	unit TEXT NOT NULL,
	lang TEXT NOT NULL,
	content TEXT NOT NULL,
	PRIMARY KEY (unit, lang, num),
	FOREIGN KEY (unit) REFERENCES unit(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE unit_tag (
    unit TEXT,
    tag INTEGER,
    PRIMARY KEY (unit, tag),
    FOREIGN KEY (unit) REFERENCES unit (_id),
    FOREIGN KEY (tag) REFERENCES tag (_id)
);