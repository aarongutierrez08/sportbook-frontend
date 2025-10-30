import React, { useState } from "react";
import "../styles/myDataPage.css"
import {useAuth} from "../auth/useAuth.ts";
import {useProfilePicture} from "../auth/ProfilePictureContext";
import {formatDate} from "../utils/dateUtils.ts";
import {updateSportUser, UpdateUserDataParams} from "../api/userDataApi.ts";
import toast from 'react-hot-toast';

const MyDataPage: React.FC = () => {
    const { user: loggedUser, setUser } = useAuth();
    const { image, isLoading, updateProfilePicture } = useProfilePicture();

    // Estado para campos editables individuales
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editedUser, setEditedUser] = useState<UpdateUserDataParams | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Inicializar datos editables
    const initializeEditedUser = () => {
        if (!editedUser) {
            setEditedUser({
                id: loggedUser?.id,
                username: loggedUser?.username || "",
                email: loggedUser?.email || "",
                name: loggedUser?.name || "",
                lastName: loggedUser?.lastName || "",
                dateOfBirth: loggedUser?.dateOfBirth || "",
                role: loggedUser?.role,
                phoneNumber: loggedUser?.additionalInfo?.phoneNumber || "",
                country: loggedUser?.additionalInfo?.country || "",
                city: loggedUser?.additionalInfo?.city || "",
                address: loggedUser?.additionalInfo?.address || "",
                gender: loggedUser?.additionalInfo?.gender || "PREFER_NOT_TO_SAY",
                languages: loggedUser?.additionalInfo?.languages || []
            });
        }
    };

    // Empezar a editar un campo específico
    const startEditingField = (fieldName: string) => {
        initializeEditedUser();
        setEditingField(fieldName);
    };

    // Terminar de editar (al perder focus o presionar Enter)
    const stopEditingField = () => {
        setEditingField(null);
    };

    // Cancelar todos los cambios
    const cancelAllChanges = () => {
        setEditedUser(null);
        setEditingField(null);
        setHasChanges(false);
    };

    // Guardar cambios
    const saveChanges = async () => {
        if (!editedUser || !hasChanges) return;

        setIsSaving(true);
        try {
            const updatedUser = await updateSportUser(editedUser);
            setUser(() => updatedUser);
            setEditedUser(null);
            setEditingField(null);
            setHasChanges(false);
            toast.success('Datos actualizados correctamente');
        } catch (error) {
            console.error('Error updating user data:', error);
            toast.error('Error al actualizar los datos. Por favor, intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    // Manejar cambios en los campos
    const handleFieldChange = (field: string, value: string) => {
        initializeEditedUser();

        const newEditedUser = {
            ...editedUser!,
            [field]: value
        };

        setEditedUser(newEditedUser);

        // Verificar si hay cambios comparando con los datos originales
        const hasActualChanges = checkForChanges(newEditedUser);
        setHasChanges(hasActualChanges);
    };

    // Manejar cambios en idiomas
    const handleLanguagesChange = (languages: string) => {
        initializeEditedUser();

        const languageArray = languages.split(',').map(lang => lang.trim()).filter(lang => lang);
        const newEditedUser = {
            ...editedUser!,
            languages: languageArray
        };

        setEditedUser(newEditedUser);

        const hasActualChanges = checkForChanges(newEditedUser);
        setHasChanges(hasActualChanges);
    };

    // Verificar si hay cambios reales comparando con los datos originales
    const checkForChanges = (currentData: UpdateUserDataParams): boolean => {
        if (!loggedUser) return false;

        return (
            currentData.name !== (loggedUser.name || "") ||
            currentData.lastName !== (loggedUser.lastName || "") ||
            currentData.dateOfBirth !== (loggedUser.dateOfBirth || "") ||
            currentData.email !== (loggedUser.email || "") ||
            currentData.role !== loggedUser.role ||
            currentData.phoneNumber !== (loggedUser.additionalInfo?.phoneNumber || "") ||
            currentData.country !== (loggedUser.additionalInfo?.country || "") ||
            currentData.city !== (loggedUser.additionalInfo?.city || "") ||
            currentData.address !== (loggedUser.additionalInfo?.address || "") ||
            currentData.gender !== (loggedUser.additionalInfo?.gender || "PREFER_NOT_TO_SAY") ||
            JSON.stringify(currentData.languages) !== JSON.stringify(loggedUser.additionalInfo?.languages || [])
        );
    };

    // Obtener el valor actual del campo (editado o original)
    const getFieldValue = (field: string): string => {
        if (editedUser) {
            return (editedUser as any)[field] || "";
        }

        // Mapear campos de additionalInfo
        if (field === 'phoneNumber') return loggedUser?.additionalInfo?.phoneNumber || "";
        if (field === 'country') return loggedUser?.additionalInfo?.country || "";
        if (field === 'city') return loggedUser?.additionalInfo?.city || "";
        if (field === 'address') return loggedUser?.additionalInfo?.address || "";
        if (field === 'gender') return loggedUser?.additionalInfo?.gender || "PREFER_NOT_TO_SAY";
        if (field === 'languages') return loggedUser?.additionalInfo?.languages?.join(', ') || "";

        return (loggedUser as any)?.[field] || "";
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await updateProfilePicture(file);
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                alert('Error al subir la foto. Por favor, intenta de nuevo.');
            }
        }
    };

    const handleUploadClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = handleFileChange;
        fileInput.click();
    };

    const mapRole = (role: string) => {
        return role === 'ORGANIZER' ? 'Organizador' : 'Jugador';
    }

    const mapGender = (gender: string) => {
        switch (gender) {
            case 'MAN':
                return 'Hombre';
            case 'WOMAN':
                return 'Mujer';
            case 'NON_BINARY':
                return 'No binario';
            case 'PREFER_NOT_TO_SAY':
                return 'Prefiero no decirlo';
            default:
                return 'Prefiero no decirlo';
        }
    }

    const generalInformationCard = () => {
        return <div className="my-data-info-card">
            <div className="my-data-card-header">
                Información general
            </div>
            <div className="info-item">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.5934 22C20.5934 18.13 16.7734 15 12.0001 15C7.22672 15 3.40674 18.13 3.40674 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {editingField === 'name' ? (
                    <span>
                        Nombre:
                        <input
                            type="text"
                            value={getFieldValue('name')}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            className="edit-input"
                            onBlur={stopEditingField}
                            onKeyDown={(e) => e.key === 'Enter' ? stopEditingField() : undefined}
                        />
                    </span>
                ) : (
                    <span onClick={() => startEditingField('name')}>Nombre: {getFieldValue('name')}</span>
                )}
            </div>
            <div className="info-item">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.5934 22C20.5934 18.13 16.7734 15 12.0001 15C7.22672 15 3.40674 18.13 3.40674 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {editingField === 'lastName' ? (
                    <span>
                        Apellido:
                        <input
                            type="text"
                            value={getFieldValue('lastName')}
                            onChange={(e) => handleFieldChange('lastName', e.target.value)}
                            className="edit-input"
                            onBlur={stopEditingField}
                            onKeyDown={(e) => e.key === 'Enter' ? stopEditingField() : undefined}
                        />
                    </span>
                ) : (
                    <span onClick={() => startEditingField('lastName')}>Apellido: {getFieldValue('lastName')}</span>
                )}
            </div>
            <div className="info-item">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {editingField === 'dateOfBirth' ? (
                    <span>
                        Fecha de nacimiento:
                        <input
                            type="date"
                            value={getFieldValue('dateOfBirth')}
                            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                            className="edit-input"
                            onBlur={stopEditingField}
                            onKeyDown={(e) => e.key === 'Enter' ? stopEditingField() : undefined}
                        />
                    </span>
                ) : (
                    <span onClick={() => startEditingField('dateOfBirth')}>Fecha de nacimiento: {formatDate(getFieldValue('dateOfBirth'))}</span>
                )}
            </div>
            <div className="info-item">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {editingField === 'email' ? (
                    <span>
                        Email:
                        <input
                            type="email"
                            value={getFieldValue('email')}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            className="edit-input"
                            placeholder="Ej: usuario@ejemplo.com"
                            onBlur={stopEditingField}
                            onKeyDown={(e) => e.key === 'Enter' ? stopEditingField() : undefined}
                        />
                    </span>
                ) : (
                    <span onClick={() => startEditingField('email')}>Email: {getFieldValue('email')}</span>
                )}
            </div>
            <div className="info-item">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17,11 19,13 23,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {editingField === 'role' ? (
                    <span>
                        Rol:
                        <select
                            value={getFieldValue('role')}
                            onChange={(e) => handleFieldChange('role', e.target.value)}
                            className="edit-select"
                            onBlur={stopEditingField}
                        >
                            <option value="PLAYER">Jugador</option>
                            <option value="ORGANIZER">Organizador</option>
                        </select>
                    </span>
                ) : (
                    <span onClick={() => startEditingField('role')}>Rol: {mapRole(getFieldValue('role'))}</span>
                )}
            </div>
        </div>
    }

    const profilePictureCard = () => {
        return <div className="my-data-profile-card">
            <div className="my-data-card-header">
                Foto de perfil
            </div>
            <div className="profile-picture-container">
                {image ? (
                    <img
                        src={image}
                        alt="ProfilePicture"
                        className="profile-picture"
                    />
                ) : (
                    <div className="profile-picture-placeholder">
                        👤
                    </div>
                )}
            </div>
            <button
                className="btn btn--block btn--primary"
                onClick={handleUploadClick}
                disabled={isLoading}
            >
                {isLoading ? 'Subiendo...' : 'Cambiar foto'}
            </button>

            {/* Solo mostrar botones cuando hay cambios */}
            {hasChanges && (
                <div className="edit-buttons-section" style={{ marginTop: '1rem' }}>
                    <div className="edit-buttons">
                        <button
                            className="btn btn--block btn--primary"
                            onClick={saveChanges}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            className="btn btn--block btn--secondary"
                            onClick={cancelAllChanges}
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    }

    const aboutMeCard = () => {
        const aboutMeWithPreviousData = () =>
            (<>
                <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {editingField === 'phoneNumber' ? (
                        <span>
                            Número de teléfono:
                            <input
                                type="tel"
                                value={getFieldValue('phoneNumber')}
                                onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                                className="edit-input"
                                placeholder="Ej: 1128620683"
                                onBlur={stopEditingField}
                                onKeyDown={(e) => e.key === 'Enter' ? stopEditingField() : undefined}
                            />
                        </span>
                    ) : (
                        <span onClick={() => startEditingField('phoneNumber')}>Número de teléfono: {getFieldValue('phoneNumber') || ""}</span>
                    )}
                </div>
                <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 12h20" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {editingField === 'country' ? (
                        <span>
                            País:
                            <input
                                type="text"
                                value={getFieldValue('country')}
                                onChange={(e) => handleFieldChange('country', e.target.value)}
                                className="edit-input"
                                placeholder="Ej: Argentina"
                                onBlur={stopEditingField}
                                onKeyDown={(e) => e.key === 'Enter' ? stopEditingField() : undefined}
                            />
                        </span>
                    ) : (
                        <span onClick={() => startEditingField('country')}>País: {getFieldValue('country') || ""}</span>
                    )}
                </div>
                <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11.5c1.38 0 2.5-1.12 2.5-2.5S13.38 6.5 12 6.5 9.5 7.62 9.5 9s1.12 2.5 2.5 2.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {editingField === 'city' ? (
                        <span>
                            Ciudad:
                            <input
                                type="text"
                                value={getFieldValue('city')}
                                onChange={(e) => handleFieldChange('city', e.target.value)}
                                className="edit-input"
                                placeholder="Ej: Buenos Aires"
                                onBlur={stopEditingField}
                                onKeyDown={(e) => e.key === 'Enter' ? stopEditingField() : undefined}
                            />
                        </span>
                    ) : (
                        <span onClick={() => startEditingField('city')}>Ciudad: {getFieldValue('city') || ""}</span>
                    )}
                </div>
                <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {editingField === 'address' ? (
                        <span>
                            Dirección:
                            <input
                                type="text"
                                value={getFieldValue('address')}
                                onChange={(e) => handleFieldChange('address', e.target.value)}
                                className="edit-input"
                                placeholder="Ej: Calle Falsa 123"
                                onBlur={stopEditingField}
                                onKeyDown={(e) => e.key === 'Enter' ? stopEditingField() : undefined}
                            />
                        </span>
                    ) : (
                        <span onClick={() => startEditingField('address')}>Dirección: {getFieldValue('address') || ""}</span>
                    )}
                </div>
                <div className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {editingField === 'gender' ? (
                        <span>
                            Género:
                            <select
                                value={getFieldValue('gender')}
                                onChange={(e) => handleFieldChange('gender', e.target.value)}
                                className="edit-select"
                                onBlur={stopEditingField}
                            >
                                <option value="MAN">Hombre</option>
                                <option value="WOMAN">Mujer</option>
                                <option value="NON_BINARY">No binario</option>
                                <option value="PREFER_NOT_TO_SAY">Prefiero no decirlo</option>
                            </select>
                        </span>
                    ) : (
                        <span onClick={() => startEditingField('gender')}>Género: {mapGender(getFieldValue('gender')) || ""}</span>
                    )}
                </div>
                <div className="info-item">
                    <svg className="info-icon" fill="none" xmlns="http://www.w3.org/2000/svg"width="24" height="24" viewBox="0 0 50 50">
                        <path stroke="currentColor" strokeWidth="2" d="M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z"></path>
                    </svg>
                    {editingField === 'languages' ? (
                        <span>
                            Idiomas:
                            <input
                                type="text"
                                value={getFieldValue('languages')}
                                onChange={(e) => handleLanguagesChange(e.target.value)}
                                className="edit-input"
                                placeholder="Ej: Español, Inglés (separados por comas)"
                                onBlur={stopEditingField}
                                onKeyDown={(e) => e.key === 'Enter' ? stopEditingField() : undefined}
                            />
                        </span>
                    ) : (
                        <span onClick={() => startEditingField('languages')}>Idiomas: {getFieldValue('languages') || ""}</span>
                    )}
                </div>
            </>)

        return <div className="my-data-info-card">
            <div className="my-data-card-header">
                Sobre mí
            </div>
            {loggedUser?.additionalInfo || editingField === 'all'
                ? <span>{aboutMeWithPreviousData()}</span>
                : <>
                    <span>Aquí puedes agregar información adicional sobre ti.</span>
                    <span>{aboutMeWithPreviousData()}</span>
                </>}
        </div>
    }

    return (
        <div className="my-data-grid-container my-data-card">
            <div className="my-data-header">
                <div className="page-title">
                    Mis Datos
                </div>
            </div>
            <div className="my-data-content">
                {generalInformationCard()}
                {profilePictureCard()}
                {aboutMeCard()}
            </div>
        </div>
    );
}

export default MyDataPage;