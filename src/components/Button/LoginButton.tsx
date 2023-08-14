import React from 'react';
const logo = require('../../assets/SphereOneLogo.svg') as string;

interface LoginButtonProps {
  onClick: () => void;
  buttonStyle?: React.CSSProperties;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, buttonStyle }) => {
  const imgStyle: React.CSSProperties = {
    width: '28px', 
  };

  if (window.innerWidth >= 1280) {
    imgStyle.width = '40px';
  }

  return (
    <button style={buttonStyle} onClick={onClick}>
      <img src={logo} style={imgStyle} alt="Logo" />
    </button>
  );
};

export default LoginButton;
