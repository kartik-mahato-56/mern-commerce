var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/authRoutes");
var adminRotes = require('./routes/adminRoutes')

var app = express();
app.use(fileUpload());
app.use(cors());
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false }));
app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// auth routing
app.use("/api/auth", authRouter);
app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
//admin routes
app.use('/api/admin', adminRotes)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
