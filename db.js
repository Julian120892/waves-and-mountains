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
        ;
    `;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getLastId = () => {
    const q = `
        SELECT id FROM images
        ORDER BY id DESC
        LIMIT 1;
        `;
    return db.query(q);
};

module.exports.getMoreImages = (lastid) => {
    const q = `
        SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 10;
        `;
    const params = [lastid];
    return db.query(q, params);
};
