import { current, isDraft } from "@reduxjs/toolkit";
import { db } from "../db";
import { ShoppingListActive } from "../types/db";
import { Recipe, State } from "../types/shopping-list";

const id = "shopping-list";

const RE_ITEM =
  /(?:(?:\[`(?<nameUrl>[^`]+)`\]\((?<url>.+)\))|`(?<name>[^`]+)`)(?: *[-:])?/g;
const RE_STRONG =
  /(?:\*\*(?<vAsterisk>[^*]+)\*\*|\b__(?<vUnderscore>[^_]+)__\b)/g;

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
            RE_ITEM,
            (
              _: string,
              nameUrl: string | undefined,
              url: string | undefined,
              name: string | undefined
            ) => {
              items.push(name ?? nameUrl!);
              return url
                ? `<code class="sli">${nameUrl}</code>
                <a class="sli" href="${url}" target="_blank">🔗</a>`
                : `<code class="sli">${name}</code>`;
            }
          )
          .replaceAll(
            RE_STRONG,
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
