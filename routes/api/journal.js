const express = require("express")
const router = express.Router()
const Journal = require("../../models/Journal")

// @route    GET api/journal/
// @desc     Get all journal entries
// @access   Private
router.get("/", [], async (req, res) => {
  try {
    const sortBy = { createdAt: -1 }
    const journalData = await Journal.find()
      .and({ isDeleted: { $ne: true } })
      .sort(sortBy)

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
router.post("/add-entry", [], async (req, res) => {
  const { message } = req.body
  try {
    const journalData = new Journal({
      message,
      createdBy: "Natsu",
      isDeleted: false,
    })

    const journal = await journalData.save()

    res.status(200).json({ message: "success", journal })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Servor Error")
  }
})

// @route    POST api/journal/soft-delete/:id
// @desc     Set isDelete property to true
// @access   Private
router.post("/soft-delete/:id", [], async (req, res) => {
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
