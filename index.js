const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/'));

app.get('/', function (req, res) {
    res.render('login');
})

app.get('/login', function (req, res) {
    res.render('login');
})

app.get('/index', function (req, res) {
    res.render('index');
})

app.get('/widgets', function (req, res) {
    res.render('widgets');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})