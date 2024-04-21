// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.static(__dirname));

app.get("/getCollege", async (req, res) => {
  const { country } = req.query;
  const collegeAPI = `http://universities.hipolabs.com/search?country=${country}`;
  try {
    const response = await axios.get(collegeAPI);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
