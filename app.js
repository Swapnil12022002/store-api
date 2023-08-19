const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/connect");
const router = require("./routes/products");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/v1/products", router);
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT;
const connectionString = process.env.MONGO_URI;

const start = async () => {
  try {
    await connectDB(connectionString);
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
