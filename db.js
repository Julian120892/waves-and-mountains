const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL || "postgres:julian:pet@localhost:5432/imageboard"
);
//("WhoAreWeTalkingTo:WichDBuserWillRunCommands:TheUserPassword@WhichPort/nameOfDatabase")

module.exports.getImageFromDB = () => {
    console.log("server request for pictures");
    const q = ` 
    SELECT *
    FROM
    images;
    `;
    return db.query(q);
};
