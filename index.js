const express = require('express');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
app.use(cookieParser()); 

var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour

app.use(session({
    secret: 's3cur3',
    saveUninitialized: true,
    resave: true ,
    name: "iot_brasil_lora",
    cookie: { 
        secure: false,
        httpOnly: true,
        domain: 'dascoisas.com.br',
        expires: expiryDate
    }
}));


app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/'));

var sess;

app.get('/', function (req, res) {
    console.log(req.session)
    if(req.session.logado){
        res.render('index');
    }else{
        res.render('login', {message: null});
    }
})

app.get('/login', function (req, res) {
    if(req.session.logado){
        res.render('index');
    }else{
        res.render('login', {message: null});
    }
})

app.get('/index', function (req, res) {
    if(req.session.logado){
        res.render('index');
    }else{
        res.render('login', {message: "Por favor inicie uma sessão"});
    }
})

app.get('/widgets', function (req, res) {
    res.render('widgets');
})

app.post('/login', function (req, res){
    user_login = req.body.login
    user_pass = req.body.senha
    res.render('login', {message: user_login});
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})