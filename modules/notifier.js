Core.prototype.notifier = function(data) {
    if ((data.special && (localStorage.getItem('opt_special') == 'true') || localStorage.getItem('opt_special') == undefined) || (!data.special && (localStorage.getItem('opt_item') == 'true') || localStorage.getItem('opt_item') == undefined)) {
        if (data.bucks == 0 || data.bits == 0) {
            core.price = 'Free'
        } else if (data.bucks > 0 && data.bits > 0) {
            core.price = data.bucks + ' Bucks & ' + data.bits + ' Bits'
        } else if (data.bits > 0) {
            core.price = data.bits + ' Bits'
        } else if (data.bucks > 0) {
            core.price = data.bucks + ' Bucks'
        } else {
            core.price = 'Not for sale'
        };

        chrome.notifications.create(data.url, {
            type: 'list',
            title: data.special ? 'New Special' : 'New Item',
            message: '',
            iconUrl: data.icon,
            items: [{
                title: data.name,
                message: ''
            }, {
                title: 'Price',
                message: core.price
            }],
            requireInteraction: true,
            isClickable: true
        }, function() {
            core.url = data.url;
            setTimeout(function() {
                chrome.notifications.clear(data.url);
            }, 30000);
        });

        if (parse(localStorage.getItem('opt_audio')) || localStorage.getItem('opt_audio') == undefined) {
            responsiveVoice.speak(data.special ? "New Special" : "New Item");
        };
    };
};