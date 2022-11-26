const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require("../../middleware/auth")
const { check } = require("express-validator")
const router = express.Router()
const User = require("../../models/User")

// @route    GET api/auth
// @desc     Get user by token
// @access   Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    return res.status(200).json({ user })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Servor Error")
  }
})

// @route    POST api/auth
// @desc     Authenticate user and get token
// @access   Public
router.post(
  "/",
  [
    check("email", "Please include a valid email/username").exists(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body

      let user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ error: { message: "Invalid Credentials" } })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ error: { message: "Invalid Credentials" } })
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role,
          email: user.email,
          username: user.username,
        },
      }

      const _passwordLessUser = {
        role: user.role,
        email: user.email,
        username: user.username,
        permissions: user.permissions,
        hasPasswordChanged: user.hasPasswordChanged,
      }

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
        if (err) throw err
        res.json({ token, user: _passwordLessUser })
      })
    } catch (error) {
      console.log(error.message)
      res.status(500).send("Servor Error")
    }
  }
)

module.exports = router
