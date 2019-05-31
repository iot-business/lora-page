"use strict";

module.exports = {
    Usuario : class Usuario {
        constructor(login, pass, jwt) {
            this.login = login;
            this.pass = pass;
            this.jwt = jwt;
        }
        set login(login) {
            this._login = login;
        }
        get login() {
            return this._login;
        }

        set pass(pass) {
            this._pass = pass;
        }
        get pass() {
            return this._pass;
        }

        set jwt(jwt) {
            this._jwt = jwt;
        }
        get jwt() {
            return this._jwt;
        }


        // function get_networks(jwt) {
        //     var string_body = '{ "password": "' + user_pass + '", "username": "' +user_login +'" }'
        //     request.post({
        //         headers: {'content-type' : 'application/json', 'Accept': 'application/json'},
        //         url:     'http://191.252.1.150:8080/api/network-servers',
        //         body:    string_body
        //       }, function(error, response, body){
        //         var resposta = JSON.parse(body)
        //         if(resposta.hasOwnProperty('jwt')){
        //             console.log('tem')
        //             req.session.logado = true
        //             var user_obj = new user.Usuario(user_login, user_pass, resposta.jwt)
        //             req.session.usuario = user_obj
        //             console.log(req.session)
        //             console.log(req.session.usuario)
        //             req.session.save()
        //             res.render('index', {req}); // 
        //         }else{
        //             req.session.logado = false
        //             console.log('não tem')
        //             req.session.save()
        //             res.render('login',{message: "Usuário ou senha incorretos"}); // 
        //         }
        //       });
        // }


    }

}
  