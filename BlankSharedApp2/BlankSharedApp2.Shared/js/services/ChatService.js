(function () {
    angular.module(appConfig.appName).service('ChatService', ['$http', '$websocket', '$sce', function ($http, $websocket, $sce) {
        var self = this;
        this.messages = [];
        this.emoticons = [];

        var currentConnection = {
            userName: 'serg_nightspeller',
            channel: '#moonmeander',
            auth: 'oauth:qqdwf9bhi2eat1soec7f928hzwq01k'
        };

        var dataStream = $websocket('ws://nightspeller.net:8080');

        dataStream.onOpen(function (data) {
            dataStream.send(JSON.stringify(currentConnection));
        });

        dataStream.onMessage(function (message) {
            message = JSON.parse(message.data);

            var text = self.replaceRegexWithEmoticons(message.text);
            self.messages.push({ author: message.author, text: $sce.trustAsHtml(text) });
            if (self.messages.length > 60) self.messages.shift();
        });

        this.sendMessage = function (data) {
            dataStream.send(JSON.stringify({ text: data }));
            var text = self.replaceRegexWithEmoticons(data);
            self.messages.push({ author: currentConnection.userName, text: $sce.trustAsHtml(text) });
        };

        this.getEmoticons = function () {
            var url = "https://api.twitch.tv/kraken/chat/emoticons";
            WinJS.xhr({
                url: url
            }).done(function completed(data) {
                var temp = JSON.parse(data.response).emoticons;
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i].images[0].emoticon_set === null) {
                        self.emoticons.push({ regex: new RegExp("\\b" + temp[i].regex + "\\b", "g"), image: temp[i].images[0] });
                    }
                }
            });
        }();

        this.replaceRegexWithEmoticons = function (text) {
            text = text.replace('<', '\&lt\;');
            for (var i = 0; i < self.emoticons.length; i++) {
                text = text.replace(self.emoticons[i].regex, "<img src='" + self.emoticons[i].image.url + "'/>");
            }
            return toStaticHTML(text);
        };

        this.updateChannel = function (channel) {
            if (channel) {
                currentConnection.channel = channel;
                this.messages = [];
                dataStream.send(JSON.stringify(currentConnection));
            }
        };
    }]);
})();