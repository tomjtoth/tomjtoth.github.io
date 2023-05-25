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

function create_btn(name, onactivate, ondel = null) {

    const btn = document.createElement("button");
    
    if (ondel) {
        const span1 = document.createElement("span");
        const span2 = document.createElement("span");

        span1.innerText = name;
        btn.addEventListener("click", onactivate);
        btn.appendChild(span1);
        
        span2.innerText = "DEL";
        span2.setAttribute("class", "span-rm");
        span2.addEventListener("click", ondel);
        btn.appendChild(span2);

    } else {
        btn.innerText = name;
        btn.addEventListener("click", onactivate);
    }

    return btn;
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

    // drop all current entries
    div_dishes.innerHTML = '';
    div_items.innerHTML = '';

    // index 0 is for UNSORTED items
    const items = [[]];
    items.length = the_order.length + 1;

    // populate dish buttons in div-dishes
    for (const i of dish_indices) {

        const dish = recipies[i];

        div_dishes.appendChild(create_btn(
            dish.name,
            function() {
                this.classList.toggle("active");
                const content = this.parentElement.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            },
            function() {
                if (confirm(`Really DELETE ${dish.name}?`)) {
                    dish_indices.splice(
                        dish_indices.indexOf(i), 1);
                    store("dishes", dish_indices);
                    build();
                }
            }
        ));

        // paragraph containing instructions
        const p_dish_instr = document.createElement('p');
        p_dish_instr.innerText = dish.instructions.replace(/^( *)1\. /mg, "$1- ");

        // div responsible for hiding/showing its child paragraph
        const div_dish_instr = document.createElement("div");
        div_dish_instr.setAttribute("class", "div-dish-instr");
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
            div_items.appendChild(create_btn(
                (row_nro == 0 ? "TUNTEMATON: " : "")
                + item.name
                + (item.dish ? ` (${item.dish})` : ''), 

                function() {
                    (item.dish ? this : this.parentElement).classList.toggle("active");
                },
                
                item.dish ? null : function() {
                    if (confirm(`Really DELETE ${item.name}?`)) {
                        extra_items.splice(extra_items.indexOf(item.name), 1);
                        store("items", extra_items);
                        build();
                    }
                }
            ));
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
        const left = a.name.substring(3);
        const right = b.name.substring(3);

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

function add_item() {
    const item = window.prompt("enter item name");
    if (item != '') {
        extra_items.push(item);
        store("items", extra_items);
        build();
    }
}

function build_modal_dishes() {
    for (const [i, recipie] of recipies.entries()) {
        div_modal_dishes_content.appendChild(create_btn(
            `${i}: ${recipie.name}`,
            function() {
                dish_indices.push(i);
                store("dishes", dish_indices);
                div_modal_dishes.style.display = "none";
                build();
            }
        ));
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
