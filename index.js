"use strict";
const express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
const app = express();
const user = require('./usuario')
app.use(cookieParser()); 

var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour

app.use(session({
    secret: 's3cur3',
    saveUninitialized: true,
    resave: true ,
    name: "iot_brasil_lora",
    cookie: { 
        secure: false,
        httpOnly: false,
        expires: expiryDate
    }
}));
 
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/'));

var sess;

app.get('/', function (req, res) {
    console.log(req.cookie)
    console.log('verificando se esta logado')
    if(req.session.logado == undefined){
        console.log('nao ta')
        req.session.logado = false
        console.log(req.session)
    }else{
        console.log('ta')
    }
    if(req.session.logado){
        res.render('index', {req});
    }else{
        res.render('login', {message: null});
    }
})

app.route('/login')
    .get((req, res) => {
        if(req.session.logado == undefined){
            req.session.logado = false
            console.log(req.session)
        }
        if(req.session.logado){
            res.render('index', {req});
        }else{
            res.render('login', {message: null});
        }
    })
    .post((req, res) => {
        console.log('postando')
        console.log(req.session.logado)
        var user_login = req.body.login;
        var user_pass = req.body.senha;
        var string_body = '{ "password": "' + user_pass + '", "username": "' +user_login +'" }'
        console.log(string_body);
        request.post({
            headers: {'content-type' : 'application/json', 'Accept': 'application/json'},
            url:     'http://191.252.1.150:8080/api/internal/login',
            body:    string_body
          }, function(error, response, body){
            var resposta = JSON.parse(body)
            if(resposta.hasOwnProperty('jwt')){
                console.log('tem')
                req.session.logado = true
                var user_obj = new user.Usuario(user_login, user_pass, resposta.jwt)
                req.session.usuario = user_obj
                console.log(req.session)
                console.log(req.session.usuario)
                req.session.save()
                res.render('index', {req}); // 
            }else{
                req.session.logado = false
                console.log('não tem')
                req.session.save()
                res.render('login',{message: "Usuário ou senha incorretos"}); // 
            }
          });
        
        
    })

app.get('/index', function (req, res) {
    console.log('entrando /index')
    if(req.session.logado == undefined){
        console.log('nao ta logado')
        req.session.logado = false
        console.log(req.session)
    }else{
        console.log('ta logado')
        console.log(req.session)
    }
    if(req.session.logado){
        res.render('index', {req});
    }else{
        res.render('login', {message: "Por favor inicie uma sessão"});
    }
})


app.get('/network', function (req, res) {
    console.log('entrando /network')
    if(req.session.logado == undefined){
        console.log('nao ta logado')
        req.session.logado = false
        console.log(req.session)
    }else{
        console.log('ta logado')
        console.log(req.session)
    }
    if(req.session.logado){
        res.render('network', {req});
    }else{
        res.render('login', {message: "Por favor inicie uma sessão"});
    }
})

app.get('/organizacao', function (req, res) {
    console.log('entrando /organizacao')
    if(req.session.logado == undefined){
        console.log('nao ta logado')
        req.session.logado = false
        console.log(req.session)
    }else{
        console.log('ta logado')
        console.log(req.session)
    }
    if(req.session.logado){
        res.render('organizacao', {req});
    }else{
        res.render('login', {message: "Por favor inicie uma sessão"});
    }
})

app.get('/logout', function (req,res){
    console.log('deslogando')
    req.session.destroy();
    res.render('login', {message: null});
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})