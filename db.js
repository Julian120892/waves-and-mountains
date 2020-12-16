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
    ORDER BY created_at DESC;
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
