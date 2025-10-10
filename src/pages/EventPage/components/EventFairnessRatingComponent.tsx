import { Slider, Tooltip } from "@mui/material";
import '../../../styles/eventFairnessRating.css';
import { useEffect, useState } from "react";
import { getFairnessRating } from "../../../api/eventsApi";
import {type EventType, type TeamInfo} from "../../../types/events";
import footballSlider from '../../../assets/football_slider.png';
import volleyball from '../../../assets/volleyball.png';
import paddleball from '../../../assets/paddleball.png';

interface EventFairnessRatingComponentProps {
    eventId: number;
    eventType: EventType;
    teams: TeamInfo[];
}

const EventFairnessRatingComponent = ({ eventId, eventType, teams }: EventFairnessRatingComponentProps) => {
    const [rating, setRating] = useState(5);
    const DEFAULT_RATING = 5;

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const score = await getFairnessRating(eventId);
                setRating(score);
            } catch (error) {
                console.error('Error fetching fairness rating:', error);
                setRating(DEFAULT_RATING)
            }
        };

        fetchRating();
    }, [eventId, teams]); // Agregamos teams como dependencia

    const marks = [
        {
            value: 10,
            label: 'Muy Desparejo',
        },
        {
            value: 95,
            label: 'Muy Parejo',
        }
    ];

    const getRatingColor = (value: number) => {
        return value < 50 ? '#E98E26' : '#389148';
    };

    const getSliderImage = () => {
        switch(eventType) {
            case "FOOTBALL":
                return `url(${footballSlider})`;
            case "VOLLEY":
                return `url(${volleyball})`;
            case "PADDLE":
                return `url(${paddleball})`;
        }
    };

    return (<div className="form-group slider-group">
        <div className="slider-header">
            <Tooltip title={
                "El balance de equipos es una medida de qué tan parejos están los equipos en este evento. " +
                "Un balance más alto conduce a partidos más competitivos y emocionantes!"
            } arrow>
                <button className="info-button">¿Cómo funciona?</button>
            </Tooltip>
        </div>
        <Slider disabled
                value={rating*10}
                step={10}
                marks={marks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                sx={{
                    '& .MuiSlider-track': {
                        background: 'linear-gradient(to right, #E98E26, #389148)',
                    },
                    '&.Mui-disabled .MuiSlider-thumb': {
                        backgroundColor: getRatingColor(rating*10),
                        backgroundImage: getSliderImage(),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    },
                }}
        />
    </div>);
}

export default EventFairnessRatingComponent;