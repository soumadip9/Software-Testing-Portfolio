const express = require('express');
const Property = require('../models/Property');
const Application = require('../models/Application');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all properties (with optional search, maxRent, or owner filter)
router.get('/', async (req, res) => {
  try {
    const { search, maxRent, ownerId } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { location: regex }];
    }

    if (maxRent !== undefined && maxRent !== '') {
      const parsedRent = Number(maxRent);
      if (!Number.isNaN(parsedRent) && parsedRent >= 0) {
        filter.rent = { $lte: parsedRent };
      }
    }

    if (ownerId) {
      filter.ownerId = ownerId;
    }

    const properties = await Property.find(filter)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load properties.' });
  }
});

// Add a new property (Owner only)
router.post('/', authMiddleware, requireRole('owner'), async (req, res) => {
  try {
    const { title, location, rent, bedrooms, description } = req.body;

    if (!title || !location || rent === undefined || bedrooms === undefined) {
      return res.status(400).json({ message: 'Title, location, rent, and bedrooms are required.' });
    }

    const property = await Property.create({
      title,
      location,
      rent: Number(rent),
      bedrooms: Number(bedrooms),
      description: description || '',
      ownerId: req.user.id
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to add property.' });
  }
});

// Edit an existing property (Owner only, must own the property)
router.put('/:id', authMiddleware, requireRole('owner'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own properties.' });
    }

    const { title, location, rent, bedrooms, description, status } = req.body;
    if (title !== undefined) property.title = title;
    if (location !== undefined) property.location = location;
    if (rent !== undefined) property.rent = Number(rent);
    if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
    if (description !== undefined) property.description = description;
    if (status !== undefined && ['available', 'rented'].includes(status)) {
      property.status = status;
    }

    await property.save();
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update property.' });
  }
});

// Delete a property (Owner only, must own the property)
router.delete('/:id', authMiddleware, requireRole('owner'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own properties.' });
    }

    await Application.deleteMany({ propertyId: property._id });
    await property.deleteOne();
    res.json({ message: 'Property deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete property.' });
  }
});

module.exports = router;
