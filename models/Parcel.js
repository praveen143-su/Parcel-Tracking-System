const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  location: { type: String, default: 'System' },
  description: { type: String }
});

const parcelSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },
  receiver: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },
  parcelDetails: {
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    description: { type: String }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'], 
    default: 'Pending' 
  },
  updates: [updateSchema]
}, { timestamps: true });

const Parcel = mongoose.model('Parcel', parcelSchema);
module.exports = Parcel;
