pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    
    using SafeMath for uint;

    string public name = "DApp Token";
    string public symbol = "DAPP";
    uint256 public decimals =18;
    uint256 public totalSupply;


    mapping(address=>mapping(address => uint256)) public allowance;



    event  Transfer(address indexed from,address indexed  to, uint256 value);
    event Approval(address indexed from,address indexed spender,uint256 value);

    // track 
    mapping(address => uint256) public balanceOf;

    //send tokens 



    constructor() public{
        totalSupply = 1000000*(10**decimals); 
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to,uint256 _value) public returns(bool success){
        require(_to !=address(0));
        require(balanceOf[msg.sender]>=_value);
        _transfer(msg.sender, _to, _value);
        return true;
    }

    // Approve Token 

    function approve(address _spender,uint256 _value) public returns(bool){
        require(_spender !=address(0));

        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);

        return true;

    }


    function _transfer(address _from,address _to,uint256 _value) internal{
        balanceOf[_from] =balanceOf[_from].sub(_value);   
        balanceOf[_to]  = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }
    // Transfer from 

    function transferFrom(address _from,address _to,uint256 _value) public  returns(bool){
           require(_value <=balanceOf[_from]);
           require(_value <=allowance[_from][msg.sender]);
           allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
           _transfer(_from, _to, _value);  
           return true;
    }

}