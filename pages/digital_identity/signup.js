import React, { Component } from 'react';
import Header from '../../components/Header';
import Layout from '../../components/Layout';
import { Box, Center, FormControl, FormLabel, Heading, Image, Input, Button, Text, SimpleGrid, Divider, Stack } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import AdaptiveBox from '../../components/AdaptiveBox';
import web3 from '../../ethereum/web3';
import didentity from '../../ethereum/digitalidentity';
import ipfs from '../../ethereum/ipfs';
import Router from 'next/router'

 class SignUp extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
    }

    state = {
        email: '',
        password: '',
        conf_pass: '',
        passport_no: '',
        passport_name: '',
        secret_key: '',
        isSubmitted: false,
        isPassMatch: true,
        isMailValid: true,
        isLoad: false,
        errMessage: '',
        status: ''
    }

    generateId () {
        let id = Math.floor(1000 + (10000 - 1000) * Math.random());
        return id;
      }

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoad: true, errMessage: '' })
        try {
            this.setState({ status: 'Getting Accounts...' });
            const accounts = await web3.eth.getAccounts();
            this.setState({ status: 'Uploading file to IPFS' });
            const result = await ipfs.add(this.fileInput.current.files[0]);
            this.setState({ status: 'Generating secret key' });
            this.setState({ secret_key: this.generateId() });
            this.setState({ status: 'Creating user' });

            //Adding data to blockchain
            await didentity.methods
            .addUser( this.state.email, this.state.password, this.state.passport_no, this.state.passport_name, result.cid.string, this.state.secret_key )
            .send({ from: accounts[0] });

            let _data = {
                email: this.state.email,
                secret_key: this.state.secret_key
            }

            //Mailing code
            fetch('http://localhost:3000/mail/signup', {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json()) 
                
            this.setState({isSubmitted: true, status: 'Wrapping up...' });
        } catch(err) {
            this.setState({ errMessage: err.message });
        }
        this.setState({ isLoad: false });
    }

    render() {
         return (
             <Box>
                 <Header />
                 <Layout>
                    <Center>
                        {this.state.isSubmitted ? 
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
                                    Application submitted!
                                </AlertTitle>
                                <AlertDescription maxWidth="md">
                                    Thanks for submitting your application. Our team will get back to you soon. Please save the secret key: {this.state.secret_key}. It will be required for editing profile. 
                                </AlertDescription>
                                <Button mt={2} colorScheme="whatsapp" onClick={event => Router.push('/digital_identity/signin')} >Back to login</Button>   
                            </Alert>
                        ) : 
                        (
                            <AdaptiveBox width="1200px" minW="300px" mt={10} p={8} >
                                <SimpleGrid minChildWidth="220px" spacing="30px">
                                    <Center>
                                        <Box textAlign="center" >
                                            <Heading>Welcome to CrowdChain</Heading>
                                            <Text fontSize="2xl" >Create an account here</Text>
                                            <Center>
                                                <Image src="/block.png" maxW="300px" minW="200px" pt={6} px={4} />
                                            </Center>
                                        </Box>
                                    </Center>
                                <Box textAlign="left">
                                    <form onSubmit={this.onSubmit}>
                                        <FormControl mt={6} isRequired>
                                            <FormLabel>Email ID</FormLabel>
                                            <Input 
                                            variant="filled" 
                                            value={this.state.email} 
                                            onChange={
                                                event => this.setState({ email: event.target.value },
                                                () => {
                                                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email) || this.state.email === '' ? 
                                                    (
                                                        this.setState({ isMailValid: true })
                                                    ) : (
                                                        this.setState({ isMailValid: false })
                                                    )
                                                }
                                                )} />
                                            {!this.state.isMailValid && 
                                            (
                                                <Alert 
                                                status="error" 
                                                mt={3} 
                                                borderRadius={8} >
                                                    <AlertIcon />
                                                    Invalid E-Mail. Please enter a valid E-Mail.
                                                </Alert>
                                            ) }
                                        </FormControl>
                                        <FormControl mt={6} isRequired >
                                            <FormLabel>Password</FormLabel>
                                            <Input 
                                            variant="filled" 
                                            type="password" 
                                            value={this.state.password} 
                                            onChange={
                                                event => this.setState({ password: event.target.value })} />
                                        </FormControl>
                                        <FormControl mt={6} isRequired >
                                            <FormLabel>Confirm Password</FormLabel>
                                            <Input 
                                            variant="filled" 
                                            value={this.state.conf_pass} 
                                            onChange={
                                                event => this.setState({ conf_pass: event.target.value }, 
                                                () => {this.state.password === this.state.conf_pass || this.state.conf_pass === '' ? 
                                                    (
                                                        this.setState({ isPassMatch: true })
                                                    )   :   (
                                                        this.setState({ isPassMatch: false }) 
                                                    ) 
                                                } 
                                                ) } />
                                            {!this.state.isPassMatch && 
                                            (
                                                <Alert 
                                                status="error" 
                                                mt={3} 
                                                borderRadius={8} >
                                                    <AlertIcon />
                                                    Passwords do not match.
                                                </Alert>
                                            ) } 
                                        </FormControl>
                                        <FormControl mt={6} isRequired>
                                            <FormLabel>Passport No</FormLabel>
                                            <Input  
                                            variant="filled" 
                                            value={this.state.passport_no} 
                                            onChange={
                                                event => this.setState({ passport_no: event.target.value })} />
                                        </FormControl>
                                        <FormControl mt={6} isRequired>
                                            <FormLabel>Name on Passport</FormLabel>
                                            <Input 
                                            variant="filled" 
                                            value={this.state.passport_name} 
                                            onChange={
                                                event => this.setState({ passport_name: event.target.value })} />
                                        </FormControl>
                                        <FormControl mt={6} isRequired>
                                            <FormLabel>Passport Image</FormLabel>
                                            <Input 
                                            variant="filled" 
                                            type="file" 
                                            accept="image/*" 
                                            max={1} 
                                            ref={this.fileInput} p={1} />
                                        </FormControl>
                                        { !!this.state.errMessage && 
                                        (
                                            <Alert 
                                            status="error" 
                                            mt={6} 
                                            borderRadius={8}>
                                                <AlertIcon />
                                                {this.state.errMessage}
                                            </Alert>
                                        ) }
                                        <Button 
                                        width="full" mt={6} type="submit"
                                        isLoading={this.state.isLoad}
                                        loadingText={this.state.status}
                                        isDisabled={!this.state.isPassMatch || !this.state.isMailValid}
                                        >
                                        Sign Up
                                        </Button>
                                    </form>
                                    <Stack direction="row" pt={4} align="center">
                                        <Divider  color="gray.400" />
                                        <Text as="i" color="gray.400" >OR</Text>
                                        <Divider color="gray.400" pb={0} />
                                    </Stack>
                                    <Button 
                                    width="full" 
                                    mt={4} 
                                    onClick={ event => Router.push('/digital_identity/signin') } >
                                    Sign In
                                    </Button>
                                </Box>
                            </SimpleGrid>
                        </AdaptiveBox>
                        ) }
                    </Center>
                 </Layout>
             </Box>
         );
     }
}

export default SignUp;