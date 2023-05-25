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
        } while (dish_indices.includes(j) || recipies[j].tags.includes("dessert"));
        dish_indices.push(j);
    }
    store("dishes", dish_indices);
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

        const btn_item = document.createElement('button');
        btn_item.item = item;

        btn_item.innerText = (row_nro == 0 ? "TUNTEMATON: " : "")
            + item.name
            + (item.dish ? ` (${item.dish})` : "");

        // shall not be removable, since it's part of the recipie
        // hence own class
        if (item.dish) {
            btn_item.setAttribute('class', `btn-ingr-${++row_parity % 2}`);
            btn_item.addEventListener('click', function() {
                this.classList.toggle('active');
            });

            return btn_item;
        }

        // below starts an item button not related to a dish

        btn_item.setAttribute('class', `btn-item-${++row_parity % 2}`);
        btn_item.addEventListener('click', function() {
            this.classList.toggle('active');
            this.nextElementSibling.classList.toggle('active');
        });

        const btn_item_rm = document.createElement('button');
        btn_item_rm.innerText = "DEL";

        // alternating not incremented, because it is in the same row
        btn_item_rm.setAttribute('class', `btn-item-rm-${row_parity % 2}`);
        btn_item_rm.addEventListener('click', function() {
            item = this.previousElementSibling.item;
            extra_items.splice(extra_items.indexOf(item.name), 1);
            store("items", extra_items);

            // removing the parent div from the rendered page
            this.parentElement.parentElement
                .removeChild(this.parentElement);
        });

        const div_item = document.createElement('div');

        div_item.appendChild(btn_item);
        div_item.appendChild(btn_item_rm);

        return div_item;
    }

    // drop all current entries
    div_dishes.innerHTML = '';
    div_items.innerHTML = '';

    // indice 0 is for UNSORTED items
    const items = [[]];
    items.length = the_order.length + 1;

    let row_parity = 0;

    for (const i of dish_indices) {

        const dish = recipies[i];

        // clickable button as name of dish
        const btn_dish = document.createElement("button");
        btn_dish.innerText = dish.name;
        
        btn_dish.setAttribute("class", `btn-dish-${++row_parity % 2}`);
        btn_dish.addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.parentElement.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });

        const btn_dish_rm = document.createElement("button");
        btn_dish_rm.innerText = "DEL";
        btn_dish_rm.dish_index = i;

        btn_dish_rm.setAttribute("class", `btn-dish-rm-${row_parity % 2}`);
        btn_dish_rm.addEventListener("click", function() {
            dish_indices.splice(
                dish_indices.indexOf(this.dish_index), 1);
            store("dishes", dish_indices);
            build();
        });

        const div_dish_row = document.createElement("div");
        div_dish_row.appendChild(btn_dish);
        div_dish_row.appendChild(btn_dish_rm);
        div_dishes.appendChild(div_dish_row);

        // paragraph containing instructions
        const p_dish_instr = document.createElement('p');
        p_dish_instr.innerText = dish.instructions.replace(/^( *)1\. /mg, "$1- ");

        // div responsible for hiding/showing its child paragraph
        const div_dish_instr = document.createElement('div');
        div_dish_instr.setAttribute('class', 'div-dish-instr');
        div_dish_instr.appendChild(p_dish_instr);
        div_dishes.appendChild(div_dish_instr);

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
            div_items.appendChild(create_item_row(item, row_nro));
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
        const instructions = mo_dish.groups.descr.replace(re_ingredients, "$1");
        const ingredients = Array.from(mo_dish.groups.descr.matchAll(re_ingredients));
        return {name, tags, preference, instructions, ingredients}
    })
    .sort((a, b) => {
        const left = a.name.charAt(3);
        const right = b.name.charAt(3);

        if (left < right) return -1;
        if (left > right) return 1;
        return 0;
    });

    build_modal_dishes();

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

function build_modal_dishes() {
    for (const [i, recipie] of recipies.entries()) {
        const btn_dish = document.createElement("btn");
        btn_dish.innerText = `${i}: ${recipie.name}`;
        btn_dish.dish_index = i;
        btn_dish.setAttribute("class", `btn-dish-${i % 2}`)
        btn_dish.addEventListener("click", function() {
            dish_indices.push(this.dish_index);
            store("dishes", dish_indices);
            div_modal_dishes.style.display = "none";
            build();
        });
        div_modal_dishes_content.appendChild(btn_dish);
    }
}

function add_dish() {
    div_modal_dishes.style.display = "block";
}

const urlParams = new URLSearchParams(window.location.search);

const div_items = document.getElementById("items");
const div_dishes = document.getElementById("dishes");
const div_modal_dishes = document.getElementById("modal-dishes");
const div_modal_dishes_content = document.getElementById("modal-dishes-content");


div_modal_dishes.addEventListener("click", function() {
    this.style.display = "none";
})

var reset_qs = false;
const dish_indices = parse("dishes");
const extra_items = parse("items");
if (reset_qs) window.location.search = "";

const checked_items = parse("checked_items", false);

var recipies;
