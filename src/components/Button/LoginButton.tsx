import React from 'react';
const logo = require('../../assets/SphereOneLogo.svg') as string;

interface LoginButtonProps {
  onClick: () => void;
  buttonStyle?: React.CSSProperties;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, buttonStyle }) => {
  return (
    <button style={buttonStyle} onClick={onClick}>
      <img src={logo} className="w-28 xl:w-40" alt="Logo" />
    </button>
  );
};

export default LoginButton;
