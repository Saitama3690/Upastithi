const fs = require("fs");

const privateKey = fs.readFileSync("./server.key", "utf8");
const certificate = fs.readFileSync("./server.crt", "utf8");

const credentials = { key: privateKey, cert: certificate };

module.exports = credentials;
