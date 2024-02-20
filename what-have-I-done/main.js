const events_ul = document.querySelector('ul#events');
const datalist_activities = document.querySelector('datalist#activities');

// load DB
const db = JSON.parse(localStorage.getItem('db') || '{}');

// initialize DB
if (!db.events) {
    db.events = [];
    db.activities = [];
}

for (let act of db.activities) {
    const opt = document.createElement('option');
    opt.value = act;
    datalist_activities.appendChild(opt);
}

// populate ul#events existing events
for (let event of db.events) {
    add_event_to_ul(event);
}

function add_event_to_ul([timestamp, activity_id, duration]) {
    const li = document.createElement('li');
    li.textContent = `${timestamp}: ${db.activities[activity_id] + (duration ? ` (${duration}min)` : '')}`
    events_ul.appendChild(li);
}

function add_event() {
    const [
        { value: datetime },
        { value: activity },
        { value: duration }
    ] = document.querySelectorAll('input');

    if (activity == '') {
        alert('activity must be set');
        return;
    }

    let activity_id = db.activities.indexOf(activity);

    if (activity_id == -1) {
        activity_id = db.activities.push(activity) - 1;
        const new_activity = document.createElement('option');
        new_activity.value = activity;
        datalist_activities.appendChild(new_activity);
    }

    const new_event = [
        datetime !== '' ? datetime : new Date().toISOString(),
        // datetime !== '' ? datetime : new Date().getTime(),
        activity_id
    ];

    if (duration) {
        new_event.push(parseInt(duration));
    }

    db.events.push(new_event);
    add_event_to_ul(new_event);

    localStorage.setItem('db', JSON.stringify(db));
}

document.body.addEventListener('click', ({ target: { tagName, id } }) => {
    if (tagName !== 'BUTTON') return;

    if (id == 'export')
        log_export();
    else if (id == 'import')
        log_import();
    else add_event()
});
