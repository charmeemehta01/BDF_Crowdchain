import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, 
    Center, FormLabel, Heading, Button, FormControl, Input, 
    InputGroup, Textarea, IconButton, InputRightElement, 
    Alert, AlertTitle, AlertDescription, AlertIcon } from '@chakra-ui/react';
import React, { Component } from 'react'; 
import Header from '../../components/Header';
import AdaptiveBox  from '../../components/AdaptiveBox';
import Layout from '../../components/Layout'
import Link from 'next/link'
import Router from 'next/router'
import ipfs from '../../ethereum/ipfs';
import web3 from '../../ethereum/web3';
import { toNumber } from 'lodash';
import crowdfund from '../../ethereum/crowdfunding'
import { CaretRight, House, SignIn } from 'phosphor-react';
import LogOut from '../../components/LogOutButton';


class NewCamp extends Component{
    constructor(props){
        super(props);
        this.file = React.createRef();
    }

    state = {
        name: "",
        des : "",
        amt : "",
        status : "",
        date : "",
        isLoad : false,
        date_err : '',
        disable : false,
        err: '',
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
    }

    disablePastDate = () => {
        const today = new Date();
        const dd = String(today.getDate() + 1).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        const yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    };

    onSubmit = async event =>{
        event.preventDefault();
        this.setState({isLoad : true });
        const uid = toNumber(localStorage.getItem("uid"));
        const email = localStorage.getItem("email");
        try{
            this.setState({ status: 'Getting Accounts...' });
            const accounts = await web3.eth.getAccounts();

            this.setState({ status: 'Uploading file to IPFS' });
            const result = await ipfs.add(this.file.current.files[0]);

            this.setState({ status: 'Creating campaign' });
            await crowdfund.methods
            .createCampaign( uid, this.state.name, this.state.des, result.cid.string, this.state.amt, this.state.date, email)
            .send({ from: accounts[0] });

            this.setState({ status: 'Wrapping up...' });
            let _data = {
                email: email,
                camp_title: this.state.name
            }
            //Mailing code
            fetch('http://localhost:3000/mail/camp_create', {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json()) 
                
            Router.push("/crowdfunding");
        }
        catch(err){
            this.setState({ err: err.message });
        }
    
        this.setState({isLoad : false});

    }

    validate = () => {
        const now = new Date().getTime();
        const selected = new Date(this.state.date).getTime();
        if(selected-now > 0) {
            this.setState({ disable: false, date_err: '' })
        } else {
            this.setState({ disable: true, date_err: 'Invalid Date Selected' })
        }

    }

    logout = () => {
        this.setState({isLoggedIn: false});
    }

    render(){
        return(
        <Box>
            <Header right={
                [
                <IconButton icon={ <House weight="bold" size={20} /> } variant="ghost" onClick={() => Router.push('/crowdfunding')} />,
                this.state.isLoggedIn ? <LogOut logout={this.logout} /> : <IconButton icon={<SignIn weight="bold" size={20} />} variant="ghost" onClick={event => Router.push('/digital_identity/signin')} />
                ]
            } />
            <Layout>
            {this.state.isLoggedIn ? 
            <Box>
                <AdaptiveBox 
                mb={3} 
                p={3} 
                boxShadow="md" 
                maxW="230px" 
                borderRadius={10} >
                    <Breadcrumb separator={<CaretRight weight="bold" size={12} />}>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={Link} href="/crowdfunding" >Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={Link} href="/crowdfunding/new_campaign" >Create Campaign</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </AdaptiveBox>
                <Center>
                    <AdaptiveBox width="600px" minW="300px" mt={6} p={8} >
                        <Heading 
                        mb={10} 
                        textAlign="center">
                            Create Campaign
                        </Heading>
                        <form onSubmit={this.onSubmit}>
                            <FormControl mt={5} isRequired>   
                                <FormLabel>Campaign Name</FormLabel>
                                <Input 
                                placeholder="Enter the name of campaign" 
                                variant="filled" 
                                type="text" 
                                value={this.state.name}
                                onChange = {
                                    event => this.setState({name : event.target.value})
                                } />
                            </FormControl> 
                            <FormControl mt={5} isRequired>   
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                borderRadius={5}
                                placeholder="Enter description here"
                                size="md"
                                resize="vertical"
                                variant="filled" type="text" value={this.state.des}
                                onChange = {
                                    event => this.setState({des : event.target.value})
                                } />
                            </FormControl> 
                            <FormControl mt={5} isRequired>
                                <FormLabel>Fund to be raised</FormLabel>
                                <InputGroup>
                                    <Input 
                                    placeholder="Enter the amount to be raised in ether" 
                                    variant="filled" 
                                    type="number" 
                                    value={this.state.amt}
                                    onChange = {
                                        event => this.setState({amt : event.target.value})
                                    } />
                                    <InputRightElement pointerEvents="none" children="ETH" pr={5} color="gray.400" />
                                </InputGroup>
                            </FormControl>
                            <FormControl mt={5} isRequired isInvalid={!!this.state.date_err}>
                                <FormLabel>Campaign end time</FormLabel>
                                <Input 
                                variant="filled" 
                                type="date"
                                min={this.disablePastDate()} 
                                value={this.state.date}
                                onChange = {
                                    event => this.setState({date : event.target.value})
                                } />
                            </FormControl> 
                            <FormControl mt={5} isRequired>
                                <FormLabel>Upload campaign image</FormLabel>
                                <Input 
                                type="file" 
                                variant="filled" 
                                ref={this.file} 
                                accept="image/*" 
                                max={1} 
                                py={1} />
                            </FormControl>
                            <Button 
                            mt={10} 
                            isLoading={this.state.isLoad} 
                            loadingText={this.state.status} 
                            type="submit"
                            width="full" >
                               Create
                            </Button>
                        </form>
                        {!!this.state.err && 
                        <Alert status="error" mt={3} borderRadius={8} >
                            <AlertIcon />
                            {this.state.err}
                        </Alert> }       
                    </AdaptiveBox>
                </Center>
            </Box> : 
            <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius={10}
            height={250}
            mt={10}
            size="md"
            >
                <AlertIcon boxSize="40px" />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    You are not logged in to CrowdChain
                </AlertTitle>
                <AlertDescription maxWidth="md">
                    Please log in with your CrowdChain account to create a new campaign. 
                </AlertDescription>
                <Button mt={4} colorScheme="pink" onClick={event => Router.push('/digital_identity/signin')} >Login</Button>   
            </Alert> }
            </Layout>
        </Box>
        )
    }
}

export default NewCamp;