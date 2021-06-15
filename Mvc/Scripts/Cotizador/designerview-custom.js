(function () {
    // declare dependency on the sfSelectors module
    angular.module('designer').requires.push('sfSelectors');
    angular.module('designer').requires.push('ngSanitize');

    angular.module('designer').controller('CustomCtrl', ['$scope', 'propertyService', function ($scope, propertyService) {
        $scope.feedback.showLoadingIndicator = true;

        // initialize the selector model
        $scope.librariesSelector = {
            selectedItemId: [],
            selectedItem: []
        };

        // whenever librariesSelector.selectedItemId changes, bind the new value to the widget controller property 
        $scope.$watch(
            'librariesSelector.selectedItemId',
            function (newSelectedItemId, oldSelectedItemId) {
                if (newSelectedItemId !== oldSelectedItemId) {
                    if (newSelectedItemId) {
                        $scope.properties.SerializedSelectedItemId.PropertyValue = newSelectedItemId;
                    }
                }
            },
            true
        );

        // whenever librariesSelector.selectedItem changes, bind the new value to the widget controller property
        $scope.$watch(
            'librariesSelector.selectedItem',
            function (newSelectedItem, oldSelectedItem) {
                if (newSelectedItem !== oldSelectedItem) {
                    if (newSelectedItem) {
                        $scope.properties.SerializedSelectedItem.PropertyValue = JSON.stringify(newSelectedItem);
                    }
                }
            },
            true
        );

        propertyService.get()
            .then(function (data) {
                if (data) {
                    $scope.properties = propertyService.toAssociativeArray(data.Items);

                    // copy the selected item id so that the selector can initialize with the selected items
                    var selectedItemId = $scope.properties.SerializedSelectedItemId.PropertyValue || null;
                    $scope.librariesSelector.selectedItemId = selectedItemId;

                    var selectedItem = $scope.properties.SerializedSelectedItem.PropertyValue || null;
                    $scope.librariesSelector.selectedItem = selectedItem;

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