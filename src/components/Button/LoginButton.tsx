import React from 'react';
import BlackLogo from '../../assets/BlackLogo.png';
import WhiteLogo from '../../assets/WhiteLogo.png';


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
