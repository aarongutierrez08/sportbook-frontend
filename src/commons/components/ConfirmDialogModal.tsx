import React from 'react';
import '../../styles/confirmDialog.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay" onClick={onCancel}>
            <div className="confirm-dialog-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirm-dialog-title">{title}</h3>
                <p className="confirm-dialog-message">{message}</p>
                <div className="confirm-dialog-buttons">
                    <button
                        className="confirm-dialog-button cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="confirm-dialog-button confirm"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
