"use strict";
var request = require('request');


module.exports = {
    Usuario : class Usuario {
        constructor(login, pass, jwt) {
            this.login = login;
            this.pass = pass;
            this.jwt = jwt;
            this.organizations = [];
            this.networks = [];
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

        set organizations(organizations) {
            this._organizations = organizations;
        }
        get organizations() {
            return this._organizations;
        }

        set networks(networks) {
            this._networks = networks;
        }
        get networks() {
            return this._networks;
        }


        get_organizations() {

            request.get({
                headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ this.jwt},
                url:     'http://191.252.1.150:8080/api/internal/profile',
            }, function(error, response, body){
                var resposta = JSON.parse(body);
                if(resposta.hasOwnProperty('error')) {
                    console.log('não autenticado')
                }else{
                    this.organizations = resposta.organizations
                    console.log(this.organizations)
                }

            });




        }




    }

}
  