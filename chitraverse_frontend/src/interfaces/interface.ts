export interface IuserData {
    username:String,
    fullname:String,
    email:String,
    avatar:File,
    coverImage:File,
    password:String
}

export interface IuserDataResponse {
    username:String,
    fullname:String,
    email:String,
    avatar:String,
    coverImage:String,
    password:String
}


export interface SideBarProps {

    isSidebarOpen: boolean;
  
    toggleSidebar: () => void;
  
  }
  