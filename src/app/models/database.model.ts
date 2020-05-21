export interface ProjFeed {
  this_project_id?: string;
  name?: String;  // Project name
}

export interface UserFeed {
  member_names?: string[];
}

export interface User {
  this_user_id: String;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Task {
  name: string;
  description: string;
  projected_start_date: Date;
  projected_end_date: Date;
  status: String;
  project_id: String;
  owner_id: String;   
  assignee_id:String;
}

export interface DialogData {
  task: string;
  name: string;
}

export interface Project {
  this_project_id: string;
  creator_id:String;
  description:String;
  name: String;
  project_manager_id:String;
  project_owner_id:String;
  scrum_master_id:String;
}

export interface Team {
  admin_id:String;
  creator_id:String;
  description:String;
  name:String;
}

export interface MembersSubCol {
  member_id?: string;
  member_name?: string;
}

export interface SideBarOrder {
  menu_order?: String[];
}
