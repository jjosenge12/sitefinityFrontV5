(function ($) {
    var sfFields = angular.module('sfFields');
    sfFields.requires.push('sfMultiImageField');

    angular.module('sfMultiImageField', ['sfServices', 'sfImageSelector'])
        .directive('sfMultiImageField', ['serverContext', 'sfMediaService', 'sfMediaFilter', function (serverContext, sfMediaService, sfMediaFilter) {
            return {
                restrict: "AE",
                scope: {
                    sfImages: '=?sfModel',
                    sfProvider: '=?',
                    sfAutoOpenSelector: '@',
                    sfMediaSettings: '=?'
                },
                templateUrl: function (elem, attrs) {
                    var assembly = attrs.sfTemplateAssembly || 'Telerik.Sitefinity.Frontend';
                    var url = attrs.sfTemplateUrl || 'client-components/fields/multi-image-field/sf-multi-image-field.sf-cshtml';
                    return serverContext.getEmbeddedResourceUrl(assembly, url);
                },
                link: function (scope, element, attrs, ctrl) {
                    var guidEmpty = "00000000-0000-0000-0000-000000000000";
                    scope.guidEmpty = guidEmpty;
                    var autoOpenSelector = attrs.sfAutoOpenSelector !== undefined && attrs.sfAutoOpenSelector.toLowerCase() !== 'false';

                    var getDateFromString = function (dateStr) {
                        return (new Date(parseInt(dateStr.substring(dateStr.indexOf('Date(') + 'Date('.length, dateStr.indexOf(')')))));
                    };

                    var getImage = function (id) {
                        sfMediaService.images.getById(id, scope.sfProvider).then(function (dataCtx) {
                            if (dataCtx && dataCtx.Item) {
                                refreshScopeInfo(dataCtx);
                            }
                        });
                    };

                    var refreshScopeInfo = function (dataCtx) {
                        var image = dataCtx.Item;
                        var isVectorGraphics = false;
                        if (dataCtx.SfAdditionalInfo) {
                            var isVectorGraphicsItems = $.grep(dataCtx.SfAdditionalInfo, function (e) { return e.Key === "IsVectorGraphics"; });
                            if (isVectorGraphicsItems.length == 1) {
                                isVectorGraphics = isVectorGraphicsItems[0].Value;
                            }
                        }
                        image.IsVectorGraphics = isVectorGraphics;
                        if (image.ThumbnailUrl) {
                            image.sfImageIsVisible = true;
                        } else {
                            image.sfImageIsVisible = false;
                        }

                        image.imageSize = Math.ceil(image.TotalSize / 1024) + " KB";
                        image.uploaded = getDateFromString(image.DateCreated);

                        scope.sfImages.push(image);
                    };

                    scope.done = function () {
                        scope.$uibModalInstance.close();
                        scope.sfImages = [];

                        if (scope.model.selectedItems && scope.model.selectedItems.length) {
                            scope.sfProvider = scope.model.provider;

                            for (var i = 0; i < scope.model.selectedItems.length; i++) {
                                getImage(scope.model.selectedItems[i].Id || scope.model.selectedItems[i]);
                            }
                        }
                    };

                    scope.cancel = function () {
                        // cancels the image properties if no image is selected
                        if (scope.sfImages === undefined) {
                            scope.sfImages = null;
                        }

                        scope.$uibModalInstance.dismiss();
                    };

                    scope.changeImage = function () {
                        scope.model = {
                            selectedItems: [],
                            filterObject: null,
                            provider: scope.sfProvider
                        };

                        try {
                            if (scope.sfImages && scope.sfImages.length > 0) {
                                scope.model.selectedItems = scope.sfImages;
                                scope.model.filterObject = sfMediaFilter.newFilter();
                                scope.model.filterObject.set.parent.to(scope.sfImages[0].FolderId || scope.sfImages[0].Album.Id);
                            }
                        }
                        catch (e) {
                            console.log(e);
                        }

                        var imageSelectorModalScope = element.find('.imageSelectorModal').scope();

                        if (imageSelectorModalScope)
                            imageSelectorModalScope.$openModalDialog();
                    };

                    if (autoOpenSelector) {
                        scope.changeImage();
                    }

                    scope.$on('sf-image-selector-image-uploaded', function (event, uploadedImageInfo) {
                        scope.sfProvider = scope.model.provider;
                        getImage(uploadedImageInfo.ContentId);
                        scope.$uibModalInstance.dismiss();
                    });
                }
            };
        }]);
})(jQuery);
