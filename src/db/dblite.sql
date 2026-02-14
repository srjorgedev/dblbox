PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS ability (
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

CREATE TABLE IF NOT EXISTS ability_type (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chapter (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS chapter_texts(
    chapter int,
	lang text,
	content text,
	PRIMARY KEY(chapter, lang),
	FOREIGN KEY (chapter) REFERENCES chapter(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE IF NOT EXISTS color (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS color_texts(
    color int,
	lang text,
	content text,
	PRIMARY KEY(color, lang),
	FOREIGN KEY (color) REFERENCES color(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE IF NOT EXISTS lang (
    _code TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rarity (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS rarity_texts(
    rarity int,
	lang text,
	content text,
	PRIMARY KEY(rarity, lang),
	FOREIGN KEY (rarity) REFERENCES rarity(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE IF NOT EXISTS tag (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS tag_texts(
    tag int,
	lang text,
	content text,
	PRIMARY KEY(tag, lang),
	FOREIGN KEY (tag) REFERENCES tag(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE IF NOT EXISTS type (
    _id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS type_texts(
    type int,
	lang text,
	content text,
	PRIMARY KEY(type, lang),
	FOREIGN KEY (type) REFERENCES type(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE IF NOT EXISTS unit (
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

CREATE TABLE IF NOT EXISTS unit_color (
    number INTEGER NOT NULL,
    unit TEXT NOT NULL,
    color INTEGER NOT NULL,
    PRIMARY KEY (unit, color, number),
    FOREIGN KEY (unit) REFERENCES unit(_id),
    FOREIGN KEY (color) REFERENCES color(_id)
);

CREATE TABLE IF NOT EXISTS unit_name (
	num INTEGER NOT NULL,
	unit TEXT NOT NULL,
	lang TEXT NOT NULL,
	content TEXT NOT NULL,
	PRIMARY KEY (unit, lang, num),
	FOREIGN KEY (unit) REFERENCES unit(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE IF NOT EXISTS unit_tag (
    unit TEXT,
    tag INTEGER,
    PRIMARY KEY (unit, tag),
    FOREIGN KEY (unit) REFERENCES unit (_id),
    FOREIGN KEY (tag) REFERENCES tag (_id)
);

CREATE TABLE IF NOT EXISTS equipment_type();

CREATE TABLE equipment (
	_id INTEGER PRIMARY KEY NOT NULL,
	type INTEGER NOT NULL,
	is_awaken BOOLEAN NOT NULL,
	awaken_from INTEGER NOT NULL,
	FOREIGN KEY (type) REFERENCES type(_id),
	FOREIGN KEY (awaken_from) REFERENCES equipment(_id)
);

CREATE TABLE IF NOT EXISTS equipment_texts (
	_id INTEGER NOT NULL,
	lang TEXT NOT NULL,
	title TEXT NOT NULL,
	PRIMARY KEY (_id, lang),
	FOREIGN KEY (_id) REFERENCES equipment(_id),
	FOREIGN KEY (lang) REFERENCES lang(_code)
);

CREATE TABLE IF NOT EXISTS equipment_condition (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER NOT NULL,
    unit_id TEXT NULL, 
    tag_id INTEGER NULL,
    type_id INTEGER NULL,
    rarity_id INTEGER NULL,
    chapter_id INTEGER NULL,
    color_id INTEGER NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(_id),
    FOREIGN KEY (unit_id) REFERENCES unit(_id),
    FOREIGN KEY (tag_id) REFERENCES tag(_id),
    FOREIGN KEY (type_id) REFERENCES type(_id),
    FOREIGN KEY (rarity_id) REFERENCES rarity(_id),
    FOREIGN KEY (chapter_id) REFERENCES chapter(_id),
    FOREIGN KEY (color_id) REFERENCES color(_id)
);

CREATE TABLE IF NOT EXISTS equipment_effect (
	equipment_id INTEGER NOT NULL,
	slot_num INTEGER NOT NULL,
	slot_type INTEGER NOT NULL,
	slot_effect TEXT NOT NULL,
	effect_num INTEGER NOT NULL,
	PRIMARY KEY (equipment_id, slot_num, effect_num),
	FOREIGN KEY (equipment_id) REFERENCES equipment(_id)
);
