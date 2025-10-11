import { Slider, Tooltip } from "@mui/material";
import "../../../styles/eventFairnessRating.css";
import { useEffect, useState } from "react";
import { getFairnessRating } from "../../../api/eventsApi";
import { type TeamInfo } from "../../../types/events";

interface EventFairnessRatingComponentProps {
  eventId: number;
  teams: TeamInfo[];
}

const EventFairnessRatingComponent = ({
  eventId,
  teams,
}: EventFairnessRatingComponentProps) => {
  const [rating, setRating] = useState(5);
  const DEFAULT_RATING = 5;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const score = await getFairnessRating(eventId);
        setRating(score);
      } catch {
        setRating(DEFAULT_RATING);
      }
    };

    fetchRating();
  }, [eventId, teams]);

  const marks = [
    {
      value: 10,
      label: "Muy Desparejo",
    },
    {
      value: 90,
      label: "Muy Parejo",
    },
  ];

  return (
    <div className="form-group slider-group">
      <div className="slider-header">
        <Tooltip
          title={
            "El balance de equipos es una medida de qué tan parejos están los equipos en este evento. " +
            "Un balance más alto conduce a partidos más competitivos y emocionantes!"
          }
          arrow
        >
          <button className="info-button">¿Cómo funciona?</button>
        </Tooltip>
      </div>
      <Slider
        disabled
        value={rating * 10}
        step={10}
        marks={marks}
        min={0}
        max={100}
        valueLabelDisplay="auto"
        sx={{
          ".MuiSlider-track": {
            background: "linear-gradient(to right, #E98E26, #389148)",
            height: 10,
          },
          ".MuiSlider-rail": {
            height: 10,
          },
          ".MuiSlider-thumb": {
            display: 'none'
          },
          ".MuiSlider-mark": {
            display: 'none'
          },
        }}
      />
    </div>
  );
};

export default EventFairnessRatingComponent;
