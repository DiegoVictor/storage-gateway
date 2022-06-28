const { S3 } = require("@aws-sdk/client-s3");
const {
  promises: { readFile },
} = require("fs");
const { extname } = require("path");

const s3 = new S3({});
const files = ["blown.gif", "programming.jpg", "works.png"];

Promise.all(
  files.map((file) =>
    readFile(`./scripts/${file}`).then((buffer) => {
      return s3.putObject({
        Bucket: "storage-gateway-dev-bucket",
        Key: `images/${file}`,
        Body: buffer,
        ContentType: `image/${extname(file).substring(1)}`,
      });
    })
  )
).then(() => console.log("Files uploaded"));
