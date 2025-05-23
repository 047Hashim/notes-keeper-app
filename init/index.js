const mongoose = require("mongoose");
const initData = require("./data.js");
const Note = require("../models/note.js");
const data = require("./data.js");

main()
  .then(() => {
    console.log("Connect to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/NOTES_KEEPER");
}

const initDB = async () => {
  await Note.deleteMany({});
  initData.data = initData.data.map((data) => ({
    ...data,
    owner: "681b3834b770cff1f44afa25",
  }));
  await Note.insertMany(initData.data);
  console.log("Length of data which initiazed:", initData.data.length);
  console.log("Data was initialized");
};
initDB();
