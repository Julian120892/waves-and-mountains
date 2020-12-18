const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL || "postgres:julian:pet@localhost:5432/imageboard"
);
//("WhoAreWeTalkingTo:WichDBuserWillRunCommands:TheUserPassword@WhichPort/nameOfDatabase")

module.exports.getImagesFromDB = () => {
    console.log("server request for pictures");
    const q = ` 
    SELECT *
    FROM
    images
    ORDER BY id DESC
    LIMIT 10;
    `;
    return db.query(q);
};

module.exports.getImageFromDB = (id) => {
    console.log("server request for pictures");
    const q = ` 
    SELECT *
    FROM
    images
    WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.uploadImage = (url, username, title, description) => {
    console.log("server upload of picture");
    const q = ` 
        INSERT INTO images (url, username, title, description) 
        VALUES ($1, $2, $3, $4)
        RETURNING *
        ;
    `;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getMoreImages = (lastid) => {
    const q = `
        SELECT url, title, id, username, description, (
     SELECT id FROM images
     ORDER BY id ASC
     LIMIT 1
 ) AS "lowestId" FROM images
 WHERE id < $1
 ORDER BY id DESC
 LIMIT 10;
        `;
    const params = [lastid];
    return db.query(q, params);
};

module.exports.addComment = (comment, username, imageId) => {
    const q = `
        INSERT INTO comments (comment, username, imageId) 
        VALUES ($1, $2, $3)
        ;
`;
    const params = [comment, username, imageId];
    return db.query(q, params);
};

module.exports.getComments = (imageId) => {
    const q = `
        SELECT * FROM comments
        WHERE imageId = $1
        ;
`;
    const params = [imageId];
    return db.query(q, params);
};
