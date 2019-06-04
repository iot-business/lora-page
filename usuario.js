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


        async get_organizations() {
            console.log('aqui dentro do get orga')
            this.organizations = await api.get_organizations(this.jwt)
            return 'ok'
        }

        async get_users() {
            console.log('aqui dentro do get users')
            this.organizations = await api.lista_de_usuarios(this._organizations[0].organizationID, this.jwt)
            return 'ok'
        }

    }

}
  