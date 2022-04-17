
import {tokens,EVM_REVERT} from './helpers'
const { result } = require('lodash')
const { default: Web3 } = require('web3')

const Token = artifacts.require('./Token')
require('chai').use(require('chai-as-promised')).should()




contract('Token',([deployer,receiver,exchange])=>{

    let token
    const name="DApp Token"
    const symbol = "DAPP"
    const decimals = '18' 
    const totalSupply =tokens(1000000)
  





    beforeEach(async ()=>{
        token  =await Token.new()
        
    })

    describe('deployment',()=>{
        it('tracks the name' ,async () => {
            // fetch token from blockchain 
          
           

             // read name 
             const result =await token.name()
             
             // the name is  'My name'
             result.should.equal( name)


        });

        it('track the symbol',async ()=>{
            const reuslt = await token.symbol()
            reuslt.should.equal(symbol)
        });

        it('track the totalsupply',async ()=>{
            const reuslt = await token.totalSupply()
            reuslt.toString().should.equal(totalSupply.toString())
        });

        it('track the decimal',async ()=>{
            const reuslt = await token.decimals()
            reuslt.toString().should.equal(decimals)
        });

        it('assign the total supply to the deployer',async ()=>{
            const result =await token.balanceOf(deployer);
            result.toString().should.equal(totalSupply.toString());
        });
    })

    describe('send tokens', () => { 
        let result
        let amount 
           beforeEach(async ()=>{
               amount=tokens(100)
               result =await token.transfer(receiver,amount,{from: deployer})
           })

          it('transfer token balances',async ()=>{
              let balanceOf 
              balanceOf =await token.balanceOf(receiver);
              console.log("receiver balance",balanceOf.toString());

              balanceOf =await token.balanceOf(deployer);
              console.log("deployer balnace before transfer ",balanceOf.toString());

              //transfer 

               await token.transfer(receiver,tokens(100),{from : deployer})


              // balance after transfer 
              balanceOf =await token.balanceOf(receiver);
              console.log("receiver balance after transfer",balanceOf.toString());
              balanceOf.toString().should.equal(tokens(200).toString());

              balanceOf =await token.balanceOf(deployer);
              balanceOf.toString().should.equal(tokens(999800).toString());
              console.log("deployer balnace after transfer ",balanceOf.toString());



          });

          it('emit a transfer event',async () =>{
              const log=(result.logs[0]);
              log.event.should.eq('Transfer')
              const event = log.args
              event.from.toString().should.equal(deployer,'from is correct ')
              event.to.toString().should.equal(receiver,'to is correct')

          });

          describe('failed',()=>{
          it('rejects insufficient balances',async ()=>{
              let invalidAmount 
              invalidAmount = tokens(100000000)
              await token.transfer(receiver,invalidAmount,{from:deployer}).should.be.rejectedWith(EVM_REVERT);

          });
          it('rejects invalid recipients',async ()=>{
              await token.transfer(0x0,10000,{from:deployer}).should.be.rejected;
          });
      });
     })

     

      describe('approving tokens', () => {
 
        let result
        let amount 

        beforeEach(async ()=>{
            amount =tokens(100)
            result =await token.approve(exchange,amount,{from:deployer})
        })

        describe('success',()=>{

          it('allocates an allownance for delegated token spending on exchange ',async ()=>{
              const allownance = await token.allowance(deployer,exchange)
              allownance.toString().should.equal(amount.toString())
          })
          it('emit a approve event',async () =>{
            const log=(result.logs[0]);
            log.event.should.eq('Approval')
            const event = log.args
            event.from.toString().should.equal(deployer,'owner is correct ')
            event.spender.toString().should.equal(exchange,'spender is correct')
            event.value.toString().should.equal(amount.toString(),"value is correct ")


        });





        })

        describe('failed',()=>{

            it('rejects invaalid spenders',async ()=>{
                await token.approve(0x0,amount,{from : deployer}).should.be.rejected
            })

        })
      })


      describe('delegated token transfer ',()=>{

        let result 
        let amount 
        beforeEach(async ()=>{
            amount =tokens(100)
            await token.approve(exchange,amount,{from:deployer})
        })

        describe('success',async ()=>{
             
            beforeEach(async ()=>{ 
                result = await token.transferFrom(deployer,receiver,amount,{from: exchange})
            })

            it('transfer token balance', async ()=>{
                let balanceOf
                balanceOf = await token.balanceOf(deployer);
                balanceOf.toString().should.equal(tokens(999900).toString())
                balanceOf = await token.balanceOf(receiver);
                balanceOf.toString().should.equal(tokens(100).toString())
            })

            it('reset the allowance',async ()=>{
                const allowance = await token.allowance(deployer,exchange)
                allowance.toString().should.equal('0')
            })



        })
      })
})