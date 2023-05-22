function store(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj))
}

// gets the previous conf, overrides by querystring
function parse(name, check_qs = true) {
    if (check_qs && urlParams.has(name)) {
        reset_qs = true;

        const res = urlParams.get(name).split(",");
        store(name, res);
        return res;
    }
    const conf = JSON.parse(localStorage.getItem(name));
    return conf ? conf : [];
}

// randomly re-picks dishes
function shuffle() {
    let n = dish_indices.length;
    if (n == 0) {
        n = 3
    }
    dish_indices.length = 0;
    for (let i = 0; i < n; i++) {
        let j;
        do {
            j = Math.floor(Math.random() * recipies.length);
        } while (dish_indices.includes(j) || recipies[j].tags.includes('dessert'));
        dish_indices.push(j);
    }
    store('dishes', dish_indices);
    build();
}

// builds the dishes and items divs
function build() {

    // shoves the item in it's ordered place
    function assign(name, dish = null) {
        let found = false;
        for (const [j, regex] of the_order.entries()) {
            if (name.match(regex)) {
                if (!items[j+1]) {
                    items[j+1] = []
                }

                items[j+1].push({name, dish});
                found = true;
                break;
            }
        }
        if (!found) {
            items[0].push({name, dish})
        }
    }

    function create_item_row(item, row_nro) {

        const item_btn = document.createElement('button');
        item_btn.item = item;

        item_btn.innerText = (row_nro == 0 ? "TUNTEMATON: " : "")
            + item.name
            + (item.dish ? ` (${item.dish})` : "");

        if (item.dish) {
            item_btn.setAttribute('class', alternating++ % 2 == 0
                ? 'ingr_btn'
                : 'ingr_btn2');
            item_btn.addEventListener('click', function() {
                this.classList.toggle('active');
            });

            return item_btn;
        }

        // below starts an item button not related to a dish

        item_btn.setAttribute('class', alternating++ % 2 == 0
            ? 'item_btn'
            : 'item_btn2');
        item_btn.addEventListener('click', function() {
            this.classList.toggle('active');
            this.nextElementSibling.classList.toggle('active');
        });

        const item_btn_rm = document.createElement('button');
        item_btn_rm.innerText = "DEL";

        item_btn_rm.setAttribute('class', alternating++ % 2 == 0
            ? 'item_btn_rm'
            : 'item_btn_rm2');
        item_btn_rm.addEventListener('click', function() {
            item = this.previousElementSibling.item;
            extra_items.splice(extra_items.indexOf(item.name), 1);
            store("items", extra_items);

            // removing the parent div from the rendered page
            this.parentElement.parentElement
                .removeChild(this.parentElement);
        });

        const item_div = document.createElement('div');

        item_div.appendChild(item_btn);
        item_div.appendChild(item_btn_rm);

        return item_div;
    }

    // drop all current entries
    html_dishes.innerHTML = '';
    html_ingredients.innerHTML = '';

    // indice 0 is for UNSORTED items
    const items = [[]];
    items.length = the_order.length + 1;

    let alternating = 0;

    for (const i of dish_indices) {

        const dish = recipies[i];

        // clickable button as name of dish
        const dish_btn = document.createElement('button');
        dish_btn.innerText = dish.name;

        // TODO: get rid of 2 different classes and simply make bg-color darker a bit via JS
        dish_btn.setAttribute('class', alternating++ % 2 == 0 ? 'dish_btn' : 'dish_btn2');

        dish_btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
        html_dishes.appendChild(dish_btn);

        // paragraph containing instructions
        const dish_p = document.createElement('p');
        dish_p.innerText = dish.instructions.replace(/^( *)1\. /mg, "$1- ");

        // div responsible for hiding/showing its child paragraph
        const dish_div = document.createElement('div');
        dish_div.setAttribute('class', 'dish_div');
        dish_div.appendChild(dish_p);
        html_dishes.appendChild(dish_div);


        for (const mo_ingr of dish.ingredients) {
            assign(mo_ingr.groups.name, dish.name)
        }
    }

    for (const extra of extra_items) {
        assign(extra)
    }

    for (const [row_nro, row_in_shop] of items.entries()) {
        // items as an Array might include unvisited rows
        if (!row_in_shop) continue;

        for (const item of row_in_shop) {
            html_ingredients.appendChild(create_item_row(item, row_nro));
        }
    }
}

function main([recipies_md]) {
    recipies = Array.from(recipies_md
    .matchAll(re_dishes))
    .map(mo_dish => {
        const name = mo_dish.groups.name;
        const tags = Array.from((mo_dish.groups.tags
            ? mo_dish.groups.tags
            : ''
        ).matchAll(re_tags)).map(mo_tag => mo_tag[0]);
        const preference = parseInt(mo_dish.groups.pref);
        const instructions = mo_dish.groups.descr.replace(re_ingredients, '$1');
        const ingredients = Array.from(mo_dish.groups.descr.matchAll(re_ingredients));
        return {name, tags, preference, instructions, ingredients}
    });

    if (dish_indices.length > 0) {
        build();
    } else {
        shuffle();
    }
}

function add_extra_item() {
    const item = window.prompt("enter item name");
    if (item != null) {
        extra_items.push(item);
        store("items", extra_items);
        build();
    }
}

const urlParams = new URLSearchParams(window.location.search);

const html_ingredients = document.getElementById('items');
const html_dishes = document.getElementById('dishes');

var reset_qs = false;
const dish_indices = parse("dishes");
const extra_items = parse("items");
if (reset_qs) window.location.search = "";

const checked_items = parse("checked_items", false);

var recipies;
