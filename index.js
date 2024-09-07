const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.set("view engine", "ejs");

const users = [
  { id: 1, name: "Test user 1" },
  { id: 2, name: "Test user 2" },
  { id: 3, name: "Test user 3" },
  { id: 4, name: "Test user 4" },
  // Add more users as needed
];

app.get("/", (req, res) => {
  res.send("Code Fiesta Round 2");
});

app.post("/users", (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).send(user);
});

app.get("/users", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const search = req.query.search || "";
  const sort = req.query.sort || "asc";

  let filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === "asc") {
    filteredUsers.sort((a, b) => a.id - b.id);
  } else {
    filteredUsers.sort((a, b) => b.id - a.id);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const resultUsers = filteredUsers.slice(startIndex, endIndex);

  res.render("users", { users: resultUsers, page, limit, search, sort });
});

app.get("/users/:id", (req, res) => {
  const user = users.find((i) => i.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("user not found");
  res.send(user);
});

app.put("/users/:id", (req, res) => {
  const user = users.find((i) => i.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("user not found");
  Object.assign(user, req.body);
  res.send(user);
});

app.delete("/users/:id", (req, res) => {
  const index = users.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("user not found");
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
