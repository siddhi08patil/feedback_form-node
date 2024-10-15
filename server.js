const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/feedbackdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Create a Schema and Model
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes
app.post('/api/feedback', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error submitting feedback", error: err });
    }
});

app.get('/api/feedbacksend', async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); // Fetch all feedback from the database
        res.json(feedbacks); // Respond with the fetched data
    } catch (err) {
        res.status(500).json({ message: "Error retrieving feedback", error: err });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
