// gets the previous conf, overrides by querystring
function parse(name) {
    let conf = localStorage.getItem(name);
    if (!conf) {
        conf = '[]'
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(name)) {
        const tags = urlParams.get(name).split(",");
        if (tags.some(tag => isNaN(tag))) {
            tags.map(tag => `"${tag}"`)
        }
        conf = `[${",".join(tags)}]`
    }
    return JSON.parse(conf);
}

// resets the items which are set to green
function reset_checkboxes() {
    for (const btn of document.querySelectorAll('.ingr_btn, .ingr_btn2')) {
        btn.classList.remove('active');
    }
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
    localStorage.setItem('dishes', JSON.stringify(dish_indices));
    build();
}

// shoves the item in it's ordered place
function assign(arr, name, dish = null) {
    let found = false;
    for (const [j, regex] of the_order) {
        if (mo_ingr.groups.name.match(regex)) {
            if (!arr[j+1]) {
                arr[j+1] = []
            }

            arr[j+1].push({name, dish});
            found = true;
            break;
        }
    }
    if (!found) {
        arr[0].push({name, dish})
    }
}

// builds the dishes and items divs
function build() {

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
        dish_p.innerText = dish.instructions.replace(/^( *)1\. /mg, "$1- ");

        // div responsible for hiding/showing its child paragraph
        const dish_div = document.createElement('div');
        dish_div.setAttribute('class', 'dish_div');
        dish_div.appendChild(dish_p);
        html_dishes.appendChild(dish_div);

        
        for (const mo_ingr of dish.ingredients) {
            assign(items, mo_ingr.groups.name, dish.name)    
        }
    }

    for (const extra of extra_items) {
        assign(items, extra)
    }

    for (const row_in_shop of items) {
        for (const item of row_in_shop) {
            const ingr_btn = document.createElement('button');

            // show name of dish in parenths if present
            ingr_btn.innerText = item.name + (item.dish ? ` ("${item.dish})` : "");

            ingr_btn.setAttribute('class', alternating++ % 2 == 0 ? 'ingr_btn' : 'ingr_btn2');
            ingr_btn.addEventListener('click', () => {
                this.classList.toggle('active');
            });
            html_ingredients.appendChild(ingr_btn);
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
        const ingredients = mo_dish.groups.descr.matchAll(re_ingredients);
        return {name, tags, preference, instructions, ingredients}
    });
    
    if (dish_indices.length > 0) {
        build()
    } else {
        shuffle()
    }
}

const html_ingredients = document.getElementById('items');
const html_dishes = document.getElementById('dishes');

const dish_indices = parse("dishes")
const extra_items = parse("items")

var recipies;

