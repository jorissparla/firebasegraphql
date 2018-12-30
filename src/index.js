const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createServer = require("./createServer");
const { db, auth } = require("./db");

const server = createServer();

server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const user = auth.currentUser;
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APPSECRET);
    console.log("i have a token");
    req.userId = userId;
  } else {
    console.log("i do not have a token");
    if (user) {
      req.userId = user.uid;
    }
  }
  next();
});

server.express.use(async (req, res, next) => {
  if (!req.userId) {
    return next();
  }
  console.log("hier3");
  const user = auth.currentUser;
  if (!user) {
    return next();
  }
  const userObj = {
    id: user.uid,
    email: user.email,
    password: user.pass,
    name: user.displayName,
    photoURL: user.photoURL
  };
  req.user = userObj;
  console.log({ userObj });
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: ["http://localhost:3000", "http://localhost:4000/"]
    }
  },
  () => console.log("Server is running on localhost:4000")
);
