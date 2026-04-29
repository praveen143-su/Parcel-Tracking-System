const express = require('express');
const { getAllParcels, updateParcelStatus, getReports } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/parcels', protect, admin, getAllParcels);
router.put('/parcels/:id/status', protect, admin, updateParcelStatus);
router.get('/reports', protect, admin, getReports);

module.exports = router;
