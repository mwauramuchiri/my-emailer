require("dotenv").config({ path: "../.env" });
const express = require("express");
const sendMail = require("./send-mail");
const {
  createFileName,
  createFile,
  getFileData,
  getDirectoryFiles
} = require("./src/filer");
const authMiddleware = require("./src/auth-middleware");
const app = express();
const socket = require("socket.io");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookie = require("cookie"); // Import the cookie module

const templatesDir = "./templates";
const COOKIE_NAME = "emailer/jwt";

const server = app.listen(process.env.VUE_APP_APP_PORT);

const io = socket(server, {
  path: "/io"
});

app.use(express.static("../app/dist"));

// middlware to set header information for the ajax calls
app.use(
  [
    "/save",
    "/send",
    "/templates",
    "/get-template",
    "/socket.io",
    "/io",
    "/login",
    "/status",
    /.+[.ico]/,
    /^\/socket\.io\/?(?=\/|$)/i
  ],
  express.json(),
  function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.VUE_APP_APP_URL);
    res.header("Access-Control-Allow-Origin", process.env.VUE_APP_APP_DEV_URL);

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  }
);

app.post(
  "/send",
  (req, res, next) => authMiddleware(req, res, next),
  function(req, res) {
    const data = req.body;
    // console.log(data);

    if (
      Object.prototype.hasOwnProperty.call(data || {}, "htmlFile") &&
      Object.prototype.hasOwnProperty.call(data || {}, "data")
    ) {
      const sockConnect = {
        // sock: sock,
        // sockid: data.sockid || ""
      };
      const mailerResponse = sendMail(data.htmlFile, data.data, sockConnect);

      mailerResponse
        .catch(err => {
          console.error("err \n", err);
          res.status(500).send({
            ok: false,
            message: "Error in sending mail. \n Could be bad email data"
          });
        })
        .then(_res => {
          res.status(200).send({
            ok: true,
            message: _res
          });
        });
    } else {
      res.status(500).send({
        ok: false,
        message: "Could not find data property [htmlFile] or [data]"
      });
    }
  }
);

app.post(
  "/save",
  (req, res, next) => authMiddleware(req, res, next),
  function(req, res) {
    const file = req.body.file || false;
    const templateName = req.body.templateName || false;
    const saveTo = req.body.saveTo || false;
    // eslint-disable-next-line prettier/prettier
  const saveToHtml = (saveTo == false) ? false : `${templatesDir}/${req.body.saveTo.split(".")[0]}.html`;
    const fileExt = ".json";

    if (file) {
      if (saveTo == false) {
        // create new file
        if (templateName) {
          // create file
          const _saveResponse = createFile(
            `${templatesDir}/${templateName}${fileExt}`,
            file
          );
          var responseMessage =
            _saveResponse == true
              ? `Template ${templateName} saved`
              : _saveResponse;

          res.status(200).send({
            ok: _saveResponse,
            data: templateName,
            message: responseMessage
          });
        } else {
          res.status(400).send({
            ok: false,
            message: "We could not create a unique file name"
          });
        }
      } else {
        // update existing file
        // update/create html file
        var _saveJsonResponse;
        // var _saveHtmlResponse;

        if (
          Object.prototype.hasOwnProperty.call(file, "htmlFile") &&
          Object.prototype.hasOwnProperty.call(file, "jsonFile")
        ) {
          // eslint-disable-next-line prettier/prettier
        _saveJsonResponse = createFile(`${templatesDir}/${saveTo}`, file.jsonFile, templatesDir, true);
          // eslint-disable-next-line prettier/prettier
        createFile(saveToHtml, file.htmlFile, templatesDir, true);
        } else {
          // eslint-disable-next-line prettier/prettier
        _saveJsonResponse = createFile(`${templatesDir}/${saveTo}`, file.jsonFile, templatesDir, true);
        }

        res.status(_saveJsonResponse ? 200 : 400).send({
          ok: _saveJsonResponse ? true : false,
          data: saveTo,
          message: _saveJsonResponse ? "Saved!" : _saveJsonResponse
        });
      }
    } else {
      res.status(400).send({
        ok: false,
        message: "No [file] property in the post data"
      });
    }
  }
);

app.get(
  "/templates",
  (req, res, next) => authMiddleware(req, res, next),
  function(req, res) {
    const [ok, directoryFiles] = getDirectoryFiles(templatesDir);

    res.status(ok ? 200 : 400).send({
      ok,
      data: ok
        ? directoryFiles.filter(file => path.extname(file) === ".json")
        : [],
      message: ok ? "Templates found" : directoryFiles
    });
  }
);

app.get(
  "/get-template",
  (req, res, next) => authMiddleware(req, res, next),
  function(req, res) {
    if (Object.prototype.hasOwnProperty.call(req.query, "t")) {
      const templateFileName = req.query.t;

      let [ok, fileData] = getFileData(`${templatesDir}/${templateFileName}`);

      if (typeof fileData == "string" && ok) {
        fileData = JSON.parse(fileData);
      }

      res.status(ok ? 200 : 404).send({
        ok,
        data: fileData,
        message: ok ? "Template found" : fileData
      });
    } else {
      res.status(400).send({
        ok: false,
        data: "",
        message:
          "You need to parse the template's name in the parameters [ ?t={{fileName}} ]"
      });
    }
  }
);

app.get(
  "/status",
  (req, res, next) => authMiddleware(req, res, next),
  function(req, res) {
    return res.status(200).send({
      ok: true,
      data: {},
      message: "success"
    });
  }
);

app.post("/login", function(req, res) {
  const password = req.body.password;

  if (password !== process.env.USER_PASSWORD) {
    return res.status(401).send({
      ok: false,
      data: "Wrong password",
      message: "Wrong password"
    });
  }

  // Create a JWT token and save it to cookie
  const token = jwt.sign(
    {
      userName: process.env.VUE_APP_USER_NAME
    },
    process.env.VUE_APP_TOKEN_KEY,
    {
      expiresIn: "2h"
    }
  );

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(COOKIE_NAME, token, {
      path: "/",
      httpOnly: true, // Prevent JavaScript access to the cookie
      maxAge: 3600 * 4, // Cookie expiration time in seconds (4 hours)
      sameSite: "strict", // Protect against cross-site request forgery (CSRF)
      secure: process.env.NODE_ENV === "production" // Only send over HTTPS in production
    })
  );

  return res.status(200).send({ ok: true, data: {}, message: "Login success" });
});

console.log("listening at " + process.env.VUE_APP_APP_URL);
