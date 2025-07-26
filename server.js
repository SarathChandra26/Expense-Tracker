const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // optional, for environment variables

const Expense = require('./models/Expense');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve views
app.get('/', (req, res) => {
  res.redirect('/view');
});

app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'add.html'));
});

app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'view.html'));
});

// ✅ API Routes
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    const saved = await newExpense.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'your-hardcoded-uri', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
