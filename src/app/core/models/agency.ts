import { City } from "./city";
import { Tag } from "./tag";

export interface Project {
  id: number;
  imgUrl: string;
  name?: string;
  likesCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Review {
  id: number;
  userName: string;
  userImage?: string;
  userId: number;
  rate: number;
  createdOn: Date;
  message?: string;
}

export interface Agency {
  id: number;
  isAvailable?: boolean;
  userId?: number;
  name: string;
  logoImgUrl?: string;
  headerImgUrl?: string;
  contactFirstName?: string;
  contactLastName?: string;
  phoneNumber?: string;
  email?: string;
  about?: string;
  description?: string;
  remoteAvailable?: boolean;
  onSiteAvailable?: boolean;
  tags?: Tag[];
  city: City;
  budget: string;
  followersCount?: number;
  likesCount?: number;
  savesCount?: number;
  isSaved?: boolean;
  rate: number;
  projects: Project[];
  reviews?: Review[];
}

export interface CreateAgencyRequest {
  name: string,
  email: string;
}