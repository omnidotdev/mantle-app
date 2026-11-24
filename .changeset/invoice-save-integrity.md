---
"@omnidotdev/mantle-app": patch
---

Saving an invoice is safer: only the line items and payments you changed are rewritten, payments are saved before the invoice is marked paid (so an interrupted save can no longer leave an invoice paid with no payments or drop a recorded payment), and line items keep their link to inventory products. The invoice number field now has room to show the full number.
