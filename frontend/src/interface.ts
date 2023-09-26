import { ReactNode } from "react";

export interface Cuisine {
  id: number;
  cuisine_name: string;
}

interface CooksCuisine {
  cuisine: Cuisine;
  cuisine_id: number;
  eatery_id: number;
  id: number;
}
export interface CreateOpeningHours {
  eatery_id: number;
  opening_time: string;
  closing_time: string;
  day_of_week: string;
  is_closed: boolean;
}

interface OpeningHours {
  id: number;
  eatery_id: number;
  opening_time: string;
  closing_time: string;
  day_of_week: string;
  is_closed: boolean;
}

export interface Eatery {
  id: string;
  email: string;
  restaurant_name: string;
  location: string;
  cuisines: CooksCuisine[];
  role: string;
  latitude: number;
  longitude: number;
  reviews: Review[];
  opening_hours: OpeningHours[];
  is_open_now: boolean;
  eatery_image: Array<string>;
}
export interface Images {
  images: Array<any>;
  image_ids: Array<any>;
}
export interface Review {
  rating: number;
  review_text: string;
  id: string;
  customer_id: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
  role: UserRole;
  restaurant_name: string; //Eatery User
}

export interface Voucher {
  id: string;
  description: string;
  eatery_id: string;
  quantity: number;
  start: Date;
  expiry: Date;
  loyalty_points: number | null;
}

export interface AddVoucher {
  description: string;
  eatery_id: string | undefined;
  quantity: number;
  start: string;
  expiry: string;
  is_schedule?: boolean,
  schedule_start_time?: string,
  schedule_end_time?: string,
  schedule_week_day?: string
}

export interface UpdateLoyaltyPoints {
  eatery_id: number | null;
  customer_id: string | undefined;
  action: string;
  points: number;
}

export interface UpdatePassword {
  currentPassword: string;
  newPassword: string;
}
// CONTEXT

export interface EateryContextProps {
  token: string | null;
  fetchEateries: () => Promise<void>;
  fetchEateryImages: (eateryId: string) => Promise<void>;
  getReview: (eateryId: string) => Promise<Review | void>;
  getAllReviews: (eateryId: string) => Promise<Array<Review> | void>;
  addReview: (
    eateryId: string,
    rating: string,
    reviewText: string
  ) => Promise<boolean | void>;
  deleteReview: (reviewId: string) => Promise<boolean | void>;
  fetchEatery: (id: string) => Promise<Eatery | null>;
  eatery: Eatery | null;
  eateries: Array<Eatery>;
  eateryImages: Images | null;
  review: Review | null;
  allReviews: Array<Review>;
  addImage: (imageFile: File) => Promise<boolean>;
  deleteImage: (imageId: string) => Promise<boolean>;
  getEateryImage: (imageId: string) => Promise<string | undefined>;
  getAllCuisines: () => Promise<Array<Cuisine> | void>;
  allCuisines: Array<Cuisine>;
  addMenuCuisines: (cuisineIds: Array<number>) => Promise<number | null>;
  addOpenHours: (
    formDate: Array<CreateOpeningHours>
  ) => Promise<CreateOpeningHours | void>;
  // Add or Deduct Customer points
  updateLoyaltyPoints: (
    formDate: UpdateLoyaltyPoints
  ) => Promise<UpdateLoyaltyPoints | void>;
  addCustomerToLoyalty: (
    eateryId: string,
    customerId: string
  ) => Promise<boolean | void>;
  recommendedEateries: object | null,
  fetchRecommendedEateries: (lat: number, lon: number) => Promise<object | null>
}
export interface AuthContextType {
  token: string | null;
  getAllReviews: (eateryId: string) => Promise<Array<Review> | void>;
  isAuthenticated: () => boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  googleLogin: (code: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    role: string,
    location?: string,
    latitude?: number,
    longitude?: number
  ) => Promise<boolean>;
  passwordResetRequest: (email: string, role: string) => Promise<boolean>;
  passwordReset: (resetCode: any, newPassword: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  fetchUser: () => Promise<void>;
  user: User | null;
  getUserById: (id: string) => Promise<User | void>;
  updateProfile: (name: string, email: string) => Promise<User>;
  updateEateryUser: (restaurant_name: string, email: string) => Promise<User>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updatePassword: (
    current_password: string,
    new_password: string
  ) => Promise<UpdatePassword>;
}
export interface VoucherContextProps {
  customerVouchers: Array<Voucher>;
  eateryVouchers: Array<Voucher>;
  fetchVouchers: (customerId: string) => Promise<void>;
  claimVoucher: (voucherId: string, customerId: string) => Promise<any>;
  fetchVouchersForEatery: (eateryId: string) => Promise<void>;
  addVoucher: (formDate: AddVoucher) => Promise<AddVoucher | void>;
  deleteVoucher: (voucherId: string) => Promise<boolean | void>;
  fetchQRCode: () => Promise<object>;
  verifyQRCode: (customer_id: string, code: string) => Promise<boolean | void>;
  deleteCustomerVoucher: (voucherId: string, customerId: string) => Promise<boolean | void>;
}

export interface Props {
  children?: ReactNode;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  role: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface ResetPassword {
  newPassword: string;
  resetCode: string;
}

export interface SignInFormInputs {
  email: string;
  password: string;
  role: "customer" | "eatery";
}

export interface Review {
  rating: number;
  review_text: string;
  id: string;
}

// utils/location
export type SetUserLocation = React.Dispatch<
  React.SetStateAction<{ lat: number; lng: number }>
>;
export interface UserPosition {
  lat: number;
  lng: number;
}

// Map
export type MapRef = React.MutableRefObject<google.maps.Map | null>;
export type SetLoadingPosition = React.Dispatch<React.SetStateAction<boolean>>;
export type SetUpLocation = (
  setUserLocation: SetUserLocation,
  setLoadingPosition: SetLoadingPosition,
  mapRef: MapRef
) => void;
export interface ClusterProps {
  count: number;
  position: google.maps.LatLng | google.maps.LatLngLiteral;
}
export interface MapProps {
  findLocation: Eatery | null;
}

export interface TabProps {
  eatery: Eatery;
  user: User;
}

export enum UserRole {
  EATERY = "eatery",
  CUSTOMER = "customer",
  // add more if you have
}