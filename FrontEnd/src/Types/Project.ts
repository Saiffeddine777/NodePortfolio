export enum ProjectCategory {
  WEB = "Web",
  API = "Api",
  MOBILE = "Mobile",
  OTHER = "Other",
}

export interface Project {
  [key:string]: any;
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
}
