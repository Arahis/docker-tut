const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const Todo = require("./models/todo");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  return res.status(200).json({
    todos,
  });
});

app.post("/todos", async (req, res) => {
  const name = req.body.name;
  const todo = new Todo({
    name,
  });
  await todo.save();
  res.status(201).json({ message: "Goal saved", todo });
});

app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.completed = !todo.completed;

  await todo.save();

  return res.status(201).json({ message: "Todo saved", todo });
});

app.delete("/todos/:id", async (req, res) => {
  await Todo.deleteOne({
    id: req.params.id,
  });

  return res.status(201).json({ message: "Todo deleted" });
});

mongoose.connect(
  // host.docker.internal is the connection to the MongoDB container through the local machine
  // "mongodb://host.docker.internal:27017/todo-app",

  //172.17.0.2 is the IP address of the MongoDB container
  // "mongodb://172.17.0.2:27017/todo-app",

  // mongodb is the name of the MongoDB container when both containers are placed in the same Network
  // for this we need to create a Network
  "mongodb://mongodb:27017/todo-app",

  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Unable to connect to MongoDB");
      console.log(err);
    } else {
      console.log("Connected to MongoDB");
      app.listen(8000, () => {
        console.log("Now listening on PORT 8000");
      });
    }
  }
);
