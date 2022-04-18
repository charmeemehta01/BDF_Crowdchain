import { Button, Box, Input, Wrap, InputGroup, InputLeftElement, IconButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Stat, StatLabel, StatNumber, StackDivider, VStack, StatArrow, StatUpArrow } from '@chakra-ui/react';
import React, { Component } from 'react';
import Header from '../../components/Header'
import Layout from '../../components/Layout';
import { Plus, SignIn, SignOut } from 'phosphor-react';
import CampCard from '../../components/CampCard';
import crowdfund from '../../ethereum/crowdfunding';
import compiledCamp from '../../ethereum/build/Campaign.json'
import Link from 'next/link'
import Router from 'next/router'
import AdaptiveBox from '../../components/AdaptiveBox';
import web3 from '../../ethereum/web3';
import LogOut from '../../components/LogOutButton';

class CrowdFunding extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isLoggedIn: false,
        cards: [],
        active_camp: 0,
        total_camp: 0,
        stat: false
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
        this.fetchInfo();
        window.innerWidth < 1920 ? this.setState({ stat: false }) : this.setState({ stat: true });
    }

    fetchInfo = async () => {
        try {
            const address = await crowdfund.methods.getDeployedCampaigns().call();
            this.setState({ total_camp: address.length })
            let cards = [];
            let active_camp = 0;
            for(let add of address) {
                let instance = new web3.eth.Contract(
                    compiledCamp.abi,
                    add
                );
                let data = await instance.methods.getCampaignDetails().call();
                if(this.expireCheck(data[6])) {
                    active_camp++;
                    cards.push(<CampCard 
                        title={data[1]} 
                        desc={data[2]} 
                        imgHash={data[3]} 
                        total={data[4]} 
                        raised={data[5]} 
                        ttl={data[6]} 
                        address={add} 
                        key={add} />);
                }
            }
            this.setState({ cards, active_camp });
        } catch(err) {
            console.log(err);
        }
    }

    expireCheck = (ttl) => {
        const now = new Date().getTime();
        const exp_time = new Date(ttl).getTime();
        const left = exp_time - now;
        if(left <=0) {
            return false;
        } else {
            return true;
        }
    }

    logout = () => {
        this.setState({isLoggedIn: false});
    }

    render() {
        return (
            <Box>
                <Header 
                right={
                    this.state.isLoggedIn ? (
                        [<IconButton icon={<Plus weight="bold" size={20} />} variant="ghost" onClick={() => Router.push('/crowdfunding/new_campaign')} />,
                        <LogOut logout={this.logout} />]) : 
                        <IconButton icon={<SignIn weight="bold" size={20} />} variant="ghost" onClick={event => Router.push('/digital_identity/signin')} />
                } />
                <Layout>
                    <AdaptiveBox mb={3} p={3} boxShadow="md" maxW="70px" borderRadius={10} >
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <BreadcrumbLink as={Link} href='/crowdfunding/' >Home</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </AdaptiveBox>
                    { !this.state.stat ? (
                        <div></div>
                    ) : (
                        <AdaptiveBox p={8} float="right" >
                            <VStack spacing={5} divider={<StackDivider />}>
                                <Stat>
                                    <StatLabel>Total Campaigns Hosted</StatLabel>
                                    <StatNumber><StatUpArrow /> { this.state.total_camp } Campaigns</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Active Campaigns</StatLabel>
                                    <StatNumber><StatUpArrow /> { this.state.active_camp } Campaigns</StatNumber>
                                </Stat>
                            </VStack>
                        </AdaptiveBox>

                    )}
                    {this.state.cards}
                </Layout>
            </Box>
        );
    }
}

export default CrowdFunding;
/** 
   left={
                <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<MagnifyingGlass weight="bold" />}
                />
                <Input variant="filled" />
                </InputGroup>}                 
***/