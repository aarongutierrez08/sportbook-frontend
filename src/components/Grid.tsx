import React from "react";

const Grid: React.FC<{ content: React.ReactNode }> = ({ content }) => {
  return (
    <div
      className="grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1rem",
      }}
    >
      {content}
    </div>
  );
};

export default Grid;
