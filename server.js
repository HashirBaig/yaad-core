const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const app = express()

// Connect to DB
connectDB()

// Enable pre-flight across-the-board
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use(cors())

// Init middleware
app.use(express.json())

// Define routes
app.use("/api/journal", require("./routes/api/journal"))
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`app running on port ${PORT}...`))
