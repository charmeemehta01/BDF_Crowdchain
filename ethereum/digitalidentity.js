import web3 from './web3';
import compiledIdentity from './build/DigitalIdentity.json';

const instance = new web3.eth.Contract(
    compiledIdentity.abi,
  '0xb6055f8Cc06fC140Eebdd6F43F4FE411a85656cE'
);

export default instance;