import React from 'react';
const BlackLogo = require('../../assets/SphereOneLogo.svg') as string;
const WhiteLogo = require('../../assets/SphereOneLogo.svg') as string;

interface LoginButtonProps {
  onClick: () => void;
  buttonStyle?: React.CSSProperties;
  logoColor?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, buttonStyle, logoColor = 'black' }) => {
  return (
    <button style={buttonStyle} onClick={onClick}>
      <img src={!logoColor ? BlackLogo : WhiteLogo} alt="logo" />
    </button>
  );
};

export default LoginButton;
