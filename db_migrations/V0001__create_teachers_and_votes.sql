
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    nomination_id INTEGER NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    nomination_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL REFERENCES teachers(id),
    voter_fingerprint TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(nomination_id, voter_fingerprint)
);

INSERT INTO teachers (nomination_id, name) VALUES
(2, 'Лада Львовна'),
(2, 'Дарья Александровна'),
(2, 'Виктория Андреевна'),
(2, 'Лариса Николаевна'),
(2, 'Ксения Геннадьевна'),
(2, 'Елена Владимировна'),
(2, 'Наталья Михайловна'),
(2, 'Светлана Валентиновна'),
(2, 'Марина Евгеньевна'),
(2, 'Татьяна Станиславовна'),
(2, 'Елена Вениаминовна'),
(2, 'Елена Анатольевна'),
(2, 'Наталья Анатольевна'),
(2, 'Любовь Александровна');
