const express = require("express")
const router = express.Router()
const Streak = require("../../models/Streak")
const auth = require("../../middleware/auth")

// @route    GET api/streak/
// @desc     Get streak by user
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const streak = await Streak.findOne({ user: req.user.id }).and({ isBroken: false })
    res.status(200).json({ message: "success", streak: streak?.noOfDays })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Servor Error")
  }
})

module.exports = router
