export interface IUserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    remember_token: string;
    company: ICompanyEntity
    role: EUserRole
    created_at: string
    updated_at: string
}

export interface ICompanyEntity {
    id: string;
    name: string;
    created_at: string
    updated_at: string
}

export enum EUserRole {
    owner = "owner",
    employee = "employee",
}

export type TCreateCompanyPayload = Omit<ICompanyEntity, "id" | "created_at" | "updated_at">
export type TLoginPayload = Omit<IUserEntity, "id" | "name" | "company" | "remember_token" | "created_at" | "updated_at">
export type TRegisterPayload = Omit<IUserEntity, "id" | "company" | "remember_token" | "created_at" | "updated_at" | "role">
