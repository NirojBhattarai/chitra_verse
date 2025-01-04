export interface IuserData {
  username: string;
  fullname: string;
  email: string;
  avatar: string;
  coverImage: string;
  password: string;
}

export interface IuserDataResponse {
  username: string;
  fullname: string;
  email: string;
  avatar: string;
  coverImage: string;
  password: string;
}

export interface SideBarProps {
  isSidebarOpen: boolean;

  toggleSidebar: () => void;
}

export interface IVideo {
  _id: string;
  url:string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  views: number;
  duration: number;
  isPublished: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVideo {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  views: number;
  duration: number;
  createdAt: string;
  videoFile: string;
}
