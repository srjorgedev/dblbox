create table ability_type (_id INTEGER PRIMARY KEY);

INSERT INTO
    ability_type
VALUES
    (1),
    (2),
    (3),
    (4),
    (5),
    (6),
    (7),
    (8),
    (9),
    (10),
    (11),
    (12),
    (13),
    (14),
    (15),
    (16),
    (17),
    (18),
    (19),
    (20),
    (21),
    (22),
    (23),
    (24);

CREATE TABLE ability_type_texts (
    ability_type INTEGER NOT NULL,
    lang TEXT NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (ability_type, lang),
    FOREIGN KEY (ability_type) REFERENCES ability_type (id) FOREIGN KEY (lang) REFERENCES lang (id)
);

INSERT INTO
    ability_type_texts (ability_type, lang, content)
VALUES
    (1, "en", "Main Ability"),
    (2, "en", "Ultra Ability"),
    (3, "en", "Unique Ability"),
    (4, "en", "Z Ability"),
    (5, "en", "Z Limited Ability"),
    (6, "en", "Zenkai Ability"),
    (7, "en", "Unique Gauge"),
    (8, "en", "Special Cover Change"),
    (9, "en", "Zenkai Main Ability"),
    (10, "en", "Zenkai Unique Ability"),
    (11, "en", "Starter Ability"),
    (12, "en", "Held Cards"),
    (13, "en", "Strike"),
    (14, "en", "Blast"),
    (15, "en", "Special Move"),
    (16, "en", "Special Art"),
    (17, "en", "Ultimate"),
    (18, "en", "Awaken"),
    (19, "en", "Switch Ability"),
    (20, "en", "Zenkai Switch Ability"),
    (21, "en", "Zenkai Special Art"),
    (22, "en", "Zenkai Special Move"),
    (23, "en", "Zenkai Ultimate"),
    (24, "en", "Zenkai Awaken"),
    (1, "es", "Main Ability"),
    (2, "es", "Ultra Ability"),
    (3, "es", "Unique Ability"),
    (4, "es", "Z Ability"),
    (5, "es", "Z Limited Ability"),
    (6, "es", "Zenkai Ability"),
    (7, "es", "Unique Gauge"),
    (8, "es", "Special Cover Change"),
    (9, "es", "Zenkai Main Ability"),
    (10, "es", "Zenkai Unique Ability"),
    (11, "es", "Starter Ability"),
    (12, "es", "Held Cards"),
    (13, "es", "Strike"),
    (14, "es", "Blast"),
    (15, "es", "Special Move"),
    (16, "es", "Special Art"),
    (17, "es", "Ultimate"),
    (18, "es", "Awaken"),
    (19, "es", "Switch Ability"),
    (20, "es", "Zenkai Switch Ability"),
    (21, "es", "Zenkai Special Art"),
    (22, "es", "Zenkai Special Move"),
    (23, "es", "Zenkai Ultimate"),
    (24, "es", "Zenkai Awaken");

INSERT INTO
    ability_type_texts (ability_type, lang, content)
VALUES
    (1, "es", "Habilidad inicial"),
    (5, "es", "Cambio Protector singular"),
    (6, "es", "Medidor único"),
    (8, "es", "Contraataque automático");

