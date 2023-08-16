import React from 'react';

interface LoginButtonProps {
  onClick: () => void;
  buttonStyle?: React.CSSProperties;
  isLogoDark?: boolean;
}

const blackLogoSrc =
  'https://firebasestorage.googleapis.com/v0/b/sphereone-testing.appspot.com/o/BlackLogo.png?alt=media&token=60ba8159-273a-4d01-9473-5a82685d9054';
const whiteLogoSrc =
  'https://firebasestorage.googleapis.com/v0/b/sphereone-testing.appspot.com/o/WhiteLogo.png?alt=media&token=e796c9fd-db1b-456a-818d-db1bab51c976';

const LoginButton: React.FC<LoginButtonProps> = ({
  buttonStyle,
  imageStyles,
  ...props
}: {
  buttonStyle?: React.CSSProperties;
  imageStyles?: React.CSSProperties;
}) => {
  return (
    <button
      style={{
        backgroundColor: '#7ACBFF',
        paddingTop: '0.625rem',
        paddingBottom: '0.625rem',
        borderRadius: '0.5rem',
        alignItems: 'center',
        display: 'inline-flex',
        paddingLeft: '1.25rem',
        paddingRight: '1.25rem',
        ...buttonStyle,
      }}
      {...props}>
      <img height={20} src={blackLogoSrc} alt="SphereOne logo" style={{ ...imageStyles }} />
    </button>
  );
};

export default LoginButton;
