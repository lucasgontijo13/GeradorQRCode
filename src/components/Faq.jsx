

import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';


const faqData = [
  {
    question: 'Quem desenvolveu este projeto?',
    answer: (
      <>
        Este gerador de QR Code foi desenvolvido por Lucas Gontijo como um projeto de estudo e portfólio. Você pode encontrar mais dos meus trabalhos no meu{' '}
        <a href="https://github.com/lucasgontijo13" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>{' '}
        ou conectar-se comigo no{' '}
        <a href="https://www.linkedin.com/in/lucas-gontijo-693a90229/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        .
      </>
    )
  },
  {
    question: 'Quais tecnologias foram usadas?',
    answer: 'A interface foi construída com React e Vite. A geração dos QR Codes e dos arquivos ZIP é feita diretamente no seu navegador, usando as bibliotecas JavaScript "qrcode" e "jszip". O design foi estilizado com CSS puro e ícones da biblioteca "react-icons".',
  },
  {
    question: 'Este projeto é de código aberto?',
    answer: 'Sim! O código-fonte está disponível no GitHub. Sinta-se à vontade para explorar, sugerir melhorias ou utilizá-lo como base para seus próprios projetos. Se este projeto foi útil para você, considere deixar uma estrela ⭐ no repositório!',
  },
  {
    question: 'Por que criar um gerador próprio?',
    answer: 'Muitos geradores de QR Code online são lentos, cheios de anúncios ou cobram por funcionalidades básicas como alta resolução. O objetivo deste projeto foi criar uma ferramenta 100% gratuita, rápida, sem anúncios e de código aberto para a comunidade.',
  }
];


const FaqItem = ({ item, isOpen, onClick }) => {
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={onClick}>
        {item.question}
        <FiChevronDown className={`faq-icon ${isOpen ? 'open' : ''}`} />
      </button>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <p>{item.answer}</p>
      </div>
    </div>
  );
};

// Componente principal do FAQ
const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="faq-section">
      <h2>FAQ / Sobre o Projeto</h2>
      <div className="faq-container">
        {faqData.map((item, index) => (
          <FaqItem
            key={index}
            index={index}
            item={item}
            isOpen={openIndex === index}
            onClick={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Faq;