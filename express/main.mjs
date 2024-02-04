import express from "express";
import session from "./express-session.mjs";
import RedisStore from "./connect-redis.mjs";
import { createClient } from "redis";

const app = express();

app.set("trust proxy", 1);
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = createClient({
  url: "redis://redis:6379",
});

redisClient.connect();

let redisStore = new RedisStore({ client: redisClient });

//Configure session middleware
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "keyboard cat",
  })
);

// sess:Us6D4HIK59Yb-Qx2n076PDz7FnPGHgsc
// s%3A Us6D4HIK59Yb-Qx2n076PDz7FnPGHgsc .10INJOZ7r6L2nyLjgf % 2BkG21ZbNC3CRYC8jJJqLZkt6w

app.get("/", (req, res) => {
  const user = {
    username: req.session.username ?? "",
  };
  res.render("index", { user });
});

app.post("/login", (req, res) => {
  req.session.username = req.body.username;
  req.session.password = req.body.password;
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(5000, () => {
  console.log(`Running on port:${5000}`);
});
