// src/models/Action.js
import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  action_type: {
    type: String,
    required: true,
    enum: [
      'account_created',
      'payment_sent',
      'feedback_left',
      'appointment_scheduled',
      'session_today',
      'appointment_rescheduled',
    ]
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model (student or tutor)
    required: true
  },
  related_entity_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Not all actions have a related entity (e.g., account creation)
  },
  timestamp: {
    type: Date,
    default: Date.now  // Automatically set timestamp when the action is created
  },
  metadata: {
    type: Object,  // Store any additional info (e.g., session duration, feedback, files)
    required: false
  }
}, { timestamps: true });

const Action = mongoose.model('Action', actionSchema);
export default Action;
