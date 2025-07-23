const Doctor = require('../models/Doctor');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    console.log('Fetching all doctors...');
    const doctors = await Doctor.find().populate({
      path: 'user',
      select: 'name email phone address',
    });

    console.log(`Found ${doctors.length} doctors`);
    console.log('Doctor IDs:', doctors.map(doc => doc._id));

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single doctor by ID
const getDoctor = async (req, res) => {
  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID format. Please use a valid MongoDB ObjectId.',
        details: 'The ID should be a 24-character hexadecimal string (e.g., 507f1f77bcf86cd799439011)'
      });
    }

    const doctor = await Doctor.findById(req.params.id).populate({
      path: 'user',
      select: 'name email phone address',
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error('Error in getDoctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new doctor profile
const createDoctor = async (req, res) => {
  try {
    // Temporarily comment out authentication for testing
    // req.body.user = req.user.id;
    // const existingDoctor = await Doctor.findOne({ user: req.user.id });
    // if (existingDoctor) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Doctor profile already exists for this user',
    //   });
    // }
    // const user = await User.findById(req.user.id);
    // if (user.role !== 'doctor') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only doctors can create a doctor profile',
    //   });
    // }

    // Set default values if not provided
    if (!req.body.specialization) {
      req.body.specialization = 'General Physician';
    }
    if (!req.body.experience) {
      req.body.experience = 5; // Default experience in years
    }
    if (!req.body.timings) {
      req.body.timings = ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'];
    }

    // Set fees based on specialization
    if (req.body.specialization) {
      switch (req.body.specialization.toLowerCase()) {
        case 'general practitioner':
        case 'family medicine':
        case 'pediatrics':
          req.body.fees = 2000;
          break;
        case 'orthopedics':
        case 'cardiology':
        case 'neurology':
        case 'dermatology':
        case 'dentist':
        case 'dental surgery':
          req.body.fees = 3000;
          break;
        case 'cardiac surgery':
        case 'neurosurgery':
        case 'oncology':
          req.body.fees = 4000;
          break;
        default:
          req.body.fees = 2000;
      }
    }

    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update doctor profile
const updateDoctor = async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if user is authorized to update
    if (req.user.role !== 'admin' && doctor.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this doctor'
      });
    }

    // Set fees based on specialization if it's being updated
    if (req.body.specialization) {
      switch (req.body.specialization.toLowerCase()) {
        case 'general practitioner':
        case 'family medicine':
        case 'pediatrics':
          req.body.fees = 2000;
          break;
        case 'orthopedics':
        case 'cardiology':
        case 'neurology':
        case 'dermatology':
        case 'dentist':
        case 'dental surgery':
          req.body.fees = 3000;
          break;
        case 'cardiac surgery':
        case 'neurosurgery':
        case 'oncology':
          req.body.fees = 4000;
          break;
        default:
          req.body.fees = 2000;
      }
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Add doctor review
const addDoctorReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor not found with id of ${req.params.id}`,
      });
    }

    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only patients can review doctors',
      });
    }

    const alreadyReviewed = doctor.reviews.find(
      (r) => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already reviewed',
      });
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
    };

    doctor.reviews.push(review);
    doctor.numberOfReviews = doctor.reviews.length;

    doctor.averageRating =
      doctor.reviews.reduce((acc, item) => item.rating + acc, 0) /
      doctor.reviews.length;

    await doctor.save();

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  addDoctorReview,
};
