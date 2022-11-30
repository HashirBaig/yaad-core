const mongoose = require("mongoose")

const JournalSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
  },
  isEdited: {
    type: Boolean,
  },
})

module.exports = mongoose.model("journal", JournalSchema)
