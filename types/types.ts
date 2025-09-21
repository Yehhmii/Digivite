// types.ts
export type RSVPStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

/* ---------------------- Core Models ---------------------- */

export type Event = {
  id: string;
  slug: string;
  title: string;
  date: string; // Date as ISO string when sent to frontend
  venue?: string | null;
  createdAt: string;
  updatedAt: string;

  adminId?: string | null;
};

export type Table = {
  id: string;
  eventId: string;
  number: number;
  capacity: number;
  createdAt: string;
};

export type Gift = {
  id: string;
  eventId: string;
  guestId?: string | null;
  amount?: number | null;
  note?: string | null;
  provider?: string | null;
  createdAt: string;
};

export type Guest = {
  id: string;
  eventId: string;

  fullName: string;
  email?: string | null;
  phone?: string | null;
  status: RSVPStatus;
  numberOfGuests: number;
  qrCodeToken: string;
  slug?: string | null;
  checkedIn: boolean;
  checkInTime?: string | null;

  tableId?: string | null;

  giftSent: boolean;
  createdAt: string;
  updatedAt: string;

  // optional: include related data
  table?: Table | null;
  gifts?: Gift[];
};

export type Admin = {
  id: string;
  email: string;
  name?: string | null;
  password: string;
  salt?: string | null;
  resetToken?: string | null;
  resetExpires?: string | null;
  createdAt: string;
  updatedAt: string;
};

/* ---------------------- DTO Helpers ---------------------- */

// Example: short guest for lists
export type GuestShort = Pick<
  Guest,
  | 'id'
  | 'fullName'
  | 'email'
  | 'phone'
  | 'numberOfGuests'
  | 'tableId'
  | 'status'
  | 'checkedIn'
  | 'checkInTime'
> & {
  tableNumber?: number | null;
  gifts?: Gift[];
};

// Example: status counts
export type GuestStatusCounts = {
  PENDING: number;
  ACCEPTED: number;
  DECLINED: number;
};



/// ----------- contact us types -----------//
export interface ContactFormData {
  fullName: string;
  email: string;
  serviceType: string;
  message: string;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  serviceType?: string;
  message?: string;
}