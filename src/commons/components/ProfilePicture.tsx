import React, { useEffect, useState, useRef } from 'react';
import { getProfilePicture, uploadProfilePicture } from '../../api/profileApi';
import "../../styles/profilePicture.css";

interface ProfilePictureComponentProps {
    className?: string;
    size?: number;
}

const ProfilePicture: React.FC<ProfilePictureComponentProps> = ({
    className = '',
    size = 100
}) => {
    const [image, setImage] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadProfilePicture();
    }, []);

    const loadProfilePicture = async () => {
        try {
            const blob = await getProfilePicture();
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
        } catch (error) {
            console.error('Error loading profile picture:', error);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Previene la navegación del NavLink
        setIsMenuOpen(!isMenuOpen);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await uploadProfilePicture(file);
                await loadProfilePicture(); // Recarga la imagen después de subir
                setIsMenuOpen(false);
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Cierra el menú cuando se hace click fuera
    const handleOverlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
    };

    const defaultStyle: React.CSSProperties = {
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        backgroundColor: '#e0e0e0'
    };

    return (
        <>
            <div className={`profile-picture-container ${className}`} onClick={handleClick}>
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

                {isMenuOpen && (
                    <>
                        <div className="profile-menu">
                            <div className="profile-menu-item" onClick={handleUploadClick}>
                                📷 Subir foto
                            </div>
                        </div>
                        <div className="profile-picture-overlay" onClick={handleOverlayClick} />
                    </>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}/>
            </>);
};

export default ProfilePicture;
