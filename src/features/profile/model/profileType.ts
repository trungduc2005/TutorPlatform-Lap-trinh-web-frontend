import type { Gender } from "../../../shared/model/enums";

export interface UpdateProfilePayload {
    fullName: string;
    address: string;
    gender: Gender;
    email: string;
    phone: string;
    avatarUrl?: string;
}