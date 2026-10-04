const apService = require('../services/apService');
const logger = require('../logger');

async function list(req, res) {
  try {
    const items = await apService.listInvoices();
    res.json(items);
  } catch (err) {
    logger.error({ event: 'controller_error', op: 'list', message: err.message });
    res.status(500).json({ error: 'Failed to list invoices' });
  }
}

async function get(req, res) {
  try {
    const item = await apService.getInvoice(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    logger.error({ event: 'controller_error', op: 'get', message: err.message });
    res.status(500).json({ error: 'Failed to get invoice' });
  }
}

async function create(req, res) {
  try {
    const item = await apService.createInvoice(req.body);
    res.status(201).json(item);
  } catch (err) {
    logger.error({ event: 'controller_error', op: 'create', message: err.message });
    res.status(500).json({ error: 'Failed to create invoice' });
  }
}

async function update(req, res) {
  try {
    const item = await apService.updateInvoice(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    logger.error({ event: 'controller_error', op: 'update', message: err.message });
    res.status(500).json({ error: 'Failed to update invoice' });
  }
}

async function pay(req, res) {
  try {
    const item = await apService.payInvoice(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    logger.error({ event: 'controller_error', op: 'pay', message: err.message });
    res.status(500).json({ error: 'Failed to mark invoice as paid' });
  }
}

async function remove(req, res) {
  try {
    const ok = await apService.deleteInvoice(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    logger.error({ event: 'controller_error', op: 'remove', message: err.message });
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
}

module.exports = { list, get, create, update, pay, remove };
