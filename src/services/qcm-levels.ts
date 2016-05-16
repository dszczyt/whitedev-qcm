/// <reference path="../../typings/browser.d.ts"/>

angular.module("qcm").factory(
  "qcmLevels",
  function() {
    return [
      { id: "debutant", name: "Débutant" },
      { id: "intermediaire", name: "Intermédiaire" },
      { id: "expert", name: "Expert" }
    ];
  }
);
