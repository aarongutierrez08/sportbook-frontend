import type { FootballProfileDTO, PaddleProfileDTO, SportProfileDTO, UpdateFootballProfileRequest, UpdatePaddleProfileRequest, UpdateVolleyProfileRequest, VolleyProfileDTO } from "../types/user";
import api from "./axios";

export const fetchProfiles = async (): Promise<SportProfileDTO[]> => {
  const res = await api.get<SportProfileDTO[]>("/profile");
  return res.data;
};

export const updateFootballProfile = async (
  body: UpdateFootballProfileRequest
): Promise<FootballProfileDTO> => {
  const res = await api.put<FootballProfileDTO>("/profile/football", body);
  return res.data;
};

export const updateVolleyProfile = async (
  body: UpdateVolleyProfileRequest
): Promise<VolleyProfileDTO> => {
  const res = await api.put<VolleyProfileDTO>("/profile/volley", body);
  return res.data;
};

export const updatePaddleProfile = async (
  body: UpdatePaddleProfileRequest
): Promise<PaddleProfileDTO> => {
  const res = await api.put<PaddleProfileDTO>("/profile/paddle", body);
  return res.data;
};

export const getProfilePicture = async () => {
    const res = await api.get("/profile-picture", { responseType: 'blob' });
    return res.data;
}

export const uploadProfilePicture = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post("/profile-picture", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
}
