/// <reference path="../../typings/browser.d.ts"/>

angular.module("qcm").factory(
  "qcmThemes",
  function() {
    return [
      { id: "divers", name: "Divers" },
      { id: "angular", name: "Angular" }
    ];
  }
);
