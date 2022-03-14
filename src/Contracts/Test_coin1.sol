// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Simple_Token is ERC20 {
    mapping(address => address[]) public _history; 
    mapping(address => int256[]) public _amount; 




  
    constructor()  ERC20("Simple_Token", "ST") {
        _mint(msg.sender,10000 );
        
    }
    
  

    function decimals() public pure override returns (uint8) {
        return 0;
    }
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        
        _history[_msgSender()].push(recipient);
        
        _amount[_msgSender()].push(-amount);
        _history[recipient].push(_msgSender());
        _amount[recipient].push(amount);

        
        return true;
    }
    function getHistory() public view  returns ( address[] memory add_arr ,  uint256[] memory amount  ) {
         return (_history[_msgSender()],_amount[_msgSender()]);
         
         }
   
    
}
