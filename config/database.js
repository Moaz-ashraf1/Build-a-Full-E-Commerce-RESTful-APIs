const mongoose = require("mongoose");
const DatabaseConnection = () => {
  mongoose.connect(process.env.DATABASE_URI).then(() => {
    console.log("Database has been connected successfully");
  });
  // .catch(() => {
  //   console.log("The connection to Database was not successful");
  //   process.exit();
  // });
};
module.exports = DatabaseConnection;
