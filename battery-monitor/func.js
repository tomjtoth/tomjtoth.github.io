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
                    alert('notifications are blocked');
                    return false;
                }
            });
        }
    }
    return true;
}

async function start_monitoring() {
    while (running && async_stopper == 0) {
        try {
            let {charging, level, chargingTime, dischargingTime} = await navigator.getBattery();
            level *= 100;

            if (charging && level >= maximum.value && chargingTime != Infinity
            || !charging && level <= minimum.value && dischargingTime != Infinity) {
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
    async_stopper--;
}

const start_stop = document.getElementById('start-stop');
start_stop.addEventListener('click', ev => {
    running = !running;
    ev.target.innerText = !running ? 'start' : 'stop'
    
    if (!running) {
        async_stopper++;

    } else {
        if (check_permission())  {
            start_monitoring();
        }
    }
});

const minimum = document.getElementById('minimum');
const min_val = localStorage.getItem('minimum');
if (min_val) {
    minimum.value = min_val;
}
minimum.addEventListener('change', ev => {
    localStorage.setItem('minimum', ev.target.value);
});

const maximum = document.getElementById('maximum');
const max_val = localStorage.getItem('maximum');
if (max_val) {
    maximum.value = max_val;
}
maximum.addEventListener('change', ev => {
    localStorage.setItem('maximum', ev.target.value);
});

let running = false,
    async_stopper = 0,
    autostart = localStorage.getItem('autostart');

document.getElementById('autostart')
.addEventListener('click', _ => {
    autostart = !autostart;
    localStorage.setItem('autostart', autostart);
    alert(`Autostart is now set to: ${autostart}`);
});

if (autostart === 'true') {
    autostart = true;
    start_stop.click();
} else {
    autostart = false;
}
