// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Simple_Token is ERC20 {
    mapping(address => address[]) public send_history; 
     mapping(address => address[]) public recieve_history; 
    mapping(address => uint256[]) public s_amount; 
    mapping(address => uint256[]) public r_amount; 




  
    constructor()  ERC20("Simple_Token", "ST") {
        _mint(msg.sender,10000 );
        
    }
    
  

    function decimals() public pure override returns (uint8) {
        return 0;
    }
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        
        send_history[_msgSender()].push(recipient);
        s_amount[_msgSender()].push(amount);
         recieve_history[recipient].push(_msgSender());
                 r_amount[recipient].push(amount);

        
        return true;
    }
    function getSenderHistory() public view  returns ( address[] memory add_arr ,  uint256[] memory amount  ) {
         return (send_history[_msgSender()],s_amount[_msgSender()]);
         
         }
         function getRecieverHistory() public view  returns ( address[] memory add_arr ,  uint256[] memory amount  ) {
         return (recieve_history[_msgSender()],r_amount[_msgSender()]);
         
         }
   
    
}
