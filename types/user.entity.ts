export interface IUserEntity {
    [key: string]: any;
    id: string;
    name: string;
    surname: string;
    phone: string;
    city: string;
    address: string;
    email: string;
    password: string;
    remember_token: string;
    company: ICompanyEntity
    role: EUserRole
    notes: string
    created_at: string
    updated_at: string
}

export interface ICompanyEntity {
    id: string;
    name: string;
    city: string;
    post_code: string;
    address: string;
    web_site: string;
    currency: string;
    created_at: string
    updated_at: string
}

export enum EUserRole {
    owner = "owner",
    employee = "employee",
}

export type TUserUpdatePayload = Pick<IUserEntity, 'name'>
export type TCompanyUpdatePayload = Pick<ICompanyEntity, 'name'>
export type TCreateCompanyPayload = Pick<ICompanyEntity, 'name'>
export type TLoginPayload = Pick<IUserEntity, "email" | "password">
export type TRegisterPayload = Pick<IUserEntity, 'name' | 'email' | 'password'>
export type TEmployeeCreatePayload = Pick<IUserEntity, 'name' | 'surname' | 'email' | 'phone' | 'role' | 'notes'>

