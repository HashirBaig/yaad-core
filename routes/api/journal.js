const express = require("express")
const router = express.Router()
const Journal = require("../../models/Journal")
const auth = require("../../middleware/auth")

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
  try {
    const journalData = new Journal({
      message,
      createdBy: userEmail,
      isDeleted: false,
    })

    const journal = await journalData.save()

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

module.exports = router
