import React from 'react';
import { Container, Box } from '@chakra-ui/react';

let Layout;
export default Layout = props => {
    return (
      <Box px={4} py={4} display={props.display} >
        {props.children}
      </Box>
    );
  };