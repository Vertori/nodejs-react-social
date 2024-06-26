const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//private access
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id }); // get contacts related to the logged in user
  res.status(200).json(contacts);
});

//private access
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found!");
  }
  res.status(200).json(contact);
});

//private access
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

//private access
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found!");
  }

  // don't allow to update contact of another user
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("No permission for updating other users contacts!");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(201).json(updatedContact);
});

//private access
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found!");
  }

  // don't allow to delete contact of another user
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("No permission for deleting other users contacts!");
  }

  await Contact.deleteOne({ _id: req.params.id });

  res.status(201).json(contact);
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
