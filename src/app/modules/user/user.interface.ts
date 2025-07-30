export enum Role {
    admin = 'admin', 
    sender = 'sender',
    receiver = 'receiver'
};

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}


export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  phone?: string;
  address?: string;
  isDeleted?: boolean;
  isBlocked?: boolean;
  auths: IAuthProvider[]
}