import Web3 from 'web3'
import { web3Loaded,web3AccountLoaded, tokenLoaded, exchangeLoaded,cancelledOrdersLoaded

} from "./actions"
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
export const loadWeb3 = (dispatch) =>{
    const web3 =new Web3(Web3.giveProvider ||  'http://localhost:7545')
    dispatch(web3Loaded(web3))
    return web3
}
export const loadAccount = async (web3,dispatch) =>{
    
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    dispatch(web3AccountLoaded(account))
    return account
}

export const loadToken = async (web3,networkId,dispatch) =>{
    try{
        const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
        dispatch(tokenLoaded(token))
        return token
    }catch(error){
       console.log("Token  Contract not deployed to the current network")
       return null
    }
   
    
}


export const loadExchange = async (web3,networkId,dispatch) =>{
    try{
        const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
        dispatch(exchangeLoaded(exchange))
        return exchange
    }catch(error){
        console.log("Contract not deployed to the current network")
       return null
    }
   
    
}


export const loadAllOrders =async(exchange,dispatch) =>{
    // fetch cancelled orders with 
    const cancelStream =await exchange.getPastEvents('Cancel',{fromBlock:0,toBlock:'latest'})
    
    const cancelledOrders = cancelStream.map((event)=> event.returnValues)
    // 将cancelled order 加入redux store中
    dispatch(cancelledOrdersLoaded(cancelledOrders))

    
    const tradeStream =await exchange.getPastEvents('Trade',{fromBlock:0,toBlock:'latest'})
    
    const filledorders = tradeStream.map((event)=> event.returnValues)
   
    dispatch(filledOrdersLoaded(filledorders))



    const orderStream =await exchange.getPastEvents('Order',{fromBlock:0,toBlock:'latest'})
    
    const allorders = orderStream.map((event)=> event.returnValues)
   
    dispatch(allOrdersLoaded(allorders))

    







    //fetch filled orders with the trade event stream


}