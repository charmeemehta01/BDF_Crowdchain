import web3 from './web3';
import compiledFactory from './build/CampaignFact.json';

const instance = new web3.eth.Contract(
    compiledFactory.abi,
  '0xd4CC12fdDf57584f97E93f9E3F98B4582716074a'
);

export default instance;