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

    /*if (view == 'about') {
        visitor_countdown();
    }*/
}

const view = (hash = null) => (x = (hash ? hash : window.location.hash).match(/(?<=#)[\w-]+/))
    ? x[0]
    : 'about';

// upon clicking the nav buttons
document.querySelector('nav')
    .addEventListener('click', ({ target: { hash, tagName, textContent } }) => {

        if (tagName != 'A') return;

        // share button is clicked, set QR, show modal
        if (textContent == 'Share') new QRCode();

        // simply change view
        else chg_view(view(hash));

    });

// upon refreshing the page or opening the page from a link
document.addEventListener("DOMContentLoaded", _ => {
    chg_view(view());
});

const FAVICONS = {
    'shopping-list': '🛒',
    'battery-monitor': '🔋',
    'lyrics': '🎶',
}
