const express = require('express');
const Application = require('../models/Application');
const Property = require('../models/Property');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Apply for a rental property (Tenant only)
router.post('/', authMiddleware, requireRole('tenant'), async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required.' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    if (property.status === 'rented') {
      return res.status(400).json({ message: 'This property is already rented.' });
    }

    const existing = await Application.findOne({
      propertyId,
      tenantId: req.user.id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existing) {
      return res.status(409).json({ message: 'You have already applied for this property.' });
    }

    const application = await Application.create({
      propertyId,
      tenantId: req.user.id,
      message: message || ''
    });

    const populated = await Application.findById(application._id)
      .populate('propertyId', 'title location rent status')
      .populate('tenantId', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to submit application.' });
  }
});

// Get applications (Tenant sees own applications; Owner sees applications for their properties)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'tenant') {
      const apps = await Application.find({ tenantId: req.user.id })
        .populate('propertyId', 'title location rent status')
        .sort({ createdAt: -1 });
      return res.json(apps);
    }

    if (req.user.role === 'owner') {
      const ownerProperties = await Property.find({ ownerId: req.user.id }).select('_id');
      const propertyIds = ownerProperties.map((p) => p._id);

      const apps = await Application.find({ propertyId: { $in: propertyIds } })
        .populate('propertyId', 'title location rent status')
        .populate('tenantId', 'name email')
        .sort({ createdAt: -1 });
      return res.json(apps);
    }

    res.status(403).json({ message: 'Invalid role.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load applications.' });
  }
});

// Approve or reject a rental application (Owner only)
router.patch('/:id', authMiddleware, requireRole('owner'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected.' });
    }

    const application = await Application.findById(req.params.id).populate('propertyId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    if (!application.propertyId || application.propertyId.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only review applications for your own properties.' });
    }

    application.status = status;
    await application.save();

    if (status === 'approved') {
      await Property.findByIdAndUpdate(application.propertyId._id, { status: 'rented' });
    }

    const updated = await Application.findById(application._id)
      .populate('propertyId', 'title location rent status')
      .populate('tenantId', 'name email');

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update application.' });
  }
});

module.exports = router;
