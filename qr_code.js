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


/* example

<div class="share">
    <button title="share via QR code or clipboard">🔗</button>
    <img src="https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&amp;size=100x100" alt="QR code"/>
</div>
*/
