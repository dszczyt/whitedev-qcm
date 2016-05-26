angular.module("qcm")
    .config(function ($stateProvider) {
    $stateProvider
        .state({
        name: "qcm",
        url: "/admin/qcm",
        templateUrl: "/templates/qcm-select.html",
        controller: function ($scope, fbQcmThemes, fbQcmLevels, $state, $stateParams, qcmSelect) {
            this.themes = fbQcmThemes;
            this.levels = fbQcmLevels;
            this.qcmSelect = qcmSelect;
            this.updateState = function () {
                $state.go(".", qcmSelect);
            };
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
        url: "/list?:theme&:level",
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
        url: "/edit?:theme&:level",
        template: "<qcm-form qcm=\"vm.qcm\" on-submit=\"vm.save()\"></qcm-form>",
        controller: function (qcm, $scope) {
            var _this = this;
            this.qcm = qcm;
            this.saving = false;
            this.save = function () {
                _this.saving = true;
                _this.qcm.$save().then(function () { _this.saving = false; });
            };
        },
        controllerAs: "vm",
        resolve: {
            qcm: function ($firebaseObject, $stateParams) {
                return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/qcm/" + $stateParams.theme + "/" + $stateParams.level));
            }
        }
    });
})
    .component("qcmForm", {
    templateUrl: "/templates/qcm-form.html",
    bindings: {
        qcm: "<",
        onSubmit: "&"
    },
    controller: function ($scope, $stateParams) {
        var _this = this;
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
    }
})
    .run(function ($rootScope, $state, $stateParams, qcmSelect) {
    $rootScope.$on("$stateChangeSuccess", function () {
        if ($state.includes("qcm")) {
            qcmSelect.theme = $stateParams.theme;
            qcmSelect.level = $stateParams.level;
        }
    });
});
//# sourceMappingURL=new_qcm.directive.js.map