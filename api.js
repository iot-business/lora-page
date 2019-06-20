
var request = require('request-promise');


async function retorna_dados_device(query, mysort, dbo) {
    var resultado = await dbo.collection("device_data").find(query).sort(mysort).limit(5).toArray(); 
    return resultado
}


async function deletar_organizacao(id, jwt){
    await request.delete({
        headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
        url:     'http://191.252.1.150:9090/api/organizations/'+id,
    }, function(error, response, body){
        var resposta = JSON.parse(body);
        console.log(resposta)
    }).catch(function(err){
        console.log(err)
    });
    
}

async function lista_de_usuarios(organizations, jwt){
    for(var i =0; i < organizations.length; i++){
        var users = []
        await request.get({
            headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
            url:    ' http://191.252.1.150:9090/api/organizations/'+ organizations[i].organizationID +'/users?limit=999',
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
        url:     'http://191.252.1.150:9090/api/internal/profile',
    }, function(error, response, body){
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

    for(var i =0; i < organizations.length; i++){
        var gateways = []
        await request.get({
            headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
            url:    'http://191.252.1.150:9090/api/gateways?limit=999&organizationID='+ organizations[i].organizationID,
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

    for(var i =0; i < organizations.length; i++){
        var apps = []
        await request.get({
            headers: {'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+ jwt},
            url:    'http://191.252.1.150:9090/api/applications?limit=999&organizationID='+ organizations[i].organizationID,
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

    for(var i =0; i < organizations.length; i++){

        for(var d = 0; d < organizations[i].apps.length; d++){

            var devices = []
            await request.get({
                headers: { 'Accept': 'application/json', 'Grpc-Metadata-Authorization': 'Bearer '+jwt },
                url:    'http://191.252.1.150:9090/api/devices?limit=999&applicationID='+ organizations[i].apps[d].id ,
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

async function get_devices_data(organizations, dbo){

    for(var i =0; i < organizations.length; i++){

        for(var a = 0; a < organizations[i].apps.length; a++){

            for (var d = 0; d < organizations[i].apps[a].devices.length; d++) {

                var query = { devEUI: organizations[i].apps[a].devices[d].devEUI,  }
                var mysort = { date: -1 };
                var resposta
                var dados = await retorna_dados_device(query, mysort, dbo)


                for(var q = 0; q < dados.length; q++){
                    if(dados[q].data.length == 40){
                        var buf = Buffer.from(dados[q].data, 'base64'); // Ta-da
                        var lat = buf.slice(9,11)
                        var minutos_lat = buf.slice(11,17)
                        var letra_lat = buf.slice(17,18).toString()
                        var long = buf.slice(18,21)
                        var minutos_long = buf.slice(21,27)
                        var letra_long = buf.slice(27,28).toString()

                        minutos_lat = ((parseInt(minutos_lat.toString())/0.6) / 1000000)
                        minutos_long = ((parseInt(minutos_long.toString())/0.6) / 1000000)
                        lat = parseInt(lat.toString()) * 1
                        long = parseInt(long.toString()) * 1


                        lat = (lat + minutos_lat).toFixed(6)
                        long = (long + minutos_long).toFixed(6)

                        if(letra_lat == 'S'){
                            lat = lat * -1
                        }

                        if(letra_long == 'W'){
                            long = long * -1
                        }

                        dados[q].lat = lat
                        dados[q].long = long
                        console.log(lat);
                        console.log(long);
                        dados[q].image = await request_mapa(lat,long)

                        console.log(lat);
                        console.log(long);

                    }
                }

                organizations[i].apps[a].devices[d].data = dados
                
            }

        }

    }

    return 'ok'
}


async function request_mapa(lat, long){

    var img

    await request.get({
        headers: {  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        url:    'https://www.mapquestapi.com/staticmap/v5/map?key=tOl73IhrA72EXUNLADRGZHXiwDBOT9bH&locations='+lat+','+long+'|marker-blue&zoom=16&type=hyb&size=600,400' ,
    }, function(error, response, body){
        img = body;
        console.log(body);
    }).catch(function(err){
        console.log(err)
    });

    return img

}


module.exports = {
    deletar_organizacao,
    lista_de_usuarios,
    get_organizations,
    get_gateways,
    get_apps,
    get_devices,
    get_devices_data,
    request_mapa
}