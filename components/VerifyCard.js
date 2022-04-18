import React, { Component } from 'react';
import AdaptiveBox from './AdaptiveBox';
import { Box, Center, Image, SimpleGrid, Button, Table, Tr, Th, Tbody, Td, Wrap, Textarea, FormLabel } from '@chakra-ui/react';
import didentity from '../ethereum/digitalidentity';
import web3 from '../ethereum/web3';

class VerifyCard extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        pass_no: '',
        uid: 0,
        name: '',
        email: '',
        imgUrl: '',
        reason: '',
        isAcceptLoad: false,
        isRejectLoad: false
    }

    onAccept = async () => {
        try {
            this.setState({ isAcceptLoad: true });
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            await didentity.methods
            .verifyUser(this.state.uid, 'verified')
            .send({ from: accounts[0] });
            
            let _data = {
                email: this.state.email
            }
            
            //Mailing code
            fetch('http://localhost:3000/mail/accept_status', {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json()) 

            this.props.rerender();
        } catch(err) {
            console.log(err.message);
        }
        this.setState({ isAcceptLoad: false });
    }

    onReject = async () => {
        try {
            this.setState({ isRejectLoad: true });
            const accounts = await web3.eth.getAccounts();
            await didentity.methods
            .verifyUser(this.state.uid, 'rejected')
            .send({ from: accounts[0] });
            
            let _data = {
                email: this.state.email,
                reason: this.state.reason
            }
            
            //Mailing code
            fetch('http://localhost:3000/mail/reject_status', {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json()) 

            this.props.rerender();
        } catch(err) {
            console.log(err.message);
        }
        this.setState({ isRejectLoad: false });
    }

    componentDidMount() {
        this.setState({ pass_no: this.props.pass_no, uid: this.props.uid, name: this.props.name, email: this.props.email, imgUrl: `https://ipfs.infura.io/ipfs/${this.props.imgHash}` })
    }
    render() {
        return (
            <AdaptiveBox maxW="900px" minW="280px" p={8}>
                <SimpleGrid minChildWidth="200px" spacing="30px">
                    <Center>
                        <Image src={this.state.imgUrl} borderRadius={10} objectFit="contain" width={390} height={270} bg="#0000001F" mb={3} />
                    </Center>
                        <Box>
                            <Table variant="unstyled"  fontSize="md" >
                                <Tbody>
                                    <Tr>
                                        <Th fontSize="md" >User ID</Th>
                                        <Td>{ this.state.uid }</Td>
                                    </Tr>
                                    <Tr>
                                        <Th fontSize="md">Passport No</Th>
                                        <Td>{ this.state.pass_no }</Td>
                                    </Tr>
                                    <Tr>
                                        <Th fontSize="md" >Email ID</Th>
                                        <Td>
                                            <Wrap wordBreak="break-word">{ this.state.email }</Wrap>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Th fontSize="md" >Name</Th>
                                        <Td>
                                            <Wrap wordBreak="break-word">{ this.state.name }</Wrap>
                                        </Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                            <FormLabel pl={6} fontSize="md" >Reason for rejection</FormLabel>
                            <Textarea variant="filled" value={this.state.reason} onChange={event => this.setState({reason: event.target.value})} />
                            <Button width="full" isLoading={this.state.isAcceptLoad} loadingText="Verifying" onClick={this.onAccept} mt={3} >Verify User</Button>
                            <Button width="full" isLoading={this.state.isRejectLoad} loadingText="Rejecting" onClick={this.onReject} mt={3} >Reject User</Button>
                        </Box>
                </SimpleGrid> 
            </AdaptiveBox>
        );
    }
}

export default VerifyCard;