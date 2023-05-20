const html_ingredients = document.getElementById('items');
const html_dishes = document.getElementById('dishes');

let dish_conf = localStorage.getItem('dishes');
if (!dish_conf) {
    dish_conf = '[]'
}
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("dishes")) {
    dish_conf = urlParams.get("dishes")
}
const dish_indices = JSON.parse(dish_conf);

function reset_checkboxes() {
    for (const btn of document.querySelectorAll('.ingr_btn, .ingr_btn2')) {
        btn.classList.remove('active');
    }
}

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
    localStorage.setItem('dishes', JSON.stringify(dish_indices));
    build();
}

function build() {
    // drop all current entries
    html_dishes.innerHTML = '';
    html_ingredients.innerHTML = '';

    const items = new Map();
    items.set(-1, []);
    let alternating = 0;

    for (const i of dish_indices) {

        const dish = recipies[i];

        // clickable button as name of dish
        const dish_btn = document.createElement('button');
        dish_btn.innerText = dish.name;

        // TODO: get rid of 2 different classes and simply make bg-color darker a bit via JS
        dish_btn.setAttribute('class', alternating++ % 2 == 0 ? 'dish_btn' : 'dish_btn2');

        dish_btn.addEventListener('click', () => {
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
        dish_p.innerText = dish.instructions.replace(/^( *)1\. /g, "$1- ");

        // div responsible for hiding/showing its child paragraph
        const dish_div = document.createElement('div');
        dish_div.setAttribute('class', 'dish_div');
        dish_div.appendChild(dish_p);
        html_dishes.appendChild(dish_div);        

        for (const ingredient of dish.ingredients) {
            let found = false;
            for (const [i, regex] of the_order) {
                if (ingredient.match(regex)) {
                    if (!items.has(i)) {
                        items.set(i, [])
                    }

                    items.get(i).push([ingredient, dish]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                items.get(-1).push((ingredient, dish))
            }
        }
    }

    for (const [_, equivalent_items] of [...items.entries()].sort((a, b) => {
        const left = parseInt(a[0]);
        const right = parseInt(b[0]);
        if (left < right) {
            return -1;
        }
        if (left < right) {
            return 1;
        }
        return 0;
    })) {
        for (const item of equivalent_items) {
            const ingr_btn = document.createElement('button');

            // show name of dish in parenths if present
            ingr_btn.innerText = `${item[0]}${item.length > 1 ? ` (${item[1].name})` : "" }`;
            
            ingr_btn.setAttribute('class', alternating++ % 2 == 0 ? 'ingr_btn' : 'ingr_btn2');
            ingr_btn.addEventListener('click', () => {
                this.classList.toggle('active');
            });
            html_ingredients.appendChild(ingr_btn);
        }
    }
}

var recipies;

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
        build()
    } else {
        shuffle()
    }
}
