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
        while (this.state == 1) {
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
                this.state = 0;
                alert('getBattery() failed, stopped script');
            }
        }
        this.state = 0;
    }

    static toggle(target) {
        this.state++;
        target.innerText = this.state != 1 ? 'start' : 'stop'

        if (this.state == 0 && this.check_permission()) {
            this.start_monitoring();
        }
    }

    /// 0 -> NOT running
    /// 1 -> running
    /// 1+ -> wanna stop
    static state = parseInt(localStorage.getItem('state') || 0);
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
                const autostart = 1 - parseInt(localStorage.getItem('state') || 0);
                localStorage.setItem('state', autostart);
                target.innerText = (autostart == 1 ? 'disable' : 'enable') + ' autostart';
            }

            else {
                this.toggle(target);
            }
        });

        div.addEventListener('change', ({ target: { name, value, tagName } }) => {
            if (tagName == 'INPUT') localStorage.setItem(name, value);
        });

        if (this.state == 1)
            this.toggle(document.querySelector('div#battery-monitor button'));

    }
}
