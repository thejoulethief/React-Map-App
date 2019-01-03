const express = require("express");
const mongoose = require("mongoose");
const Filter = require("bad-words");

const helmet = require("helmet");

const morgan = require("morgan");

const cors = require("cors");

const bodyParser = require("body-parser");

filter = new Filter();
const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());

app.use(bodyParser.json());

mongoose.connect(
  "mongodb://",
  { useNewUrlParser: true }
);

var schema = new mongoose.Schema(
  {
    name: String,
    message: String,
    lat: Number,
    lng: Number
  },
  { timestamps: true }
);

const Pin = mongoose.model("Pin", schema);

app.get("/", function (req, res) {
  res.json({ "Hello and welcome to the maps API": "🗺!" });
});

sanitizeInput = body => { };

app.post("/markers", function (req, res) {
  console.log(req.body);
  if (
    req.body.name.trim() != 0 &&
    req.body.message.trim() != 0 &&
    -90 >= req.body.lat <= 90 &&
    -180 >= req.body.lng <= 180
  ) {
    req.body.message = filter.clean(req.body.message);
    req.body.name = filter.clean(req.body.name);
    const newpin = new Pin(req.body);
    newpin.save().then(() => console.log("saved to db"));
    res.status(200);
    res.end("You submitted a marker boi");
  } else {
    res.status(500);
    res.end("Oops! That didn't work!");

  }
});

app.get("/markers", function (req, res) {
  Pin.find({}, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

app.listen(5000 || process.env.PORT);
