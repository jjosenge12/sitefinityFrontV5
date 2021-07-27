var designerModule = angular.module('designer');
designerModule.requires.push('sfFields');
designerModule.requires.push('ngSanitize');
designerModule.requires.push('sfSelectors');

designerModule.controller('CustomCtrl', ['$scope', 'propertyService', function ($scope, propertyService) {
    $scope.feedback.showLoadingIndicator = true;
    $scope.link_btn = 0;
    $scope.link_src = 0;
    $scope.new_tab = false;
    $scope.text_color = "#ffffff";
    $scope.text_size = "32";
    $scope.selected_page = { id: '', page: '' };

    $scope.mobile = {
        link_btn: 0,
        link_src: 0,
        new_tab: false,
        text_color: "#ffffff",
        text_size: "24",
        selected_page: { id: '', page: '' }
    };

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

                if ($scope.properties.MobileImages.PropertyValue) {
                    $scope.mobile.images = JSON.parse($scope.properties.MobileImages.PropertyValue);
                }
                else {
                    $scope.mobile.images = null;
                }

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

    //Desktop carousel controls

    $scope.$watch('images', function (newValue, oldValue) {
        if (newValue) {
            $scope.properties.Images.PropertyValue = JSON.stringify(newValue);
            $scope.properties.ImagesPath.PropertyValue = JSON.stringify(newValue.map(x => x.ItemDefaultUrl.Value));

            if (!$scope.properties.SlideOptions.PropertyValue) {
                let options = newValue.map(x => ({
                    Text: '',
                    HasLink: 0,
                    LinkSrc: 0,
                    Link: '',
                    ButtonLabel: '',
                    NewTab: false,
                    TextColor: '#ffffff',
                    TextSize: '32',
                    SelectedPage: JSON.stringify({ id: '', page: '' })
                }));
                $scope.properties.SlideOptions.PropertyValue = JSON.stringify(options);
            }
            else {
                var value = JSON.parse($scope.properties.SlideOptions.PropertyValue);

                let diff = value.length - $scope.images.length;
                while (diff > 0) {
                    value.pop();
                    diff = value.length - $scope.images.length;
                }
                while (diff < 0) {
                    value.push({
                        Text: '',
                        HasLink: 0,
                        LinkSrc: 0,
                        Link: '',
                        ButtonLabel: '',
                        NewTab: false,
                        TextColor: '#ffffff',
                        TextSize: '32',
                        SelectedPage: JSON.stringify({ id: '', page: '' })
                    });
                    diff = value.length - $scope.images.length;
                }
                $scope.properties.SlideOptions.PropertyValue = JSON.stringify(value);
            }

        }
    }, true);

    $scope.$watch('select_image', function (newValue, oldValue) {
        if (newValue) {

            var value = JSON.parse($scope.properties.SlideOptions.PropertyValue);

            let diff = value.length - $scope.images.length;
            while (diff > 0) {
                value.pop();
                diff = value.length - $scope.images.length;
            }
            while (diff < 0) {
                value.push({
                    Text: '',
                    HasLink: 0,
                    LinkSrc: 0,
                    Link: '',
                    ButtonLabel: '',
                    NewTab: false,
                    TextColor: '#ffffff',
                    TextSize: '32',
                    SelectedPage: JSON.stringify({ id: '', page: '' })
                });
                diff = value.length - $scope.images.length;
            }

            $scope.slide_text = value[Number($scope.select_image)].Text;
            $scope.link_btn = value[Number($scope.select_image)].HasLink;
            $scope.link_src = value[Number($scope.select_image)].LinkSrc;
            $scope.url_link = value[Number($scope.select_image)].Link;
            $scope.btn_label = value[Number($scope.select_image)].ButtonLabel;
            $scope.new_tab = value[Number($scope.select_image)].NewTab;
            $scope.text_color = value[Number($scope.select_image)].TextColor;
            $scope.text_size = value[Number($scope.select_image)].TextSize;
            $scope.selected_page = JSON.parse(value[Number($scope.select_image)].SelectedPage);
            $scope.properties.SlideOptions.PropertyValue = JSON.stringify(value);
        }
    }, true);

    $scope.$watch('slide_text', function (newValue, oldValue) {
        if ($scope.images && $scope.select_image) {
            var value = JSON.parse($scope.properties.SlideOptions.PropertyValue);
            value[Number($scope.select_image)].Text = newValue;

            $scope.properties.SlideOptions.PropertyValue = JSON.stringify(value);
        }
    }, true);

    $scope.$watch('link_btn', function (newValue, oldValue) {
        if (newValue) {
            var options = JSON.parse($scope.properties.SlideOptions.PropertyValue);
            options[Number($scope.select_image)].HasLink = newValue;

            $scope.properties.SlideOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('link_src', function (newValue, oldValue) {
        if (newValue) {
            var options = JSON.parse($scope.properties.SlideOptions.PropertyValue);
            options[Number($scope.select_image)].LinkSrc = newValue;

            if (newValue === '0') {
                options[Number($scope.select_image)].Link = $scope.url_link;
            }
            else if (newValue === '1') {
                options[Number($scope.select_image)].Link = $scope.selected_page.page.FullUrl;
            }

            $scope.properties.SlideOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('btn_label', function (newValue, oldValue) {
        if ($scope.properties)
            if (newValue) {
                var options = JSON.parse($scope.properties.SlideOptions.PropertyValue);
                options[Number($scope.select_image)].ButtonLabel = newValue;

                $scope.properties.SlideOptions.PropertyValue = JSON.stringify(options);
            }
    }, true);

    $scope.$watch('selected_page', function (newValue, oldValue) {
        if (newValue != oldValue) {
            var options = JSON.parse($scope.properties.SlideOptions.PropertyValue);
            options[Number($scope.select_image)].Link = newValue.page.FullUrl;
            options[Number($scope.select_image)].SelectedPage = JSON.stringify(newValue);

            $scope.properties.SlideOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('url_link', function (newValue, oldValue) {
        if (newValue) {
            var options = JSON.parse($scope.properties.SlideOptions.PropertyValue);
            options[Number($scope.select_image)].Link = newValue;

            $scope.properties.SlideOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('new_tab', function (newValue, oldValue) {
        if (newValue) {
            var options = JSON.parse($scope.properties.SlideOptions.PropertyValue);
            options[Number($scope.select_image)].NewTab = newValue;

            $scope.properties.SlideOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('text_color', function (newValue, oldValue) {
        if ($scope.properties)
            if (newValue != oldValue) {
                console.log(Number($scope.select_image));
                console.log($scope.properties.SlideOptions);
                var options = JSON.parse($scope.properties.SlideOptions.PropertyValue);
                options[Number($scope.select_image)].TextColor = newValue;

                $scope.properties.SlideOptions.PropertyValue = JSON.stringify(options);
            }
    }, true);

    $scope.$watch('text_size', function (newValue, oldValue) {
        if ($scope.properties)
            if (newValue != oldValue) {
                console.log(Number($scope.select_image));
                console.log($scope.properties.SlideOptions);
                var options = JSON.parse($scope.properties.SlideOptions.PropertyValue);
                options[Number($scope.select_image)].TextSize = newValue;

                $scope.properties.SlideOptions.PropertyValue = JSON.stringify(options);
            }
    }, true);

    //Mobile carousel controls

    $scope.$watch('mobile.images', function (newValue, oldValue) {
        if (newValue) {
            $scope.properties.MobileImages.PropertyValue = JSON.stringify(newValue);
            $scope.properties.MobileImagesPath.PropertyValue = JSON.stringify(newValue.map(x => x.ItemDefaultUrl.Value));

            if (!$scope.properties.MobileOptions.PropertyValue) {
                let options = newValue.map(x => ({
                    Text: '',
                    HasLink: 0,
                    LinkSrc: 0,
                    Link: '',
                    ButtonLabel: '',
                    NewTab: false,
                    TextColor: '#ffffff',
                    TextSize: '24',
                    SelectedPage: JSON.stringify({ id: '', page: '' })
                }));
                $scope.properties.MobileOptions.PropertyValue = JSON.stringify(options);
            }
            else {
                var value = JSON.parse($scope.properties.MobileOptions.PropertyValue);

                let diff = value.length - $scope.mobile.images.length;
                while (diff > 0) {
                    value.pop();
                    diff = value.length - $scope.mobile.images.length;
                }
                while (diff < 0) {
                    value.push({
                        Text: '',
                        HasLink: 0,
                        LinkSrc: 0,
                        Link: '',
                        ButtonLabel: '',
                        NewTab: false,
                        TextColor: '#ffffff',
                        TextSize: '32',
                        SelectedPage: JSON.stringify({ id: '', page: '' })
                    });
                    diff = value.length - $scope.mobile.images.length;
                }
                $scope.properties.MobileOptions.PropertyValue = JSON.stringify(value);
            }
        }
    }, true);

    $scope.$watch('mobile.select_image', function (newValue, oldValue) {
        if (newValue) {

            var value = JSON.parse($scope.properties.MobileOptions.PropertyValue);

            let diff = value.length - $scope.mobile.images.length;
            while (diff > 0) {
                value.pop();
                diff = value.length - $scope.mobile.images.length;
            }
            while (diff < 0) {
                value.push({
                    Text: '',
                    HasLink: 0,
                    LinkSrc: 0,
                    Link: '',
                    ButtonLabel: '',
                    NewTab: false,
                    TextColor: '#ffffff',
                    TextSize: '24',
                    SelectedPage: JSON.stringify({ id: '', page: '' })
                });
                diff = value.length - $scope.mobile.images.length;
            }

            $scope.mobile.slide_text = value[Number($scope.mobile.select_image)].Text;
            $scope.mobile.link_btn = value[Number($scope.mobile.select_image)].HasLink;
            $scope.mobile.link_src = value[Number($scope.mobile.select_image)].LinkSrc;
            $scope.mobile.url_link = value[Number($scope.mobile.select_image)].Link;
            $scope.mobile.btn_label = value[Number($scope.mobile.select_image)].ButtonLabel;
            $scope.mobile.new_tab = value[Number($scope.mobile.select_image)].NewTab;
            $scope.mobile.text_color = value[Number($scope.mobile.select_image)].TextColor;
            $scope.mobile.text_size = value[Number($scope.mobile.select_image)].TextSize;
            $scope.mobile.selected_page = JSON.parse(value[Number($scope.mobile.select_image)].SelectedPage);
            $scope.properties.MobileOptions.PropertyValue = JSON.stringify(value);
        }
    }, true);

    $scope.$watch('mobile.slide_text', function (newValue, oldValue) {
        if ($scope.mobile.images && $scope.mobile.select_image) {
            var value = JSON.parse($scope.properties.MobileOptions.PropertyValue);
            value[Number($scope.mobile.select_image)].Text = newValue;

            $scope.properties.MobileOptions.PropertyValue = JSON.stringify(value);
        }
    }, true);

    $scope.$watch('mobile.link_btn', function (newValue, oldValue) {
        if (newValue) {
            var options = JSON.parse($scope.properties.MobileOptions.PropertyValue);
            options[Number($scope.mobile.select_image)].HasLink = newValue;

            $scope.properties.MobileOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('mobile.link_src', function (newValue, oldValue) {
        if (newValue) {
            var options = JSON.parse($scope.properties.MobileOptions.PropertyValue);
            options[Number($scope.mobile.select_image)].LinkSrc = newValue;

            if (newValue === '0') {
                options[Number($scope.mobile.select_image)].Link = $scope.mobile.url_link;
            }
            else if (newValue === '1') {
                options[Number($scope.mobile.select_image)].Link = $scope.mobile.selected_page.page.FullUrl;
            }

            $scope.properties.MobileOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('mobile.btn_label', function (newValue, oldValue) {
        if ($scope.properties)
            if (newValue) {
                var options = JSON.parse($scope.properties.MobileOptions.PropertyValue);
                options[Number($scope.mobile.select_image)].ButtonLabel = newValue;

                $scope.properties.MobileOptions.PropertyValue = JSON.stringify(options);
            }
    }, true);

    $scope.$watch('mobile.selected_page', function (newValue, oldValue) {
        if (newValue != oldValue) {
            var options = JSON.parse($scope.properties.MobileOptions.PropertyValue);
            options[Number($scope.mobile.select_image)].Link = newValue.page.FullUrl;
            options[Number($scope.mobile.select_image)].SelectedPage = JSON.stringify(newValue);

            $scope.properties.MobileOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('mobile.url_link', function (newValue, oldValue) {
        if (newValue) {
            var options = JSON.parse($scope.properties.MobileOptions.PropertyValue);
            options[Number($scope.mobile.select_image)].Link = newValue;

            $scope.properties.MobileOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('mobile.new_tab', function (newValue, oldValue) {
        if (newValue) {
            var options = JSON.parse($scope.properties.MobileOptions.PropertyValue);
            options[Number($scope.mobile.select_image)].NewTab = newValue;

            $scope.properties.MobileOptions.PropertyValue = JSON.stringify(options);
        }
    }, true);

    $scope.$watch('mobile.text_color', function (newValue, oldValue) {
        if ($scope.properties)
            if (newValue != oldValue) {
                var options = JSON.parse($scope.properties.MobileOptions.PropertyValue);
                options[Number($scope.mobile.select_image)].TextColor = newValue;

                $scope.properties.MobileOptions.PropertyValue = JSON.stringify(options);
            }
    }, true);

    $scope.$watch('mobile.text_size', function (newValue, oldValue) {
        if ($scope.properties)
            if (newValue != oldValue) {
                var options = JSON.parse($scope.properties.MobileOptions.PropertyValue);
                options[Number($scope.mobile.select_image)].TextSize = newValue;

                $scope.properties.MobileOptions.PropertyValue = JSON.stringify(options);
            }
    }, true);

}]);