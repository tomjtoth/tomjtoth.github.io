const html_ingredients = document.getElementById('ingredients');
const html_dishes = document.getElementById('dishes');
const menu = new Set(JSON.parse(localStorage.getItem('menu')));

function reset_checkboxes() {
    for (const btn of document.querySelectorAll('.ingr_btn, .ingr_btn2')) {
        btn.classList.remove('active');
    }
}

function shuffle() {
    menu.clear();
    for (let i = 0; i < 7; i++) {
        let j;
        do {
            j = Math.floor(Math.random() * cookbook.length);
        } while (menu.has(j) || cookbook[j].tags.includes('dessert'));
        menu.add(j);
    }
    localStorage.setItem('menu', JSON.stringify([...menu]));
    build();
}

function build() {
    // drop all current entries
    html_dishes.innerHTML = '';
    html_ingredients.innerHTML = '';

    const js_ingredients = new Map();
    js_ingredients.set(-1, []);
    let alternating = 0;

    for (const i of menu) {
        const dish = cookbook[i];

        // clickable button as name of dish
        const dish_btn = document.createElement('button');
        dish_btn.innerText = dish.name;

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
        dish_p.innerText = dish.instructions;

        // div responsible for hiding/showing its child paragraph
        const dish_div = document.createElement('div');
        dish_div.setAttribute('class', 'dish_div');
        dish_div.appendChild(dish_p);
        html_dishes.appendChild(dish_div);        

        for (let ingredient of dish.ingredients) {
            let found = false;
            for (let i = 0; i < regexes.length; i ++) {
                if (ingredient.match(regexes[i])) {
                    if (!js_ingredients.has(i)) {
                        js_ingredients.set(i, [])
                    }

                    js_ingredients.get(i).push(`${ingredient} (${dish.name})`);
                    found = true;
                    break;
                }
            }
            if (!found) {
                js_ingredients.get(-1).push(`UNSORTED: ${ingredient} (${dish.name})`)
            }
        }
    }

    for (const [order, ingredients] of [...js_ingredients.entries()].sort((a, b) => {
        let left = parseInt(a[0]);
        let right = parseInt(b[0]);
        if (left < right) {
            return -1;
        }
        if (left < right) {
            return 1;
        }
        return 0;
    })) {
        for (const ingredient of ingredients) {
            const ingr_btn = document.createElement('button');
            ingr_btn.innerText = ingredient;
            
            ingr_btn.setAttribute('class', alternating++ % 2 == 0 ? 'ingr_btn' : 'ingr_btn2');
            ingr_btn.addEventListener('click', function() {
                this.classList.toggle('active');
            });
            html_ingredients.appendChild(ingr_btn);
        }
    }
}

function main([recipies]) {
    const cookbook = Array.from(recipies
    .matchAll(re_dishes))
    .map(mo_dish => {
        const name = mo_dish.groups.name;
        const tags = Array.from((mo_dish.groups.tags
            ? mo_dish.groups.tags
            : ''
        ).matchAll(re_tags)).map(mo_tag => mo_tag[0]);
        const preference = parseInt(mo_dish.groups.pref);
        const instructions = mo_dish.groups.descr.replace(re_ingredients, '$1');
        const ingredients = Array.from(mo_dish.groups.descr.matchAll(re_ingredients)).map(mo_i => mo_i[1]);
        return {name, tags,preference, instructions, ingredients}
    });
    
    if (menu.size > 0) {
        build()
    } else {
        shuffle()
    }
}
