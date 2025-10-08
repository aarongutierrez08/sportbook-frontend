import {Slider, Tooltip} from "@mui/material";
import '../../../styles/eventFairnessRating.css';

interface EventFairnessRatingComponentProps {
    rating: number;
}

const EventFairnessRatingComponent = ({ rating } : EventFairnessRatingComponentProps ) => {
    const marks = [
        {
            value: 5,
            label: 'Muy Desparejo',
        },
        {
            value: 95,
            label: 'Muy Parejo',
        }]

    const getRatingColor = (value: number) => {
        // Interpolamos entre naranja y verde
        return value < 50 ? '#E98E26' : '#389148';
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
                defaultValue={rating*10}
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
                    },
                }}
        />
    </div>)
}

export default EventFairnessRatingComponent;