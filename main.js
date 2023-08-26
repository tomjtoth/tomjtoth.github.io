/**
 * unhides 1 view's div, hides the rest
 * 
 * @param {string} view 
 */
function toggle_divs_navs(view, navs_too = true) {
    for (const elem of document.querySelectorAll('body > div')) {
        if (elem.id == view) {
            elem.removeAttribute('hidden');
        } else {
            elem.setAttribute('hidden', '');
        }
    }
    if (navs_too) {
        for (const elem of document.querySelectorAll('nav > a')) {
            if (elem.href.endsWith(view)) {
                elem.classList.add('active');
            } else {
                elem.classList.remove('active');
            }
        }
    }
}

/**
 * (de-)activates navlinks, divs and initiates the view's init function
 *
 * @param {string} view
 */
function chg_view(view) {
    toggle_divs_navs(view);
}

function create_qr_code(parent_divs) {

    const img = document.createElement('img');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?data=${jotain}`;
    img.alt = 'QR code';

    const btn = document.createElement('button');
    btn.value = '🔗';

    const div = document.createElement('div');
    div.setAttribute('class', 'qr-code');

    div.addEventListener('click', ev => {
        if (ev.target.tagName == 'BUTTON') {
            ev.target.nextSiblingElement.style.visibility = 'visible';
        }
    });



    for (const parent_div of parent_divs) {

    }
}


// upon clicking the nav buttons
document.querySelector('nav').addEventListener('click', ev => {
    chg_view(ev.target.hash.substring(2))
});

// upon refreshing the page or opening the page from a link
document.addEventListener("DOMContentLoaded", _ => {
    const route = window.location.hash.substring(2);
    if (route !== '') chg_view(route);
});



/* example

<div class="share">
    <button title="share via QR code or clipboard">🔗</button>
    <img src="https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&amp;size=100x100" alt="QR code"/>
</div>
*/
