const sleep = (ms = 1000*30) => new Promise(r => setTimeout(r, ms));

function notify(level) {

    function __show_notification(body) {
        new Notification('Battery monitor', { body });
    }

    if (!window.Notification) {
        alert('notifications are not supported');
    } else {
        if (Notification.permission === 'granted') {
            __show_notification(`Current level: ${level}%`);
        } else {
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    __show_notification(`Current level: ${level}%`);
                } else {
                    alert('notifications are blocked')
                }
            });
        }
    }
}

async function start_monitoring() {
    while (running) {
        try {
            let {charging, level, dischargingTime} = await navigator.getBattery();
            level *= 100;

            if (charging && level >= upper.value && dischargingTime != Infinity
            || !charging && level <= lower.value) {
                notify(level);
                // sleep twice
                await sleep();
            }
            await sleep();
        } catch {
            // unsupported browser or battery removed (?)
            running = false;
            alert('getBattery() failed, stopped script');
        }
    }
}

document.getElementById('start')
.addEventListener('click', _ => {
    if (running) return;

    running = true;
    start_monitoring();
});

document.getElementById('stop')
.addEventListener('click', _ => {
    running = false;
});

const lower = document.getElementById('lower');
const lower_val = localStorage.getItem('lower');
if (lower_val) {
    lower.value = lower_val;
}
lower.addEventListener('change', ev => {
    localStorage.setItem('lower', ev.target.value);
});

const upper = document.getElementById('upper');
const upper_val = localStorage.getItem('upper');
if (upper_val) {
    upper.value = upper_val;
}
upper.addEventListener('change', ev => {
    localStorage.setItem('upper', ev.target.value);
});

let running = false;

let autostart = localStorage.getItem('autostart');
if (autostart === 'true') {
    running = true;
    autostart = true;
    start_monitoring();
} else {
    autostart = false;
}

document.getElementById('autostart')
.addEventListener('click', _ => {
    autostart = !autostart;
    localStorage.setItem('autostart', autostart);
    alert(`Autostart is now set to: ${autostart}`);
});
