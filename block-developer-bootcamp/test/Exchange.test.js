

import {EVM_REVERT, tokens,ETHER_ADDRESS,ether } from './helpers'

const Token =artifacts.require('./Token')
const Exchange =artifacts.require('./Exchange')

require('chai')
.use(require('chai-as-promised'))
.should()


contract('Exchange',([deployer,feeAccount,user1,user2])=>{

       let token 
       let exchange 
       const feePercent =10 

       beforeEach(async ()=>{
           token = await Token.new()
           // 转移tokens到user1 
           token.transfer(user1,tokens(100),{from:deployer})
           
           // 部署exchange
           exchange= await Exchange.new(feeAccount,feePercent)
 

       })

       describe('deployment',()=>{
           it('tracks the fee account', async ()=>{
               const result = await exchange.feeAccount()
               result.should.equal(feeAccount)
           })

           it('tracks the fee percent ',async ()=>{
               const result =await exchange.feePercent()
               result.toString().should.equal(feePercent.toString())
           })
       })

       describe('fallback',()=>{
           it('revert when ether is sent',async ()=>{
               await exchange.sendTransaction({value:1,from:user1}).should.be.rejectedWith(EVM_REVERT)
           });
       })

       describe('depisting eth',()=>{
           let result
           let amount

           beforeEach(async ()=>{
               amount =ether(1)
               result =await exchange.depositEther({from:user1,value:amount})
           })

           it("tracks the ether deposit",async()=>{
               const balance =await exchange.tokens(ETHER_ADDRESS,user1)
               balance.toString().should.equal(amount.toString())
           })


           it("emit a Deposit event ",async ()=>{
               const log = result.logs[0]
            //    console.log(log)
               log.event.should.eq('Deposit')
               const event =log.args;

               event.token.should.equal(ETHER_ADDRESS,"token address is correct")

               event.user.should.equal(user1,"user address is correct")
               event.amount.toString().should.equal(amount.toString(),"amount is ok")
               event.balance.toString().should.equal(amount.toString(),"balance is ok ")
           })
       })

       describe('withdraw eth',()=>{
            
          let result 
          let amount

          beforeEach(async()=>{
              amount =ether(1)
              await exchange.depositEther({from:user1,value:amount});

          })

          describe('success', () => { 
               beforeEach(async()=>{
                   result = await exchange.withdrawEther(amount,{from:user1})

               })

               it("check funds",async ()=>{
                   const balance = await exchange.tokens(ETHER_ADDRESS,user1)
                   balance.toString().should.equal("0")
               })

           })

       })

       describe('make orders',async ()=>{
           let result 

           beforeEach(async ()=>{
               result = await exchange.makeOrder(
                   token.address,
                   tokens(1),
                   ETHER_ADDRESS,
                   ether(1),
                   {from: user1}
               );
           })
           

          it('tracks the newly created order',async()=>{
             const  orderCount =await exchange.orderCount()
             orderCount.toString().should.equal("1")
             const order = await exchange.orders("1")
             order.id.toString().should.equal('1','id is correct')
             order.user.should.equal(user1,"user is correct")
             order.tokenGet.should.equal(token.address,"token is correct")
             order.amountGet.toString().should.equal(tokens(1).toString(),"amountGet is correct");


          })

          it('emit an order event ', async()=>{
              const log =result.logs[0]
              log.event.should.eq('Order')
              const event = log.args 
              event.id.toString().should.equal('1','id is correct')

          })

       })


       describe('cancel order ',async()=>{

         beforeEach(async()=>{

            // order

            await exchange.depositEther({from:user1,value:ether(1)})

            // user1 makes ans order to buy tokens with Ether

            await exchange.makeOrder(token.address,tokens(1),ETHER_ADDRESS,ether(1),{from:user1})

         })

         describe('cancelling orders', async() =>{
             let result 

             describe('syccess',async()=>{
                  beforeEach(async()=>{

                    result = await exchange.cancelOrder('1',{from: user1})

                  })

                  it('update cancel order ',async()=>{
                      const orderCancelled =await  exchange.orderCancelled(1)
                      orderCancelled.should.equal(true)
                  })
             })
         })

       })











});