import { Tag } from "./tag";

export interface ProjectDetails {
  id: number;
  mainImgUrl?: string;
  name?: string;
  likesCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  elements: ProjectElement[];
  agencyId?: number;
  agencyName?: string;
  agencyAvatarUrl?: string;
}

export interface ProjectImage {
  //   id: number;
  imgUrl: string;
}

export interface ProjectElement {
  type: string;
  image?: ProjectImage;
  text?: string;
}

export class ProjectDetailsObject implements ProjectDetails {
  id: number;
  mainImgUrl?: string;
  name?: string;
  likesCount?: number;
  // isLiked?: boolean;
  // isSaved?: boolean;
  elements: ProjectElement[];
}

export class ProjectImageObject implements ProjectImage {
  //   id: number;
  imgUrl: string;
  tags?: Tag[];
}

export class ProjectElementObject implements ProjectElement {
  type: string;
  image?: ProjectImage;
  text?: string;
}

export interface ProjectCreateRequest {
  name?: string;
  mainImage?: string;
  agencyId?: number;
  elements?: any[];
  tags?: Tag[];
}