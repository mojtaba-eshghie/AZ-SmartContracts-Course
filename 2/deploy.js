const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')


const contract_output = require(`./compile`)
const {abi, evm} = contract_output['Inbox']
const bytecode = evm["bytecode"]

const provider = new HDWalletProvider(
    'decade auction pyramid wet album affair ridge clay remain filter job garbage',
    'https://rinkeby.infura.io/v3/2fb1ec69430f420b83c53e6371b5b833'
);

/*
const provider = new HDWalletProvider(
    'oak bike scorpion garden panther other unable scene federal tuna decide flash',
    'https://rinkeby.infura.io/v3/2fb1ec69430f420b83c53e6371b5b833'
);
*/

const web3 = new Web3(provider);

const INITIAL_STRING = 'hello world';

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account ', accounts[0]);
    const result = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode.object,
            arguments: [INITIAL_STRING]
        })
        .send({
            gas: '1000000',
            from: accounts[0]
        });
    
    //console.log(result.options.address);
    
};
deploy();

