
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

async function lista_de_usuarios(id, jwt){
    console.log('buscando lista de usuários')
    console.log(jwt)
    var users = []
    await request.get({
        headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
        url:    ' http://191.252.1.150:8080/api/organizations/'+ id +'/users?limit=999',
    }, function(error, response, body){
        var resposta = JSON.parse(body);
        if(resposta.hasOwnProperty > 0){
            users = resposta.result
        }
    }).catch(function(err){
        console.log(err)
    });
    
    return users
}

async function get_organizations(jwt){

    console.log('aqui dentro DA API')

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


module.exports = {
    deletar_organizacao,
    lista_de_usuarios,
    get_organizations
}