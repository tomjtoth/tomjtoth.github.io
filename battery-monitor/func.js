function notify(level) {

    function __show_notification() {
        new Notification('Battery monitor', {
            body: `Current level: ${level}%`
        });
    }

    if (!window.Notification) {
        alert('your browser does not support desktop notifications');
    } else {
        if (Notification.permission === 'granted') {
            __show_notification()
        } else {
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    __show_notification()
                } else {
                    alert('you blocked notifications')
                }
            })
        }
    }
}

let lower = localStorage.getItem('lower');
if (typeof lower === 'undefined' ) {
    lower = 20;
}

document.getElementById('start')
.addEventListener('click', _ => {
    alert('clicked start')
});

document.getElementById('stop')
.addEventListener('click', _ => {
    notify(30);
});

