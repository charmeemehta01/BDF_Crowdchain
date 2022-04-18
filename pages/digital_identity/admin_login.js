import React, { Component } from 'react';
import { Heading, Button, FormControl, FormLabel, Box, Image, Input, Center, Alert, AlertIcon } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import Router from'next/router';
import didentity from '../../ethereum/digitalidentity'
import AdaptiveBox from '../../components/AdaptiveBox';
import Header from '../../components/Header';

class AdminLogin extends Component {
    state = {
        apassword: '',
        admin:'',
        errAdmin: '',
        adminLoad: false
    }
    
    onAdminSubmit = async event => {
        event.preventDefault();
        const regex = new RegExp('\E(.*)\.');
        this.setState({ adminLoad: true, errAdmin: '' });
        try {
            await didentity.methods.adminLogin(this.state.admin, this.state.apassword).call();
            Router.push('/digital_identity/admin_page');
        } catch (err) {
            const error = err.message.match(regex);
            this.setState({ errAdmin: error[0] });
        }
        this.setState({ adminLoad: false });
    }

    render() {
        return (
            <Box>
                <Header>
                </Header>
                <Layout>
                    <Center>
                        <AdaptiveBox width="550px" p={8} >
                            <Box textAlign="center">
                                <Heading>Admin Login</Heading>
                                <Image src="/blog-wp-login.png" />
                            </Box>
                            <Box textAlign="left">
                                <form onSubmit={this.onAdminSubmit}>
                                    <FormControl isRequired="true">
                                        <FormLabel>Username</FormLabel>
                                        <Input variant="filled" placeholder="Chris3245" value={ this.state.admin } 
                                        onChange={
                                        event => this.setState({ admin: event.target.value })} />
                                    </FormControl>
                                    <FormControl mt={6} isRequired="true">
                                        <FormLabel>Password</FormLabel>
                                        <Input variant="filled" type="password" placeholder="*********" value={ this.state.apassword } 
                                        onChange={
                                        event => this.setState({ apassword: event.target.value })} />
                                    </FormControl>
                                    {!this.state.errAdmin ? 
                                    (<div></div>) : 
                                    (
                                        <Alert status="error" mt={3} borderRadius={8} >
                                        <AlertIcon />
                                        {this.state.errAdmin}
                                        </Alert>
                                    ) } 
                                    <Button width="full" mt={4} type="submit"
                                    isLoading={this.state.adminLoad}
                                    loadingText='Signing in'>
                                        Sign In
                                    </Button>
                                </form>
                            </Box>
                        </AdaptiveBox>
                    </Center>
                </Layout>
            </Box>
        );
    }
}

export default AdminLogin;