const assert = require('assert')
const ganache = require('ganache-cli')

const Web3 = require('web3')

const contract_output = require(`../compile`)
const {abi, evm} = contract_output['Inbox']
const bytecode = evm["bytecode"]


const web3 = new Web3(ganache.provider())


// Let's define a global accounts variable
let accounts;
let inbox;
const INITIAL_STRING = 'This is the initial string... Hello World!'


// Use one of those accounts to deploy the contract
beforeEach(async () => {
    // Get a list of all accounts 
    // Every function that you call within web3 is an async function, meaning that 
    // it will return a promise!
    /*
    web3.eth.getAccounts()
        .then((fetchedAccounts) => {
            console.log(fetchedAccounts)
        })
    */

    // Rather than using promises, let's use async/await syntax!
    // Remember to label the sorounding function as the async (callback of beforeEach)
    accounts = await web3.eth.getAccounts()
    
    

    // Let's deploy the contract!
    // Remember that in this case the abi itself is a js object (no need to JSON.parse to convert json to js obj then)
    
    inbox = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode.object,
            arguments: [INITIAL_STRING]
        })
        .send({ 
            from: accounts[0],
            gas: '1000000' 
        })
});

describe('Inbox Smart Contract Tests', () => {
    
    it('Checks to see if the accounts are fetched successfully from ganache (using web3.eth.getAccounts promise)', () => {
        console.log(inbox)
    })

    it('Does the message variable has a default value?', async () => {
        // calling a method is going to return a promise, thus we will define the 
        // arrow function as async to wait for this message property to return to us
        const message = await inbox.methods.message().call(); // call: cannot modify a contract's data. No transaction receipt.
        assert.equal(message, INITIAL_STRING);
        
    })

    it("Can we set the value of the message correctly?", async () => {
        let new_message = 'I have something to say.';
        await inbox.methods.setMessage(new_message).send({
            from: accounts[0],

        }); // send: can modify the contract's data :: returns a transaction receipt!
        /**
         * There is no need to check the tranaction hash (receipt) to see if
         * it has been fine. If anything with the transaction itself is wrong, the
         * line will not proceed. But, we need to check the results of transaction
         * modifying the contract's data.
         */

        const message = await inbox.methods.message().call();
        assert.equal(message, new_message);

    })

})