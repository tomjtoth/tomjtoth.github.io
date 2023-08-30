class QRCode {
    static div_qr = document.querySelector('div#qr-code');
    static img_qr = document.querySelector('div#qr-code>div>img');

    static {
        this.div_qr.addEventListener('click', ({ target: { tagName } }) => {
            if (tagName == 'DIV') {
                this.div_qr.setAttribute('hidden', 'hidden');
                this.div_qr.style.visibility = 'hidden';
            } else if (tagName == 'BUTTON') {
                // copy to clipboard
            }
        })
    }

    constructor() {
        const path = view();

        fetch(`https://api.qrserver.com/v1/create-qr-code/?data=https://tomjtoth.github.io${path
            ? '%23' + path + (
                path == 'shopping-list'
                    ? '%3Fdishes='
                    + JSON.stringify(dish_indices).replaceAll(/[\[\]"]/g, '')
                    + '%26items='
                    + JSON.stringify(extra_items).replaceAll(/[\[\]"]/g, '')
                    : ''
            )
            : ''}`)
            .then(res => res.blob())
            .then(img => {
                QRCode.img_qr.src = URL.createObjectURL(img);

                // show the QR modal
                QRCode.div_qr.removeAttribute('hidden');
                QRCode.div_qr.style.visibility = 'visible';

            })
            .catch(err => alert(`failed to fetch QR code: "${err}"`))
    }

}
