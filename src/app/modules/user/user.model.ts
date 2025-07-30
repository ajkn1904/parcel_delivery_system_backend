import { model, Schema } from 'mongoose';
import { IAuthProvider, IUser, Role } from './user.interface';


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }    
}, {
    _id: false, 
    versionKey: false
});


const userSchema = new Schema({
  name: { 
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
     default: Role.receiver
    },
  phone: { type: String },
  address: { type: String },
  isDeleted: { type: Boolean, default: false},
  isBlocked: { 
    type: Boolean, 
    default: false 
},
auths: [authProviderSchema],
}, { 
    timestamps: true,
    versionKey: false 
});

export const User = model<IUser>("User", userSchema);