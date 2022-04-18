import React from 'react';
import { Image, StackDivider, Box, Center,
    Text, Wrap, WrapItem, HStack,
    Heading, Accordion, VStack, AccordionItem, 
    AccordionButton, AccordionIcon, AccordionPanel, Skeleton, 
    Stat, StatLabel, StatNumber, StatHelpText, StatGroup, Divider } from '@chakra-ui/react';
import AdaptiveBox from './AdaptiveBox';
import { Component } from 'react';
import Link from 'next/link'

class CampCard extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        title: '',
        desc: '',
        imgUrl: '',
        raised: '',
        total: '',
        ttl: '',
        countdown: ''
    }

    componentDidMount() {
        this.setState({ 
            title: this.props.title, 
            desc: this.props.desc, 
            imgUrl: `https://ipfs.infura.io/ipfs/${this.props.imgHash}`, 
            total: this.props.total, 
            raised: this.props.raised, 
            ttl: this.props.ttl });
        this.count = setInterval(
            () => this.ttl(),
            1000
        );
    }
    
    ttl = () => {
        let now = new Date().getTime();
        let exp_time = new Date(this.state.ttl).getTime();
        let left = exp_time - now;
        let days = Math.floor(left / (1000 * 60 * 60 * 24));
        let hours = Math.floor((left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((left % (1000 * 60)) / 1000);
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

    render() {
        return (
            <AdaptiveBox p={8} mt={3} maxW={1625}>
                <Wrap spacing={10}>
                    <WrapItem justifySelf="center">    
                        <Center>
                            <Image 
                            src={this.state.imgUrl} 
                            borderRadius={10} 
                            objectFit="contain" 
                            width={450} 
                            minW={190} 
                            height={270} 
                            bg="#0000001F" 
                            mb={3} 
                            fallbackSrc="./placeholder.jpg" />
                        </Center>
                    </WrapItem>
                    <WrapItem>
                        <VStack align="left" spacing={3} maxW={ window.innerWidth - 900} >
                            <Skeleton isLoaded={!!this.state.title}>
                                <Heading size="2xl" px={4}>{ this.state.title } Campaign</Heading>
                            </Skeleton>
                            <Skeleton isLoaded={!!this.state.desc}>
                                <Accordion allowToggle _focusVisible='false' >
                                    <AccordionItem>
                                        <AccordionButton >
                                            <Box flex="1" textAlign="left" >
                                                <Text fontWeight="medium">Description</Text>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4} >
                                        { this.state.desc }
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            </Skeleton>
                            <HStack spacing={10} divider={<StackDivider />} px={4} >
                                <Skeleton isLoaded={!!this.state.raised}>
                                    <Stat>
                                        <StatLabel>Ether raised</StatLabel>
                                        <StatNumber>{ this.state.raised } ETH</StatNumber>
                                        <StatHelpText>Out of { this.state.total } ETH</StatHelpText>
                                    </Stat>
                                </Skeleton>
                                <Skeleton isLoaded={!!this.state.ttl}>
                                    <Stat>
                                        <StatLabel>Ends in</StatLabel>
                                        <StatNumber>{ this.state.countdown }</StatNumber>
                                        <StatHelpText>Estimated</StatHelpText>
                                    </Stat>
                                </Skeleton>
                            </HStack>
                            <Divider />
                            <Box px={4}>
                                <Link href={{pathname: '/crowdfunding/[address]/view_campaign', query: { address: this.props.address }}} mt={3} >View Campaign</Link>
                            </Box>
                        </VStack>
                    </WrapItem>
                </Wrap>
            </AdaptiveBox>
        )
    }
}

export default CampCard;