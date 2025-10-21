import React from 'react';
import {addTeam} from '../../api/eventsApi';
import toast from 'react-hot-toast';
import '../../styles/addTeamButton.css';
import type {Color, PaddleEvent, VolleyEvent} from "../../types/events.ts";

interface AddTeamButton {
    event: PaddleEvent | VolleyEvent;
    disabled?: boolean
    onTeamAdded: (event: PaddleEvent | VolleyEvent) => void;
}

const AddTeamButton: React.FC<AddTeamButton> = ({ event, disabled, onTeamAdded }) => {
    const handleClick = async () => {
        try {
            const allColors = ["Rojo", "Azul", "Verde", "Negro", "Blanco"]
            const usedColors = event.teams ? event.teams.map(team => team.color) : [];
            const availableColors = event.teams ?
                (allColors as Color[])
                    .filter(color => !usedColors.includes(color)) : ["Negro"];
            const updatedEvent = await addTeam(event.id, {
                players: [], id: 0,
                color: (availableColors[0]? availableColors[0] : "Negro") as Color
            });
            toast.success('Se agregó un nuevo equipo!');
            if (onTeamAdded) {
                onTeamAdded(updatedEvent);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Error al unirse al equipo');
        }
    };

    return (
        <div>
            <button className="add-team-btn" onClick={handleClick} disabled={disabled}>
                Agregar Equipo
            </button>
        </div>
    );
};

export default AddTeamButton;
