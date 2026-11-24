---
"@omnidotdev/mantle-app": patch
---

Creating an invoice from a quote now happens in one step on the server, so a dropped connection can no longer leave a half-built invoice behind, and the same quote can never be invoiced twice. Deleting an invoice made from a quote puts the quote back to accepted. Invoices with a payment link show a "Pay online" button, and the printed invoice spells out the payment address.
