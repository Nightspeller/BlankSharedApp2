(function () {
    angular.module(appConfig.appName).directive('picker', ['PickerService', function (PickerService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/picker.html',
            controller: function ($scope) {

                $scope.PickerService = PickerService;

                $scope.hidePicker = function () {
                    PickerService.resetState();
                };

                $scope.cardClicked = function (card) {
                    PickerService.setCurrentState(card.nextState);
                };

                $scope.back = function () {
                    PickerService.returnToPrevState();
                };

                $scope.prevPage = function () {
                    PickerService.prevPage();
                };

                $scope.nextPage = function () {
                    PickerService.nextPage();
                };

            }
        };
    }]);
})();