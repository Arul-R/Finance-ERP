const Client = require("../model/Client");

exports.getAllClients = async () => {
  try {
    console.log('Fetching all clients...');
    const clients = await Client.find();
    console.log(`Found ${clients.length} clients`);
    return clients;
  } catch (error) {
    console.error('Error in getAllClients:', error);
    throw error;
  }
};

exports.getClientById = async (id) => {
  try {
    console.log('Fetching client by ID:', id);
    const client = await Client.findById(id);
    console.log('Client found:', client ? 'Yes' : 'No');
    return client;
  } catch (error) {
    console.error('Error in getClientById:', error);
    throw error;
  }
};

exports.createClient = async (data) => {
  try {
    console.log('Creating new client:', data);
    const client = await Client.create(data);
    console.log('Client created successfully');
    return client;
  } catch (error) {
    console.error('Error in createClient:', error);
    throw error;
  }
};

exports.updateClient = async (id, data) => {
  try {
    console.log('Updating client:', { id, data });
    const client = await Client.findByIdAndUpdate(id, data, { new: true });
    console.log('Client updated:', client ? 'Yes' : 'No');
    return client;
  } catch (error) {
    console.error('Error in updateClient:', error);
    throw error;
  }
};

exports.deleteClient = async (id) => {
  try {
    console.log('Deleting client:', id);
    const client = await Client.findByIdAndDelete(id);
    console.log('Client deleted:', client ? 'Yes' : 'No');
    return client;
  } catch (error) {
    console.error('Error in deleteClient:', error);
    throw error;
  }
};
