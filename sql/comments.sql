DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    imageId INTEGER NOT NULL REFERENCES images (id),
    username VARCHAR NOT NULL,
    comment VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO comments(imageId, username, comment) VALUES (
    2,
    'funkychicken',
    'I really like this picture!! Verymuch'
);