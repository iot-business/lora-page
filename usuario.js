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
            var orgs = await api.get_organizations(this.jwt)
            this._organizations = orgs
            return 'ok'
        }

        async get_users() {
            var users = await api.lista_de_usuarios(this._organizations, this.jwt)
            return 'ok'
        }

        async get_gateways() {
            var users = await api.get_gateways(this._organizations, this.jwt)
            return 'ok'
        }

        async get_apps() {
            var users = await api.get_apps(this._organizations, this.jwt)
            return 'ok'
        }

        async get_devices() {
            var users = await api.get_devices(this._organizations, this.jwt)
            return 'ok'
        }

        async get_devices_data(dbo) {
            var users = await api.get_devices_data(this._organizations, dbo)
            return 'ok'
        }

    }

}
  