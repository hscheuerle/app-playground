import express from "express";
import pg from "pg";
import redis from "redis";

const PORT = 5000;

const app = express();

const cache = redis.createClient({
  url: "redis://cache:6379",
});

cache.on("error", (err) => console.log("Redis Client Error", err));

const postgres = new pg.Pool({
  connectionString:
    "postgres://user:password@database:5432/postgres?sslmode=disable",
  ssl: {
    rejectUnauthorized: false,
  },
});

app.set("view engine", "ejs");

// chrome will not respect document cache on the client but safari seems to.
app.get("/", (_, res) => {
  // res.setHeader("Cache-Control", "max-age=10");
  res.render("index", { time: `s: ${new Date().getSeconds()}` });
});

app.get("/api/add-table", async (_, res) => {
  const client = await postgres.connect();
  await client.query(`CREATE TABLE IF NOT EXISTS test (value TEXT);`);
  res.sendStatus(200);
});

app.get("/api/add-one", async (_, res) => {
  const client = await postgres.connect();
  await client.query(`INSERT INTO test (value) VALUES ('one');`);
  res.sendStatus(200);
});

app.get("/api/list-all", async (_, res) => {
  const client = await postgres.connect();
  const result = await client.query(`SELECT * FROM test`);
  res.json({
    data: result.rows,
  });
});

app.get("/api/set-key", async (_, res) => {
  await cache.connect();
  await cache.set("key", "cached value");
  res.sendStatus(200);
});

app.get("/api/get-key", async (_, res) => {
  const result = await cache.get("key");
  res.json({
    data: result,
  });
});

app.get("/split-clients", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.render("split-clients/index", {
    color: req.headers["x-color"] || "unset",
  });
});

app.get("/api/one", (_, res) => {
  res.setHeader("Cache-Control", "max-age=10, private");
  res.send(`1: ${new Date().getSeconds()}`);
});

app.get("/api/two", (_, res) => {
  res.setHeader("Cache-Control", "max-age=10");
  res.send(`2: ${new Date().getSeconds()}`);
});

app.listen(PORT, () => {
  console.log(`Running on port:${PORT}`);
});
