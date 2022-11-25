const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()
const User = require("../../models/User")

// @route    POST api/users/add-user
// @desc     Register new user with email & password
// @access   Private
router.post("/add-user", [], async (req, res) => {
  try {
    const { email, username, password } = req.body

    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ error: { message: "User already exits" } })
    }

    user = new User({
      email,
      username,
      role: "consumer",
      password,
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) throw err
      res.json({ token, user })
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Servor Error")
  }
})

module.exports = router
