import mongoose, { model } from 'mongoose';
import { IUser, Role } from './user.interface';

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    unique: true, 
    lowercase: true, 
    required: true 
},
  password: { 
    type: String, 
},
  role: {
     type: String, 
     enum: Object.values(Role),
     default: Role.receiver, 
     required: true 
    },
  phone: { type: String },
  address: { type: String },
  isBlocked: { 
    type: Boolean, 
    default: false 
},
}, { 
    timestamps: true,
    versionKey: false 
});

export const User = model<IUser>("User", userSchema);