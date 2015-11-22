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
                $location.path('/');
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
                                var urlInicial = "http://" + $window.location.host + "/competicao/#/dashboard";
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
                            console.log('Erro ao tentar validar a senha');
                        });
            };
            //funcao para efetuar o logout
            $scope.logout = function () {
                $rootScope.usuarioLogado = false;
                $scope.Configuracoes.nomeUsuario = "";
            };
});

app.factory('Configuracoes', function () {
    return {menu: '', nomeUsuario: ''};
});