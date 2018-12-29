const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createServer = require("./createServer");
const { db, auth } = require("./db");

const server = createServer();

server.express.use(cookieParser());

server.express.use((req, res, next) => {
  console.log("hier1");
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APPSECRET);
    req.userId = userId;
  }
  next();
});

server.express.use(async (req, res, next) => {
  console.log("hier2");
  if (!req.userId) {
    return next();
  }
  const user = auth.currentUser;
  if (!user) {
    return next();
  }
  const userObj = { id: user.uid, email, password, name: user.displayName, photoURL: user.photoURL };
  req.user = userObj;
  console.log({ userObj });
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: "localhost:4000"
    }
  },
  () => console.log("Server is running on localhost:4000")
);
