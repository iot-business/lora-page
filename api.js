
var request = require('request-promise');

async function deletar_organizacao(id, jwt){
    console.log('deletando organizacao')
    console.log(jwt)
    await request.delete({
        headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
        url:     'http://191.252.1.150:8080/api/organizations/'+id,
    }, function(error, response, body){
        var resposta = JSON.parse(body);
        console.log(resposta)
    }).catch(function(err){
        console.log(err)
    });
    
}

async function lista_de_usuarios(organizations, jwt){
    console.log('buscando lista de usuários')
    for(var i =0; i < organizations.length; i++){
        var users = []
        await request.get({
            headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
            url:    ' http://191.252.1.150:8080/api/organizations/'+ organizations[i].organizationID +'/users?limit=999',
        }, function(error, response, body){
            var resposta = JSON.parse(body);
            if(resposta.totalCount > 0){
                users = resposta['result']
            }
        }).catch(function(err){
            console.log(err)
        });

        organizations[i].users = users
        organizations[i].usersCount = users.length

    }
    return 'ok'
}

async function get_organizations(jwt){

    var orgs = [];

    await request.get({
        headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
        url:     'http://191.252.1.150:8080/api/internal/profile',
    }, function(error, response, body){
        console.log('qual vem primeiro 11111111')
        var resposta = JSON.parse(body);
        if(resposta.hasOwnProperty('error')) {
            console.log('não autenticado')
            orgs = null
        }else{
            if(resposta.organizations.length > 0){
                orgs = resposta.organizations
            }
        }
    });

    return orgs
}

async function get_gateways(organizations,jwt){

    console.log('buscando lista de gateways')
    for(var i =0; i < organizations.length; i++){
        var gateways = []
        await request.get({
            headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
            url:    'http://191.252.1.150:8080/api/gateways?limit=999&organizationID='+ organizations[i].organizationID,
        }, function(error, response, body){
            var resposta = JSON.parse(body);
            if(resposta.totalCount > 0){
                gateways = resposta['result']
            }
        }).catch(function(err){
            console.log(err)
        });

        organizations[i].gateways = gateways
    }
    return 'ok'
}

async function get_apps(organizations,jwt){

    console.log('buscando lista de apps')
    for(var i =0; i < organizations.length; i++){
        var apps = []
        await request.get({
            headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
            url:    'http://191.252.1.150:8080/api/applications?limit=999&organizationID='+ organizations[i].organizationID,
        }, function(error, response, body){
            var resposta = JSON.parse(body);
            if(resposta.totalCount > 0){
                apps = resposta['result']
            }
        }).catch(function(err){
            console.log(err)
        });

        organizations[i].apps = apps
    }
    return 'ok'
}

async function get_devices(organizations,jwt){

    console.log('buscando lista de devices')
    for(var i =0; i < organizations.length; i++){

        for(var d = 0; d < organizations[i].apps.length; d++){

            var devices = []
            await request.get({
                headers: { 'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+jwt },
                url:    'http://191.252.1.150:8080/api/devices?limit=999&applicationID='+ organizations[i].apps[d].id ,
            }, function(error, response, body){
                var resposta = JSON.parse(body);
                if(resposta.totalCount > 0){
                    devices = resposta['result']
                }
            }).catch(function(err){
                console.log(err)
            });

            organizations[i].apps[d].devices = devices

        }

    }
    return 'ok'
}


module.exports = {
    deletar_organizacao,
    lista_de_usuarios,
    get_organizations,
    get_gateways,
    get_apps,
    get_devices
}