const service = require("../services/clientService");

exports.getAll = async (req, res) => {
  try {
    console.log('GET /api/clients - Fetching all clients');
    const data = await service.getAllClients();
    console.log(`Found ${data.length} clients`);
    res.json(data);
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({ 
      message: 'Failed to fetch clients',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getById = async (req, res) => {
  try {
    console.log(`GET /api/clients/${req.params.id} - Fetching client by ID`);
    const data = await service.getClientById(req.params.id);
    if (!data) {
      console.log('Client not found');
      return res.status(404).json({ message: "Client not found" });
    }
    console.log('Client found');
    res.json(data);
  } catch (error) {
    console.error('Error in getById:', error);
    res.status(500).json({ 
      message: 'Failed to fetch client',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('POST /api/clients - Creating new client:', req.body);
    const { name, poc_name, poc_email } = req.body;
    
    if (!name || !poc_name || !poc_email) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        message: "Name, POC Name, and POC Email are required" 
      });
    }

    const created = await service.createClient(req.body);
    console.log('Client created successfully');
    res.status(201).json(created);
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({ 
      message: 'Failed to create client',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.update = async (req, res) => {
  try {
    console.log(`PUT /api/clients/${req.params.id} - Updating client:`, req.body);
    const { name, poc_name, poc_email } = req.body;
    
    if (!name || !poc_name || !poc_email) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        message: "Name, POC Name, and POC Email are required" 
      });
    }

    const updated = await service.updateClient(req.params.id, req.body);
    if (!updated) {
      console.log('Client not found');
      return res.status(404).json({ message: "Client not found" });
    }
    console.log('Client updated successfully');
    res.json(updated);
  } catch (error) {
    console.error('Error in update:', error);
    res.status(500).json({ 
      message: 'Failed to update client',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.remove = async (req, res) => {
  try {
    console.log(`DELETE /api/clients/${req.params.id} - Deleting client`);
    const deleted = await service.deleteClient(req.params.id);
    if (!deleted) {
      console.log('Client not found');
      return res.status(404).json({ message: "Client not found" });
    }
    console.log('Client deleted successfully');
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error('Error in remove:', error);
    res.status(500).json({ 
      message: 'Failed to delete client',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
