/// <reference path="../../typings/browser.d.ts"/>

angular.module("qcm").factory(
  "qcmService",
  function($firebaseObject:AngularFireObjectService) {
    return $firebaseObject(
      new Firebase("https://qcm-whitedev.firebaseio.com/qcm")
    );
  }
);
