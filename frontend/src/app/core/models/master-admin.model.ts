export interface UserRole {
  id: number;
  nik: string;
  role: string;
  name: string;
  email: string;
  phone_number: string;
  work_location: string;
  isSelected?: any;
}

export interface RolePermission {
  role_id: number;
  role_name: string;
  role_detail: string;
  permission_id: number;
  permission_code: string;
  isSelected?: any;
}

export interface Role {
  id: number;
  role_name: string;
  detail: string;
}

export interface Permission {
  id: number;
  code: string;
  detail: string;
}
