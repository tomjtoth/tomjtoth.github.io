import { current, isDraft } from "@reduxjs/toolkit";
import { db } from "../db";
import { ShoppingListActive } from "../types/db";
import { Recipe, State } from "../types/shopping-list";
import { re } from "../components/ShoppingList/config";

const id = "shopping-list";

export default {
  saveActive: ({ active }: ShoppingListActive) => {
    db.misc.put({
      id,
      active: isDraft(active) ? current(active) : active,
    } as ShoppingListActive);
  },

  saveItems: ({ items }: Pick<State, "items">) => {
    db.shoppingListItems.bulkPut(current(items));
  },

  rmItem: (id: number) => {
    db.shoppingListItems.delete(id);
  },

  load: () => {
    return Promise.all([
      db.misc
        .get(id)
        .then((res) => (res ? (res as ShoppingListActive).active : [])),
      db.shoppingListItems.toArray(),
    ]);
  },
};

export function parseYaml(yaml: any) {
  return Object.entries(yaml)
    .toSorted(([a], [b]) => {
      const a3 = a.slice(3).toLowerCase();
      const b3 = b.slice(3).toLowerCase();

      if (a3 < b3) return -1;
      if (a3 > b3) return 1;
      return 0;
    })
    .map(([title, rec]) => {
      const { steps, ...recipe } = rec as Recipe;

      const items: string[] = [];

      const htmlSteps = steps.map((step) =>
        step
          .replaceAll(
            re.item,
            (
              _: string,
              nameUrl: string | undefined,
              url: string | undefined,
              name: string | undefined
            ) => {
              items.push(name ?? nameUrl!);
              return url
                ? `<code class="recipe-item">${nameUrl}</code>
                <a class="recipe-item" href="${url}" target="_blank">🔗</a>`
                : `<code class="recipe-item">${name}</code>`;
            }
          )
          .replaceAll(
            re.strong,
            (
              _: string,
              vAsterisk: string | undefined,
              vUnderscore: string | undefined
            ) => ` <strong>${vAsterisk ?? vUnderscore!}</strong> `
          )
      );

      return {
        ...recipe,
        title,
        items,
        steps: htmlSteps,
      };
    });
}
