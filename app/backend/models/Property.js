const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    rent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [1, 'Rent must be greater than 0'],
      max: [1000000, 'Rent cannot exceed 1,000,000']
    },
    bedrooms: {
      type: Number,
      required: [true, 'Bedrooms count is required'],
      min: [1, 'Bedrooms must be at least 1'],
      max: [20, 'Bedrooms cannot exceed 20']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['available', 'rented'],
      default: 'available'
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
