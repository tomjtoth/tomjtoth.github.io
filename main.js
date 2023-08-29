/**
 * unhides 1 view's div, hides the rest
 * 
 * @param {string} view 
 */
function toggle_divs_navs(view, navs_too = true) {
    for (const elem of document.querySelectorAll('body>div')) {
        if (elem.id == view) {
            elem.removeAttribute('hidden');
        } else {
            elem.setAttribute('hidden', '');
        }
    }
    if (navs_too) {
        for (const elem of document.querySelectorAll('nav>a')) {
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
    document.title = view;
    document.querySelector('link[rel=icon]').outerHTML =
        `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${FAVICONS[view] || '❓'}</text></svg>">`

    if (view == 'about') {
        visitor_countdown();
    }
}

// upon clicking the nav buttons
document.querySelector('nav')
    .addEventListener('click', ({ target: { hash, tagName } }) => {

        if (tagName != 'A') {
            return;
        }

        // share button is clicked, set QR, show modal
        if (!hash) {
            const curr_path = window.location.hash.substring(1);

            fetch(`https://api.qrserver.com/v1/create-qr-code/?data=https://tomjtoth.github.io%23${curr_path + (
                curr_path == 'shopping-list'
                    ? '%3Fdishes='
                    + JSON.stringify(dish_indices).replaceAll(/[\[\]"]/g, '')
                    + '%26items='
                    + JSON.stringify(extra_items).replaceAll(/[\[\]"]/g, '')
                    : ''
            )}`)
                .then(res => res.blob())
                .then(img => {
                    img_qr.src = URL.createObjectURL(img);

                    // show the QR modal
                    div_qr.removeAttribute('hidden');
                    div_qr.style.visibility = 'visible';

                })
                .catch(err => alert(`failed to fetch QR code: "${err}"`))
        }

        // simply change view
        else {
            chg_view(hash.substring(1))
        }

    });

// upon refreshing the page or opening the page from a link
document.addEventListener("DOMContentLoaded", _ => {
    const route = window.location.hash.substring(1);
    chg_view(route || 'about');
});

const FAVICONS = {
    'shopping-list': '🛒',
    'battery-monitor': '🔋',
}

const div_qr = document.querySelector('div#qr-code');
const img_qr = document.querySelector('div#qr-code>div>img');

div_qr.addEventListener('click', ({ target: { tagName } }) => {
    if (tagName == 'DIV') {
        div_qr.setAttribute('hidden', 'hidden');
        div_qr.style.visibility = 'hidden';
    } else if (tagName == 'BUTTON') {
        // copy to clipboard
    }
})
