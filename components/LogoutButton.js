import React from 'react';
import { IconButton, useToast } from '@chakra-ui/react';
import { SignOut } from 'phosphor-react';

function LogOut(props) {
    const toast = useToast()
    return (
      <IconButton
        icon={<SignOut weight="bold" size={20} />}
        variant="ghost"
        onClick={() => {
            localStorage.removeItem("uid");
            localStorage.removeItem("status");
            localStorage.removeItem("email");
            localStorage.removeItem("jwt");
            props.logout();
            toast({
                title: "Logout successful!",
                description: "You have logged out successfully",
                status: "info",
                duration: 2000,
                isClosable: true,
            })
        }  
        }
      >
      </IconButton>
    )
  }

export default LogOut;