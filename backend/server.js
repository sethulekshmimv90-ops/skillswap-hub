const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // allow frontend fetch requests
app.use(express.json()); // parse JSON

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Root route
app.get('/', (req, res) => {
  res.send("Backend is running!");
});

// Schema
const SkillSchema = new mongoose.Schema({
  rollNo: String,
  name: String,
  teachOrLearn: String
});

const Skill = mongoose.model('Skill', SkillSchema);

// CREATE
app.post('/api/skills', async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    await newSkill.save();
    res.json(newSkill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/api/skills/:id', async (req, res) => {
  try {
    const updated = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete('/api/skills/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));