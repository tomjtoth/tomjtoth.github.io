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
                Notification.requestPermission().then((p) => {
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


    // TODO: restore and improve the stop_request counter as this might result in multiple while loops in parallel
    static async start_monitoring() {
        while (this.running) {
            try {
                const { charging, level, chargingTime, dischargingTime } = await navigator.getBattery();
                const lv100 = Math.round(100 * level);

                if (charging && lv100 >= this.max.value && chargingTime != Infinity
                    || !charging && lv100 <= this.min.value && dischargingTime != Infinity) {
                    this.show_notification(`Current level: ${lv100}%`);
                    // sleep twice
                    await this.sleep();
                }
                await this.sleep();
            } catch {
                // unsupported browser
                this.running = false;
                alert('getBattery() failed, stopped script');
            }
        }
    }

    static toggle(target) {
        this.running = !this.running;
        target.innerText = !this.running ? 'start' : 'stop'

        if (this.running && this.check_permission()) {
            this.start_monitoring();
        }
    }

    static running = (localStorage.getItem('running') === 'true');
    static min = document.querySelector('div#battery-monitor input[name=minimum]');
    static max = document.querySelector('div#battery-monitor input[name=maximum]');

    static {
        // restore previously used values
        this.min.value = localStorage.getItem('minimum') || 20;
        this.max.value = localStorage.getItem('maximum') || 80;

        const div = document.querySelector('div#battery-monitor');

        div.addEventListener('click', ({ target }) => {

            if (target.tagName !== 'BUTTON') return;

            if (target.innerText.endsWith('autostart')) {
                const autostart = localStorage.getItem('running') === 'true';
                localStorage.setItem('running', !autostart);
                target.innerText = (!autostart ? 'disable' : 'enable') + ' autostart';
            }

            else {
                this.toggle(target);
            }
        });

        div.addEventListener('change', ({ target: { name, value, tagName } }) => {
            if (tagName == 'INPUT') localStorage.setItem(name, value);
        });

        if (this.running) {

            // triggering ideal condition for autostart
            this.running = false;
            this.toggle(document.querySelector('div#battery-monitor button'));
        }

    }
}
