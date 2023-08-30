function visitor_countdown() {
    setTimeout(_ => {
        const
            MIN = 60,
            HOURS = 60 * MIN,
            DAYS = 24 * HOURS,
            diff = Math.floor((new Date(visitors[0][1]) - new Date()) / 1000),
            d = Math.floor(diff / DAYS),
            h = Math.floor((diff % DAYS) / HOURS),
            m = Math.floor((diff % HOURS) / MIN),
            s = diff % 60;

        if (view() == 'about') {
            if (diff > 0) {
                spn_vstr.textContent = ` ${d} nap ${h}:${m}:${s} múlva`;
                visitor_countdown();
            } else {
                spn_vstr.parentNode.classList.add('hu');
                spn_vstr.parentNode.innerHTML = `${visitors[0][0]} IN DA HOUSE!!!!`;
            }
        }
    }, 1000);
}

const spn_vstr = document.querySelector('span#visitor-text');
const visitors = [['Bálint + dr. NŐ', '2023-09-01T06:30:00Z', 'hu']]
