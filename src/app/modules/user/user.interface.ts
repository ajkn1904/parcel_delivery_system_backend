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
  fullName: string;
  email: string;
  password?: string;
  role: Role;
  phone?: string;
  address?: string;
  isBlocked?: boolean;
  auths: IAuthProvider[]
}