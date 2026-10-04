# Accounts Payable Simulator (Node.js)

Simple REST API to simulate Accounts Payable operations, with JSON logging and a lightweight JSON file DB.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start server:

```bash
npm start
```

The API listens on `PORT` environment variable or port `3000` by default.

## Endpoints

- `GET /api/ap/invoices` — list invoices
- `GET /api/ap/invoices/:id` — get invoice
- `POST /api/ap/invoices` — create invoice
- `PUT /api/ap/invoices/:id` — update invoice
- `POST /api/ap/invoices/:id/pay` — mark invoice paid
- `DELETE /api/ap/invoices/:id` — delete invoice

## Invoice Structure

### Request (POST/PUT)

```json
{
  "invoiceNumber": "INV-2026-001",
  "invoiceDate": "2026-05-15",
  "dueDate": "2026-06-15",
  "header": {
    "vendorId": "VENDOR-001",
    "vendorName": "ACME Corporation",
    "vendorEmail": "invoices@acme.com",
    "vendorPhone": "+1-555-0100",
    "vendorAddress": "123 Business Ave, New York, NY 10001",
    "invoiceNotes": "Payment terms: Net 30"
  },
  "lines": [
    {
      "description": "Software Licensing - Annual",
      "quantity": 1,
      "unitPrice": 5000
    },
    {
      "description": "Consulting Services",
      "quantity": 40,
      "unitPrice": 150
    }
  ],
  "summary": {
    "taxRate": 0.08
  }
}
```

### Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "invoiceNumber": "INV-2026-001",
  "invoiceDate": "2026-05-15",
  "dueDate": "2026-06-15",
  "header": {
    "vendorId": "VENDOR-001",
    "vendorName": "ACME Corporation",
    "vendorEmail": "invoices@acme.com",
    "vendorPhone": "+1-555-0100",
    "vendorAddress": "123 Business Ave, New York, NY 10001",
    "invoiceNotes": "Payment terms: Net 30"
  },
  "lines": [
    {
      "id": "line-001",
      "description": "Software Licensing - Annual",
      "quantity": 1,
      "unitPrice": 5000,
      "lineAmount": 5000
    },
    {
      "id": "line-002",
      "description": "Consulting Services",
      "quantity": 40,
      "unitPrice": 150,
      "lineAmount": 6000
    }
  ],
  "summary": {
    "subtotal": 11000,
    "taxRate": 0.08,
    "taxAmount": 880,
    "total": 11880
  },
  "status": "pending",
  "createdAt": "2026-05-15T10:30:00Z",
  "updatedAt": "2026-05-15T10:30:00Z"
}
```

## Data & Logs

- DB file: `db.json` in project root
- Logs: `logs/app.log` (JSON lines)

## Usage Example (curl)

```bash
# Create invoice
curl -X POST http://localhost:3000/api/ap/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV-2026-001",
    "dueDate": "2026-06-15",
    "header": {"vendorName": "Vendor Inc"},
    "lines": [{"description": "Service", "quantity": 1, "unitPrice": 1000}],
    "summary": {"taxRate": 0.08}
  }'

# List invoices
curl http://localhost:3000/api/ap/invoices

# Pay invoice
curl -X POST http://localhost:3000/api/ap/invoices/{id}/pay
```

