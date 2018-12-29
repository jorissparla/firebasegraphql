const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();
server.express.use(cookieParser());
server.express.use((req, res, next) => {
  console.log("req", req.db);
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

server.start(() => console.log("Server is running on localhost:4000"));
