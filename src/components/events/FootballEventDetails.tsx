import React from "react";
import type { FootballEvent, UpdateEventParams } from "../../types/events";
import { formatDate } from "../../utils/events";
import FootballPitch from "../FootballPitch";
import MiniMap from "../MiniMap";
import LocationPickerMap from "../LocationPickerMap";

interface FootballEventDetailsProps {
    event: FootballEvent;
    editForm: UpdateEventParams;
    isEditingLocation: boolean;
    setIsEditingLocation: (value: boolean) => void;
    handleLocationChange: (lat: number, lng: number, placeName?: string) => void;
    renderEditableField: (label: string, value: string | number, field: keyof UpdateEventParams, type?: string) => React.ReactNode;
}

const FootballEventDetails: React.FC<FootballEventDetailsProps> = ({
    event,
    editForm,
    isEditingLocation,
    setIsEditingLocation,
    handleLocationChange,
    renderEditableField,
}) => {
    return (
        <>
            <div className="event-page-details">
                <div className="event-page-section">
                    <h3>Detalles del Evento</h3>
                    <p>Fecha y hora: {formatDate(event.dateTime)}</p>
                    {renderEditableField('Organizador', event.organizer, 'organizer')}
                    <p>Jugadores: {event.players.length} / {event.minPlayers}</p>
                    {renderEditableField('Costo', event.cost, 'cost', 'number')}
                    {event.pitchSize && renderEditableField('Tamaño de cancha', event.pitchSize, 'pitchSize', 'number')}
                </div>

                <div className="event-page-section">
                    <h3>Ubicación</h3>
                    {renderEditableField('Lugar', event.location.placeName, 'locationPlaceName')}
                    <div className="location-edit-container">
                        {!isEditingLocation ? (
                            <div className="event-page-minimap">
                                {event.location && (
                                    <MiniMap lat={event.location.x} lng={event.location.y} />
                                )}
                                <button
                                    className="edit-location-button"
                                    onClick={() => setIsEditingLocation(true)}
                                >
                                    Cambiar ubicación ✏️
                                </button>
                            </div>
                        ) : (
                            <div className="location-picker-container">
                                <LocationPickerMap
                                    lat={editForm.locationX ?? event.location.x}
                                    lng={editForm.locationY ?? event.location.y}
                                    onChange={handleLocationChange}
                                />
                                <button
                                    className="cancel-location-button"
                                    onClick={() => setIsEditingLocation(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="event-page-section">
                    <h3>Datos de Pago</h3>
                    <div className="event-page-payment-info">
                        {renderEditableField('Alias', event.transferData.alias, 'transferDataAlias')}
                        {renderEditableField('CBU', event.transferData.cbu, 'transferDataCbu')}
                    </div>
                </div>
            </div>

            <div className="event-page-section">
                <h3>Jugadores</h3>
                <ul className="event-page-players-list">
                    {event.players.map(player => (
                        <li key={player.user.username}>{player.name}</li>
                    ))}
                </ul>
            </div>

            <div className="event-page-section">
                <h3>Equipos</h3>
                <div className="event-page-team-section">
                    <div
                        className="event-page-team-card"
                        data-color={event.firstTeam.color}
                    >
                        <h4>Equipo {event.firstTeam.color}</h4>
                        <ul className="event-page-players-list">
                            {event.firstTeam.players.map(player => (
                                <li key={player.user.username}>{player.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div
                        className="event-page-team-card"
                        data-color={event.secondTeam.color}
                    >
                        <h4>Equipo {event.secondTeam.color}</h4>
                        <ul className="event-page-players-list">
                            {event.secondTeam.players.map(player => (
                                <li key={player.user.username}>{player.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="event-page-pitch-container">
                    <h3>Distribución táctica</h3>
                    <FootballPitch
                        eventId={Number(event.id)}
                        firstTeamColor={event.firstTeam.color}
                        secondTeamColor={event.secondTeam.color}
                        pitchSize={Number(event.pitchSize)}
                    />
                </div>
            </div>
        </>
    );
};

export default FootballEventDetails;
