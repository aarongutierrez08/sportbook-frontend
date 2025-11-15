import type { Gender, Role, SportUser } from "../types/apiTypes";
import api from "./axios";

export interface UpdateUserDataParams {
  id?: number;
  username?: string;
  email?: string;
  name?: string;
  lastName?: string;
  dateOfBirth?: string;
  role?: Role;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  gender?: Gender;
  languages?: string[];
}

export const updateSportUser = async (
  user: UpdateUserDataParams
): Promise<SportUser> => {
  const res = await api.put<SportUser>("/user-data/" + user.id, user);
  return res.data;
};
