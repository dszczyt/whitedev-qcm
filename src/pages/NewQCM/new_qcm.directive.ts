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
      controller: function($scope: ng.IScope, fbQcmThemes: AngularFireObject, fbQcmLevels: AngularFireObject, $state: ng.ui.IStateService, $stateParams: IQcmEditStateParamsService, qcmSelect) {
        this.themes = fbQcmThemes;
        this.levels = fbQcmLevels;
        this.qcmSelect = qcmSelect;

        this.updateState = function() {
          $state.go(".", qcmSelect);
        };
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
      url: "/list?:theme&:level",
      templateUrl: "/templates/qcm-list.html",
      controller: function(qcmList: AngularFireObject) {
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
      url: "/edit?:theme&:level",
      template: "<qcm-form qcm=\"vm.qcm\" on-submit=\"vm.save()\"></qcm-form>",
      controller: function(qcm: AngularFireObject, $scope: ng.IScope) {
        this.qcm = qcm;
        this.saving = false;
        this.save = () => {
          this.saving = true;
          this.qcm.$save().then(() => { this.saving = false; });
        };
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
)
.run(function($rootScope: ng.IRootScopeService, $state: ng.ui.IStateService, $stateParams: IQcmEditStateParamsService, qcmSelect) {
  $rootScope.$on("$stateChangeSuccess", function() {
    if ($state.includes("qcm")) {
      qcmSelect.theme = $stateParams.theme;
      qcmSelect.level = $stateParams.level;
    }
  });
});
