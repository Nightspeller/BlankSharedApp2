(function () {
    angular.module(appConfig.appName).directive('chat', ['ChatService', function (ChatService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/chat.html',
            controller: function ($scope) {
                $scope.ChatService = ChatService;

                $scope.sendMessage = function ($event) {
                    if ($event.keyCode === 13) {
                        ChatService.sendMessage($scope.chatMessage)
                    }
                }

                $scope.sendChannel = function ($event) {
                    if ($event.keyCode === 13) {
                        ChatService.updateChannel($scope.channel)
                    }
                }
            },
            link: function (scope, elem, attrs) {
                var chatContainer = elem[0].getElementsByClassName('chatMessages')[0];

                scope.$watch('ChatService', function () {
                    chatContainer.scrollTop = chatContainer.scrollHeight + 10000;
                    if (chatContainer.scrollTop !== chatContainer.scrollHeight) {

                    }
                }, true);

            }
        };
    }]);
})();