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

export interface IPlaylist{
  _id: string;
  name: string;
  description: string;
  videos: string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface IComment{
  _id: string;
  content:string;
  video:string[];
  owner:string;
  createdAt:string;
  updatedAt:string;
}