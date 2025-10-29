CREATE TABLE
    IF NOT EXISTS color (_id INT PRIMARY KEY AUTO_INCREMENT);

CREATE TABLE
    IF NOT EXISTS type (_id INT PRIMARY KEY AUTO_INCREMENT);

CREATE TABLE
    IF NOT EXISTS chapter (_id INT PRIMARY KEY AUTO_INCREMENT);

CREATE TABLE
    IF NOT EXISTS tag (_id INT PRIMARY KEY AUTO_INCREMENT);

CREATE TABLE
    IF NOT EXISTS rarity (_id INT PRIMARY KEY AUTO_INCREMENT);

CREATE TABLE
    IF NOT EXISTS lang (
        _code CHAR(2) PRIMARY KEY, 
        name TEXT NOT NULL
        );

CREATE TABLE
    IF NOT EXISTS ability_type (
        _id INT PRIMARY KEY AUTO_INCREMENT,
        content TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS ability (
        _id INT PRIMARY KEY AUTO_INCREMENT,
        number INT NOT NULL,
        ability_type INT NOT NULL,
        FOREIGN KEY (ability_type) REFERENCES ability_type (_id)
    );

CREATE TABLE
    IF NOT EXISTS ability_texts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ability INT NOT NULL,
        lang CHAR(2) NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (ability) REFERENCES ability (_id),
        FOREIGN KEY (lang) REFERENCES lang (_code)
    );

CREATE TABLE
    IF NOT EXISTS unit (
        _id CHAR(10) PRIMARY KEY,
        _num INT,
        color INT,
        type INT,
        chapter INT,
        FOREIGN KEY (chapter) REFERENCES chapter (_id),
        FOREIGN KEY (color) REFERENCES color (_id),
        FOREIGN KEY (type) REFERENCES type (_id)
    );

CREATE TABLE
    IF NOT EXISTS name (
        _id INT PRIMARY KEY AUTO_INCREMENT,
        chapter INT NOT NULL,
        FOREIGN KEY (chapter) REFERENCES chapter (_id)
    );

CREATE TABLE
    IF NOT EXISTS unit_tag (
        unit CHAR(10),
        tag INT,
        PRIMARY KEY (unit, tag),
        FOREIGN KEY (unit) REFERENCES unit (_id),
        FOREIGN KEY (tag) REFERENCES tag (_id)
    );

CREATE TABLE
    IF NOT EXISTS unit_ability (
        unit CHAR(10),
        ability INT,
        PRIMARY KEY (unit, ability),
        FOREIGN KEY (unit) REFERENCES unit (_id),
        FOREIGN KEY (ability) REFERENCES ability (_id)
    );

CREATE TABLE
    IF NOT EXISTS tag_texts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tag INT NOT NULL,
        lang CHAR(2) NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (tag) REFERENCES tag (_id),
        FOREIGN KEY (lang) REFERENCES lang (_code)
    );

CREATE TABLE
    IF NOT EXISTS rarity_texts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        rarity INT NOT NULL,
        lang CHAR(2) NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (rarity) REFERENCES rarity (_id),
        FOREIGN KEY (lang) REFERENCES lang (_code)
    );

CREATE TABLE
    IF NOT EXISTS chapter_texts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        chapter INT NOT NULL,
        lang CHAR(2) NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (chapter) REFERENCES chapter (_id),
        FOREIGN KEY (lang) REFERENCES lang (_code)
    );

CREATE TABLE
    IF NOT EXISTS name_texts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name INT NOT NULL,
        lang CHAR(2) NOT NULL,
        title TEXT NOT NULL,
        FOREIGN KEY (name) REFERENCES name (_id),
        FOREIGN KEY (lang) REFERENCES lang (_code)
    );

CREATE TABLE
    IF NOT EXISTS color_texts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        color INT NOT NULL,
        lang CHAR(2) NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (color) REFERENCES color (_id),
        FOREIGN KEY (lang) REFERENCES lang (_code)
    );

CREATE TABLE
    IF NOT EXISTS type_texts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type INT NOT NULL,
        lang CHAR(2) NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (type) REFERENCES type (_id),
        FOREIGN KEY (lang) REFERENCES lang (_code)
    );