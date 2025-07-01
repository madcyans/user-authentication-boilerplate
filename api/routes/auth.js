const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const newUser = new User({ email, password: hash })
    await newUser.save()
    res.status(201).json({ message: 'User created' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new Error('Invalid credentials')
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Invalid credentials')
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
})

module.exports = router