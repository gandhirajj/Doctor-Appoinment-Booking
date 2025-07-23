const express = require('express');
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  addDoctorReview,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getDoctors); // Get all doctors
router.get('/:id', getDoctor); // Get single doctor

// Protected routes
router.post('/', protect, authorize('doctor'), createDoctor);
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctor);
router.post('/:id/reviews', protect, authorize('patient'), addDoctorReview);

module.exports = router;
