const Parcel = require('../models/Parcel');

const bookParcel = async (req, res) => {
  try {
    const { sender, receiver, parcelDetails } = req.body;
    
    // Auto-generate tracking ID
    const trackingId = 'TRK' + Date.now() + Math.floor(Math.random() * 1000);

    const parcel = await Parcel.create({
      trackingId,
      user: req.user._id,
      sender,
      receiver,
      parcelDetails,
      updates: [{
        status: 'Pending',
        description: 'Parcel booking received'
      }]
    });

    res.status(201).json(parcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackParcel = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const parcel = await Parcel.findOne({ trackingId }).populate('user', 'name email');
    
    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }

    res.json(parcel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookParcel, getUserParcels, trackParcel };
