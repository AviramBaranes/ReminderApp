import React from 'react';

interface TitlePropsTypes {
  header: string;
  paragraph: string;
}

const Title: React.FC<TitlePropsTypes> = ({ header, paragraph }) => {
  return (
    <div>
      <h2>{header}</h2>
      <p>{paragraph}</p>
    </div>
  );
};

export default Title;
