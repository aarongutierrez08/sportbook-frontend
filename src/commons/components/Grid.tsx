import React from "react";

const Grid: React.FC<{ content: React.ReactNode }> = ({ content }) => {
  return <div className={'grid-container'}>{content}</div>;
};

export default Grid;
