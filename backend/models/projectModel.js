const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://deepaksingh1realme:bTgPSats5oDvca4U@cluster0.i4mmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo Error", err));

const projectSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  date: {
    type: Date,
    default: Date.now
  },
  htmlCode: {
    type: String,
    default: `<!DOCTYPE html>
     <html lang="eng">
      <head>
       <title>Hello, World!</title>
       <link rel="stylesheet" href="styles.css" />
        </head> 
        <body>
     <h1 class="title">Hello World! </h1>
      <p id="currentTime"></p>
       </body>
         </html>`
  },
  cssCode: {
    type: String,
    default: `body{
     padding: 25px;
     } 
     .title {
     color: #5C6AC4;
     }`
  },
  jsCode: {
    type: String,
    default: `function showTime() {
    document.getElementById('currentTime').innerHTML = new Date().toUTCString();
    }
    showTime();
    setInterval(function () {
showTime();
}, 1000);`
  }
});

module.exports = mongoose.model("Project", projectSchema);