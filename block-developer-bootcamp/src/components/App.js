import React, { Component } from 'react';
import './App.css';
 
import { loadWeb3,
  loadAccount,
  loadToken,
  loadExchange } from '../store/interactions';
import { connect } from 'react-redux';

import { contractsLoadedSelector} from '../store/selectors'
import Navbar from './Navbar';
import Content from './Content';
 

class App extends Component {
  componentWillMount() {
    
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()
    
    await loadAccount(web3,dispatch)
    const token = loadToken(web3,networkId,dispatch)
    if(!token){
      window.alert("Token smart contract not detected on the current network")
      return
    } 
    const exchange = await loadExchange(web3,networkId,dispatch)
    if(!exchange){
      window.alert("exchange smart contract node detected on the current network")
      return
    }  

  }

  render() {
    //console.log(this.props.account)
    return (
      <div>
        <Navbar />
        {this.props.contractsLoaded ? <Content /> : <div className="content"></div> }
        
      </div>
    );
  }
}



function mapStateToProps(state){
  console.log("contractsLoadedSelector",contractsLoadedSelector(state))
  return {
    contractsLoaded:contractsLoadedSelector(state)
   // account : accountSelector(state)
  }
}
export default connect(mapStateToProps)(App);
