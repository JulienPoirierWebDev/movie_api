const session = require("express-session");
const connectMongo = require("connect-mongo");

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  httpOnly: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  },
  store: connectMongo.create({
    mongoUrl: process.env.MONGO_URL,
  }),
});

module.exports = sessionMiddleware;
