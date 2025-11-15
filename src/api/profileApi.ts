import type {
  FootballProfileDetail,
  PaddleProfileDetail,
  SportProfile,
  VolleyProfileDetail,
} from "../types/apiTypes";
import api from "./axios";

export const fetchProfiles = async (): Promise<SportProfile[]> => {
  const res = await api.get<SportProfile[]>("/profile");
  return res.data;
};

export const updateFootballProfile = async (
  body: FootballProfileDetail
): Promise<FootballProfileDetail> => {
  const res = await api.put<FootballProfileDetail>("/profile/football", body);
  return res.data;
};

export const updateVolleyProfile = async (
  body: VolleyProfileDetail
): Promise<VolleyProfileDetail> => {
  const res = await api.put<VolleyProfileDetail>("/profile/volley", body);
  return res.data;
};

export const updatePaddleProfile = async (
  body: PaddleProfileDetail
): Promise<PaddleProfileDetail> => {
  const res = await api.put<PaddleProfileDetail>("/profile/paddle", body);
  return res.data;
};

export const getProfilePicture = async () => {
  const res = await api.get("/profile-picture", { responseType: "blob" });
  return res.data;
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/profile-picture/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
