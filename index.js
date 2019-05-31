const express = require('express');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var request = require('request');
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

app.route('/login')
    .get((req, res) => {
        console.log(req.session.logado)
        if(req.session.logado){
            res.render('index');
        }else{
            res.render('login', {message: null});
        }
    })
    .post((req, res) => {
        console.log(req.session.logado)
        user_login = req.body.login;
        user_pass = req.body.senha;
        string_body = '{ "password": "' + user_pass + '", "username": "' +user_login +'" }'
        console.log(string_body);
        request.post({
            headers: {'content-type' : 'application/json', 'Accept': 'application/json'},
            url:     'http://191.252.1.150:8080/api/internal/login',
            body:    string_body
          }, function(error, response, body){
            resposta = JSON.parse(body)
            if(resposta.hasOwnProperty('jwt')){
                console.log('tem')
                res.render('index', {usuario: user_login});
            }else{
                console.log('não tem')
                res.render('login', {message: "Usuário ou senha incorretos"});
            }
          });
        
        
    })

app.get('/index', function (req, res) {
    if(req.session.logado == undefined){
       console.log(req.session)
    }
    if(req.session.logado){
        res.render('index');
    }else{
        res.render('login', {message: "Por favor inicie uma sessão"});
    }
})

app.get('/widgets', function (req, res) {
    res.render('widgets');
})



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})