(function() {
    var app = angular.module('myApp', []);

    app.controller('revimexCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.url = `https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/get?propertyKey=PropertyAttributes`;

        $scope.busqueda;
        $scope.propiedad = {};

        $scope.cargando = false;

        $scope.similarProperties = {};
        $scope.similarClient = {};

        // Variables ocultamiento
        $scope.main = false;
        $scope.second = false;
        $scope.tercer = false;
        // VArables config
        $scope.conProp = false;
        $scope.confBuy = true;
        $scope.confDistan = true;

        // Parte de la configuracion
        $scope.datos = [];
        // datos comprador
        $scope.comprador = [];

        // IIFE
        (function() {
            $http({
                method: "GET",
                url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/attributes/Properties/get'
            }).then(function mySuccess(response) {

                $scope.revisarDatos(response.data.data);

            }, function myError(response) {
                console.error(response);
                console.log("Configurar datos valor");
            });
        })();

        // Confiuracion

        $scope.configurarCompradores = function() {
            $scope.conProp = true;
            $scope.confBuy = false;
            console.log("Listo");

            (function() {
                $http({
                    method: "GET",
                    url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/get?propertyKey=BuyersAttributes'
                }).then(function mySuccess(response) {

                    $scope.revisarComprador(response.data.data);



                }, function myError(response) {
                    console.error(response);
                });
            })();
        }

        $scope.revisarComprador = function(dato) {

            let arregloFinal = [];
            let pinky = [];

            let espanol = [
                { key: "Status", idioma: "Estatus" },
                { key: "BirthState", idioma: "Estado de nacimiento" },
                { key: "Age", idioma: "Edad" },
                { key: "Gender", idioma: "Genero" },
                { key: "PlaceOfInterest", idioma: "Lugar de interes" },
                { key: "Location", idioma: "Ubicación" }
            ];


            (function() {
                $http({
                    method: "GET",
                    url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/get?propertyKey=BuyerAttributeWeights      '
                }).then(function mySuccess(response) {
                    let numeros = response.data.data;
                    let a = numeros.split(',');
                    let b = dato.split(',');

                    for (let i = 0; i < a.length; i++) {
                        arregloFinal.push({ key: b[i], value: a[i] });
                    }

                    console.log(arregloFinal);

                    for (let i = 0; i < arregloFinal.length; i++) {
                        let ale = espanol.find(persona => persona.key === arregloFinal[i].key);
                        if (ale) {
                            let a = ale.idioma;
                            let b = arregloFinal[i].value;
                            let c = arregloFinal[i].key;
                            pinky.push({ key: a, value: b, realValue: c, cuenta: true });
                        } else {
                            console.log("no respuesta");
                        }
                        $scope.comprador = pinky;

                    }


                }, function myError(response) {
                    console.error(response);
                });
            })();
        }

        // Resetear valores comprador
        $scope.resetearComprador = function() {
                $http({
                    method: "POST",
                    url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=BuyersAttributes&propertyValue=Status,BirthState,Age,Gender,PlaceOfInterest,Location'
                }).then(function mySuccess(response) {
                    $scope.resetearCompradorValues();
                }, function myError(response) {
                    console.error(response);
                });
            }
            // cOMPLEMENTO
        $scope.resetearCompradorValues = function() {
            $http({
                method: "POST",
                url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=BuyerAttributeWeights&propertyValue=5,5,5,5,5,5'
            }).then(function mySuccess(response) {
                swal("Valores reseteados exitosamente");
                setTimeout(function() {
                    location.href = "index.html";
                }, 1500);

            }, function myError(response) {
                console.error(response);
            });
        }

        // Save data of a buyer properties
        $scope.saveBuyer = function(data) {

            const newUrl = data.filter(person => person.cuenta === true);

            let cadena = 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=BuyersAttributes&propertyValue=';
            let valores = 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=BuyerAttributeWeights&propertyValue=';

            for (let i = 0; i < newUrl.length; i++) {

                cadena += newUrl[i].realValue;
                valores += newUrl[i].value;
                cadena += ',';
                valores += ',';

            }

            valores = valores.slice(0, -1);
            cadena = cadena.slice(0, -1);

            console.log(valores);
            console.log(cadena);

            $http({
                method: "POST",
                url: cadena
            }).then(function mySuccess(response) {

                $scope.setValores(valores);

            }, function myError(response) {
                console.error(response);
            });

        }

        // conDistancia

        $scope.editarDistancias = function() {
            $scope.conProp = true;
            $scope.confBuy = true;
            $scope.confDistan = false;

            (function() {

                $http({
                    method: "GET",
                    url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/get?propertyKey=PropertyDistanceFactor'
                }).then(function mySuccess(response) {
                    $scope.propertyDistance = response.data.data;
                }, function myError(response) {
                    console.log(response);
                });

            })();

            (function() {

                $http({
                    method: "GET",
                    url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/get?propertyKey=BuyerDistanceFactor'
                }).then(function mySuccess(response) {
                    $scope.buyerDistance = response.data.data;
                }, function myError(response) {
                    console.log(response);
                });

            })();
        }

        $scope.resetearDistancia = function() {

            url = "https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=BuyerDistanceFactor&propertyValue=100";

            $http({
                method: "POST",
                url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=PropertyDistanceFactor&propertyValue=5'
            }).then(function mySuccess(response) {
                $scope.setValores(url);
            }, function myError(response) {
                console.log(response);
            });

        }

        $scope.guardarDistancia = function(val, val2) {

            console.log(val, val2);

            let compra = 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=BuyerDistanceFactor&propertyValue=';

            compra += val2;
            // console.log(compra);

            let propie = 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=PropertyDistanceFactor&propertyValue=5';

            propie += val;

            // console.log(propie);

            $http({
                method: "POST",
                url: propie
            }).then(function mySuccess(response) {

                $scope.setValores(compra);

            }, function myError(response) {

            });

        }

        // end conf

        // funcion que revice datos cliente


        // Funcion que revisa los datos de la propiedad
        $scope.revisarDatos = function(response) {

            let espanol = [
                { key: "PropertyType", idioma: "Typo de Propiedad", value: "1" },
                { key: "Bedrooms", idioma: "Cuartos", value: "1" },
                { key: "Baths", idioma: "Baños", value: "1" },
                { key: "ConstructionSize", idioma: "Construccion en m²", value: "1" },
                { key: "LotSize", idioma: "Tamano del terreno en m²", value: "1" },
                { key: "Parking", idioma: "Estacionamientos", value: "1" },
                { key: "Levels", idioma: "Pisos", value: "1" },
                { key: "PropertyFloor", idioma: "Tipo de piso", value: "1" },
                { key: "Deeds", idioma: "Escrituras", value: "1" },
                { key: "Squatters", idioma: "Predio invadido", value: "1" },
                { key: "MarketValue", idioma: "Valor en el mercado", value: "2" },
                { key: "PercentDiscount", idioma: "Porcentaje de descuento", value: "2" },
                { key: "Location", idioma: "Ubicacion", value: "3" }
            ];

            let pinky = [];

            for (let i = 0; i < response.length; i++) {

                let ale = espanol.find(persona => persona.key === response[i].key);
                if (ale) {

                    let a = ale.idioma;
                    let b = response[i].value;
                    let c = response[i].key;

                    pinky.push({ key: a, value: b, realValue: c, cuenta: true });

                } else {
                    console.log("no respuesta");
                }

                $scope.datos = pinky;

            }

            // console.log($scope.datos);

        }


        // fUNCION PARA PORCENTAJE
        $scope.formateo = function(val) {
            val *= 100;
            return val;
        }

        $scope.buscarPropiedad = function(id) {
            $http({
                method: "GET",
                url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/property/' + id + '/get'
                    // url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/property/IF-3001034173/get'
            }).then(function mySuccess(response) {

                var a = response.data.data;

                if (a == undefined) {
                    swal({
                        title: "No se encontraron trabajos con este ID-Propiedad",
                        icon: "error",
                        button: "Buscar",
                        dangerMode: true,
                    });
                    setTimeout(function() {
                        location.reload();
                    }, 1500);

                } else {
                    // console.log('Primer Propiedad');
                    // console.log(response);
                    $scope.cargando = true;
                    $scope.propiedad = response.data.data;

                    $scope.main = true;
                    $scope.second = true;

                    $scope.similarProperties(id);
                    $scope.sugestedBuyers(id);
                }

            }, function myError(response) {
                console.error(response);
            });

        };

        $scope.similarProperties = function(id) {
            $http({
                method: "GET",
                url: 'https://revimex-mx.appspot.com/_ah/api/recommenderApi/v1/property/' + id + '/similar'
                    // url: 'https://revimex-mx.appspot.com/_ah/api/recommenderApi/v1/property/IF-3001034173/similar'
            }).then(function mySuccess(response) {

                // console.log("Segunda respuesta");
                // console.log(id);
                // console.log(response);
                $scope.similarProperties = response.data.data.slice(0, 10);

            }, function myError(response) {
                console.error(response);
            });
        }

        $scope.sugestedBuyers = function(id) {

            $scope.idBusqueda = id;

            $http({
                method: "GET",
                // url: 'https://revimex-mx.appspot.com/_ah/api/recommenderApi/v1/property/' + id + '/similar'
                url: 'https://revimex-mx.appspot.com/_ah/api/recommenderApi/v1/property/' + id
            }).then(function mySuccess(response) {
                // console.log("Tercer respuesta");
                // console.log(id);
                // console.log(response);
                $scope.similarClient = response.data.data.slice(0, 10);
                $scope.cargando = false;

            }, function myError(response) {
                console.error(response);
            });
        }

        $scope.guardarPropiedad = function(datos) {

            const newUrl = datos.filter(person => person.cuenta === true);

            let cadena = 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=PropertyAttributes&propertyValue=';
            let valores = 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=PropertyAttributeWeights&propertyValue=';

            for (let i = 0; i < newUrl.length; i++) {

                cadena += newUrl[i].realValue;
                valores += newUrl[i].value;
                cadena += ',';
                valores += ',';

            }

            console.log(cadena);
            console.log(valores);

            // Correcciones de Shai
            cadena = cadena.slice(0, -1);
            valores = valores.slice(0, -1);


            $http({
                method: "POST",
                url: cadena
            }).then(function mySuccess(response) {
                console.log("done");
                $scope.setValores(valores);

            }, function myError(response) {
                console.error(response);
            });

        }

        $scope.setValores = function(val) {
            $http({
                method: "POST",
                url: val
            }).then(function mySuccess(response) {
                swal("Cambio Realizado Exitosamente");
                setTimeout(function() {
                    location.href = "index.html";
                }, 1500);


            }, function myError(response) {
                console.error(response);
            });
        }

        $scope.resetearValoresPropiedad = function() {

            let cadena = 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=PropertyAttributeWeights&propertyValue=1,1,1,1,1,1,1,1,1,1,2,2,3';

            $http({
                method: "POST",
                url: 'https://revimex-mx.appspot.com/_ah/api/dataApi/v1/appconstant/save?propertyKey=PropertyAttributes&propertyValue=PropertyType,Bedrooms,Baths,ConstructionSize,LotSize,Parking,Levels,PropertyFloor,Deeds,Squatters,MarketValue,PercentDiscount,Location'
            }).then(function mySuccess(response) {
                console.log("done");
                $scope.setValores(cadena);


            }, function myError(response) {
                console.error(response);
            });
        }

        // Email
        $scope.enviarMail = function(userId) {

            swal("Enviado");

            let idpropiedad = $scope.idBusqueda;

            var arreglo = $scope.similarProperties;
            var id = [];

            for (let i = 0; i < arreglo.length; i++) {
                id.push(arreglo[i].entity.propertyID);
            }

            console.log(arreglo[0]);

            let body = {
                "buyerIds": [
                    `${userId}`
                ],
                "propertyIds": [
                    `${idpropiedad}`
                ]
            };

            $http({
                method: "POST",
                url: 'https://revimex-mx.appspot.com/_ah/api/emailApi/v1/email/send',
                data: body
            }).then(function mySuccess(response) {

                swal("Email enviado");

            }, function myError(response) {
                console.log(response);
            })


        }


    }]);
})();