export enum ProjectCategory {
  WEB = "Web",
  API = "Api",
  MOBILE = "Mobile",
  OTHER = "Other",
}

export type  Project = {

  id?: number;
  projectName?: string;
  githubUrl?: string;
  liveUrl?: string;
  published: boolean;
  description?: string;
  imageUrl?: string;
  techStack: string[];
  category: ProjectCategory;
  file ?: File;
  createdAt?: Date;
  updatedAt?: Date;
  publicId?: string;
} 
