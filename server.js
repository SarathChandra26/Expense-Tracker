const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Expense = require('./models/Expense'); // adjust path if different

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Serve static files from /public
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

// ✅ API routes
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

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'your-local-uri', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}).catch(err => console.error(err));
