import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const ScrollIndicator = () => {
  return (
    <a href="#faq-section" className="scroll-indicator" aria-label="Rolar para o FAQ">
      <FiChevronDown />
    </a>
  );
};

export default ScrollIndicator;