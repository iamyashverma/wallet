pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Simple_Token is ERC20 {
    mapping(address => address[]) public _history; 
    mapping(address => uint256[]) public _amount;
    mapping(address => bool[]) public _is_sender; 
    int256 dummy_amt;



  
    constructor()  ERC20("Simple_Token", "ST") {
        _mint(msg.sender,10000 );
        
    }
    
  

    function decimals() public pure override returns (uint8) {
        return 0;
    }
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        
        _history[_msgSender()].push(recipient);
        _amount[_msgSender()].push(amount);
        _is_sender[_msgSender()].push(true);
        _history[recipient].push(_msgSender());
        _amount[recipient].push(amount);
        _is_sender[recipient].push(false);
        
        return true;
    }
    function getHistory() public view  returns ( address[] memory add_arr ,  uint256[] memory amount, bool[] memory is_sender  ) {
         return (_history[_msgSender()],_amount[_msgSender()],_is_sender[_msgSender()]);
         }
   
    
}
