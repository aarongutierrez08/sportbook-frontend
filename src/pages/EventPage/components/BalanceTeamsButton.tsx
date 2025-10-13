import toast from "react-hot-toast";
import {balanceEvent} from "../../../api/eventsApi.ts";
import React from "react";

interface BalanceTeamsButtonProps {
    eventId: number;
    onBalance?: () => void;
}

const BalanceTeamsButton: React.FC<BalanceTeamsButtonProps> = ({eventId, onBalance}) => {
    const onClick = async () => {
        toast.promise(
            async () => {
                await balanceEvent(eventId);
                if (onBalance) {
                    onBalance();
                }
            },
            {
                loading: "Balanceando Evento...",
                success: "Evento balanceado!",
                error: (err: Error) => `No se pudo balancear el evento: ${err.message}`,
            }
        );
    };

    return (
        <button
            className="btn btn--lg"
            onClick={onClick}
            title="Balancear Equipos"
        >
            Balancear Equipos
        </button>
    );
}

export default BalanceTeamsButton;