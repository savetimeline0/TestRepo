const path = require('path');
const Crypto = require('crypto');
const JsonDb = require('../jsonDb');

const db = new JsonDb(path.join(__dirname, '..', '..', 'db.json'));

function genId() {
  try { return Crypto.randomUUID(); } catch { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
}

async function listInvoices() {
  return await db.getAll('invoices');
}

async function getInvoice(id) {
  return await db.findById('invoices', id);
}

async function createInvoice(payload) {
  const now = new Date().toISOString();
  
  // Calculate totals from lines if provided
  let totalAmount = 0;
  const lines = (payload.lines || []).map(line => ({
    id: genId(),
    description: line.description || '',
    quantity: Number(line.quantity) || 0,
    unitPrice: Number(line.unitPrice) || 0,
    lineAmount: (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0)
  }));
  
  totalAmount = lines.reduce((sum, line) => sum + line.lineAmount, 0);
  
  const invoice = {
    id: genId(),
    invoiceNumber: payload.invoiceNumber || `INV-${Date.now()}`,
    invoiceDate: payload.invoiceDate || now.split('T')[0],
    dueDate: payload.dueDate || null,
    header: {
      vendorId: payload.header?.vendorId || payload.vendorId || null,
      vendorName: payload.header?.vendorName || payload.vendor || 'unknown',
      vendorEmail: payload.header?.vendorEmail || null,
      vendorPhone: payload.header?.vendorPhone || null,
      vendorAddress: payload.header?.vendorAddress || null,
      invoiceNotes: payload.header?.invoiceNotes || payload.notes || ''
    },
    lines: lines,
    summary: {
      subtotal: totalAmount,
      taxRate: Number(payload.summary?.taxRate) || 0,
      taxAmount: totalAmount * (Number(payload.summary?.taxRate) || 0),
      total: totalAmount * (1 + (Number(payload.summary?.taxRate) || 0))
    },
    status: payload.status || 'pending',
    createdAt: now,
    updatedAt: now
  };
  
  return await db.insert('invoices', invoice);
}

async function updateInvoice(id, patch) {
  patch.updatedAt = new Date().toISOString();
  return await db.update('invoices', id, patch);
}

async function payInvoice(id) {
  const now = new Date().toISOString();
  const updated = await db.update('invoices', id, { status: 'paid', paidAt: now, updatedAt: now });
  return updated;
}

async function deleteInvoice(id) {
  return await db.remove('invoices', id);
}

module.exports = { listInvoices, getInvoice, createInvoice, updateInvoice, payInvoice, deleteInvoice };
