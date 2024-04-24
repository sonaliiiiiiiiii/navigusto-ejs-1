const express = require('express');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Set up Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Connect to MongoDB Atlas
const mongoURI = 'mongodb+srv://sonaliiiiii:kali@cluster0.ep1jpjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';



 // Create the User model schema
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
  });
  const User = mongoose.model('User', userSchema);
  
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.log('MongoDB Atlas connection error:', err));
  
  
  app.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
  
    try {
      const user = new User({ firstname, lastname, email, password });
      await user.save();
      res.redirect('/');
    } catch (err) {
      console.error('Error registering user:', err);
      res.send('Error occurred during signup');
    }
  });
    // Define routes
    app.get("/", (req, res) => {
        res.render('index');
      });
    
      app.get("/login.ejs", (req, res) => {
        res.render('login');
      });

      app.get("/events.ejs", (req, res) => {
        res.render('events');
      });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email, password });
  
      if (user) {
        res.redirect('/events.ejs');
      } else {
        res.send('Invalid credentials');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      res.send('Error occurred during login');
    }
  });

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('dashboard', { user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});