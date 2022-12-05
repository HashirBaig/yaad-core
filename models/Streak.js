const mongoose = require("mongoose")

const StreakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  noOfDays: {
    type: Number,
    required: true,
  },
  isBroken: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("streak", StreakSchema)

/*
{
    - user makes a journal entry and streak is set to 1
    - the next day, user makes another entry.
    - In streak collection, algo gets the streak collection via unique ID of user and updates the steak.
    user: {
        userId: system-generated-id,
    },
    noOfDay: 3,
    isBroken: false,
    createdAt: 12032022T01:12:25,
}
*/
