import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, SimpleGrid, Wrap, IconButton } from '@chakra-ui/react';
import React, { Component } from 'react';
import Layout from "../../components/Layout";
import Header from '../../components/Header';
import didentity from '../../ethereum/digitalidentity';
import AppCard from '../../components/UserCard';
import VerifyCard from '../../components/VerifyCard';
import { ArrowsClockwise } from 'phosphor-react';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            unverifiedUser: []
        }
    }

    componentDidMount() {
        this.fetchInfo();
    }

    fetchInfo = async () => {
        try {
            let unverifiedUser = [];
            const count = await didentity.methods.getNumOfUsers().call();
            let cards = Array(parseInt(count)).fill().map((element, i) => {
                return <AppCard uid={i+1} key={i+1} />;
            })
            this.setState({ cards });
            for(let i=0; i<parseInt(count); i++) {
                try {
                    let data = await didentity.methods.getUnverifiedUser(i+1).call();
                    unverifiedUser.push(<VerifyCard key={i+1} uid={i+1} email={data[0]} pass_no={data[1]} name={data[2]} imgHash={data[3]} rerender={this.rerender} />);
                } catch (err) {
                }
            }
            this.setState({ unverifiedUser });
        } catch(err) {
            console.log(err);
        }
    }

    rerender = () => {
        this.fetchInfo();
    }

    render() {
        return (
            <Box>
                <Header />
                <Layout>
                    <Tabs isLazy variant="soft-rounded" colorScheme="telegram">
                        <TabList>  
                            <Tab>View Users</Tab>
                            <Tab>Verify Users</Tab>
                            <Box flex={1} align="right">
                                <IconButton onClick={() => {this.forceUpdate}} borderRadius={20} icon={<ArrowsClockwise />} mr={3} colorScheme="telegram" />
                            </Box>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Wrap spacing={20} >
                                    {this.state.cards}
                                </Wrap>
                            </TabPanel>
                            <TabPanel>
                                <SimpleGrid minChildWidth="280px" spacing="50px">
                                    {this.state.unverifiedUser}
                                </SimpleGrid>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Layout>
            </Box>
            
        );
    }
}

export default Admin;