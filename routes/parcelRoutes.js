const express = require('express');
const { bookParcel, getUserParcels, trackParcel } = require('../controllers/parcelController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, bookParcel);
router.get('/history', protect, getUserParcels);
router.get('/track/:trackingId', trackParcel); // Public route to track

module.exports = router;
