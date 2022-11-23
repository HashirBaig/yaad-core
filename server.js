const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const app = express()

// Connect to DB
connectDB()

// Init middleware
app.use(cors())
app.use(express.json())

// Define routes
app.use("/api/journal", require("./routes/api/journal"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`app running on port ${PORT}...`))
