import toast from 'react-hot-toast';
import '../styles/confirmDialog.css';

interface ConfirmDialogProps {
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const showConfirmDialog = async ({
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}: ConfirmDialogProps): Promise<boolean> => {
    let confirmed = false;

    await new Promise<void>((resolve) => {
        toast((t) => (
            <div className="confirm-dialog">
                <p>{message}</p>
                <div className="confirm-dialog-buttons">
                    <button
                        className="confirm-dialog-button confirm"
                        onClick={() => {
                            confirmed = true;
                            toast.dismiss(t.id);
                            resolve();
                        }}
                    >
                        {confirmText}
                    </button>
                    <button
                        className="confirm-dialog-button cancel"
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve();
                        }}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            style: {
                background: '#333',
                color: 'white',
                padding: '1rem',
            }
        });
    });

    return confirmed;
};

export default showConfirmDialog;
