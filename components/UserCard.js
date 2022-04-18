import { Button, WrapItem, Image, Box, Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import React, { Component } from 'react';
import AdaptiveBox from './AdaptiveBox';
import web3 from '../ethereum/web3';
import didentity from '../ethereum/digitalidentity';

class AppCard extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        imgUrl: '',
        pass_no: '',
        name: '',
        status: '',
        mail: '',
        isLoad: false
    }

    componentDidMount() {
        this.fetchInfo();
    }

    fetchInfo = async () => {
        try {
            const data = await didentity.methods.getUser(this.props.uid).call();
            this.setState({ imgUrl: `https://ipfs.infura.io/ipfs/${data[4]}`, pass_no: data[2], status: data[1], name: data[3], mail: data[0] }); 
        } catch(err) {
            console.log(err);
        }
    }

    onClick = async () => {
        this.setState({ isLoad: true })
        try {
            const accounts = await web3.eth.getAccounts();
            await didentity.methods
            .suspendUser(this.props.uid)
            .send({ from: accounts[0] });
            this.fetchInfo();
        } catch(err) {
            console.log(err.message);
        }
        this.setState({ isLoad: false })
    }

    render() {
        return (
            <WrapItem>
                <AdaptiveBox maxW={378} minW={260} p={8}>
                    <Image src={this.state.imgUrl} borderRadius={10} objectFit="contain" width={350} height={200} bg="#0000001F" mb={3} />
                    <Box>
                        <Table size="sm" variant="unstyled">
                            <Tbody>
                                <Tr>
                                    <Th>User ID</Th>
                                    <Td>{ this.props.uid }</Td>
                                </Tr>
                                <Tr>
                                    <Th>Passport No</Th>
                                    <Td>{ this.state.pass_no }</Td>
                                </Tr>
                                <Tr>
                                    <Th>Email ID</Th>
                                    <Td>{ this.state.mail }</Td>
                                </Tr>
                                <Tr>
                                    <Th>Name</Th>
                                    <Td>{ this.state.name }</Td>
                                </Tr>
                                <Tr>
                                    <Th>Status</Th>
                                    <Td textTransform="capitalize">{ this.state.status }</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>
                    <Button width="full" isLoading={this.state.isLoad} loadingText="Suspending" onClick={this.onClick} mt={5} >Suspend</Button>
                </AdaptiveBox>
            </WrapItem>
        );
    }   
}

export default AppCard;