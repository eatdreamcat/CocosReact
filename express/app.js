const express = require("express");
var path = require("path");
var multer = require("multer");
var fs = require("fs");
var xlsx = require("xlsx");

var upload = multer({ dest: path.join(__dirname, "./public/") });
const app = express();
const port = 1090;

app.get("/", (req, res) => {
  res.send("Fuck you!");
});

function toJson(basePath, fileName, callback) {
  let jsonPath = basePath + "json" + "/";
  let jsonName = fileName.split(".")[0] + ".json";

  if (fs.existsSync(jsonPath)) {
  } else {
    fs.mkdirSync(jsonPath);
  }

  book = xlsx.readFile(basePath + fileName);

  for (let sheet in book.Sheets) {
    let jsonData = xlsx.utils.sheet_to_json(book.Sheets[sheet]);
    if (jsonData.length <= 0) continue;
    let dataType = jsonData[0];
    //console.log(dataType);
    let dataKey = jsonData[1];
    let dataArr = jsonData.splice(2, jsonData.length - 2);
    let json = [];
    for (let data of dataArr) {
      let resData = {};
      for (let key in data) {
        //console.log(key);
        //console.log(dataType[key]);
        switch (dataType[key].toLowerCase()) {
          case "type<>":
          case "string<>":
            data[key] = data[key].toString().split("_");
            break;
          case "number<>":
            data[key] = data[key].toString().split("_");
            for (let i = 0; i < data[key].length; i++) {
              if (data[key][i].split(".").length > 1) {
                data[key][i] = parseFloat(data[key][i]);
              } else {
                data[key][i] = parseInt(data[key][i]);
              }
            }
            break;
        }
        resData[dataKey[key]] = data[key];
      }
      json.push(resData);
    }

    jsonName = jsonName
      .trim()
      .split(" ")
      .join("_");
    //console.log(jsonPath + jsonName);

    fs.writeFileSync(jsonPath + jsonName, JSON.stringify(json));
    callback();
  }
}

app.post("/upload", upload.any(), (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "*");

  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");

  var target_path = req.files[0].destination + req.param("name", "temp") + "/";
  console.log(" -------------------------- upload ----------------------");

  if (fs.existsSync(target_path)) {
    // let files = fs.readdirSync(target_path);
    // files.forEach((file, index) => {
    //   fs.unlinkSync(target_path + file);
    // });
  } else {
    fs.mkdirSync(target_path);
  }

  fs.rename(
    req.files[0].path,
    target_path + req.files[0].originalname,
    function(err, data) {
      if (err) {
        console.log(err);
      } else {
        try {
          toJson(target_path, req.files[0].originalname, () => {
            res.send();
          });
        } catch (error) {
          res.send(error);
        }
      }
    }
  );
});

app.use("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "*");

  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.listen(port, () => console.log("Example app listening on port: " + port));
