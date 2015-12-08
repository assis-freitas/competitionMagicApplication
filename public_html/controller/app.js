var app = angular.module("competitionMagic", ['angularUtils.directives.dirPagination', 'ngRoute']).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                .when('/dashboard', {
                    templateUrl: 'views/home.html',
                    auth: function (usuarioLogado) {
                        return usuarioLogado;
                    }
                })
                .when('/login', {
                    templateUrl: 'views/login.html'
                })
                .when('/equipe', {
                    templateUrl: 'views/submenu/equipe.html',
                    auth: function (usuarioLogado) {
                        return usuarioLogado;
                    }
                })
                .when('/equipe/novo', {
                    templateUrl: 'views/submenu/nova-equipe.html',
                    auth: function (usuarioLogado) {
                        return usuarioLogado;
                    }
                })
                .when('/participante', {
                    templateUrl: 'views/submenu/participante.html',
                    auth: function (usuarioLogado) {
                        return usuarioLogado;
                    }
                })
                .when('/participante/novo', {
                    templateUrl: 'views/submenu/novo-participante.html',
                    auth: function (usuarioLogado) {
                        return usuarioLogado;
                    }
                })
                .when('/', {
                    templateUrl: 'views/login.html'
                })
                .when('/403', {
                    templateUrl: 'views/403.html'
                })
                .otherwise({
                    redirectTo: '/403'
                });
    }]).run(function ($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function (ev, next, curr) {
        if (next.$$route) {
            var user = $rootScope.usuarioLogado;
            var auth = next.$$route.auth;
            if (auth && !auth(user)) {
                $location.path('/403');
                console.info("Usuário não está logado!");
            }
        }
    });
});

app.controller("competController", function ($scope, $http, $window, $rootScope, Configuracoes) {
            $scope.Configuracoes = Configuracoes;
     /*
             * 
             * RESTFUL SERVICES
             * 
             */
            var urlBase = 'http://localhost:8080/competicaoService';
            /*
             * LOGIN
             * 
             */
            //funcao para validar o login
            $scope.validaLogin = function (login) {
                $http.get(urlBase + "/login/" + login.usuario + "/" + login.senha)
                        .success(function (data) {
                            if (data === true) {
                                var urlInicial = "http://" + $window.location.host + "/competitionMagicApplication/#/dashboard";
                                $window.location.href = urlInicial;
                                $window.location;                                
                                $rootScope.usuarioLogado = true;
                                $scope.Configuracoes.nomeUsuario = login.usuario.toUpperCase();

                            } else {
                                var erro = document.getElementById("erro");
                                erro.innerHTML = "Usuário ou senha inválido";
                                erro.style.display = "block";
                                $scope.login = [];
                                $rootScope.usuarioLogado = false;
                                $scope.Configuracoes.nomeUsuario = "";
                            }
                        })
                        .error(function () {
                            var erro = document.getElementById("erro");
                                erro.innerHTML = 'Erro ao tentar validar a senha';
                                erro.style.display = "block";
                        });
            };
            //funcao para efetuar o logout
            $scope.logout = function () {
                $rootScope.usuarioLogado = false;
                $scope.Configuracoes.nomeUsuario = "";
            };
            
            
            /* 
             *  ======================================== COMPETIÇÃO ===============================================================
             *
             *  
             */
            
            $scope.carregaCompeticoes = function () {
                getCompeticoes(); 
            };
            
            function getCompeticoes() {
                $http.get(urlBase + "/competicoes/")
                     .success(function (data) {
                        $scope.competicoes = [];
                        angular.forEach(data, function(competicao, index){
                            angular.forEach(competicao.usuarios, function(usuario, index2){
                                if(usuario.login === Configuracoes.nomeUsuario){
                                    $scope.competicoes.push(competicao);
                                    return;
                                }
                            });
                        });
                        $scope.competicoes = data;
                     })
                     .error(function () {
                        console.log('Erro ao obter os dados da competição');
                        $scope.equipes = "ERRO ao efetuar o SELECT!";
                     });    
            };
            
            $scope.adicionaCompeticao = function (competicao) {
                $http.post(urlBase + "/competicoes", competicao).success(function (data) {                   
                    console.info(JSON.stringify("Competição inscrita com sucesso : " + data));
                    getCompeticoes();                          
                }).error(function (error) {
                    console.error(JSON.stringify("Erro ao inscrever a competição : " + error));
                    alert(JSON.stringify("Erro ao inscrever a competição: " + error));
                });
            };

            $scope.apagaCompeticao = function (codigo) {
                if (confirm("Realmente deseja excluir esta competição?")) {
                    $http.delete(urlBase + "/competicoes/" + codigo).success(function (data) {
                        if (data !== true) {
                            console.error("Erro ao excluir a competição: " + data);
                            alert("Erro ao excluir a competição: " + data);
                        } else {
                            console.info("Competição removida com sucesso");
                        }
                        getCompeticoes();
                    });
                }
            };
            
            $scope.alteraCompeticao = function (competicao) {
                $http.put(urlBase + "/competicoes/" + competicao.codigo, competicao).success(function (data) {
                    if (data !== true) {
                        console.error("Erro ao alterar a competição: " + data);
                    } else {
                        console.info("Competição " + competicao.descricao + " alterada com sucesso!");
                    }
                    ;
                    getCompeticoes();
                });
            };
            
            
            /* 
             *  ======================================== EQUIPE ===============================================================
             *
             *  
             */
            
            $scope.carregaEquipes = function () {
                getEquipes(); 
            };
            
            function getEquipes() {
                $http.get(urlBase + "/equipes/2")
                     .success(function (data) {
                        $scope.equipes = data;
                     })
                     .error(function () {
                        console.log('Erro ao obter os dados da equipe');
                        $scope.equipes = "ERRO ao efetuar o SELECT!";
                     });    
            };
            
            $scope.adicionaEquipe = function (equipe) {
                $http.post(urlBase + "/equipes", equipe).success(function (data) {                   
                    console.info(JSON.stringify("Equipe inscrita com sucesso : " + data));
                    getEquipes();                          
                }).error(function (error) {
                    console.error(JSON.stringify("Erro ao inscrever a equipe : " + error));
                    alert(JSON.stringify("Erro ao inscrever a equipe: " + error));
                });
            };

            $scope.apagaEquipe = function (codigo) {
                if (confirm("Realmente deseja excluir esta equipe?")) {
                    $http.delete(urlBase + "/equipes/" + codigo).success(function (data) {
                        if (data !== true) {
                            console.error("Erro ao excluir a equipe: " + data);
                            alert("Erro ao excluir a equipe: " + data);
                        } else {
                            console.info("Equipe removida com sucesso");
                        }
                        getEquipes();
                    });
                }
            };
            
            $scope.alteraEquipe = function (equipe) {
                $http.put(urlBase + "/equipes/" + equipe.codigo, equipe).success(function (data) {
                    if (data !== true) {
                        console.error("Erro ao alterar a Equipe: " + data);
                    } else {
                        console.info("Equipe " + equipe.descricao + " alterada com sucesso!");
                    }
                    ;
                    getEquipes();
                });
            };
            
            /* 
             *  ======================================== PARTICIPANTES ===============================================================
             *
             *  
             */
            
            $scope.carregaParticipantes = function () {
                getParticipantes(); 
            };
            
            function getParticipantes() {
                $http.get(urlBase + "/participantes/")
                     .success(function (data) {
                        $scope.participantes = data;
                     })
                     .error(function () {
                        console.log('Erro ao obter os dados dos participantes');
                        $scope.participantes = "ERRO ao efetuar o SELECT!";
                     });    
            };
            
            $scope.adicionaParticipante = function (participante) {
                $http.post(urlBase + "/participantes", participante).success(function (data) {                   
                    console.info(JSON.stringify("Participante inscrito com sucesso : " + data));
                    getParticipantes();                          
                }).error(function (error) {
                    console.error(JSON.stringify("Erro ao inscrever um participante : " + error));
                    alert(JSON.stringify("Erro ao inscrever um participante : " + error));
                });
            };

            $scope.apagaParticipante = function (codigo) {
                if (confirm("Realmente deseja excluir este participante?")) {
                    $http.delete(urlBase + "/participantes/" + codigo).success(function (data) {
                        if (data !== true) {
                            console.error("Erro ao excluir um participante: " + data);
                            alert("Erro ao excluir um participantee: " + data);
                        } else {
                            console.info("Participante removido com sucesso");
                        }
                        getParticipantes();
                    });
                }
            };
            
            $scope.alteraParticipante = function (participante) {
                $http.put(urlBase + "/equipes/" + participante.codigo, participante).success(function (data) {
                    if (data !== true) {
                        console.error("Erro ao alterar um participante: " + data);
                    } else {
                        console.info("Participante " + equipe.nome + " alterado com sucesso!");
                    }
                    ;
                    getParticipantes();
                });
            };
});

app.factory('Configuracoes', function () {
    return {menu: '', nomeUsuario: ''};
});
