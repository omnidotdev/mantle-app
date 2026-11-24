import { describe, expect, test } from "bun:test";

import { renderToStaticMarkup } from "react-dom/server";

import InvoicePaymentLink from "./InvoicePaymentLink";

const render = (url: string | null) =>
  renderToStaticMarkup(<InvoicePaymentLink url={url} accentColor="#0d9488" />);

describe("InvoicePaymentLink", () => {
  test("links to the payment page on screen and spells it out in print", () => {
    const html = render(" https://pay.example.com/i/1 ");

    expect(html).toContain('href="https://pay.example.com/i/1"');
    expect(html).toContain('rel="noopener noreferrer"');
    // The clickable link is hidden on paper, the printed address on screen
    expect(html).toMatch(
      /<a [^>]*class="[^"]*print:hidden[^"]*"[^>]*>Pay online<\/a>/,
    );
    expect(html).toMatch(
      /<p class="[^"]*hidden[^"]*print:block[^"]*">.*https:\/\/pay\.example\.com\/i\/1/,
    );
  });

  test("renders nothing without a link or for a non-https one", () => {
    expect(render(null)).toBe("");
    expect(render("javascript:alert(1)")).toBe("");
    expect(render("http://pay.example.com")).toBe("");
  });
});
