import React from "react";

const Grid: React.FC<{ content: React.ReactNode, title: string }> = ({ content, title }) => {
  return (
    <div className={'grid-container'}>
      <header>
        <h1>{title}</h1>
      </header>
      <main>
        {content}
      </main>
    </div>
  );
};

export default Grid;
