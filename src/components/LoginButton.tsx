import React from 'react';

interface LoginButtonProps {
  onClick: () => any;
  buttonProps?: any;
  imageProps?: any;
  isLogoDark?: boolean;
}

const blackLogoSrc = 'https://firebasestorage.googleapis.com/v0/b/sphereone-testing.appspot.com/o/BlackLogo.png?alt=media&token=60ba8159-273a-4d01-9473-5a82685d9054';
const whiteLogoSrc = "https://firebasestorage.googleapis.com/v0/b/sphereone-testing.appspot.com/o/WhiteLogo.png?alt=media&token=e796c9fd-db1b-456a-818d-db1bab51c976";

export const LoginButton: React.FC<LoginButtonProps> = ({
  onClick,
  buttonProps,
  imageProps,
  isLogoDark
}: {
  onClick: () => any;
  buttonProps?: any;
  imageProps?: any;
  isLogoDark?: boolean;
}) => {
  return (
    <button onClick={buttonProps.onClick?? onClick} {...buttonProps}>
      <img src={isLogoDark? blackLogoSrc : whiteLogoSrc} alt="SphereOne logo" {...imageProps} />
    </button>
  );
};

