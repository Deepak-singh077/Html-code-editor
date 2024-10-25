const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://deepaksingh1realme:bTgPSats5oDvca4U@cluster0.i4mmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo Error", err));

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: Date.now
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('user', userSchema);
