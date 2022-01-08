import React from 'react';
import { motion } from 'framer-motion';

const LogoText: React.FC = () => {
  const title = 'Timers Made Easy';
  return (
    <h6>
      {title.split('').map((char, i) => (
        <motion.span
          key={char + i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.075 }}
        >
          {char}
        </motion.span>
      ))}
    </h6>
  );
};

export default LogoText;
