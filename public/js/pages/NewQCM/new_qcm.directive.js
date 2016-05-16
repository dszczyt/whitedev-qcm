angular.module("qcm")
    .config(function ($stateProvider) {
    $stateProvider
        .state({
        name: "qcm",
        url: "/admin/qcm",
        templateUrl: "/templates/qcm-select.html",
        controller: function ($scope, fbQcmThemes, fbQcmLevels, $state) {
            var _this = this;
            this.themes = fbQcmThemes;
            this.levels = fbQcmLevels;
            $scope.$watchGroup(["vm.theme", "vm.level"], function () {
                $state.go("qcm.edit", { theme: _this.theme, level: _this.level });
            });
        },
        controllerAs: "vm",
        resolve: {
            fbQcmThemes: function ($firebaseObject) {
                return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/themes")).$loaded();
            },
            fbQcmLevels: function ($firebaseObject) {
                return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/levels")).$loaded();
            }
        }
    })
        .state({
        name: "qcm.list",
        url: "/list",
        templateUrl: "/templates/qcm-list.html",
        controller: function (qcmList) {
            this.qcmList = qcmList;
        },
        controllerAs: "vm",
        resolve: {
            qcmList: function ($stateParams, $firebaseObject) {
                return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/qcm")).$loaded();
            }
        }
    })
        .state({
        name: "qcm.edit",
        url: "/:theme/:level",
        template: "<qcm-form qcm=\"vm.qcm\"></qcm-form>",
        controller: function (qcm, $scope, $stateParams) {
            this.qcm = qcm;
            $scope.$parent.vm.theme = $stateParams.theme;
            $scope.$parent.vm.level = $stateParams.level || "debutant";
        },
        controllerAs: "vm",
        resolve: {
            qcm: function ($firebaseObject, $stateParams) {
                return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/qcm/" + $stateParams.theme + "/" + $stateParams.level));
            }
        }
    });
})
    .directive("qcmForm", function () {
    return {
        restrict: "E",
        templateUrl: "/templates/qcm-form.html",
        scope: {
            qcm: "="
        },
        controller: function ($scope, $stateParams) {
            var _this = this;
            this.theme = $stateParams.theme;
            this.level = $stateParams.level;
            this.saving = false;
            this.save = function () {
                _this.saving = false;
                _this.qcm.$save().then(function () {
                    _this.saving = false;
                });
            };
            this.newQuestion = function () {
                if (_this.qcm.questions === undefined) {
                    _this.qcm.questions = [];
                }
                _this.qcm.questions.push({});
            };
            this.deleteResponse = function (question, idx) {
                question.answers.splice(idx, 1);
            };
            this.deleteQuestion = function (idx) {
                _this.qcm.questions.splice(idx, 1);
            };
            this.newAnswer = function (question) {
                if (question.answers === undefined)
                    question.answers = [];
                question.answers.push({});
            };
        },
        controllerAs: "vm",
        bindToController: true
    };
});
//# sourceMappingURL=new_qcm.directive.js.map