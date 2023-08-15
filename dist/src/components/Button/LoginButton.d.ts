import React from 'react';
interface LoginButtonProps {
    onClick: () => void;
    buttonStyle?: React.CSSProperties;
    isLogoDark?: boolean;
}
declare const LoginButton: React.FC<LoginButtonProps>;
export default LoginButton;
