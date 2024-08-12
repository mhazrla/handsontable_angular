export interface User {
  id: number;
  nik: string;
  role: string;
  name: string;
  email: string;
  phone_number: string;
  work_location: string;
  isSelected?: any;
}

export interface Authorization {
  id: number;
  name: string;
  nik: string;
  role_id: string;
  role_name: string;
  user_type: string;
  account_sap: string;
  account_sap_password: string;
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

export interface RolePermission {
  role_id: number;
  role_name: string;
  role_detail: string;
  permission_id: number;
  permission_code: string;
}

export interface UserCompany {
  id: number;
  nik: string;
  name: string;
  company: string;
  created_by: string;
  created_at: string;
}
