"use strict";
const express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var Q = require('q')
const app = express();
const user = require('./usuario')
const api = require('./api')
app.use(cookieParser());

const PORT = 3000 || process.env;

var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour


async function atualizaDadosUser(user_obj, req, res, pagina) {
    user_obj = new user.Usuario(user_obj._login, user_obj._pass, user_obj._jwt)
    var status = await user_obj.get_organizations()
    var status = await user_obj.get_users()
    var status = await user_obj.get_gateways()
    var status = await user_obj.get_apps()
    var status = await user_obj.get_devices()
    console.log('conferindo users');
    console.log(user_obj);
    console.log(user_obj.organizations[0].apps);
    console.log(user_obj.organizations[0].apps[0].devices);
    req.session.usuario = user_obj;
    req.session.save();
    res.render(pagina, { req }); //
}


app.use(session({
    secret: 's3cur3',
    saveUninitialized: true,
    resave: true,
    name: "iot_brasil_lora",
    cookie: {
        secure: false,
        httpOnly: false,
        expires: expiryDate
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/'));

app.get('/', function(req, res) {

    if (req.session.logado == undefined) {
        console.log('nao ta')
        req.session.logado = false
    } else {
        console.log('ta')
    }
    if (req.session.logado) {
        atualizaDadosUser(req.session.usuario, req, res, 'index')
    } else {
        res.render('login', { message: null });
    }
})

app.route('/login')
    .get((req, res) => {
        if (req.session.logado == undefined) {
            req.session.logado = false
        }
        if (req.session.logado) {
            atualizaDadosUser(req.session.usuario, req, res, 'index')
        } else {
            res.render('login', { message: null });
        }
    })
    .post((req, res) => {

        var user_login = req.body.login;
        var user_pass = req.body.senha;
        var string_body = '{ "password": "' + user_pass + '", "username": "' + user_login + '" }';
        console.log(string_body)
        var jwt = ""
        request.post({
            headers: { 'content-type': 'application/json', 'Accept': 'application/json' },
            url: 'http://191.252.1.150:8080/api/internal/login',
            body: string_body
        }, function(error, response, body) {
            var resposta = JSON.parse(body);
            if (resposta.hasOwnProperty('jwt')) {
                jwt = resposta.jwt
                req.session.logado = true;
                var user_obj = new user.Usuario(user_login, user_pass, jwt);
                console.log('ta aqui')
                console.log(user_obj)
                atualizaDadosUser(user_obj, req, res, 'index')
            } else {
                req.session.logado = false;
                console.log('não tem');
                req.session.save();
                res.render('login', { message: "Usuário ou senha incorretos" }); // 
            }
        });


    })

app.get('/index', function(req, res) {
    console.log('entrando /index')
    if (req.session.logado == undefined) {
        console.log('nao ta logado')
        req.session.logado = false
    } else {
        console.log('ta logado')
    }
    if (req.session.logado) {
        atualizaDadosUser(req.session.usuario, req, res, 'index')
    } else {
        res.render('login', { message: "Por favor inicie uma sessão" });
    }
})


app.get('/network', function(req, res) {
    console.log('entrando /network')
    if (req.session.logado == undefined) {
        console.log('nao ta logado')
        req.session.logado = false
    } else {
        console.log('ta logado')
    }
    if (req.session.logado) {
        atualizaDadosUser(req.session.usuario, req, res, 'network')
    } else {
        res.render('login', { message: "Por favor inicie uma sessão" });
    }
})

app.get('/organizacao', function(req, res) {
    console.log('entrando /organizacao');
    if (req.session.logado == undefined) {
        console.log('nao ta logado');
        req.session.logado = false
    } else {
        console.log('ta logado')
    }
    if (req.session.logado) {
        atualizaDadosUser(req.session.usuario, req, res, 'organizacao')
    } else {
        res.render('login', { message: "Por favor inicie uma sessão" });
    }
})


app.get('/aplicacoes', function(req, res) {
    console.log('entrando /aplicacao');
    if (req.session.logado == undefined) {
        console.log('nao ta logado');
        req.session.logado = false
    } else {
        console.log('ta logado')
    }
    if (req.session.logado) {
        atualizaDadosUser(req.session.usuario, req, res, 'aplicacoes')
    } else {
        res.render('login', { message: "Por favor inicie uma sessão" });
    }
})


app.get('/gateways', function(req, res) {
    console.log('entrando /aplicacao');
    if (req.session.logado == undefined) {
        console.log('nao ta logado');
        req.session.logado = false
    } else {
        console.log('ta logado')
    }
    if (req.session.logado) {
        atualizaDadosUser(req.session.usuario, req, res, 'gateways')
    } else {
        res.render('login', { message: "Por favor inicie uma sessão" });
    }
})













app.get('/logout', function(req, res) {
    console.log('deslogando');
    req.session.destroy();
    res.render('login', { message: null });
})
















app.get('/panels', function(req, res) {
    console.log('paineis');
    if (req.session.logado) {
        res.render('panels', { req });
    } else {
        res.render('login', { message: "Por favor inicie uma sessão" });
    }
})

app.get('/charts', function(req, res) {
    console.log('paineis');
    if (req.session.logado) {
        res.render('charts', { req });
    } else {
        res.render('login', { message: "Por favor inicie uma sessão" });
    }
})

app.get('/elements', function(req, res) {
    console.log('paineis');
    if (req.session.logado) {
        res.render('elements', { req });
    } else {
        res.render('login', { message: "Por favor inicie uma sessão" });
    }
})

app.get('/widgets', function(req, res) {
    console.log('paineis');
    if (req.session.logado) {
        res.render('widgets', { req });
    } else {
        res.render('login', { message: "Por favor inicie uma sessão" });
    }
})




















app.get('/deletar_organizacao', function (req,res){
    console.log('deletando org');
    if(req.session.logado){
        var orgId = req.query['orgId']
        api.deletar_organizacao(orgId, req.session.usuario._jwt)
        atualizaDadosUser(req.session.usuario, req, res, 'organizacao')        
    }else{
        res.render('login', {message: "Por favor inicie uma sessão"});
    }
})

app.get('/deletar_usuario', function (req,res){
    console.log('deletando usuario');
    if(req.session.logado){
        var userId = req.query['userId']
        api.deletar_usuario(userId, req.session.usuario._jwt)
        atualizaDadosUser(req.session.usuario, req, res, 'organizacao')        
    }else{
        res.render('login', {message: "Por favor inicie uma sessão"});
    }
})


app.listen(PORT, function() {
    console.log('Example app listening on port 3000!')
})

