var designerModule = angular.module('designer');
designerModule.requires.push('sfFields');
designerModule.requires.push('ngSanitize');
designerModule.requires.push('sfSelectors');

designerModule.controller('CustomCtrl', ['$scope', 'propertyService', function ($scope, propertyService) {
    $scope.feedback.showLoadingIndicator = true;
    $scope.link_btn = 0;
    $scope.link_src = 0;
    //$scope.slideOptions = new SlideOption();

    propertyService.get()
        .then(function (data) {
            if (data) {
                $scope.properties = propertyService.toAssociativeArray(data.Items);

                if ($scope.properties.Images.PropertyValue) {
                    $scope.images = JSON.parse($scope.properties.Images.PropertyValue);

                }
                else {
                    $scope.images = null;
                }

                if ($scope.properties.DesktopTexts.PropertyValue) {
                    console.log($scope.properties.DesktopTexts);
                }
            }
        },
            function (data) {
                $scope.feedback.showError = true;
                if (data) {
                    $scope.feedback.errorMessage = data.Detail;
                    console.log(data.Detail);
                }
            })
        .finally(function () {
            $scope.feedback.showLoadingIndicator = false;
        });

    $scope.$watch('images', function (newValue, oldValue) {
        if (newValue) {
            console.log(newValue);
            $scope.properties.Images.PropertyValue = JSON.stringify(newValue);
            $scope.properties.ImagesPath.PropertyValue = JSON.stringify(newValue.map(x => x.ItemDefaultUrl.Value));

            if (!$scope.properties.DesktopTexts.PropertyValue) {
                $scope.properties.DesktopTexts.PropertyValue = JSON.stringify([]);
            }
        }
    }, true);

    $scope.$watch('select_image', function (newValue, oldValue) {
        if (newValue) {
            console.log(Number(newValue))
            console.log($scope.properties.DesktopTexts)

            var value = JSON.parse($scope.properties.DesktopTexts.PropertyValue);

            let diff = value.length - $scope.images.length;
            while (diff > 0) {
                value.pop();
                diff = value.length - $scope.images.length;
            }
            while (diff < 0) {
                value.push("");
                diff = value.length - $scope.images.length;
            }

            $scope.slide_text = value[Number($scope.select_image)];
            $scope.properties.DesktopTexts.PropertyValue = JSON.stringify(value);
        }
    }, true);

    $scope.$watch('slide_text', function (newValue, oldValue) {
        if ($scope.images && $scope.select_image) {
            var value = JSON.parse($scope.properties.DesktopTexts.PropertyValue);
            value[Number($scope.select_image)] = newValue;

            $scope.properties.DesktopTexts.PropertyValue = JSON.stringify(value);

        }
    }, true);

    $scope.$watch('selected_page', function (newValue, oldValue) {
        if (newValue) {
            console.log(newValue);
            console.log($scope.selectedPage);
            console.loG($scope.selected_page);
        }
    }, true);
}]);

$(document).ready(function () {
    console.log("jqueryyyyyyyyy")
});

//class SlideOption {
//    HasLink = '0';
//    LinkSrc = '0';
//    Link;
//    ButtonLabel;
//    constructor() {
//    }
//} 