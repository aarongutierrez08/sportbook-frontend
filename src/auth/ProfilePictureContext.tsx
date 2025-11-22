import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getProfilePicture, uploadProfilePicture } from "../api/profileApi";
import { useAuth } from "./useAuth";

interface ProfilePictureContextType {
  image: string | null;
  isLoading: boolean;
  loadProfilePicture: () => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
}

const ProfilePictureContext = createContext<
  ProfilePictureContextType | undefined
>(undefined);

interface ProfilePictureProviderProps {
  children: ReactNode;
}

export const ProfilePictureProvider: React.FC<ProfilePictureProviderProps> = ({
  children,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useAuth();

  const loadProfilePicture = async () => {
    if (status !== "auth") {
      setImage(null);
      return;
    }

    try {
      setIsLoading(true);
      const imageUrl = await getProfilePicture();
      setImage(imageUrl);
    } catch {
      setImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfilePicture = async (file: File) => {
    try {
      setIsLoading(true);
      await uploadProfilePicture(file);
      await loadProfilePicture();
    } catch (error) {
      console.error("Error cargando la foto de perfil:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "auth") {
      loadProfilePicture();
    } else {
      setImage(null);
    }
  }, [status]);

  const value = {
    image,
    isLoading,
    loadProfilePicture,
    updateProfilePicture,
  };

  return (
    <ProfilePictureContext.Provider value={value}>
      {children}
    </ProfilePictureContext.Provider>
  );
};

export const useProfilePicture = () => {
  const context = useContext(ProfilePictureContext);
  if (context === undefined) {
    throw new Error(
      "useProfilePicture must be used within a ProfilePictureProvider"
    );
  }
  return context;
};
