const express = require("express");
const app = express();
// allows HTML forms to send HTTP requests other than GET and POST
const methodOverride = require("method-override");
const { v4: uuid } = require("uuid");
const path = require("path");

// allows req.body to decipher data from a HTML form
app.use(express.urlencoded({ extended: true }))
// allows req.body to decipher JSON data
app.use(express.json())
// sets the query string name to _method
app.use(methodOverride("_method"));

// serves public css or js files that go along with the express app
app.use(express.static(path.join(__dirname, "public")));

// sets the view engine to ejs (embedded javascript)
app.set("view engine", "ejs");
// provides access to the views folder where you write all your HTML templates
app.set("views", path.join(__dirname, "views"));

let todoItems = [];

// INDEX
app.get("/", (_req, res) => {
  res.render("index", { todoItems });
})

// NEW
app.get("/new", (_req, res) => {
  res.render("new")
})

// CREATE
app.post("/todos", (req, res) => {
  const { desc, date, time } = req.body;
  todoItems.push({ id: uuid(), desc, date, time });
  res.redirect("/");
})

// SHOW
app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todoItem = todoItems.find(todo => todo.id === id);
  res.render("show", { todoItem });
})

// EDIT
app.get("/todos/:id/edit", (req, res) => {
  const { id } = req.params;
  const todoItem = todoItems.find(todo => todo.id === id);
  res.render("edit", { todoItem });
})

// UPDATE
app.patch("/todos/:id", (req, res) => {
  const { id } = req.params;
  const todoItem = todoItems.find(todo => todo.id === id);
  const { desc, date, time } = req.body;
  todoItem.desc = desc;
  todoItem.date = date;
  todoItem.time = time;
  res.redirect("/");
})

// DELETE
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  todoItems = todoItems.filter(todo => todo.id !== id);
  res.redirect("/");
})

// opens the specific port to start the express server
app.listen(3000, () => {
  console.log("Listening on port 3000")
});