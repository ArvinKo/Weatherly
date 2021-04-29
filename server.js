const express = require("express");
const Datastore = require("nedb");
const app = express();
const port = 3000;

// Setting up the public directory
app.use(express.static("application"));
app.use(express.json({ limit: "1mb" }));
app.listen(port, () => console.log(`listening on port ${port}`));

//creating a data base to store the users history
const database = new Datastore("history.db");
database.loadDatabase();

//enables history.js to retrieve the users searches
app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

//enables main.js to post information about the user's chosen location to a database
app.post("/api", (request, response) => {
  const data = request.body;
  const time = Date.now();
  data.time = time;
  database.insert(data);
  response.json(data);
});
