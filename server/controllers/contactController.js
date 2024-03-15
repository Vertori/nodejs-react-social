const asyncHandler = require("express-async-handler");

const getContacts = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Fetched contacts!" });
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  res.status(201).json({ message: "Added new contact!" });
});

const updateContact = asyncHandler(async (req, res) => {
  res
    .status(201)
    .json({ message: `Modified contact with id: ${req.params.id}` });
});

const deleteContact = asyncHandler(async (req, res) => {
  res
    .status(201)
    .json({ message: `Deleted contact with id: ${req.params.id}` });
});

module.exports = { getContacts, createContact, updateContact, deleteContact };
