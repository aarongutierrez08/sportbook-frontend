import React, { useState } from 'react';
import { finishEvent } from '../api/eventsApi';
import type {FinishEventParams, SportEvent} from '../types/events';
import toast from 'react-hot-toast';
import '../styles/finishEventButton.css';
import showConfirmDialog from './ConfirmDialog';
import FinishEventModal from './FinishEventModal';

interface FinishEventButtonProps {
    event: SportEvent;
    onFinish?: () => void;
    className?: string;
}

const FinishEventButton: React.FC<FinishEventButtonProps> = ({ event, onFinish, className }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleFinish = async () => {
        const confirmed = await showConfirmDialog({
            message: '¿Estás seguro que deseas finalizar el evento?'
        });

        if (!confirmed) return;
        setShowModal(true);
    };

    const handleModalSubmit = async (params: FinishEventParams) => {
        setIsSubmitting(true);
        try {
            await finishEvent(event.id, params);
            toast.success('Evento finalizado exitosamente');
            setShowModal(false);
            onFinish?.();
        } catch (error) {
            console.error('Error al finalizar el evento:', error);
            toast.error('Error al finalizar el evento');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className={`finish-event-button ${className || ''}`}
            >
                {isSubmitting ? 'Finalizando...' : 'Finalizar Evento'}
            </button>

            {showModal && (
                <FinishEventModal
                    event={event}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleModalSubmit}
                />
            )}
        </>
    );
};

export default FinishEventButton;
