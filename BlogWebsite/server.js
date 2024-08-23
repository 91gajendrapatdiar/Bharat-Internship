const express = require('express');
const articleRouter = require('./routes/articles');
const Article = require('./models/article');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', './views');  // Ensure this directory exists and is correctly named

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Static files (optional, if you have any)
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: 'desc' });
        res.render('articles/index', { articles: articles });
    } catch (err) {
        console.error(err);
        res.redirect('/');  // Handle errors gracefully
    }
});

app.use('/articles', articleRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
