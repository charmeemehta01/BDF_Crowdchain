const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFact.json');
const compiledIdentity = require('./build/DigitalIdentity.json');
const mnemonicPhrase = "shell body punch brush anxiety advance fault brain company broccoli verify renew";
const cfbytecode = compiledFactory.evm.bytecode.object;
const cfabi = compiledFactory.abi;
const dibytecode = compiledIdentity.evm.bytecode.object;
const diabi = compiledIdentity.abi;
const provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonicPhrase
    },
    providerOrUrl: "https://rinkeby.infura.io/v3/43d79bd2ca444d69949d23ff9a875c49"
  });
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy crowdfunding contract from account', accounts[0]);

    const cfresult = await new web3.eth.Contract(
        cfabi
    )
        .deploy({ data: cfbytecode })
        .send({ gas: '1546647', from: accounts[0] });
        //Code to estimate gas limit
        /*.estimateGas(function(err, gas){
            console.log(gas);
        });*/

    console.log('Crowfunding contract deployed to', cfresult.options.address);

    console.log('Attempting to deploy digital identity contract from account', accounts[0]);

    const diresult = await new web3.eth.Contract(
        diabi
    )
        .deploy({ data: dibytecode })
        .send({ gas: '2247216', from: accounts[0] });

    console.log('Digital Identity contract deployed to', diresult.options.address);

};
deploy();