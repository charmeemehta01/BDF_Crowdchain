import { Box, Center, FormControl, FormLabel, Heading, Button, Input, Alert, AlertIcon, AlertDescription, AlertTitle } from '@chakra-ui/react';
import React, { Component } from 'react';
import web3 from '../../ethereum/web3';
import didentity from '../../ethereum/digitalidentity'
import AdaptiveBox from '../../components/AdaptiveBox';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import Router from 'next/router';

class ForPass extends Component {
    state = {
        passport_no: '',
        password: '',
        conf_pass: '',
        secret_key: '',
        isSubmitted: false,
        isMatch: true,
        isLoad: false,
        errMessage: ''
    }

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoad: true, errMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await didentity.methods
            .updatePassword( this.state.passport_no, this.state.password, this.state.secret_key )
            .send({ from: accounts[0] });
            this.setState({ isSubmitted: true });
        } catch(err) {
            this.setState({ errMessage: err.message });
        }
        this.setState({ isLoad: false });
    }

    render() {
        return (
            <Box>
                <Header>

                </Header>
                <Layout>
                    <Center>
                        { this.state.isSubmitted ? 
                        (
                            <Alert
                            status="success"
                            variant="subtle"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                            height="300px"
                            borderRadius={10}
                            mt={10}
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Password reset successful!
                                </AlertTitle>
                                <AlertDescription maxWidth="md">
                                    Your password has been reset succesfully. Please login to continue. 
                                </AlertDescription>
                                <Button mt={2} onClick={event => Router.push('/digital_identity/signin')} >Back to login</Button>   
                            </Alert>
                        ) : (   
                            <AdaptiveBox minW="300px" width="550px" mt={10} p={8} >
                            <Box textAlign="center">
                                <Heading>Reset Password</Heading>
                            </Box>
                            <Box>
                                <form onSubmit={this.onSubmit}>
                                    <FormControl mt={6} isRequired >
                                        <FormLabel>Passport No</FormLabel>
                                        <Input variant="filled" 
                                        onChange={ 
                                            event => this.setState({ passport_no: event.target.value }) } />
                                    </FormControl>
                                    <FormControl mt={6} isRequired >
                                        <FormLabel>New password</FormLabel>
                                        <Input variant="filled" type="password" 
                                        onChange={ 
                                            event => this.setState({ password: event.target.value }) } />
                                    </FormControl>
                                    <FormControl mt={6} isRequired >
                                        <FormLabel>Confirm new password</FormLabel>
                                        <Input variant="filled" 
                                        onChange={ 
                                            event => this.setState({ conf_pass: event.target.value }, 
                                            () => { this.state.password === this.state.conf_pass || this.state.conf_pass === '' ? 
                                                    (
                                                        this.setState({ isMatch: true })
                                                    ) : (
                                                        this.setState({ isMatch: false })
                                                    ) } ) } />
                                        {this.state.isMatch ? 
                                        (
                                            <div></div>
                                        ) : (
                                            <Alert status="error" mt={3} borderRadius={8} >
                                                <AlertIcon />
                                                Passwords do not match.
                                            </Alert>
                                        ) }
                                    </FormControl>
                                    <FormControl mt={6} isRequired >
                                        <FormLabel>Secret Key</FormLabel>
                                        <Input variant="filled" onChange={ event => this.setState({ secret_key: event.target.value }) } />
                                    </FormControl>
                                    {!this.state.errMessage ? 
                                    (
                                        <div></div> 
                                    ) : (
                                        <Alert status="error" mt={6} borderRadius={8} >
                                        <AlertIcon />
                                        {this.state.errMessage}
                                        </Alert>
                                    ) } 
                                    <Button mt={6} width="full" type="submit"
                                    isLoading={ this.state.isLoad }
                                    loadingText="Resetting password..." >Reset</Button>
                                </form>
                            </Box>
                        </AdaptiveBox>
                        )}
                    </Center>
                </Layout>
            </Box>
        );
    }
}

export default ForPass;