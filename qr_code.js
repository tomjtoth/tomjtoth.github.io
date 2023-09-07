class QRCode {
    static div_qr = document.querySelector('div#qr-code');
    static img_qr = document.querySelector('div#qr-code>div>img');

    static {
        this.div_qr.addEventListener('click', ({ target: { tagName } }) => {
            if (tagName == 'DIV') {
                this.div_qr.setAttribute('hidden', 'hidden');
                this.div_qr.style.visibility = 'hidden';
            } else if (tagName == 'BUTTON') {
                navigator.clipboard.writeText(this.url(false));
            }
        })
    }

    /**
     * escape3 as in '&', '#', '?'
     * 
     * @param {boolean} escape3 
     * @returns 
     */
    static url(escape3 = true) {
        const path = view();

        let res = 'https://tomjtoth.github.io';

        if (path.length > 0)
            res += '/#' + path;

        if (path == 'shopping-list') {
            const x = [];
            if (ShoppingList.dish_indices.length > 0) {
                x.push('dishes='
                    + JSON.stringify(ShoppingList.dish_indices).replaceAll(/[\[\]"]/g, ''))
            }

            if (ShoppingList.extra_items.length > 0) {
                x.push('items='
                    + JSON.stringify(ShoppingList.extra_items).replaceAll(/[\[\]"]/g, ''))
            }

            if (x.length > 0)
                res += '?' + x.join('&');
        }

        if (!escape3) return res;

        return res
            .replace('#', '%23')
            .replace('?', '%3F')
            .replace('&', '%26');
    }

    constructor() {

        fetch('https://api.qrserver.com/v1/create-qr-code/?data=' + QRCode.url())
            .then(res => res.blob())
            .then(img => {
                QRCode.img_qr.src = URL.createObjectURL(img);

                // show the QR modal
                QRCode.div_qr.removeAttribute('hidden');
                QRCode.div_qr.style.visibility = 'visible';
            })
            .catch(err => alert(`failed to fetch QR code: "${err}"`));
    }

}
