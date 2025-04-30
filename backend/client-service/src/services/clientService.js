const Client = require("../models/Client");

exports.getAllClients = () => Client.find();
exports.getClientById = (id) => Client.findById(id);
exports.createClient = (data) => Client.create(data);
exports.updateClient = (id, data) => Client.findByIdAndUpdate(id, data, { new: true });
exports.deleteClient = (id) => Client.findByIdAndDelete(id);
