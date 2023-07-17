function store(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj))
}

// gets the previous conf, overrides by querystring
function parse(name, check_qs = true) {
    if (check_qs && url_params.has(name)) {
        reset_qs = true;

        const res = url_params.get(name).split(",");
        store(name, res);
        return res;
    }
    const conf = JSON.parse(localStorage.getItem(name));
    return conf ? conf : [];
}

// randomly re-picks dishes
function shuffle() {
    const rec_len = recipies.length;
    let n = dish_indices.length;
    if (n == 0) {
        n = 3
    }
    for (const i of dish_indices) {
        rm_dish(i, false);
    }
    dish_indices.length = 0;
    for (let i = 0; i < n && i < rec_len - 1; i++) {
        let j;
        do {
            j = Math.floor(Math.random() * rec_len);
        } while (dish_indices.includes(j) || recipies[j].tags.includes("dessert"));
        dish_indices.push(j);
        add_dish(j);
    }
    store("dishes", dish_indices);
}

function create_btn(name, onactivate, ondel = null) {

    const btn = document.createElement("button");
    btn.addEventListener("click", onactivate);

    if (ondel) {
        const span1 = document.createElement("span");
        span1.innerText = name;
        btn.appendChild(span1);

        const span2 = document.createElement("span");
        span2.innerText = "DEL";
        span2.addEventListener("click", ondel);
        btn.appendChild(span2);

    } else {
        btn.innerText = name;
    }

    return btn;
}

function add_dish(dish_idx) {

    const dish = recipies[dish_idx];
    const btn = create_btn(
        dish.name,
        function() {
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        },
        function(ev) {
            if (confirm(`Really DELETE ${dish.name}?`)) {
                rm_dish(dish_idx);
            }
            ev.stopPropagation();
        }
    );
    btn.dish_idx = dish_idx;
    div_dishes.appendChild(btn);

    // paragraph containing instructions
    const p_dish_instr = document.createElement('p');
    p_dish_instr.innerHTML = md_html_conv.makeHtml(dish.instructions);

    // div responsible for hiding/showing its child paragraph
    const div_dish_instr = document.createElement("div");
    div_dish_instr.setAttribute("class", "dish-instr");
    div_dish_instr.appendChild(p_dish_instr);
    div_dishes.appendChild(div_dish_instr);

    for (const mo_ingr of dish.ingredients) {
        add_item(
            mo_ingr.groups.name,
            get_item_order(mo_ingr.groups.name),
            dish_idx
        );

    }
}

function rm_dish(dish_idx, splicing = true) {
    if (splicing) {
        dish_indices.splice(
            dish_indices.indexOf(dish_idx), 1);
        store("dishes", dish_indices);
    }

    for (const item of recipies[dish_idx].ingredients) {
        rm_item(item.groups.name, dish_idx);
    }

    for (const dish of div_dishes.childNodes) {
        if (dish.dish_idx == dish_idx) {
            // instructions in the collapsible
            div_dishes.removeChild(dish.nextSibling);

            // the always-visible button itself
            div_dishes.removeChild(dish);
        }
    }
}

function get_item_order(name) {
    for (const [i, regex] of the_order.entries()) {
        if (name.match(regex)) {
            return i+1;
        }
    }
    return 0
}

function add_item(item, order, dish_idx = -1) {
    const dish = dish_idx > -1 ? recipies[dish_idx] : null;
    const new_btn = create_btn(
        (order == 0 ? "TUNTEMATON: " : "")
        + item
        + (dish ? ` (${dish.name})` : ''),

        function() {
            this.classList.toggle("active");
            store_item_states();
        },

        dish ? null : function(ev) {
            if (confirm(`Really DELETE ${item}?`)) {
                extra_items.splice(extra_items.indexOf(item), 1);
                store("items", extra_items);
                rm_item(item);
                item_states();
            }
            ev.stopPropagation();
        }
    );
    new_btn.order = order;
    new_btn.item_name = item;
    new_btn.dish_idx = dish_idx;

    for (const existing_btn of div_items.childNodes) {
        if (order <= existing_btn.order) {
            div_items.insertBefore(new_btn, existing_btn);
            return;
        }
    }

    // on 1st run and on new largest `order` nro
    div_items.appendChild(new_btn);
}

function rm_item(item_name, dish_idx = -1) {
    for (const itemNode of div_items.childNodes) {
        if (itemNode.item_name == item_name && itemNode.dish_idx == dish_idx) {
            div_items.removeChild(itemNode);
        }
    }
}

function main(recipies_md) {
    recipies = Array.from(recipies_md
        .matchAll(re_dishes))
        .map(mo_dish => {
            const name = mo_dish.groups.name;
            const tags = Array.from((mo_dish.groups.tags
                ? mo_dish.groups.tags
                : ''
            ).matchAll(re_tags)).map(mo_tag => mo_tag[0]);
            const preference = parseInt(mo_dish.groups.pref);

            // removing only the code blocks and possibly merge conjugated suffix
            const instructions = mo_dish.groups.descr.replaceAll(re_ingredients, "$1$2$3");
            const ingredients = Array.from(mo_dish.groups.descr.matchAll(re_ingredients));
            return {name, tags, preference, instructions, ingredients}
        })
        .sort((a, b) => {
            const left = a.name.substring(3);
            const right = b.name.substring(3);

            if (left < right) return -1;
            if (left > right) return 1;
            return 0;
        });

    build_modal_dishes();

    for (const i of dish_indices) {
        add_dish(i);
    }

    for (const extra of extra_items) {
        add_item(extra, get_item_order(extra));
    }

    activate_items();

    div_items_observer.observe(div_items, {
        childList: true,
        subtree: true
    });
}

function build_modal_dishes() {
    const modal_content = document.createElement("div");
    modal_content.setAttribute("class", "modal-content");

    for (const [i, recipie] of recipies.entries()) {
        modal_content.appendChild(create_btn(
            `${i}: ${recipie.name}`,
            function() {
                dish_indices.push(i);
                store("dishes", dish_indices);
                document.body.removeChild(div_modal_dishes);
                add_dish(i);
            }
        ));
    }
    div_modal_dishes.setAttribute("class", "modal");
    div_modal_dishes.appendChild(modal_content);
    div_modal_dishes.addEventListener("click", function() {
        document.body.removeChild(div_modal_dishes);
    });
}

function new_dish() {
    document.body.appendChild(div_modal_dishes);
}

function new_item() {
    const item = window.prompt("enter item name");
    if (item != '' && item != null) {
        extra_items.push(item);
        store("items", extra_items);
        add_item(item, get_item_order(item));
    }
}

function activate_items() {
    const item_btns = Array.from(document.querySelectorAll('#items>button'));
    for (const i of JSON.parse(localStorage.getItem('item_states'))) {
        item_btns[i].classList.add('active');
    }
}

function deactivate_items() {
    for (const btn of document.querySelectorAll('#items>button.active')) {
        btn.classList.remove('active');
    }
    store_item_states(true);
}

function store_item_states(reset = false) {
    localStorage.setItem('item_states',
        JSON.stringify(reset
            ? '[]'
            : Array.from(
                document.querySelectorAll('#items>button.active')
            ).map(btn => Array.prototype.indexOf.call(div_items.childNodes, btn))
        )
    );
}

const url_params = new URLSearchParams(window.location.search);

const div_modal_dishes = document.createElement("div");
const div_dishes = document.getElementById("dishes");
const div_items = document.getElementById("items");
const div_items_observer = new MutationObserver((mutations, _obs) => {
    // rm_dish() removes `n` children from div_items, they appear here in a batch
    if (mutations.some(m => m.type === 'childList')) {
        store_item_states();
    }
});

var reset_qs = false;
const dish_indices = parse("dishes");
const extra_items = parse("items");
if (reset_qs) window.location.search = "";

var recipies;
const md_html_conv = new showdown.Converter();

fetch('../ruokaohjeet/README.md').then(res =>
    res.text().then(recipies => main(recipies))
);
