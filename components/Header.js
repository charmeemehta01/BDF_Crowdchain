import React from 'react';
import { Box, HStack, Stack, Wrap, Heading } from '@chakra-ui/react';
import { Link } from 'phosphor-react';
import ThemeToggler from './ThemeToggler';
import { useColorMode } from '@chakra-ui/system';

export default function Header(props) {
    const { colorMode } = useColorMode()
    return (
        <Box d="flex" boxShadow="lg" borderRadius={10} mx={3} mt={6} px={4} bg={ colorMode === "light" ? "white" : "#293245" } >
            <HStack>
                <Link size={20} weight="bold" />
                <Heading size="md" >CrowdChain</Heading>
            </HStack>
            <Box pl={10} py={2} my={3} flex={4} align="left" >
                {props.left}
            </Box>
            <Box py={2} my={3} flex={1} align="right" >
                <Stack spacing={2} direction="row-reverse" >
                <ThemeToggler />
                {props.right}
                </Stack>
            </Box>
        </Box>
    )
}