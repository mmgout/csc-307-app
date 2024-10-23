// backend.js
import userService from "./services/user-service.js"; 
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING, {
    useNewURLParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService.addUser(userToAdd).then((p) => {
    if (p) {
      res.status(201).send(p);
    } else {
      res.status(500).end();
    }
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params._id;
  mongoose.findByIdAndDelete(id);
  res.status(204).send();
});

//Get user by name/job or by name or by job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  userService
    .getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An internal server error occurred.");
    });
});

//Get user by ID
app.get("/users/:id", (req, res) => {
  const id = req.params["_id"]; //or req.params._id
  userService.findUserById(id).then((result) => {
    if (result === undefined || result === null) {
      res.status(404).send("Resource not found.");
    } else {
      res.send({ users_list: result });
    }
  });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
