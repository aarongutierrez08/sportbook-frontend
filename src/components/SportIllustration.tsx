import type {SportEvent} from "../types/events.ts";
import footballSillhouette from "../assets/football_sillhouette.png";
import paddleSillhouette from "../assets/paddle_sillhouette.png";
import React from "react";

const sillhouetteMap = {
    "FOOTBALL": footballSillhouette,
    "PADDLE": paddleSillhouette,
    "VOLLEY": paddleSillhouette
}

interface SportIllustrationProps {
    event: SportEvent;
}

const SportIllustration: React.FC<SportIllustrationProps> = (props: SportIllustrationProps) => {
  return (
    <>
        <img src={sillhouetteMap[props.event.sport]} className='sport-icon'/>
    </>
  )
}

export default SportIllustration