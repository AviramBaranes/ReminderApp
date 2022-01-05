import React from 'react';

import classes from '../../../styles/UI/Title.module.scss';

interface TitlePropsTypes {
  header: string;
  paragraph: string;
}

const Title: React.FC<TitlePropsTypes> = ({ header, paragraph }) => {
  return (
    <div className={classes.TitleContainer}>
      <h2>{header}</h2>
      <p>{paragraph}</p>
    </div>
  );
};

export default Title;
