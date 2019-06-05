"use strict";
var request = require('request-promise');
var Q = require('q');
var api = require('./api')

module.exports = {
    Usuario : class Usuario {
        constructor(login, pass, jwt) {
            this.login = login;
            this.pass = pass;
            this.jwt = jwt;
            this.organizations = [];
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


        async get_organizations() {
            console.log('aqui dentro do get orga')
            var orgs = await api.get_organizations(this.jwt)
            console.log('retorno do get ORGS : ' + orgs);
            this._organizations = orgs
            return 'ok'
        }

        async get_users() {
            console.log('aqui dentro do get users')
            var users = await api.lista_de_usuarios(this._organizations, this.jwt)
            return 'ok'
        }

        async get_gateways() {
            console.log('aqui dentro do get gateways')
            var users = await api.get_gateways(this._organizations, this.jwt)
            return 'ok'
        }

        async get_apps() {
            console.log('aqui dentro do get apps')
            var users = await api.get_apps(this._organizations, this.jwt)
            return 'ok'
        }

    }

}
  