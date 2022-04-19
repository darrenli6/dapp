

// Contracts 
const Token = artifacts.require('Token')
const Exchange = artifacts.require('Exchange')


// Utils

const ETHER_ADDRESS='0x0000000000000000000000000000000000000000';

const ether = (n)=>{
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(),'ether')
    )
}
const tokens= (n) =>ether(n)

const wait =(seconds) =>{
    const milliseconds = seconds *1000;
    return new Promise(resolve => setTimeout(resolve,milliseconds) )

}

module.exports = async function(callback){
    try{
       const accounts =await web3.eth.getAccounts()

       //Fetch the deployed token
       const token =await Token.deployed()
       console.log("Token fetched ",token.address)

       //fetch the deployed exchange 
       const exchange = await Exchange.deployed()
       console.log('exchange fetched ',exchange.address);

       //give tokens to account[1]
       const sender = accounts[0]
       const receiver =accounts[1]
       let amount =web3.utils.toWei('10000','ether')

       await token.transfer(receiver,amount,{from: sender});

       console.log(`Transfer ${amount} tokrn from ${sender} to ${receiver}`)

       //set up exchange users
       const user1= accounts[0]
       const user2= accounts[1]

        // User 1 deposits eth
        amount =1 
        await exchange.depositEther({from:user1,value:ether(amount)})
        console.log(`deposted ${amount} eth from ${user1}`)


        // user2 存储token

        amount =10000
        await  token.approve(exchange.address, tokens(amount),{from:user2})

        console.log(`Approved ${amount} tokens from ${user2}`)

        // user 2 deposits token 
        await exchange.depositToken(token.address,tokens(amount),{from:user2})
        console.log(`deposited ${amount} tokens from ${user2}`)

        // user 1 makes order to get tokens 
        let result
        let orderId
        result =await exchange.makeOrder(token.address,
            tokens(100),
            ETHER_ADDRESS,
            ether(0.1),
            {from : user1})
        console.log(`make order from ${user1}`)
        
        // User1 cancel order 
        orderId = result.logs[0].args.id

        await exchange.cancelOrder(orderId,{from : user1})
        console.log(` Cancelled order from ${user1} `)

        // user1 make order 
        result =await exchange.makeOrder(token.address,tokens(100),ETHER_ADDRESS,ether(0.1),{from : user1})
        console.log(`make order from ${user1}`)

        // user2 fills order 
        orderId= result.logs[0].args.id
        await exchange.fillOrder(orderId,{from : user2})
        console.log(` filled order from ${user2} `)

        await wait(1)

   






    }catch(error){
        console.log(error)
    }

    callback()
}

