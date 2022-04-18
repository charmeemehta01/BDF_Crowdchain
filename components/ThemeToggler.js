import React from 'react';
import { useColorMode, IconButton, Center, Box } from '@chakra-ui/react';
import { Sun, MoonStars } from 'phosphor-react';

export default function Example() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
      <IconButton onClick={toggleColorMode}  icon={ colorMode === "light" ? <MoonStars weight="bold" size={20} /> : <Sun weight="bold" size={20} /> } variant="ghost" />
    )
  }