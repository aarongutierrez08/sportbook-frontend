import React, { useEffect, useState } from 'react';
import { getProfilePicture } from '../../api/profileApi';

interface ProfilePictureComponentProps {
    className?: string;
    size?: number;
}

const ProfilePicture: React.FC<ProfilePictureComponentProps> = ({
    className = '',
    size = 100
}) => {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const loadProfilePicture = async () => {
            try {
                const blob = await getProfilePicture();
                const imageUrl = URL.createObjectURL(blob);
                setImage(imageUrl);
            } catch (error) {
                console.error('Error loading profile picture:', error);
            }
        };

        loadProfilePicture();

        // Cleanup function to revoke the object URL when component unmounts
        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, []);

    const defaultStyle: React.CSSProperties = {
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        backgroundColor: '#e0e0e0'
    };

    return (
        <div style={{ width: size, height: size }} className={className}>
            {image ? (
                <img
                    src={image}
                    alt="Profile"
                    style={defaultStyle}
                />
            ) : (
                <div style={{
                    ...defaultStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: size * 0.4,
                    color: '#666'
                }}>
                    👤
                </div>
            )}
        </div>
    );
};

export default ProfilePicture;
