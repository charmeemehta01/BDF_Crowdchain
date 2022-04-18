import React from 'react';
import { useColorMode } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/react';

export default function AdaptiveBox(props) {
    const { colorMode } = useColorMode()
    return (
        <Box p={props.p} maxW={props.maxW} borderRadius={10} boxShadow="lg" bg={ colorMode === "light" ? "white" : "#293245" } 
        h={props.h} display={ props.display } flexDir={ props.flexDir } minW={ props.minW } width={ props.width } mt={props.mt} mb={props.mb} float={props.float} >
            {props.children}
        </Box>
    );
}