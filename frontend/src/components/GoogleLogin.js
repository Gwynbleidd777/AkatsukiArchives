// GoogleLoginButton.js
import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { Button } from '@chakra-ui/react';

const GoogleLoginButton = ({ onSuccess, onFailure }) => {
  return (
    <GoogleLogin
      clientId="676282944751-mc267ktnnie8pja8aa4l6p08kfehaklr.apps.googleusercontent.com"
      buttonText="Sign up with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      render={(renderProps) => (
        <Button
          colorScheme="teal"
          variant="outline"
          mt={4}
          width="100%"
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          Sign up with Google
        </Button>
      )}
    />
  );
};

export default GoogleLoginButton;
