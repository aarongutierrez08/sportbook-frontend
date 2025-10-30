import api from "./axios";
import type {SportUser} from "../types/user.ts";

export interface UpdateUserDataParams {
    username?: string,
    email?: string,
    name?: string,
    lastName?: string,
    dateOfBirth?: string,
    role?: Role,
    phoneNumber?: string,
    address?: string,
    city?: string,
    country?: string
    gender?: Gender,
    languages?: string[]
}

export const updateSportUser = async (user: UpdateUserDataParams): Promise<SportUser> => {
    const res = await api.put<SportUser>("/user-data/" + user.id, user);
    return res.data
}