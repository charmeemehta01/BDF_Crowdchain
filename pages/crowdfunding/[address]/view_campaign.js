import React, { Component } from 'react';
import { Box, Text, Heading, Image, Stat, 
    StatHelpText, StatLabel, StatNumber, 
    Wrap, Skeleton, VStack, FormControl, 
    Input, Button, HStack, IconButton,
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, 
    StackDivider, Divider, Alert, AlertIcon } from '@chakra-ui/react';
import { CaretRight, SignIn, SignOut, Plus } from 'phosphor-react';
import Header from '../../../components/Header';
import Link from 'next/link'
import Router from 'next/router';
import Layout from '../../../components/Layout';
import AdaptiveBox from '../../../components/AdaptiveBox';
import compiledCamp from '../../../ethereum/build/Campaign.json'
import web3 from '../../../ethereum/web3';
import LogOut from '../../../components/LogOutButton';
import { toNumber } from 'lodash';

class ViewCamp extends Component {
    _isMounted = false;
    address;
    instance;

    state = {
        title: '',
        desc: '',
        imgUrl: '',
        raised: '',
        total: '',
        ttl: '',
        owner_email: '',
        countdown: '',
        address: '',
        donation_amt: '',
        isLoad: false,
        status: '',
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
        this._isMounted = true;
        this.address = Router.query.address;
        this.instance = new web3.eth.Contract(
            compiledCamp.abi,
            this.address
        );
        this._isMounted && this.fetchInfo();
        this.count = setInterval(
            () => this.ttl(),
            1000
        );
    }

    logout = () => {
        this.setState({isLoggedIn: false});
    }

    fetchInfo = async () => {

            try {
                const data = await this.instance.methods.getCampaignDetails().call();
                this._isMounted && this.setState({ 
                    title: data[1], 
                    desc: data[2], 
                    imgUrl: `https://ipfs.infura.io/ipfs/${data[3]}`, 
                    raised: data[5], 
                    total: data[4], 
                    ttl: data[6],
                    owner_email: data[8] });
            } catch(err) {
                console.log(err);
            }
    }

    donate = async (event) => {
        event.preventDefault();
        this.setState({ isLoad: true, status: '' })
        const a_raised = toNumber(web3.utils.toWei(this.state.raised)) + toNumber(web3.utils.toWei(this.state.donation_amt));
        const sender_id = toNumber(localStorage.getItem("uid"));
        const email = localStorage.getItem("email");
        console.log(email);
        try {
            const accounts = await web3.eth.getAccounts();
            await this.instance.methods
            .donate( sender_id, web3.utils.fromWei(a_raised.toString()) )
            .send({ from: accounts[0], value: web3.utils.toWei(this.state.donation_amt) })
            
            //Mailing code for donator
            let _donatorData = {
                email: email,
                camp_title: this.state.title,
                amount: this.state.donation_amt
            }
            fetch('http://localhost:3000/mail/donator', {
                method: "POST",
                body: JSON.stringify(_donatorData),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json()) 
             
            //Mailing code for campaign owner
            console.log(this.state.owner_email);
            let _ownerData = {
                email: this.state.owner_email,
                camp_title: this.state.title,
                donation_amt: this.state.donation_amt,
                a_raised: web3.utils.fromWei(a_raised.toString())
            }
            fetch('http://localhost:3000/mail/creator', {
                method: "POST",
                body: JSON.stringify(_ownerData),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json()) 
             
            this.fetchInfo();
        } catch(err) {
            this.setState({ status: err.message });
        }
        this.setState({ isLoad: false, donation_amt: '' })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    ttl = () => {
        let now = new Date().getTime();
        let exp_time = new Date(this.state.ttl).getTime();
        let left = exp_time - now;
        let days = Math.floor(left / (1000 * 60 * 60 * 24));
        let hours = Math.floor((left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((left%(1000*60))/1000);
        if(this._isMounted) {    
            left <= 0 ?
            (
                this.setState({ countdown: "Ended" })
            ) : days != 0 ? 
            (
                this.setState({ countdown: `${days}d ${hours}h ${minutes}m ${seconds}s` })
            ) : hours != 0 ? 
            (
                this.setState({ countdown: `${hours}h ${minutes}m ${seconds}s` })
            ) : 
            (
                this.setState({ countdown: `${minutes}m ${seconds}s` })
            )
        }
    }

    render() {
        return(
            <Box>
                <Header
                right={
                    this.state.isLoggedIn ? (
                        [<IconButton icon={<Plus weight="bold" size={20} />} variant="ghost" onClick={() => Router.push('/crowdfunding/new_campaign')} />,
                        <LogOut logout={this.logout} />]) : 
                        <IconButton icon={<SignIn weight="bold" size={20} />} variant="ghost" onClick={event => Router.push('/digital_identity/signin')} />
                } />
                <Layout>
                    <AdaptiveBox mb={3} p={3} boxShadow="md" maxW="210px" borderRadius={10} >
                        <Breadcrumb separator={<CaretRight weight="bold" size={12} />}>
                            <BreadcrumbItem>
                                <BreadcrumbLink as={Link} href="/crowdfunding" >Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink as={Link} href="#" >View Campaign</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </AdaptiveBox>
                    <Wrap mt={5} spacing={5} justify="center" >
                        <Skeleton isLoaded={!!this.state.imgUrl} borderRadius={10} >
                            <Image 
                            width={800} 
                            maxH={600} 
                            src={this.state.imgUrl}
                            objectFit="contain"
                            borderRadius={10} 
                            bg="#0000001F" />
                        </Skeleton>
                        <AdaptiveBox p={8} width={1050} display="flex" flexDir="column" >
                            <VStack 
                            align="left" 
                            spacing={15} 
                            flex={1} 
                            mb={15} 
                            divider={ <StackDivider /> } >
                                <Skeleton 
                                isLoaded={!!this.state.title} 
                                borderRadius={10}>
                                    <Heading 
                                    size="2xl">{this.state.title}.</Heading>
                                </Skeleton>
                                <Skeleton 
                                isLoaded={!!this.state.desc} 
                                borderRadius={10}>
                                    <Text fontSize="lg">{this.state.desc}.</Text>
                                </Skeleton>
                            </VStack>
                            <Divider />
                            <VStack 
                            align="left" 
                            spacing={15} 
                            mt={15} 
                            flex={1} 
                            divider={ <StackDivider /> } >
                                <Skeleton isLoaded={!!this.state.raised} borderRadius={10}>
                                    <Stat>
                                        <StatLabel>Ether Raised</StatLabel>
                                        <StatNumber>{this.state.raised} ETH</StatNumber>
                                        <StatHelpText>
                                            Out of {this.state.total} ETH
                                        </StatHelpText>
                                    </Stat>
                                </Skeleton>
                                <Skeleton 
                                isLoaded={!!this.state.ttl} 
                                borderRadius={10}>
                                    <Stat>
                                        <StatLabel>Ends in</StatLabel>
                                        <StatNumber>{this.state.countdown}</StatNumber>
                                    </Stat>
                                </Skeleton>
                                { (this.state.countdown != "Ended" && this.state.isLoggedIn) ? (
                                <form onSubmit={this.donate}>   
                                    <Text 
                                    fontWeight="medium" 
                                    size="xl" 
                                    mb={5}>Donate to the Campaign</Text>
                                    <HStack 
                                    spacing={5} 
                                    justify="flex-end">
                                        <FormControl isRequired >
                                            <Input 
                                            type="number" 
                                            variant="filled" 
                                            placeholder="Amount in Ether"
                                            value={this.state.donation_amt}
                                            onChange={(event) => this.setState({ donation_amt: event.target.value }) }
                                             />
                                        </FormControl>
                                        <Button 
                                        isLoading={this.state.isLoad} 
                                        loadingText="Processing" 
                                        type="submit">Donate</Button>
                                    </HStack>
                                </form>
                                ) : (
                                    <Alert status="error" mt={3} borderRadius={8} >
                                        <AlertIcon />   
                                        <Text fontSize="lg" >Please log in to donate to the campaign</Text>
                                    </Alert>
                                )
                                }
                                { !!this.state.status &&
                                <Alert status="error" mt={3} borderRadius={8} >
                                    <AlertIcon />
                                    {this.state.status}
                                </Alert> }
                            </VStack>
                        </AdaptiveBox>
                    </Wrap>
                </Layout>
            </Box>
        );
    } 
}

export default ViewCamp;