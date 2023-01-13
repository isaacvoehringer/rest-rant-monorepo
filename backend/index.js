// Modules and Globals
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const cookieSession = require("cookie-session");
// console.log(app)
// Express Settings
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(cors({
   origin: 'http://localhost:3000',
   credentials: true 
}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Controllers & Routes

app.use(express.urlencoded({ extended: true }));


app.use("/users", require("./controllers/users"));
app.use("/places", require("./controllers/places"));
app.use("/authentication", require("./controllers/authenticaton"));

// Listen for Connections
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
