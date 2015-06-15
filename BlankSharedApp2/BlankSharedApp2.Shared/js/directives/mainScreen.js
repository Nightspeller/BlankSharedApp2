(function () {
    angular.module(appConfig.appName).directive('mainScreen', ['$timeout', 'StreamsStateManager', function ($timeout, StreamsStateManager) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/main-screen.html',
            controller: function($scope){
                $scope.activeStream = '';
                $scope.previewStream = '';
            },
            link: function (scope, elem, attrs) {
                [].c
                scope.$watch(function () { return JSON.stringify(StreamsStateManager.streams) }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scope.activeStream = '';
                        scope.previewStream = '';
                        for (var i = 0; i < 4; i++) {
                            if (StreamsStateManager.streams[i].status === 'active') {
                                var videoContainer = elem[0].getElementsByClassName('active')[0];
                                if (videoContainer.firstChild) videoContainer.removeChild(videoContainer.firstChild);
                                videoContainer.appendChild(StreamsStateManager.streams[i].player);
                                StreamsStateManager.streams[i].player.play();
                                scope.activeStream = i;
                                adjustStreams();
                            }
                            if (StreamsStateManager.streams[i].status === 'preview') {
                                var videoContainer = elem[0].getElementsByClassName('preview')[0];
                                if (videoContainer.firstChild) videoContainer.removeChild(videoContainer.firstChild);
                                videoContainer.appendChild(StreamsStateManager.streams[i].player);
                                StreamsStateManager.streams[i].player.play();
                                scope.previewStream = i;
                                adjustStreams();
                            }
                        }
                    }
                });

                scope.$watch(function () { return StreamsStateManager.showStreamOverviewList }, function (newValue, oldValue) {
                    $timeout(function () {
                        adjustStreams();
                    },50);
                });

                scope.$watch(function () { return StreamsStateManager.showChat }, function (newValue, oldValue) {
                    $timeout(function () {
                        adjustStreams();
                    }, 50);
                });

                window.addEventListener("resize", adjustStreams);

                function adjustStreams() {
                    var activeStreamElem = elem[0].getElementsByClassName('active')[0];
                    var previewStreamElem = elem[0].getElementsByClassName('preview')[0];
                    var ratio = 16 / 9;

                    if (scope.activeStream !== '' && scope.previewStream !== '') {
                        var screenWidth = elem[0].offsetWidth;
                        var screenHeight = elem[0].offsetHeight;
                        var videoWidth = 0;
                        var videoHeight = 0;

                        if (screenWidth >= 2 * screenHeight * ratio) {
                            videoHeight = screenHeight;
                            videoWidth = screenHeight * ratio;
                        }

                        if (screenHeight * ratio > screenWidth / 2 && screenHeight * ratio < screenWidth) {
                            videoWidth = screenWidth * (0.5 + 0.1 * ((screenHeight * ratio * 2 - screenWidth) / (screenHeight * ratio)));
                            videoHeight = videoWidth / ratio;
                        }

                        if (screenHeight * ratio > screenWidth) {
                            videoWidth = screenWidth * (0.5 - 0.3 + 0.4 * (1 / (screenWidth / (screenHeight * ratio))));
                            videoHeight = videoWidth / ratio;
                        }

                        if (screenHeight >= 2 * screenWidth / ratio) {
                            videoWidth = screenWidth;
                            videoHeight = screenWidth / ratio;
                        }

                        activeStreamElem.style.width = videoWidth + 'px';
                        activeStreamElem.style.height = videoHeight + 'px';

                        previewStreamElem.style.width = videoWidth + 'px';
                        previewStreamElem.style.height = videoHeight + 'px';
                    } else {
                        if (activeStreamElem) {
                            activeStreamElem.style.removeProperty('width');
                            activeStreamElem.style.removeProperty('height');
                        }
                        if (previewStreamElem) {
                            previewStreamElem.style.removeProperty('width');
                            previewStreamElem.style.removeProperty('height');
                        }
                    }
                }
            }
        };
    }]);
})();