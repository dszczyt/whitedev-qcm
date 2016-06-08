/// <reference path="../../../typings/browser.d.ts"/>

interface IQcmEditStateParamsService extends ng.ui.IStateParamsService {
  theme?: string;
  level?: string;
}

angular.module("qcm")
.config(function($stateProvider: ng.ui.IStateProvider){
  $stateProvider
  .state(
    {
      name: "qcm",
      url: "/admin/qcm",
      template: "<div layout=\"row\">" +
      "<div class=\"flex-66\" flex-offset=\"20\">" +
      "<ui-view></ui-view></div></div>"
    }
  )
  .state(
    {
      name: "qcm.list",
      url: "/list?:theme&:level",
      templateUrl: "/templates/qcm-list.html",
      resolve: {
        qcmList: function($stateParams: IQcmEditStateParamsService, $firebaseObject: AngularFireObjectService) {
          return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/qcm")).$loaded();
        }
      }
    }
  )
  .state(
    {
      name: "qcm.edit",
      url: "/edit?:theme&:level",
      /*params: {
        theme: undefined,
        level: undefined
      },*/
      template: "<qcm-select on-change=\"$ctrl.updateState(selection)\"></qcm-select>" +
      "<qcm-form qcm=\"$resolve.qcm\" on-submit=\"$ctrl.save(qcm)\" ng-if=\"$resolve.qcm\"></qcm-form>",
      controller: function($state: ng.ui.IStateService, $mdToast) {
        this.save = (qcm) => {
          qcm.$save().then(() => {
            $mdToast.showSimple("Questionnaire sauvé.");
          });
        };
        this.updateState = function(selection) {
          $state.go(".", selection);
        };
      },
      controllerAs: "$ctrl",
      resolve: {
        qcm: function($firebaseObject: AngularFireObjectService, $stateParams: IQcmEditStateParamsService) {
          return $firebaseObject(new Firebase(`https://qcm-whitedev.firebaseio.com/qcm/${$stateParams.theme}/${$stateParams.level}`)).$loaded();
        }
      }
    }
  );
})
.component(
  "qcmSelect",
  {
    templateUrl: "/templates/qcm-select.html",
    bindings: {
      onChange: "&"
    },
    controller: function($scope: ng.IScope, $firebaseObject: AngularFireObjectService, $stateParams: IQcmEditStateParamsService) {
      this.$onInit = () => {
        $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/themes")).$bindTo($scope, "themes");
        $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/levels")).$bindTo($scope, "levels");
        this.qcmSelect = {
          theme: $stateParams.theme,
          level: $stateParams.level
        };
      };
    }
  }
)
.component(
  "qcmForm",
  {
    templateUrl: "/templates/qcm-form.html",
    bindings: {
      qcm: "<",
      onSubmit: "&"
    },
    controller: function($scope: angular.IScope, $stateParams: IQcmEditStateParamsService) {
      this.newQuestion = () => {
        if (this.qcm.questions === undefined) {
          this.qcm.questions = [];
        }
        this.qcm.questions.push({});
      };

      this.deleteResponse = (question, idx) => {
        question.answers.splice(idx, 1);
      };

      this.deleteQuestion = (idx) => {
        this.qcm.questions.splice(idx, 1);
      };

      this.newAnswer = (question) => {
        if (question.answers === undefined) question.answers = [];
        question.answers.push({});
      };
    }
  }
);
