import React from 'react';
import type {SportEvent, FinishEventParams, FootballEvent, PaddleEvent, VolleyEvent} from '../../types/events';
import '../../styles/finishEventModal.css';
import FootballEventFinishDetails from './events/FootballEventFinishDetails';
import PaddleEventFinishDetails from './events/PaddleEventFinishDetails';
import VolleyEventFinishDetails from './events/VolleyEventFinishDetails';

interface FinishEventModalProps {
    event: SportEvent;
    onClose: () => void;
    onSubmit: (data: FinishEventParams) => void;
}

const FinishEventModal: React.FC<FinishEventModalProps> = ({ event, onClose, onSubmit }) => {
    const renderEventDetails = () => {
        switch (event.sport) {
            case 'FOOTBALL':
                return (
                    <FootballEventFinishDetails
                        event={event as FootballEvent}
                        onSubmit={onSubmit}
                    />
                );
            case 'PADDLE':
                return (
                    <PaddleEventFinishDetails
                        event={event as PaddleEvent}
                        onSubmit={onSubmit}
                    />
                );
            case 'VOLLEY':
                return (
                    <VolleyEventFinishDetails
                        event={event as VolleyEvent}
                        onSubmit={onSubmit}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="fem-modal">
                <h2>Finalizar Evento</h2>
                {renderEventDetails()}
                <div className="fem-modal-actions">
                    <button onClick={onClose} className="fem-cancel-button">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinishEventModal;
