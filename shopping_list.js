class ShoppingList {

    static re = {
        // https://regex101.com/r/UuPPL1
        dishes: /## \[?(?<name>.+?)(?:\]\((?<url>[^\)]+)\))?\n+(?:(?<tags>(?:#\S+ )*#\S+)\n+)?(?:(?<pref>[+-]?\d+)\n+)?(?<descr>(?:.|\n)+?(?=\n## |\n$))/g,

        // https://regex101.com/r/kmOAfs
        ingredients: /(\[)?`(?<name>[^`]+)`(\]\((?<url>.+)\))?(?: *[-:])?/g,

        // not even in use (?)
        tags: /(?<=#)\S+/g,

        // arranges ingredients the way I go through my local shop
        order: [
            // ennen PRISMA:a
            /(cit+ari|K-supermarket|K-cit[iy]market)(?::sta)?/i,
            /[Tt]okmann?i/,
            /\bLIDL\b/,

            // PRISMA:sta
            /hammas(?:lan(?:ka|gai)|tahn|tikk)/i,
            /rosmari+ni|pi(ts|zz)amaus|la+kerinleh|timjami|kaneli|(musta.*)?pip+uri(?!.*juusto)|suola+|cur+y|(kasvis)?liemi.*ku+t|(?!^(torti|gril+i).*)mauste/i,
            /wraps|sinap+i|soijakast|salsa|tortil+.*maust|ketsup+i|rusin(?:oi|a)/i,
            /leivinpaperi|alumiinifolio|servetti/i,
            /kokis|kalja|olu[et]|pepsi|mehu/i,
            /(?:talous|vessa|p(?:\*+|a)ska)paperi/i,
            /banaani|omena|mandariini|sien(i|et)|vi+nirypä+le+|hedelmä|sitru+na|ru+suka+l/i,
            /(?<!peruna-)sipuli|perun(a|oi)(?!.*(?:lastu|sipuli))|parsa.*ka+li|pork+ana|sala+t+i|^(?!^wok.*)vihan+ek?s|bata+t+i|tomaatti(?!.*murska)|paprika/i,
            /(?!^ko+kos.*)(?:mai[dt]o|kerma)|voi|jogh?urt|hi+va|creme fraiche/i,
            /(?!^veke)juusto|(koskenlask)?.+dip+i?|hallou?m|cheddar/i,
            /liha|kana(?!.*muna)|mifu|possu.*suikale/i,
            /\b(?:kirjo)?loh(?:i|en|ta)\b/i,
            /karjalanpa/i,
            /kalk+una|kink+u/i,
            /pi(?:zz|ts)a|ri+sipi+rak+a/i,
            /muna|oliivi|tomaattimurska|ananas|kookosmai[dt]o|pikkukurkut/i,
            /perunalastu|pähkinä|sipsi|hampparikastike/i,
            /lei[pv]ä|sämpylä/i,
            /nu+deli|makaroni|soija.*r.*h|ri+si|öljy/i,
            /vehnäja|muro|mysli/i,
            /uncle ben/i,
            /sokeri/i,
            /hernek/i,
            /suklaa|kark+i/i,
            /pakaste|jätski|jäätelö|wok+ivihan+e|peruna.*sipuli|sei[dt]i|mais+i|ben.*jer+y/i,

            // HESBURGER
            /vekeju+sto/i
        ],
    }


    static store(name, obj) {
        localStorage.setItem(name, JSON.stringify(obj))
    }

    // gets the previous conf, overrides by querystring
    static parse(name, check_qs = true) {
        if (check_qs && this.url_params.has(name)) {
            this.reset_qs = true;

            const res = this.url_params.get(name).split(",");
            this.store(name, res);
            return res;
        }
        const conf = JSON.parse(localStorage.getItem(name));
        return conf ? conf : [];
    }

    // randomly re-picks dishes
    static shuffle() {
        const rec_len = this.recipies.length;
        let n = this.dish_indices.length;
        if (n == 0) {
            n = 3
        }
        for (const i of this.dish_indices) {
            this.rm_dish(i, false);
        }
        this.dish_indices.length = 0;
        for (let i = 0; i < n && i < rec_len - 1; i++) {
            let j;
            do {
                j = Math.floor(Math.random() * rec_len);
            } while (this.dish_indices.includes(j) || this.recipies[j].tags.includes("dessert"));
            this.dish_indices.push(j);
            this.add_dish(j);
        }
        this.store("dishes", this.dish_indices);
    }

    static create_btn(name, deletable = false) {

        const btn = document.createElement("button");

        if (deletable) {
            const span1 = document.createElement("span");
            span1.innerText = name;
            btn.appendChild(span1);

            const span2 = document.createElement("span");
            span2.innerText = "DEL";
            btn.appendChild(span2);

        } else {
            btn.innerText = name;
        }

        return btn;
    }

    static add_dish(dish_idx) {

        const dish = this.recipies[dish_idx];
        const btn = this.create_btn(dish.name, true);
        btn.dish_idx = dish_idx;
        this.div_dishes.appendChild(btn);

        // paragraph containing instructions
        const p_dish_instr = document.createElement('p');
        p_dish_instr.innerHTML = this.md_html_conv.makeHtml(dish.instructions);

        // div responsible for hiding/showing its child paragraph
        const div_dish_instr = document.createElement("div");
        div_dish_instr.setAttribute("class", "dish-instr");
        div_dish_instr.appendChild(p_dish_instr);
        this.div_dishes.appendChild(div_dish_instr);

        for (const mo_ingr of dish.ingredients) {
            this.add_item(mo_ingr.groups.name, dish_idx);
        }
    }

    static rm_dish(dish_idx, splicing = true) {
        if (splicing) {
            this.dish_indices.splice(
                this.dish_indices.indexOf(dish_idx), 1);
            this.store("dishes", this.dish_indices);
        }

        for (const item of this.recipies[dish_idx].ingredients) {
            this.rm_item(item.groups.name, dish_idx);
        }

        for (const dish of this.div_dishes.childNodes) {
            if (dish.dish_idx == dish_idx) {
                // instructions in the collapsible
                this.div_dishes.removeChild(dish.nextSibling);

                // the always-visible button itself
                this.div_dishes.removeChild(dish);
            }
        }
    }

    static get_item_order(name) {
        for (const [i, regex] of this.re.order.entries()) {
            if (name.match(regex)) {
                return i + 1;
            }
        }
        return 0
    }

    static add_item(item, dish_idx = -1) {
        const order = this.get_item_order(item);
        const dish = dish_idx > -1 ? this.recipies[dish_idx] : null;
        const new_btn = this.create_btn(
            (order == 0 ? "TUNTEMATON: " : "")
            + item
            + (dish ? ` (${dish.name})` : ''),
            dish_idx == -1
        );
        new_btn.order = order;
        new_btn.item_name = item;
        // deletion happens based on this, possible bug:
        // when multiple identical dishes are present, removing 1 would delete ALL ingredients
        new_btn.dish_idx = dish_idx;

        for (const existing_btn of this.div_items.childNodes) {
            if (order <= existing_btn.order) {
                this.div_items.insertBefore(new_btn, existing_btn);
                return;
            }
        }

        // on 1st run and on new largest `order` nro
        this.div_items.appendChild(new_btn);
    }

    static rm_item(item_name, dish_idx = -1) {
        for (const itemNode of this.div_items.childNodes) {
            if (itemNode.item_name == item_name && itemNode.dish_idx == dish_idx) {
                this.div_items.removeChild(itemNode);
            }
        }
    }

    static main(recipies_md) {
        this.recipies = Array.from(recipies_md
            .matchAll(this.re.dishes))
            .map(mo_dish => {
                const name = mo_dish.groups.name;
                const tags = Array.from((mo_dish.groups.tags
                    ? mo_dish.groups.tags
                    : ''
                ).matchAll(this.re.tags)).map(mo_tag => mo_tag[0]);
                const preference = parseInt(mo_dish.groups.pref);

                // removing only the code blocks and possibly merge conjugated suffix
                const instructions = mo_dish.groups.descr.replaceAll(this.re.ingredients, "$1$2$3");
                const ingredients = Array.from(mo_dish.groups.descr.matchAll(this.re.ingredients));
                return { name, tags, preference, instructions, ingredients }
            })
            .sort((a, b) => {
                const left = a.name.substring(3);
                const right = b.name.substring(3);

                if (left < right) return -1;
                if (left > right) return 1;
                return 0;
            });

        this.build_modal_dishes();

        for (const i of this.dish_indices) {
            this.add_dish(i);
        }

        for (const extra of this.extra_items) {
            this.add_item(extra);
        }

        this.activate_items();

        this.div_items.addEventListener('click', ev => {

            if (ev.target.innerText == 'DEL') {
                const item = ev.target.parentNode.item_name;
                if (confirm(`Poistetaanko tavaraa "${item}"?`)) {
                    this.extra_items.splice(this.extra_items.indexOf(item), 1);
                    this.store("items", this.extra_items);
                    this.rm_item(item);
                }
            } else {
                (ev.target.tagName == 'BUTTON'
                    ? ev.target
                    : ev.target.parentNode
                ).classList.toggle('active');
                this.store_item_states();
            }
        });

        this.div_items_observer.observe(this.div_items, {
            childList: true,
            subtree: true
        });

        this.div_dishes.addEventListener('click', ev => {

            if (ev.target.innerText == 'DEL') {
                if (confirm(`Poistetaanko ateriaa "${this.recipies[ev.target.parentNode.dish_idx].name
                    }"?`)) {
                    this.rm_dish(ev.target.parentNode.dish_idx);
                }
            }

            // collapsible under this button getting opened
            else {
                const node = ev.target.tagName == 'SPAN'
                    ? ev.target.parentNode
                    : ev.target,
                    nes = node.nextElementSibling;

                if (nes.style.maxHeight) {
                    nes.style.maxHeight = null;
                } else {
                    nes.style.maxHeight = nes.scrollHeight + "px";
                }
            }
        });
    }

    static build_modal_dishes() {

        const div = document.createElement('div');

        for (const [dish_idx, recipie] of this.recipies.entries()) {
            const btn = this.create_btn(`${dish_idx}: ${recipie.name}`, false);
            btn.dish_idx = dish_idx;
            div.appendChild(btn);
        }

        this.div_dish_picker.appendChild(div);

        this.div_dish_picker.addEventListener("click", ev => {
            if (ev.target.tagName == 'BUTTON') {
                this.dish_indices.push(ev.target.dish_idx);
                this.store("dishes", this.dish_indices);
                this.add_dish(ev.target.dish_idx);
            }
            // hiding the modal
            this.div_dish_picker.style.visibility = 'hidden';
        });
    }

    static new_dish() {
        this.div_dish_picker.style.visibility = 'visible';
    }

    static new_item() {
        const item = window.prompt("enter item name");
        if (item != '' && item != null) {
            this.extra_items.push(item);
            this.store("items", this.extra_items);
            this.add_item(item);
        }
    }

    static activate_items() {
        const item_btns = Array.from(document.querySelectorAll('#items>button'));
        const checked_indices = localStorage.getItem('item_states');
        if (checked_indices) {
            for (const i of JSON.parse(checked_indices)) {
                item_btns[i].classList.add('active');
            }
        }
    }

    static deactivate_items() {
        if (confirm('are you sure you?')) {
            for (const btn of document.querySelectorAll('#items>button.active')) {
                btn.classList.remove('active');
            }
            this.store_item_states(true);
        }
    }

    static store_item_states(reset = false) {
        localStorage.setItem('item_states', reset ? '[]'
            : JSON.stringify(Array.from(document.querySelectorAll('#items>button.active'))
                .map(btn => Array.prototype.indexOf.call(this.div_items.childNodes, btn))
            )
        );
    }

    /**
     * WiP, want to use modals instead of window.confirm()
     * 
     * @param {string} prompt 
     * @returns 
     */
    static modal_conf(prompt) {

        const div_modal = document.createElement('div');
        div_modal.classList.add('modal');
        div_modal.style.visibility = 'visible';

        const div_modal_content = document.createElement('div');
        div_modal_content.classList.add('modal-content');


        // use 2 global buttons by ID, use onclick to always override the called fn from within the Promise

        return new Promise((resolve, reject) => {
            div_modal.addEventListener('click', ev => {
                if (ev.target.tagName != 'BUTTON') {
                    reject('clicked on modal');
                } else {
                    if (ev.target.innerText == 'OK') {
                        resolve('clicked OK');
                    } else {
                        reject('clicked Cancel');
                    }
                }
            });
            setTimeout(() => {
                div_modal.style.visibility = 'hidden';
                reject('timed out');
            }, 1000);
        });
    }

    static {

        document.querySelector('div#shopping-list > div#controls')
            .addEventListener('click', ({ target: { innerText } }) => {
                switch (innerText) {
                    case "Pyyhki vihreät":
                        this.deactivate_items();
                        break;

                    case "Arvo ateriat":
                        this.shuffle()
                        break;

                    case "+ ateriaa":
                        this.new_dish()
                        break;

                    case "+ kamaa":
                        this.new_item()
                        break;
                }

            });

        const qs = window.location.hash.match(/\?.+/)
        this.url_params = new URLSearchParams(qs ? qs[0] : '');

        this.div_dish_picker = document.getElementById("dish-picker");
        this.div_dishes = document.getElementById("dishes");
        this.div_items = document.getElementById("items");
        this.div_items_observer = new MutationObserver((mutations, _obs) => {
            // this.rm_dish() removes `n` children from this.div_items, they appear here in a batch
            if (mutations.some(m => m.type === 'childList')) {
                this.store_item_states();
            }
        });

        this.reset_qs = false;
        this.dish_indices = this.parse("dishes");
        this.extra_items = this.parse("items");
        if (this.reset_qs) window.location.hash = "#shopping-list";

        this.recipies;
        this.md_html_conv = new showdown.Converter();

        fetch('recipies/README.md').then(res =>
            res.text().then(rcpts => this.main(rcpts))
        );

    }
}
