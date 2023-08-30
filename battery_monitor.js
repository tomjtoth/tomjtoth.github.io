class BatteryMonitor {

    static sleep = (ms = 1000 * 30) => new Promise(r => setTimeout(r, ms));

    static show_notification(body) {
        new Notification('Battery monitor', { body });
    }

    static check_permission() {
        if (!window.Notification) {
            alert('notifications are not supported');
            return false;
        } else {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then(function (p) {
                    if (p === 'granted') {
                        this.show_notification("sample notification");
                    } else {
                        alert('notifications are blocked');
                        return false;
                    }
                });
            }
        }
        return true;
    }

    static async start_monitoring() {
        while (this.running && this.stop_requests == 0) {
            try {
                let { charging, level, chargingTime, dischargingTime } = await navigator.getBattery();
                level *= 100;

                if (charging && level >= this.max.value && chargingTime != Infinity
                    || !charging && level <= this.min.value && dischargingTime != Infinity) {
                    this.show_notification(`Current level: ${level}%`);
                    // sleep twice
                    await sleep();
                }
                await sleep();
            } catch {
                // unsupported browser
                this.running = false;
                alert('getBattery() failed, stopped script');
            }
        }
        this.stop_requests--;
    }

    static toggle({ target }) {
        this.running = !this.running;
        target.innerText = !this.running ? 'start' : 'stop'

        if (!this.running) {
            this.stop_requests++;
        } else {
            if (this.check_permission()) {
                this.start_monitoring();
            }
        }

    }

    static running = false;
    static stop_requests = 0;
    static autostart = (localStorage.getItem('autostart') === 'true');

    static min = document.querySelector('div#battery-monitor input[name=minimum]');
    static max = document.querySelector('div#battery-monitor input[name=maximum]');

    static {
        // restore previously used values
        this.min.value = localStorage.getItem('minimum') || 20;
        this.max.value = localStorage.getItem('maximum') || 80;


        const div = document.querySelector('div#battery-monitor');

        div.addEventListener('click', ({ target }) => {

            if (target.tagName !== 'BUTTON') return;

            if (target.innerText == 'start') {
                this.toggle(target);
            }

            else {
                this.autostart = !this.autostart;
                localStorage.setItem('autostart', this.autostart);
                alert(`Autostart is now set to: ${this.autostart}`);
            }
        });

        div.addEventListener('change', ({ target: { name, value, tagName } }) => {
            if (tagName == 'SELECT') localStorage.setItem(name, value);
        });

        if (this.autostart) this.toggle();

    }
}
