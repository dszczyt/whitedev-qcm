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
      templateUrl: "/templates/qcm-select.html",
      controller: function($scope, fbQcmThemes, fbQcmLevels, $state: ng.ui.IStateService) {
        this.themes = fbQcmThemes;
        this.levels = fbQcmLevels;
        $scope.$watchGroup(["vm.theme", "vm.level"], () => {
          $state.go("qcm.edit", {theme: this.theme, level: this.level});
        });
      },
      controllerAs: "vm",
      resolve: {
        fbQcmThemes: function($firebaseObject: AngularFireObjectService) {
          return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/themes")).$loaded();
        },
        fbQcmLevels: function($firebaseObject: AngularFireObjectService) {
          return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/levels")).$loaded();
        }
      }
    }
  )
  .state(
    {
      name: "qcm.list",
      url: "/list",
      templateUrl: "/templates/qcm-list.html",
      controller: function(qcmList) {
        this.qcmList = qcmList;
      },
      controllerAs: "vm",
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
      url: "/:theme/:level",
      template: "<qcm-form qcm=\"vm.qcm\"></qcm-form>",
      controller: function(qcm, $scope, $stateParams) {
        this.qcm = qcm;
        $scope.$parent.vm.theme = $stateParams.theme;
        $scope.$parent.vm.level = $stateParams.level || "debutant";
      },
      controllerAs: "vm",
      resolve: {
        qcm: function($firebaseObject: AngularFireObjectService, $stateParams: IQcmEditStateParamsService) {
          return $firebaseObject(new Firebase(`https://qcm-whitedev.firebaseio.com/qcm/${$stateParams.theme}/${$stateParams.level}`));
        }
      }
    }
  );
})
.directive(
  "qcmForm",
  function() {
    return {
      restrict: "E",
      templateUrl: "/templates/qcm-form.html",
      scope: {
        qcm: "="
      },
      controller: function($scope: angular.IScope, $stateParams: IQcmEditStateParamsService) {
        this.theme = $stateParams.theme;
        this.level = $stateParams.level;

        this.saving = false;
        this.save = () => {
          this.saving = false;
          this.qcm.$save().then(() => {
            this.saving = false;
          });
        };

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
      },
      controllerAs: "vm",
      bindToController: true
    };
  }
);