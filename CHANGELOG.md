# @omnidotdev/mantle-app

## 0.2.0

### Minor Changes

- [#78](https://github.com/omnidotdev/mantle-app/pull/78) [`ba6757f`](https://github.com/omnidotdev/mantle-app/commit/ba6757fb7c87f87b1baa6b16ff9ae5789a0d4780) Thanks [@coopbri](https://github.com/coopbri)! - Add custom fields to contacts and companies from Settings: text, number, date, checkbox, select, or multi-select. Fill them in on each record's page. Select fields show as a column on the People lists and as a filter, so you can list, for example, only qualified leads. Exports include each field as its own column.

- [#82](https://github.com/omnidotdev/mantle-app/pull/82) [`4088beb`](https://github.com/omnidotdev/mantle-app/commit/4088bebb469bc6061540de0eb7897ca708158af8) Thanks [@coopbri](https://github.com/coopbri)! - Signing in or out of Omni in another app now carries over here

- [#81](https://github.com/omnidotdev/mantle-app/pull/81) [`3c27b1a`](https://github.com/omnidotdev/mantle-app/commit/3c27b1aed743a6af19614dbb53bbd6ef633541fb) Thanks [@coopbri](https://github.com/coopbri)! - Links to your Omni account now open it as the same account you use in Mantle, even when another account is signed in on the browser

### Patch Changes

- [#80](https://github.com/omnidotdev/mantle-app/pull/80) [`d87b829`](https://github.com/omnidotdev/mantle-app/commit/d87b829fb00dc1b39b363d2bdd8e69784e494b7d) Thanks [@coopbri](https://github.com/coopbri)! - Refresh the share image and site description copy

## 0.1.0

### Minor Changes

- [#63](https://github.com/omnidotdev/mantle-app/pull/63) [`c606b01`](https://github.com/omnidotdev/mantle-app/commit/c606b01e5de7641e88746ab12f4f6fe813f29c95) Thanks [@coopbri](https://github.com/coopbri)! - Turn a sent or accepted quote into a draft invoice in one click. "Create invoice" on the quote page copies the client, currency, tax rate, notes, and line items (hourly items become estimated hours at the hourly rate, complimentary and included items are listed at no charge, and royalty items are left off for later) and opens the new invoice for editing. The quote is marked converted and links to its invoice, and the invoice shows which quote it came from. Deleting that invoice returns the quote to accepted so it can be invoiced again.

- [#61](https://github.com/omnidotdev/mantle-app/pull/61) [`913e58e`](https://github.com/omnidotdev/mantle-app/commit/913e58e84a563b831156a837924641184b4b9be5) Thanks [@coopbri](https://github.com/coopbri)! - Self-hosted instances work with any OpenID Connect provider. The app now reads its public URLs (`VITE_BASE_URL`, `VITE_API_URL`) from the runtime environment instead of values baked into the image, so one image serves any deployment. With `PERSONAL_WORKSPACE_FALLBACK=true`, a user whose provider sends no workspace claims gets a personal workspace. Signing out ends the session at the provider's advertised end-session endpoint instead of a fixed path.

- [#56](https://github.com/omnidotdev/mantle-app/pull/56) [`61a0dac`](https://github.com/omnidotdev/mantle-app/commit/61a0dac5504b13c5797c195282029965f2b4357b) Thanks [@coopbri](https://github.com/coopbri)! - Refresh the whole app with a new look and a proper phone layout. Pages sit on a warm canvas with raised cards, every page shares one header, status badges match across invoices, quotes, and inventory, and empty fields read "Not set" instead of a dash. On phones, lists become stacked cards instead of scrolling sideways, a bottom tab bar and a create button replace the lone menu icon, and invoice and quote actions move to a bar at the bottom of the screen. The dashboard now shows what is outstanding, what is overdue, what was paid this month, open quotes, invoiced totals per month, and a list of things that need attention. The landing page shows the product up front.

- [#62](https://github.com/omnidotdev/mantle-app/pull/62) [`c82cdc7`](https://github.com/omnidotdev/mantle-app/commit/c82cdc7a49403f370722dbd8117c1d14f2e58c21) Thanks [@coopbri](https://github.com/coopbri)! - Settings shows your workspace's plan and how many contacts and invoices this month it has used, with a link to upgrade or manage billing. When a plan limit stops a new contact, invoice or import, the message now says which limit was reached.

- [#62](https://github.com/omnidotdev/mantle-app/pull/62) [`c82cdc7`](https://github.com/omnidotdev/mantle-app/commit/c82cdc7a49403f370722dbd8117c1d14f2e58c21) Thanks [@coopbri](https://github.com/coopbri)! - The workspace profile (company details, contact, address, logo and accent color on invoices, quotes and contracts) is now saved to your workspace instead of this browser, so it follows you across browsers and devices and every member sees the same documents. A profile saved in this browser before is moved to the workspace the first time you open it. Only workspace owners and admins can change it.

### Patch Changes

- [#58](https://github.com/omnidotdev/mantle-app/pull/58) [`54512c9`](https://github.com/omnidotdev/mantle-app/commit/54512c91084d876ceb124271240e73ef13d8fcc5) Thanks [@coopbri](https://github.com/coopbri)! - Contracts no longer name Minnesota as the governing state when no registration state is set. They refer to the jurisdiction where you are registered instead, and the preview shows a hint to add your state in Settings.

- [#67](https://github.com/omnidotdev/mantle-app/pull/67) [`c9cf10a`](https://github.com/omnidotdev/mantle-app/commit/c9cf10a3d554de23e186d7413398dcd16e5e15ff) Thanks [@coopbri](https://github.com/coopbri)! - Fix a new invoice briefly showing "Invoice not found" after creating it from a quote, and stop long product names from pushing the dashboard's "Needs attention" card off screen.

- [#68](https://github.com/omnidotdev/mantle-app/pull/68) [`36ef557`](https://github.com/omnidotdev/mantle-app/commit/36ef5576ea3ce1d36e9e1a7ef9ea8874725e30a1) Thanks [@coopbri](https://github.com/coopbri)! - Quotes, contracts, and invoices no longer show the Omni logo when a workspace hasn't uploaded its own. They show the first letter of the company name instead.

- [#57](https://github.com/omnidotdev/mantle-app/pull/57) [`13c3c08`](https://github.com/omnidotdev/mantle-app/commit/13c3c088f88cd7916971e65d489fabe2a90a8b81) Thanks [@coopbri](https://github.com/coopbri)! - Fix a page mismatch warning when opening a new invoice or quote, so the editor loads cleanly.

- [#63](https://github.com/omnidotdev/mantle-app/pull/63) [`c606b01`](https://github.com/omnidotdev/mantle-app/commit/c606b01e5de7641e88746ab12f4f6fe813f29c95) Thanks [@coopbri](https://github.com/coopbri)! - Add a payment link to an invoice from the invoice form. It must be a full https link, and it shows in the invoice details with "Copy payment link".

- [#75](https://github.com/omnidotdev/mantle-app/pull/75) [`033c717`](https://github.com/omnidotdev/mantle-app/commit/033c7177d2693603efde6513b8a7c150d7849281) Thanks [@coopbri](https://github.com/coopbri)! - Saving an invoice is safer: only the line items and payments you changed are rewritten, payments are saved before the invoice is marked paid (so an interrupted save can no longer leave an invoice paid with no payments or drop a recorded payment), and line items keep their link to inventory products. The invoice number field now has room to show the full number.

- [#69](https://github.com/omnidotdev/mantle-app/pull/69) [`f17172b`](https://github.com/omnidotdev/mantle-app/commit/f17172b461d5a0ec390520d316fc75e617602ecd) Thanks [@coopbri](https://github.com/coopbri)! - Mantle has a new logo, in the app header, the landing page, browser tabs, home screen icons, and link previews.

- [#66](https://github.com/omnidotdev/mantle-app/pull/66) [`da79b1e`](https://github.com/omnidotdev/mantle-app/commit/da79b1e20e995900f39797c92ee8ad02ab262a78) Thanks [@coopbri](https://github.com/coopbri)! - Mantle has its own logo in the app header, the landing page, browser tabs, home screen icons, and link previews.

- [#48](https://github.com/omnidotdev/mantle-app/pull/48) [`def6e86`](https://github.com/omnidotdev/mantle-app/commit/def6e8666654ee05309ce4fba50a4f5a542376a6) Thanks [@coopbri](https://github.com/coopbri)! - Dropdowns now match the rest of the interface.

- [#73](https://github.com/omnidotdev/mantle-app/pull/73) [`cf43aa9`](https://github.com/omnidotdev/mantle-app/commit/cf43aa9e6f9d21262a65feaadbd75aa0092ea3bf) Thanks [@coopbri](https://github.com/coopbri)! - Mantle has a pricing page at /pricing, linked from the site header, the command palette, and the plan card in workspace settings. It lists the Free, Pro, and Team plans with monthly and yearly prices, the self-hosting option, and answers to common questions, and paid plans go straight to checkout in your Omni account.

- [#46](https://github.com/omnidotdev/mantle-app/pull/46) [`d1669f1`](https://github.com/omnidotdev/mantle-app/commit/d1669f149b0f88dbd9860d1474a367e92d91be66) Thanks [@coopbri](https://github.com/coopbri)! - Fix printed invoices and quotes not filling the page when printing with no margins

- [#47](https://github.com/omnidotdev/mantle-app/pull/47) [`92a872c`](https://github.com/omnidotdev/mantle-app/commit/92a872cd588be0ed7e3e8f8be7a8f723706717bd) Thanks [@coopbri](https://github.com/coopbri)! - Stop writing users' email addresses to the logs: a failed sign-in token check logs only the error message, not the user's email and name, by moving to `@omnidotdev/providers` v0.2.0.

- [#70](https://github.com/omnidotdev/mantle-app/pull/70) [`35512ac`](https://github.com/omnidotdev/mantle-app/commit/35512ac92f2b8057d6c195bd72e2a46b3709a218) Thanks [@coopbri](https://github.com/coopbri)! - Try Mantle without an account at /demo. It opens a sample design studio with clients, quotes, invoices, and inventory, and you can convert a quote to an invoice, record a payment, or adjust stock. Changes stay in your browser and reset when you reload. The landing page links to it.

- [#72](https://github.com/omnidotdev/mantle-app/pull/72) [`e71ab62`](https://github.com/omnidotdev/mantle-app/commit/e71ab628ea640129c51aa9eed0d508db149e8412) Thanks [@coopbri](https://github.com/coopbri)! - Sign-in session data sent to the browser no longer includes the session token

- [#59](https://github.com/omnidotdev/mantle-app/pull/59) [`775d8d0`](https://github.com/omnidotdev/mantle-app/commit/775d8d0231d20b935f48ca61142d8192e73dfc20) Thanks [@coopbri](https://github.com/coopbri)! - Update TanStack Start and zod to versions that fix known security issues.

- [#61](https://github.com/omnidotdev/mantle-app/pull/61) [`913e58e`](https://github.com/omnidotdev/mantle-app/commit/913e58e84a563b831156a837924641184b4b9be5) Thanks [@coopbri](https://github.com/coopbri)! - Each release now publishes a self-host container image to `api.manifold.omni.dev/omnidotdev/mantle-app`, tagged with the version and `latest`. Link previews show a text card until the final social preview image lands.

- [#71](https://github.com/omnidotdev/mantle-app/pull/71) [`9425658`](https://github.com/omnidotdev/mantle-app/commit/94256583594fc00b06b8d3222e0c6057ef5252ca) Thanks [@coopbri](https://github.com/coopbri)! - Search results and link previews now describe Mantle as open-source relationship management (CRM), quote to cash, invoicing, and inventory for small businesses.

- [#64](https://github.com/omnidotdev/mantle-app/pull/64) [`fec2e35`](https://github.com/omnidotdev/mantle-app/commit/fec2e356870c79f53cae4a36743c92b87a44bea2) Thanks [@coopbri](https://github.com/coopbri)! - Creating an invoice from a quote now happens in one step on the server, so a dropped connection can no longer leave a half-built invoice behind, and the same quote can never be invoiced twice. Deleting an invoice made from a quote puts the quote back to accepted. Invoices with a payment link show a "Pay online" button, and the printed invoice spells out the payment address.

- [#74](https://github.com/omnidotdev/mantle-app/pull/74) [`b1c7e36`](https://github.com/omnidotdev/mantle-app/commit/b1c7e36ba7c433c411f5381fcd11562790dc7909) Thanks [@coopbri](https://github.com/coopbri)! - Sign-in tokens stay out of reach of scripts running on the page: the session token is no longer returned to the browser

- [#55](https://github.com/omnidotdev/mantle-app/pull/55) [`ce98c05`](https://github.com/omnidotdev/mantle-app/commit/ce98c0563da5bffc7251e497dbe4bf8f82c15ec4) Thanks [@coopbri](https://github.com/coopbri)! - Scrollbars are thin and muted, with the same look as every other Omni app, in light and dark.

- [#49](https://github.com/omnidotdev/mantle-app/pull/49) [`774aff7`](https://github.com/omnidotdev/mantle-app/commit/774aff735a2681483223c5db0e66e0ab9e473883) Thanks [@coopbri](https://github.com/coopbri)! - Fix the workspace switcher cutting off long workspace lists: the list now scrolls, and in a collapsed sidebar the switcher shows the workspace avatar and opens its menu beside the rail

- [#62](https://github.com/omnidotdev/mantle-app/pull/62) [`c82cdc7`](https://github.com/omnidotdev/mantle-app/commit/c82cdc7a49403f370722dbd8117c1d14f2e58c21) Thanks [@coopbri](https://github.com/coopbri)! - Sign-in rate limiting now tells clients apart when the app is not behind Cloudflare, using the forwarded client address (and `TRUSTED_PROXIES` for multi-proxy setups), instead of sharing one limit across everyone.

- [#55](https://github.com/omnidotdev/mantle-app/pull/55) [`ce98c05`](https://github.com/omnidotdev/mantle-app/commit/ce98c0563da5bffc7251e497dbe4bf8f82c15ec4) Thanks [@coopbri](https://github.com/coopbri)! - Dialogs, dropdowns, switches, and form fields now use the shared Omni components, so they match the rest of Omni.

  Press `?` anywhere, or pick "Keyboard shortcuts" in the command palette, to see every keyboard shortcut. Press `b` to collapse or expand the sidebar.

- [#63](https://github.com/omnidotdev/mantle-app/pull/63) [`c606b01`](https://github.com/omnidotdev/mantle-app/commit/c606b01e5de7641e88746ab12f4f6fe813f29c95) Thanks [@coopbri](https://github.com/coopbri)! - The landing page and app description now describe only what Mantle does today: no more promise of signed quotes or records that "stay in sync".

- [#60](https://github.com/omnidotdev/mantle-app/pull/60) [`052a6f4`](https://github.com/omnidotdev/mantle-app/commit/052a6f49ebb4aea022808e2278fcd0338961e4ee) Thanks [@coopbri](https://github.com/coopbri)! - Make buttons consistent across the app: page actions share one size, add-row buttons match between invoices and quotes, confirmation dialogs use the same rounded buttons as everything else, email and tag chips match, and the delete button is easier to read in dark mode.

- [#65](https://github.com/omnidotdev/mantle-app/pull/65) [`0c924a4`](https://github.com/omnidotdev/mantle-app/commit/0c924a49d8e072d7ba3ea417950ef32e7e626181) Thanks [@coopbri](https://github.com/coopbri)! - Update the app's framework and tooling to their latest versions. Lists keep sorting the same way: text ignores case and invoice numbers sort in natural order.

- [#53](https://github.com/omnidotdev/mantle-app/pull/53) [`c49e6ca`](https://github.com/omnidotdev/mantle-app/commit/c49e6ca32264ef3af6bfd452d5dccb4331473318) Thanks [@coopbri](https://github.com/coopbri)! - The "Manage workspaces" link in the sidebar workspace switcher now opens your workspaces on the account hub.
