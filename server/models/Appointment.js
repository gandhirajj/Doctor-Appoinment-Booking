const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add an appointment date'],
    },
    time: {
      type: String,
      required: [true, 'Please add an appointment time'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    reason: {
      type: String,
      required: [true, 'Please add a reason for the appointment'],
      maxlength: [500, 'Reason cannot be more than 500 characters'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one appointment for the same time slot
AppointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
