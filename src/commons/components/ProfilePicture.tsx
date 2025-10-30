import React, { useState, useRef } from 'react';
import { useProfilePicture } from '../../auth/ProfilePictureContext';
import "../../styles/profilePicture.css";

interface ProfilePictureComponentProps {
    className?: string;
    size?: number;
}

const ProfilePicture: React.FC<ProfilePictureComponentProps> = ({
    className = '',
    size = 100
}) => {
    const { image, updateProfilePicture } = useProfilePicture();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Previene la navegación del NavLink
        setIsMenuOpen(!isMenuOpen);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await updateProfilePicture(file);
                setIsMenuOpen(false);
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleMyDataClick = () => {
        window.location.href = '/my-data';
    }

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
                                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3 3H0V14H16V3H13L11 1H5L3 3ZM8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z" fill="#000000"></path>
                                    </g>
                                </svg>
                                Subir foto
                            </div>
                            <div className="profile-menu-item" onClick={handleMyDataClick}>
                                <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"></path>
                                    </g>
                                </svg> Mis datos
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
        </>
    );
};

export default ProfilePicture;
