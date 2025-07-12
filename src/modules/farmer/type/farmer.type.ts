import { VerificationStatus } from "../dto/update-farmer.dto";


export type Farmer = {
  id: string;
  location?: string | null;
  verificationStatus: VerificationStatus;
  rating: number;
  farmDetails?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    address?: string | null;
  };
};
