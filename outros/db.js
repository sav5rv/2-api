const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/accessControl', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));

module.exports = mongoose;
