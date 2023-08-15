import React from 'react';
const BlackLogo = require('../../assets/SphereOneLogo.svg') as string;
const WhiteLogo = require('../../assets/SphereOneLogo.svg') as string;

interface LoginButtonProps {
  onClick: () => void;
  buttonStyle?: React.CSSProperties;
  isLogoDark?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, buttonStyle, isLogoDark = false }) => {
  return (
    <button style={buttonStyle} onClick={onClick}>
      <img src={isLogoDark ? BlackLogo : WhiteLogo} alt="logo" />
    </button>
  );
};

export default LoginButton;
