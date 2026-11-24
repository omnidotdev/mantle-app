import { describe, expect, test } from "bun:test";

import { renderToStaticMarkup } from "react-dom/server";

import { DataTable } from "./data-table";

import type { SortingState } from "@tanstack/react-table";
import type { DataTableColumnDef } from "./data-table";

type Item = { name: string; amount: number; number: string };

const items: Item[] = [
  { name: "beta", amount: 20, number: "INV-10" },
  { name: "Zulu", amount: 3, number: "INV-9" },
  { name: "alpha", amount: 100, number: "INV-100" },
];

const columns: DataTableColumnDef<Item>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { align: "right" },
  },
  { accessorKey: "number", header: "Number" },
];

// cell text in render order, one entry per row
const renderRows = (sorting: SortingState) => {
  const html = renderToStaticMarkup(
    <DataTable
      data={items}
      columns={columns}
      sorting={sorting}
      onSortingChange={() => {}}
    />,
  );

  const body = html.match(/<tbody>(.*)<\/tbody>/)?.[1] ?? "";

  return body
    .split("</tr>")
    .filter(Boolean)
    .map((row) => [...row.matchAll(/<td[^>]*>(.*?)<\/td>/g)].map((c) => c[1]));
};

describe("DataTable", () => {
  test("keeps data order when unsorted", () => {
    expect(renderRows([]).map((r) => r[0])).toEqual(["beta", "Zulu", "alpha"]);
  });

  test("sorts text columns case-insensitively", () => {
    expect(renderRows([{ id: "name", desc: false }]).map((r) => r[0])).toEqual([
      "alpha",
      "beta",
      "Zulu",
    ]);
  });

  test("sorts number columns numerically, not lexically", () => {
    expect(renderRows([{ id: "amount", desc: true }]).map((r) => r[1])).toEqual(
      ["100", "20", "3"],
    );
  });

  test("sorts mixed text and digits naturally", () => {
    expect(
      renderRows([{ id: "number", desc: false }]).map((r) => r[2]),
    ).toEqual(["INV-9", "INV-10", "INV-100"]);
  });

  test("applies right alignment from column meta", () => {
    const html = renderToStaticMarkup(
      <DataTable
        data={items}
        columns={columns}
        sorting={[]}
        onSortingChange={() => {}}
      />,
    );

    expect(html).toMatch(/<td class="[^"]*text-right[^"]*">20<\/td>/);
  });
});
