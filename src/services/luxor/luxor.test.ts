import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { nameOf } from "../../utils";
import { processImports } from ".";

describe(nameOf(processImports), () => {
  it("parses 3 fields correctly", () => {
    const importedAt = Date.now();
    const [res, prompt, critical] = processImports(
      "12,19,38,50,62,13,20,42,55,66,11,21,44,60,64,0,0,0,0,0,9,22,39,57,63,2,16,37,47,66,3,20,34,46,70,13,17,35,50,62,0,0,0,0,0,4,19,36,49,63,6,25,33,59,65,7,20,42,58,73,8,22,32,60,72,0,0,0,0,0,10,26,45,49,66"
    );

    expect(critical).toBe(false);
    expect(prompt).toHaveLength(0);

    const expectedRows = [
      [
        [12, 19, 38, 50, 62],
        [13, 20, 42, 55, 66],
        [11, 21, 44, 60, 64],
        [0, 0, 0, 0, 0],
        [9, 22, 39, 57, 63],
      ],
      [
        [2, 16, 37, 47, 66],
        [3, 20, 34, 46, 70],
        [13, 17, 35, 50, 62],
        [0, 0, 0, 0, 0],
        [4, 19, 36, 49, 63],
      ],
      [
        [6, 25, 33, 59, 65],
        [7, 20, 42, 58, 73],
        [8, 22, 32, 60, 72],
        [0, 0, 0, 0, 0],
        [10, 26, 45, 49, 66],
      ],
    ];

    res.forEach((field, i) => {
      expect(field.rows).toStrictEqual(expectedRows[i]);
      expect(field.importedAt).toBeGreaterThanOrEqual(importedAt);
    });
  });

  it("prompts on incomplete input, but is not a critical error", () => {
    const importedAt = Date.now();
    const [res, prompt, critical] = processImports(
      "12,19,38,50,62,13,20,42,55,66,11,21,44,60,64,0,0,0,0,0,9,22,39,57,63,2,16,37,47,66,3,20,34,46,70,13,17,35,50,62,0,0,0,0,0,4,19,36,49,63,6,25,33,59,65,7,20,42,58,73,8,22,32,60,72,0,0,0,0,0,10,26,45"
    );

    expect(critical).toBe(false);
    expect(prompt).toHaveLength(1);

    const expectedRows = [
      [
        [12, 19, 38, 50, 62],
        [13, 20, 42, 55, 66],
        [11, 21, 44, 60, 64],
        [0, 0, 0, 0, 0],
        [9, 22, 39, 57, 63],
      ],
      [
        [2, 16, 37, 47, 66],
        [3, 20, 34, 46, 70],
        [13, 17, 35, 50, 62],
        [0, 0, 0, 0, 0],
        [4, 19, 36, 49, 63],
      ],
      [
        [6, 25, 33, 59, 65],
        [7, 20, 42, 58, 73],
        [8, 22, 32, 60, 72],
        [0, 0, 0, 0, 0],
        [10, 26, 45, 0, 0],
      ],
    ];

    res.forEach((field, i) => {
      expect(field.rows).toStrictEqual(expectedRows[i]);
      expect(field.importedAt).toBeGreaterThanOrEqual(importedAt);
    });

    const { container } = render(prompt);
    const p = container.querySelector("p");
    expect(p).not.toBeNull();
    expect(p!).toHaveTextContent(
      "25-ösével kell megadni a számokat! A maradékot kipótolom bogarakkal. Majd megszerkeszted a lakatra kattintva.."
    );
  });

  it("prompts on multiple invalid input, and is a critical error", () => {
    const importedAt = Date.now();
    const [res, prompt, critical] = processImports(
      "1é2,19,38,50,62,13,20,42,55,66,11,21,44,60,64,0,0,0,0,0,9,22,39,57,63,2,16,37,47,66,3,20,34,46,70,13,17,35,50,62,0,0,0,0,0,4,19,36,49,63,6,25,33,59,65,7,20,42,58,73,8,22,32,60,72,0,0,0,0,0,10,26,45,23,3á2"
    );

    expect(critical).toBe(true);
    expect(prompt).toHaveLength(1);

    const expectedRows = [
      [
        [NaN, 19, 38, 50, 62],
        [13, 20, 42, 55, 66],
        [11, 21, 44, 60, 64],
        [0, 0, 0, 0, 0],
        [9, 22, 39, 57, 63],
      ],
      [
        [2, 16, 37, 47, 66],
        [3, 20, 34, 46, 70],
        [13, 17, 35, 50, 62],
        [0, 0, 0, 0, 0],
        [4, 19, 36, 49, 63],
      ],
      [
        [6, 25, 33, 59, 65],
        [7, 20, 42, 58, 73],
        [8, 22, 32, 60, 72],
        [0, 0, 0, 0, 0],
        [10, 26, 45, 23, NaN],
      ],
    ];

    res.forEach((field, i) => {
      expect(field.rows).toStrictEqual(expectedRows[i]);
      expect(field.importedAt).toBeGreaterThanOrEqual(importedAt);
    });

    const { container } = render(prompt);

    const p = container.querySelector("p");
    expect(p).toHaveTextContent("Az alábbiak nem 0 és 75 közötti számok:");

    const first = container.querySelector("li[value='1']");
    expect(first).toHaveTextContent('"1é2"');

    const last = container.querySelector("li[value='75']");
    expect(last).toHaveTextContent('"3á2"');
  });

  it("prompts on single invalid input, and is a critical error", () => {
    const importedAt = Date.now();
    const [res, prompt, critical] = processImports(
      "12,19,38,50,62,13,20,42,55,66,11,21,44,60,64,0,0,0,0,0,9,22,39,57,63,2,16,37,47,66,3,20,34,46,70,13,17,35,50,62,0,0,0,0,0,4,19,36,49,63,6,25,33,59,65,7,20,42,58,73,8,22,32,60,72,0,0,0,0,0,10,26,45,23,3á2"
    );

    expect(critical).toBe(true);
    expect(prompt).toHaveLength(1);

    const expectedRows = [
      [
        [12, 19, 38, 50, 62],
        [13, 20, 42, 55, 66],
        [11, 21, 44, 60, 64],
        [0, 0, 0, 0, 0],
        [9, 22, 39, 57, 63],
      ],
      [
        [2, 16, 37, 47, 66],
        [3, 20, 34, 46, 70],
        [13, 17, 35, 50, 62],
        [0, 0, 0, 0, 0],
        [4, 19, 36, 49, 63],
      ],
      [
        [6, 25, 33, 59, 65],
        [7, 20, 42, 58, 73],
        [8, 22, 32, 60, 72],
        [0, 0, 0, 0, 0],
        [10, 26, 45, 23, NaN],
      ],
    ];

    res.forEach((field, i) => {
      expect(field.rows).toStrictEqual(expectedRows[i]);
      expect(field.importedAt).toBeGreaterThanOrEqual(importedAt);
    });

    const { container } = render(prompt);

    const p = container.querySelector("p");
    expect(p).toHaveTextContent('A 75. szám nem jó: "3á2".');
  });

  it("prompts on single invalid and incomplete input, and is a critical error", () => {
    const importedAt = Date.now();
    const [res, prompt, critical] = processImports(
      "12,19,38,50,62,13,20,42,55,66,11,21,44,60,64,0,0,0,0,0,9,22,39,57,63,2,16,37,47,66,3,20,34,46,70,13,17,35,50,62,0,0,0,0,0,4,19,36,49,63,6,25,33,59,65,7,20,42,58,73,8,22,32,60,72,0,0,0,0,0,10,26,45,3á2"
    );

    expect(critical).toBe(true);
    expect(prompt).toHaveLength(2);

    const expectedRows = [
      [
        [12, 19, 38, 50, 62],
        [13, 20, 42, 55, 66],
        [11, 21, 44, 60, 64],
        [0, 0, 0, 0, 0],
        [9, 22, 39, 57, 63],
      ],
      [
        [2, 16, 37, 47, 66],
        [3, 20, 34, 46, 70],
        [13, 17, 35, 50, 62],
        [0, 0, 0, 0, 0],
        [4, 19, 36, 49, 63],
      ],
      [
        [6, 25, 33, 59, 65],
        [7, 20, 42, 58, 73],
        [8, 22, 32, 60, 72],
        [0, 0, 0, 0, 0],
        [10, 26, 45, NaN, 0],
      ],
    ];

    res.forEach((field, i) => {
      expect(field.rows).toStrictEqual(expectedRows[i]);
      expect(field.importedAt).toBeGreaterThanOrEqual(importedAt);
    });

    const { container } = render(prompt);

    const [p1, p2] = container.querySelectorAll("p");
    expect(p1).toHaveTextContent('A 74. szám nem jó: "3á2".');
    expect(p2).toHaveTextContent(
      "25-ösével kell megadni a számokat! A maradékot kipótolom bogarakkal. Majd megszerkeszted a lakatra kattintva.."
    );
  });
});
