(function () {
    angular.module(appConfig.appName).service('TwitchAPIService', ['$q', function ($q) {

        this.prepareChannel = function (channelId, channelName) {
            if (channelName) {
                return $q(function (resolve, reject) {
                    WinJS.xhr({
                        url: 'http://api.twitch.tv/api/channels/' + channelName + '/access_token',
                        responseType: "json"
                    }).done(function completed(result) {                       
                        var response = JSON.parse(result.response);
                        var url = 'http://usher.justin.tv/api/channel/hls/' + channelName + '.m3u8?token=' + response.token + '&sig=' + response.sig;
                        resolve(url);
                    });
                })
            };
        };

        this.getGames = function (amount, page) {
            var url = "https://api.twitch.tv/kraken/games/top?limit=" + amount + "&offset=" + page * amount;
            return $q(function(resolve, reject){
                WinJS.xhr({
                    url: url
                }).done(function completed(data) {
                    data = JSON.parse(data.response);
                    resolve(data);
                });
            })
        };

        this.getStreamsForGame = function (amount, page, game) {
            var url = "https://api.twitch.tv/kraken/streams?game=" + game + "&limit=" + amount + "&offset=" + page * amount;
            return $q(function (resolve, reject) {
                WinJS.xhr({
                    url: url
                }).done(function completed(data) {
                    data = JSON.parse(data.response);
                    resolve(data);
                });
            });
        };

    }]);
})();