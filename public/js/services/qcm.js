angular.module("qcm").factory("qcmService", function ($firebaseObject) {
    return $firebaseObject(new Firebase("https://qcm-whitedev.firebaseio.com/qcm"));
});
//# sourceMappingURL=qcm.js.map