// server.js
const express = require("express");
const fs = require("fs");
const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamArray } = require("stream-json/streamers/StreamArray");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.static(__dirname));

app.get("/getCollege", async (req, res) => {
  const { state, district } = req.query;

  const pipeline = chain([
    fs.createReadStream("./data.json"),
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

app.listen(3001, () => console.log("Server running on port 3001"));
