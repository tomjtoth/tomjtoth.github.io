const sleep = (ms = 1000*30) => new Promise(r => setTimeout(r, ms));

function show_notification(body) {
    new Notification('Battery monitor', { body });
}

function check_permission() {
    if (!window.Notification) {
        alert('notifications are not supported');
        return false;
    } else {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    show_notification("sample notification");
                } else {
                    alert('notifications are blocked')
                }
            });
        }
    }
    return true;
}

async function start_monitoring() {
    while (running) {
        try {
            let {charging, level, dischargingTime} = await navigator.getBattery();
            level *= 100;

            if (charging && level >= maximum.value 
            // battery removed
            && dischargingTime != Infinity
            || !charging && level <= minimum.value) {
                show_notification(`Current level: ${level}%`);
                // sleep twice
                await sleep();
            }
            await sleep();
        } catch {
            // unsupported browser
            running = false;
            alert('getBattery() failed, stopped script');
        }
    }
}

document.getElementById('start')
.addEventListener('click', _ => {
    if (running) return;

    running = true;
    if (check_permission()) start_monitoring();
});

document.getElementById('stop')
.addEventListener('click', _ => {
    running = false;
});

const minimum = document.getElementById('min');
const min_val = localStorage.getItem('min');
if (min_val) {
    minimum.value = min_val;
}
minimum.addEventListener('change', ev => {
    localStorage.setItem('min', ev.target.value);
});

const maximum = document.getElementById('max');
const max_val = localStorage.getItem('max');
if (max_val) {
    maximum.value = max_val;
}
maximum.addEventListener('change', ev => {
    localStorage.setItem('max', ev.target.value);
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
