class Visitor {

    constructor() {
        setTimeout(_ => {
            const
                MIN = 60,
                HOURS = 60 * MIN,
                DAYS = 24 * HOURS,
                diff = Math.floor((new Date(Visitor.visitors[0][1]) - new Date()) / 1000),
                d = Math.floor(diff / DAYS),
                h = Math.floor((diff % DAYS) / HOURS),
                m = Math.floor((diff % HOURS) / MIN),
                s = diff % 60;

            if (view() == 'about') {
                if (diff > 0) {
                    this.spn_vstr.textContent = ` ${d} nap ${h}:${m}:${s} múlva`;
                    new Visitor();
                } else {
                    this.spn_vstr.parentNode.classList.add('hu');
                    this.spn_vstr.parentNode.innerHTML = `${this.visitors[0][0]} IN DA HOUSE!!!!`;
                }
            }
        }, 1000);
    }

    static spn_vstr = document.querySelector('span#visitor-text');
    static visitors = [['Bálint + dr. NŐ', '2023-09-01T06:30:00Z', 'hu']]

}
