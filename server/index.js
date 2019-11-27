const express = require("express");
const cors = require("cors");
const request = require("request");

const app = express();
const port = process.env.PORT || 3005;

app.use(cors());

app.use(express.static("build"));
app.use(express.static("public"));

app.get("/", (req, res) => res.send("Hello World!"));

function getPackage(branch) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: `https://gitlab.360live.vn/zalopay/front-end/zpi-spa/raw/${branch}/package.json`,
      headers: {
        "Private-Token": "E7pc1yW9gyWA_WVFtwD2"
      },
      json: true
    };
    request(options, function(error, response) {
      if (error) return reject(error);
      resolve(response.body);
    });
  });
}

app.get("/api/:branch/package.json", async (req, res) => {
  const { branch = "develop" } = req.params;
  const result = await getPackage(branch);
  res.json(JSON.stringify(result));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
