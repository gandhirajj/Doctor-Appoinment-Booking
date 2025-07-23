const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let query;

    // If user is a patient, get only their appointments
    if (req.user.role === 'patient') {
      query = Appointment.find({ patient: req.user.id });
    }
    // If user is a doctor, get only appointments for their profile
    else if (req.user.role === 'doctor') {
      // Find doctor profile for this user
      const doctorProfile = await Doctor.findOne({ user: req.user.id });

      if (!doctorProfile) {
        // If no doctor profile exists, return empty appointments array
        // instead of throwing an error
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
          message: 'No doctor profile found. Please create your doctor profile first.'
        });
      }

      query = Appointment.find({ doctor: doctorProfile._id });
    }
    // If admin, get all appointments
    else {
      query = Appointment.find();
    }

    // Execute query with populated fields
    const appointments = await query
      .populate({
        path: 'doctor',
        select: 'name specialization fees',
        populate: {
          path: 'user',
          select: 'name email phone',
        },
      })
      .populate({
        path: 'patient',
        select: 'name email phone address',
      });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctor',
        select: 'name specialization fees',
        populate: {
          path: 'user',
          select: 'name email phone',
        },
      })
      .populate({
        path: 'patient',
        select: 'name email phone address',
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `Appointment not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is the appointment owner, the doctor, or an admin
    if (
      appointment.patient._id.toString() !== req.user.id &&
      appointment.doctor.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private/Patient
exports.createAppointment = async (req, res) => {
  try {
    // Add patient to req.body
    req.body.patient = req.user.id;

    // Check if user is a patient
    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only patients can book appointments',
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(req.body.doctor);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor not found with id of ${req.body.doctor}`,
      });
    }

    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      date: req.body.date,
      time: req.body.time,
      status: { $ne: 'cancelled' }, // Exclude cancelled appointments
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This appointment slot is already booked',
      });
    }

    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `Appointment not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is the appointment owner, the doctor, or an admin
    if (
      appointment.patient.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      // If user is a doctor, check if they are the doctor for this appointment
      if (req.user.role === 'doctor') {
        const doctorProfile = await Doctor.findOne({ user: req.user.id });

        if (!doctorProfile) {
          return res.status(404).json({
            success: false,
            message: 'No doctor profile found. Please create your doctor profile first.',
          });
        }

        if (doctorProfile._id.toString() !== appointment.doctor.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to update this appointment',
          });
        }

        // Doctors can only update status and notes
        const allowedUpdates = ['status', 'notes'];
        const requestedUpdates = Object.keys(req.body);

        const isValidOperation = requestedUpdates.every(update =>
          allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
          return res.status(400).json({
            success: false,
            message: `Doctors can only update: ${allowedUpdates.join(', ')}`,
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this appointment',
        });
      }
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `Appointment not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is the appointment owner or an admin
    if (
      appointment.patient.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this appointment',
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
