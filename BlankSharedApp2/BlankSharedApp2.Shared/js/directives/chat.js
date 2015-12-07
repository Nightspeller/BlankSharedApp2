(function () {
    angular.module(appConfig.appName).directive('chat', ['ChatService', function (ChatService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/chat.html',
            controller: function ($scope) {
                $scope.ChatService = ChatService;
            },
            link: function (scope, elem, attrs) {

                for (var i = 0; i < 4; i++) {
                    var chatWebView = document.createElement('x-ms-webview');
                    chatWebView.style.height = '100%';
                    chatWebView.style.width = '100%';
                    chatWebView.style.display = 'none';
                    chatWebView.id = 'chatContainer'+i;
                    elem[0].getElementsByClassName("chatContainers")[0].appendChild(chatWebView);
                }

                scope.$watch('ChatService.channels', function (newValue, oldValue) {
                    for (var i = 0; i < 4; i++) {
                        if (newValue[i] !== oldValue[i]) {
                            elem[0].querySelector("#chatContainer" + i).navigate('http://www.twitch.tv/' + newValue[i] + '/chat');
                        }
                    }
                }, true);

                scope.$watch('ChatService.activeChannelId', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scope.showChat(newValue);
                    }
                }, true);

                scope.showChat = function(chatId) {
                    for (var i = 0; i < 4; i++) {
                        elem[0].querySelector("#chatContainer" + i).style.display = 'none';
                    }
                    elem[0].querySelector("#chatContainer" + chatId).style.display = 'block';
                }
            }
        };
    }]);
})();