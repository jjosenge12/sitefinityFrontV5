(function () {
    // declare dependency on the sfSelectors module
    angular.module('designer').requires.push('sfSelectors');
    angular.module('designer').requires.push('ngSanitize');

    angular.module('designer').controller('CustomCtrl', ['$scope', 'propertyService', function ($scope, propertyService) {
        $scope.feedback.showLoadingIndicator = true;
        $scope.montoEnganche = "0";

        $scope.$watch(
            'montoEnganche',
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.properties.MontoEnganche.PropertyValue = newValue;
                }
            },
            true
        );

        propertyService.get()
            .then(function (data) {
                if (data) {
                    $scope.properties = propertyService.toAssociativeArray(data.Items);
                    $scope.montoEnganche = $scope.properties.MontoEnganche.properties || "0";
                }
            },
                function (data) {
                    $scope.feedback.showError = true;
                    if (data) {
                        $scope.feedback.errorMessage = data.Detail;
                        console.log(data);
                    }


                })
            .finally(function () {
                $scope.feedback.showLoadingIndicator = false;
            });
    }]);
})();