angular.module("qcm")
    .config(function ($stateProvider) {
    $stateProvider
        .state({
        name: "qcm",
        url: "/admin/qcm",
        template: "<div layout=\"row\">" +
            "<div class=\"flex-66\" flex-offset=\"20\">" +
            "<ui-view></ui-view></div></div>"
    })
        .state({
        name: "qcm.list",
        url: "/list?:theme&:level",
        templateUrl: "/templates/qcm-list.html",
        resolve: {
            qcmList: function ($stateParams, $firebaseObject) {
                return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/qcm")).$loaded();
            }
        }
    })
        .state({
        name: "qcm.edit",
        url: "/edit?:theme&:level",
        template: "<qcm-select on-change=\"$ctrl.updateState(selection)\"></qcm-select>" +
            "<qcm-form qcm=\"$resolve.qcm\" on-submit=\"$ctrl.save(qcm)\" ng-if=\"$resolve.qcm\"></qcm-form>",
        controller: function ($state, $mdToast) {
            this.save = function (qcm) {
                qcm.$save().then(function () {
                    $mdToast.showSimple("Questionnaire sauvé.");
                });
            };
            this.updateState = function (selection) {
                $state.go(".", selection);
            };
        },
        controllerAs: "$ctrl",
        resolve: {
            qcm: function ($firebaseObject, $stateParams) {
                return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/qcm/" + $stateParams.theme + "/" + $stateParams.level)).$loaded();
            }
        }
    });
})
    .component("qcmSelect", {
    templateUrl: "/templates/qcm-select.html",
    bindings: {
        onChange: "&"
    },
    controller: function ($scope, $firebaseObject, $stateParams) {
        var _this = this;
        this.$onInit = function () {
            $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/themes")).$bindTo($scope, "themes");
            $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/levels")).$bindTo($scope, "levels");
            _this.qcmSelect = {
                theme: $stateParams.theme,
                level: $stateParams.level
            };
        };
    }
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
});
//# sourceMappingURL=new_qcm.directive.js.map