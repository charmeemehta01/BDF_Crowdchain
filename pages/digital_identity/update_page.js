import React, { Component } from 'react';
import { Box, Center, Alert, AlertIcon, AlertDescription, 
    AlertTitle, Button, Stack, Divider, Text, Heading, 
    FormControl, FormLabel, Input, IconButton } from '@chakra-ui/react';
import { SignOut } from 'phosphor-react';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import AdaptiveBox from '../../components/AdaptiveBox';
import Router from 'next/router';
import web3 from '../../ethereum/web3'
import didentity from '../../ethereum/digitalidentity'
import { toNumber } from 'lodash';
import ipfs from '../../ethereum/ipfs';
import LogOut from '../../components/LogOutButton';

class Update extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
    }

    state = {
        dialog: true,
        isSubmitted: false,
        email: '',
        passport_name: '',
        passport_no: '',
        fileHash: '',
        edit: false,
        stat: 'Edit',
        isLoad: false,
        errMessage: '',
        status: '',
        userstat: '',
        isLoggedIn: false
    }

    componentDidMount() {
        let _data = {
            jwt_token: localStorage.getItem("jwt")
        }
        fetch('http://localhost:3000/jwt/authenticate', {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json())
                .then(res => {
                    if(res.status === "success") {
                        this.setState({ isLoggedIn: true });
                    } else {
                        this.setState({ isLoggedIn: false });
                    }
                })
        const userstat = localStorage.getItem("status");
        this.setState({ userstat });
    }

    onProfileClick = async () => {
        const uid = toNumber(localStorage.getItem("uid"));
        const result = await didentity.methods.getUser(uid).call();
        this.setState({ email: result[0], passport_no: result[2], passport_name: result[3], fileHash: result[4] });
        this.setState({ dialog: false });
    }

    onUpdate = async event => {
        event.preventDefault();
        this.setState({ status: '', isLoad: true, errMessage: '' });
        try {
            //Getting Accounts
            const accounts = await web3.eth.getAccounts();
            //Updating details to blockchain
            await didentity.methods
            .updateUser(this.state.email, this.state.passport_no, this.state.passport_name, this.state.fileHash)
            .send({ from: accounts[0] });
            
            let _data = {
                email: this.state.email
            }
            
            //Mailing code
            fetch('http://localhost:3000/mail/update_details', {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json()) 

            this.setState({ isSubmitted: true });
        } catch(err) {
            this.setState({ errMessage: err.message });
        }
        this.setState({ isLoad: false });
    }

    fileUpdate = async event =>{
        this.setState({ status: 'Uploading file to IPFS. Please wait...' });
        try {
            const result = await ipfs.add(this.fileInput.current.files[0]);
            this.setState({ fileHash: result.cid.string, status: 'Upload successful' });
            
        } catch(err) {
            this.setState({ status: '', errMessage: err.message })
        }
    }

    logout = () => {
        this.setState({isLoggedIn: false});
        Router.push('/digital_identity/signin');
    }

    render() {
        return (
            <Box>
                <Header
                right={
                    this.state.isLoggedIn && <LogOut logout={this.logout} />
                }/>
                <Layout>
                    <Center>
                    { this.state.dialog ?
                    (
                        <AdaptiveBox mt={10} p={8}>
                        <Button width="full" onClick={this.onProfileClick}>Update Profile</Button>
                        { this.state.userstat === "verified" && 
                        <Box>
                            <Stack direction="row" pt={4} align="center">
                                <Divider  color="gray.400" />
                                <Text as="i" color="gray.400" >OR</Text>
                                <Divider color="gray.400" pb={0} />
                            </Stack>
                            <Button width="full" mt={4} onClick={event => Router.push('/crowdfunding/')}>Continue to CrowdChain</Button>
                        </Box>  
                        }
                    </AdaptiveBox> 
                    ) : this.state.isSubmitted ?
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
                                Success!
                            </AlertTitle>
                            <AlertDescription maxWidth="md">
                                Your profile has been updated succesfully. Please wait for re-verification of your account before signing in again. 
                            </AlertDescription>
                            <Button colorScheme="whatsapp" mt={2} onClick={event => Router.push('/digital_identity/signin')} >Back to login</Button>   
                        </Alert> 
                    ) : (
                        <AdaptiveBox width="500px" spacing="200px" p={8}>
                            <Box textAlign="center" >
                                <Heading>Update Profile</Heading>
                            </Box>
                            <Box>
                                <form onSubmit={this.onUpdate}>
                                    <FormControl mt={6} isRequired >
                                        <FormLabel>Email ID</FormLabel>
                                        <Input variant="filled" value={this.state.email} isDisabled={!this.state.edit}
                                        onChange={
                                            event => this.setState({ email: event.target.value })} />
                                    </FormControl>
                                    <FormControl mt={6} isRequired >
                                        <FormLabel>Passport No</FormLabel>
                                        <Input variant="filled" value={this.state.passport_no} isDisabled={!this.state.edit}
                                        onChange={
                                            event => this.setState({ passport_no: event.target.value })} />
                                    </FormControl>
                                    <FormControl mt={6} isRequired >
                                        <FormLabel>Name on Passport</FormLabel>
                                        <Input variant="filled" value={this.state.passport_name} isDisabled={!this.state.edit} 
                                        onChange={
                                            event => this.setState({ passport_name: event.target.value })} />
                                    </FormControl>
                                    <FormControl mt={6} isRequired >
                                        <FormLabel>Passport Image</FormLabel>
                                        <input disabled={!this.state.edit} type="file" accept="image/*" max={1} ref={this.fileInput}
                                        onChange={this.fileUpdate} />
                                    </FormControl>
                                    { !!this.state.status ? 
                                    (
                                        <Alert status="info" mt={6} borderRadius={8} >
                                            <AlertIcon />
                                            {this.state.status}
                                        </Alert>
                                    ) : (
                                        <div></div>
                                    ) }
                                    { !!this.state.errMessage ? 
                                    (
                                        <Alert status="error" mt={6} borderRadius={8} >
                                            <AlertIcon />
                                            {this.state.errMessage}
                                        </Alert>
                                    ) : (
                                        <div></div>
                                    ) }
                                    <Stack direction="row" mt={6}>
                                        <Button width="full" 
                                        onClick={
                                            event => this.state.edit ? 
                                        (
                                            this.setState({ edit: false, stat: 'Edit' })
                                        ) : (
                                            this.setState({ edit: true, stat: 'Save' })
                                        )} >{this.state.stat}</Button>
                                        <Button mt={6} width="full" onClick={event => this.setState({ dialog: true })} >Back</Button>
                                    </Stack>
                                    <Button mt={6} width="full" type="submit"
                                    isLoading={this.state.isLoad}
                                    loadingText="Updating..." >Update Profile</Button>
                                </form>
                            </Box>
                        </AdaptiveBox>
                    ) }
                    </Center>
                </Layout>
            </Box>
        );
    }
}

export default Update;