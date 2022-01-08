import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LogoText: React.FC = () => {
  const [delay, setDelay] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [spans, setSpans] = useState<any[]>([]);
  const Title = 'Timers Made Easy';

  const spanVariant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay,
      },
    },
  };

  useEffect(() => {
    if (titleIndex > Title.length) return;
    setSpans((prev) => [
      ...prev,
      <motion.span
        key={delay}
        variants={spanVariant as any}
        initial='hidden'
        animate='visible'
      >
        {Title[titleIndex]}
      </motion.span>,
    ]);
    setDelay((prev) => prev + 0.075);
    setTitleIndex((prev) => prev + 1);
  }, [delay, spans]);

  return <h6>{spans}</h6>;
};

export default LogoText;
