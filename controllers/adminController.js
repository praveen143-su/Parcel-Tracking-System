const Parcel = require('../models/Parcel');
const User = require('../models/User');

const getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateParcelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, description } = req.body;

    const parcel = await Parcel.findById(id);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

    parcel.status = status;
    parcel.updates.push({
      status,
      location,
      description
    });

    const updatedParcel = await parcel.save();

    // If socket.io is attached to req
    if (req.io) {
      req.io.to(parcel.trackingId).emit('statusUpdate', updatedParcel);
    }

    res.json(updatedParcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const totalParcels = await Parcel.countDocuments();
    const delivered = await Parcel.countDocuments({ status: 'Delivered' });
    const pending = await Parcel.countDocuments({ status: 'Pending' });
    const inTransit = await Parcel.countDocuments({ status: 'In Transit' });
    
    const usersCount = await User.countDocuments();

    res.json({
      totalParcels,
      delivered,
      pending,
      inTransit,
      usersCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllParcels, updateParcelStatus, getReports };
