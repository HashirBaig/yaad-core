const express = require("express")
const dayjs = require("dayjs")
const router = express.Router()
const Journal = require("../../models/Journal")
const Streak = require("../../models/Streak")
const auth = require("../../middleware/auth")
const { getFormattedYesterday, getFormattedDayBeforeYesterday } = require("../../utils/common")

// @route    GET api/journal/
// @desc     Get all journal entries
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const filters = []
    let allFilters = {}

    const sortBy = { createdAt: -1 }
    filters.push({ createdBy: req.user.email })
    filters.push({ isDeleted: { $ne: true } })

    allFilters.$and = [...filters]

    const journalData = await Journal.find(allFilters).sort(sortBy)

    if (!journalData) return res.status(200).json({ journals: [] })

    res.status(200).json({ journals: journalData })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Servor Error")
  }
})

// @route    POST api/journal/add-entry
// @desc     Add journal entries to DB by date & time
// @access   Private
router.post("/add-entry", auth, async (req, res) => {
  const { message } = req.body
  const userEmail = req.user.email
  const userId = req.user.id
  const sortBy = { createdAt: -1 }

  try {
    // Get recent most entry and it's date & time
    const data = await Journal.find({ createdBy: userEmail, $and: [{ isDeleted: { $ne: true } }] }).sort(sortBy)
    const { createdAt } = data[0]
    const entryDate = dayjs(new Date(createdAt)).format("DD-MM-YYYY")

    const journalData = new Journal({
      message,
      createdBy: userEmail,
      isDeleted: false,
    })
    const journal = await journalData.save()

    const yesterday = getFormattedYesterday()
    const dayBeforeYesterday = getFormattedDayBeforeYesterday()

    if (entryDate === yesterday) {
      const streak = await Streak.findOne({ user: userId, $and: [{ isBroken: false }] })
      if (!streak) {
        await createStreak(userId)
      }
      await updateStreakByOne(userId)
    } else if (entryDate === dayBeforeYesterday) {
      await breakStreak(userId)
      await createStreak(userId)
    }

    res.status(200).json({ message: "success", journal })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Servor Error")
  }
})

// @route    PUT api/update-journal/:id
// @desc     Update journal
// @access   Private
router.put("/update-journal/:id", auth, async (req, res) => {
  const { message } = req.body
  const { id } = req.params

  try {
    const updatedJournal = await Journal.updateOne({ _id: id }, { $set: { message: message, isEdited: true } })

    if (!updatedJournal) {
      return res.status(404).json({ message: "Deletion Failed" })
    }

    res.status(200).json({ message: "success", journal: updatedJournal })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Servor Error")
  }
})

// @route    POST api/journal/soft-delete/:id
// @desc     Set isDelete property to true
// @access   Private
router.post("/soft-delete/:id", auth, async (req, res) => {
  const { id } = req.params
  try {
    const updatedJournal = await Journal.updateOne({ _id: id }, { $set: { isDeleted: true } })

    if (!updatedJournal) {
      return res.status(404).json({ message: "Deletion Failed" })
    }

    return res.json({ message: "Deleted Successfully" })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Servor Error")
  }
})

const createStreak = async userId => {
  const streak = new Streak({
    user: userId,
    noOfDays: 1,
    isBroken: false,
  })

  await streak.save()
}

const updateStreakByOne = async userId => {
  await Streak.updateOne({
    user: userId,
    $inc: { noOfDays: 1 },
  }).and({ isBroken: false })
}

const breakStreak = async userId => {
  await Streak.updateOne({
    user: userId,
    $set: {
      isBroken: true,
    },
  }).and({ isBroken: false })
}

module.exports = router
