import React, { Component } from 'react';
import { Stack, Text, Heading, Button, FormControl, FormLabel, Box, Image, Input, Divider, Center, ButtonGroup, Alert, AlertIcon, SimpleGrid } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import Router from 'next/router';
import Link from 'next/link';
import didentity from '../../ethereum/digitalidentity'
import AdaptiveBox from '../../components/AdaptiveBox';
import Header from '../../components/Header';

class UserLogin extends Component {
    state = {
        passport_no: '',
        upassword: '',
        errUser: '',
        userLoad: false
    }

    onUserSubmit = async event => {
        event.preventDefault();
        const regex = new RegExp('\E(.*)\.');
        this.setState({ userLoad: true, errUser: '' });
        try {
            const result = await didentity.methods.login(this.state.passport_no, this.state.upassword).call();
            localStorage.setItem("uid", result[0]);
            localStorage.setItem("status", result[1]);
            localStorage.setItem("email", result[2]);
            let _data = {
                email: localStorage.getItem("email"),
                uid: localStorage.getItem("uid")
            }
            fetch('http://localhost:3000/jwt/create', {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json())
                .then(res => {
                    if(res.status === "success") {
                        localStorage.setItem("jwt", res.jwt_token)
                    }
                }) 
            Router.push('/digital_identity/update_page');
        } catch (err) {
            const error = err.message.match(regex);
            this.setState({ errUser: error[0] });
        }
        this.setState({ userLoad: false });
    }

    render() {
        return (
            <Box>
                <Header>
                    <ButtonGroup variant="ghost" px="4">
                        <Button>Sign In</Button>
                        <Button>Sign Up</Button>
                    </ButtonGroup>
                </Header>
                <Layout>
                    <Center>
                        <AdaptiveBox width="1200px" minW="300px" mt={10} p={8} >
                            <SimpleGrid minChildWidth="220px" spacing="30px">
                                <Center>
                                    <Box textAlign="center">
                                        <Heading>Sign in</Heading>
                                        <Center>
                                            <Image src="/blog-wp-login.png" maxW="300px" minW="200px" pt={6} px={4} />
                                        </Center>
                                    </Box>
                                </Center>
                                <Box textAlign="left">
                                    <form onSubmit={ this.onUserSubmit } >
                                        <FormControl isRequired="true">
                                            <FormLabel>Passport No</FormLabel>
                                            <Input variant="filled" placeholder="A2096457" value={ this.state.passport_no } 
                                            onChange={
                                            event => this.setState({ passport_no: event.target.value })} />
                                        </FormControl>
                                        <FormControl mt={6} isRequired="true">
                                            <FormLabel>Password</FormLabel>
                                            <Input variant="filled" type="password" placeholder="*********" value={ this.state.upassword } 
                                            onChange={
                                            event => this.setState({ upassword: event.target.value })} />
                                        </FormControl>
                                        {!this.state.errUser ? 
                                        (
                                            <div></div> 
                                        ) : (
                                            <Alert status="error" mt={3} borderRadius={8} >
                                            <AlertIcon />
                                            {this.state.errUser}
                                            </Alert>
                                        ) } 
                                        <Button width="full" mt={4} type="submit"
                                        isLoading={this.state.userLoad}
                                        loadingText='Signing in'>
                                            Sign In
                                        </Button>
                                        <Box textAlign="center" pt={2}>
                                            <Link href='/digital_identity/forget_password' >
                                            Forgot your password?
                                            </Link>
                                        </Box>
                                    </form>
                                    <Stack direction="row" pt={2} align="center">
                                        <Divider  color="gray.400" />
                                        <Text as="i" color="gray.400" >OR</Text>
                                        <Divider color="gray.400" pb={0} />
                                    </Stack>
                                    <Button width="full" mt={4} onClick={ event => Router.push('/digital_identity/signup') } >
                                    Sign Up
                                    </Button>
                                </Box>
                            </SimpleGrid>
                        </AdaptiveBox>
                    </Center>
                </Layout>
            </Box>
        );
    }
}

export default UserLogin;