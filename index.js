// server.js
const express = require("express");
const fs = require("fs");
const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamArray } = require("stream-json/streamers/StreamArray");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(cors());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/getCollege", async (req, res) => {
  const { state, district } = req.query;

  const pipeline = chain([
    fs.createReadStream("data/data.json"),
    parser(),
    streamArray(),
  ]);

  let colleges = [];

  pipeline.on("data", (data) => {
    if (data && data.value) {
      const college = data.value;
      if (
        state !== "null" &&
        college["State Name"] === state &&
        college["District Name"] === district
      ) {
        colleges.push(college);
      }
    }
  });

  pipeline.on("end", () => res.send(colleges));
  pipeline.on("error", (error) => {
    console.error(error);
    res.status(500).send("Error occurred while fetching data");
  });
});

app.get("/getStates", (req, res) => {
  fs.readFile("data/states_districts.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }

    const states = JSON.parse(data).states.map((s) => s.state);
    res.send(states);
  });
});

app.get("/getDistricts", (req, res) => {
  const stateQuery = req.query.state;

  fs.readFile("data/states_districts.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }

    const states = JSON.parse(data).states;
    const state = states.find((s) => s.state === stateQuery);

    if (state) {
      res.send(state.districts);
    } else {
      res.status(404).send("State not found");
    }
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));
