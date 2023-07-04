const sleep = (ms = 1000*3) => new Promise(r => setTimeout(r, ms));

function notify(level) {

    function __show_notification(body) {
        new Notification('Battery monitor', { body });
    }

    if (!window.Notification) {
        alert('your browser does not support desktop notifications');
    } else {
        if (Notification.permission === 'granted') {
            __show_notification(`Current level: ${level}%`);
        } else {
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    __show_notification(`Current level: ${level}%`);
                } else {
                    alert('you blocked notifications')
                }
            });
        }
    }
}

document.getElementById('start')
.addEventListener('click', async _ => {
    if (running) return;

    running = true;

    while (running) {
        try {
            const bat = await navigator.getBattery();

            if (bat.charging && bat.level >= upper.value/100
            || !bat.charging && bat.level <= lower.value/100) {
                notify(bat.level);
                await sleep();
            }
        } finally {
            await sleep();
        }
    }
});

document.getElementById('stop')
.addEventListener('click', _ => {
    running = false;
});

const lower = document.getElementById('lower');
lower.addEventListener('change', ev => {
    localStorage.setItem('lower', ev.target.value);
})

const upper = document.getElementById('upper');
upper.addEventListener('change', ev => {
    localStorage.setItem('upper', ev.target.value);
})

let running = false;
