(function () {
    angular.module(appConfig.appName).service('StreamsStateManager', ['$timeout', '$rootScope', 'ChatService', 'TwitchAPIService', function ($timeout, $rootScope, ChatService, TwitchAPIService) {

        this.showStreamOverviewList = true;
        this.showChat = true;

        this.streams = [{
            id: 0,
            channel: '',
            channelUrl: '',
            player: '',
            status: '',
            info: ''
        },{
            id: 1,
            channel: '',
            channelUrl: '',
            player: '',
            status: '',
            info: ''
        },{
            id: 2,
            channel: '',
            channelUrl: '',
            player: '',
            status: '',
            info: ''
        },{
            id: 3,
            channel: '',
            channelUrl: '',
            player: '',
            status: '',
            info: ''
        }];

        this.removeStream = function (id) {
            this.streams[id].channel = '';
            this.streams[id].channelUrl = '';
            this.streams[id].player.parentElement.removeChild(this.streams[id].player);
            this.streams[id].player = '';
            this.streams[id].status = '';
            this.streams[id].info = '';
        }

        this.refreshStream = function (id) {
            if (this.streams[id].channel) this.updateStream(id, this.streams[id].channel, this.streams[id].info);
        }

        this.setStreamStatus = function (channelId, status) {
            if (this.streams[channelId].channel !== '') {
                if (status === 'active') {
                    for (var i = 0; i < 4; i++) {
                        if (this.streams[i].status === 'active') this.streams[i].status = 'overview';
                    }
                    ChatService.updateChannel('#' + this.streams[channelId].channel);
                }
                if (status === 'preview') {
                    for (var i = 0; i < 4; i++) {
                        if (this.streams[i].status === 'preview') this.streams[i].status = 'overview';
                    }
                }
                this.streams[channelId].status = status;
            }
        };

        this.updateStream = function (channelId, channelName, options) {
            var self = this;
            TwitchAPIService.prepareChannel(channelId, channelName).then(function (channelUrl) {
                var currentStatus = self.streams[channelId].status === '' ? 'overview' : self.streams[channelId].status;
                self.streams[channelId].channel = channelName;
                self.streams[channelId].channelUrl = channelUrl;
                self.streams[channelId].player = self.buildPlayer(channelUrl);
                self.streams[channelId].info = options;
                self.setStreamStatus(channelId, currentStatus);
            });
        };

        this.swapActiveAndPreview = function () {
            var activeId = null;
            var previewId = null;
            for (var i = 0; i < 4; i++) {
                if (this.streams[i].status === 'active') activeId = i;
                if (this.streams[i].status === 'preview') previewId = i;
            }
            if (activeId !== null && previewId !== null) {
                this.setStreamStatus(activeId, 'preview');
                this.setStreamStatus(previewId, 'active');
            }
        };

        this.buildPlayer = function (url) {
            var newPlayer = document.createElement('video');
            var src = document.createAttribute("src");
            src.value = url
            newPlayer.setAttributeNode(src);
            var controls = document.createAttribute("controls");
            controls.value = "controls"
            newPlayer.setAttributeNode(controls);
            var autoplay = document.createAttribute("autoplay");
            autoplay.value = "autoplay"
            newPlayer.setAttributeNode(autoplay);

            //var wasPausedByUser = false;
            //newPlayer.addEventListener("pause", function (data) { console.log('paused', data) }, true);
            //newPlayer.addEventListener("play", function (data) { console.log('playing', data) }, true);
            return newPlayer;
        };
    }]);
})();