export interface UserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    remember_token: string;
    company: CompanyEntity
    created_at: string
    updated_at: string
}

export interface CompanyEntity {
    id: string;
    name: string;
    created_at: string
    updated_at: string
}

export type TCreateCompanyPayload = Omit<CompanyEntity, "id" | "created_at" | "updated_at">
export type TLoginPayload = Omit<UserEntity, "id" | "name" | "company" | "remember_token" | "created_at" | "updated_at">
export type TRegisterPayload = Omit<UserEntity, "id" | "company" | "remember_token" | "created_at" | "updated_at">
