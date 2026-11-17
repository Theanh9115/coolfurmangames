CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    game1_score INTEGER NOT NULL,
    game2_score INTEGER NOT NULL,
    game3_score INTEGER NOT NULL,
    date TEXT NOT NULL
);

INSERT INTO scores (username, game1_score, game2_score, game3_score, date)
VALUES
    ('The Anh', 999, 999, 888, '2026-09-29'),
    ('La''Kia', 888, 888, 999, '2026-09-29'),
    ('Charlie', 1238478911, 523, 123, '2026-10-06'),
    ('Kai', 1312, 5322, 582, '2026-10-05'),
    ('Billy Bob', 10, 5, 16, '2026-10-20'),
    ('John Furman', 10, 5, 16, '2020-10-26');
