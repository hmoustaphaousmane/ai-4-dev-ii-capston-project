const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies and CORS
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/data_dashboard')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Define User Schema and Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// Define Dataset Schema and Model
const DatasetSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
const Dataset = mongoose.model('Dataset', DatasetSchema);

// Define Dashboard Schema and Model
const DashboardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  layout: { type: Object, default: {} }, // Store layout configuration as a flexible object
  datasets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' }], // Link to datasets
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Dashboard = mongoose.model('Dashboard', DashboardSchema);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Secret for JWT. In a real application, this should be in an environment variable.
const JWT_SECRET = 'supersecretjwtkey';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /csv|json/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only CSV and JSON files are allowed!');
    }
  },
});

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // No token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// User registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send('Username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered successfully.');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user.');
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid credentials.');
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ username: user.username, id: user._id }, JWT_SECRET);
      res.json({ accessToken });
    } else {
      res.status(400).send('Invalid credentials.');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in.');
  }
});

// Protected upload route
app.post('/upload', authenticateToken, upload.single('dataset'), async (req, res) => {
  if (req.file) {
    try {
      const newDataset = new Dataset({
        originalName: req.file.originalname,
        filename: req.file.filename,
        filepath: req.file.path,
        userId: req.user.id,
      });
      await newDataset.save();

      res.json({
        message: 'File uploaded successfully and metadata saved!',
        dataset: newDataset,
      });
    } catch (error) {
      console.error('Error saving dataset:', error);
      res.status(500).send('Error saving dataset metadata.');
    }
  } else {
    res.status(400).send('No file uploaded.');
  }
});

// Protected datasets route
app.get('/datasets', authenticateToken, async (req, res) => {
  try {
    const userDatasets = await Dataset.find({ userId: req.user.id });
    res.json(userDatasets);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).send('Error fetching datasets.');
  }
});

// Dashboard creation
app.post('/dashboards', authenticateToken, async (req, res) => {
  const { title, description, layout, datasets } = req.body;
  if (!title) {
    return res.status(400).send('Dashboard title is required.');
  }

  try {
    const newDashboard = new Dashboard({
      title,
      description,
      layout,
      datasets,
      userId: req.user.id,
    });
    await newDashboard.save();
    res.status(201).json({ message: 'Dashboard created successfully!', dashboard: newDashboard });
  } catch (error) {
    console.error('Error creating dashboard:', error);
    res.status(500).send('Error creating dashboard.');
  }
});

// Get all dashboards for the authenticated user
app.get('/dashboards', authenticateToken, async (req, res) => {
  try {
    const userDashboards = await Dashboard.find({ userId: req.user.id }).populate('datasets');
    res.json(userDashboards);
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    res.status(500).send('Error fetching dashboards.');
  }
});

// Get a single dashboard by ID
app.get('/dashboards/:id', authenticateToken, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ _id: req.params.id, userId: req.user.id }).populate('datasets');
    if (!dashboard) {
      return res.status(404).send('Dashboard not found or you do not have permission to view it.');
    }
    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).send('Error fetching dashboard.');
  }
});

// Update a dashboard by ID
app.put('/dashboards/:id', authenticateToken, async (req, res) => {
  const { title, description, layout, datasets } = req.body;
  try {
    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, layout, datasets, updatedAt: Date.now() },
      { new: true }
    );
    if (!dashboard) {
      return res.status(404).send('Dashboard not found or you do not have permission to update it.');
    }
    res.json({ message: 'Dashboard updated successfully!', dashboard });
  } catch (error) {
    console.error('Error updating dashboard:', error);
    res.status(500).send('Error updating dashboard.');
  }
});

// Delete a dashboard by ID
app.delete('/dashboards/:id', authenticateToken, async (req, res) => {
  try {
    const dashboard = await Dashboard.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!dashboard) {
      return res.status(404).send('Dashboard not found or you do not have permission to delete it.');
    }
    res.json({ message: 'Dashboard deleted successfully!' });
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    res.status(500).send('Error deleting dashboard.');
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
