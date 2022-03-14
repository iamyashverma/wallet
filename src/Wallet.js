import {React, useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './Wallet.module.css'
import simple_token_abi from './Contracts/simple_token_abi.json'
import Interactions from './Interactions';

const Wallet = () => {

	// deploy simple token contract and paste deployed contract address here.
	let contractAddress = '0xBC44EdD753D51A868E80Bfc7A4A8393DC21813B8';
	const [S_add, setS_add] = useState([]);
    const [S_amt, setS_amt] = useState([]);
    const [R_add, setR_add] = useState([]);
    const [R_amt, setR_amt] = useState([]);

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const [tokenName, setTokenName] = useState("Token");
	const [balance, setBalance] = useState(null);
	const [transferHash, setTransferHash] = useState(null);



	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
		updateHistory();
	}

	const updateBalance = async () => {
		let balanceBigN = await contract.balanceOf(defaultAccount);
		let balanceNumber = balanceBigN.toNumber();

		let tokenDecimals = await contract.decimals();

		let tokenBalance = balanceNumber / Math.pow(10, tokenDecimals);

		setBalance(toFixed(tokenBalance));	


	}
	const updateHistory = async ()  => {
        let SenderHistory = await contract.getSenderHistory();
        let RecieverHistory = await contract.getRecieverHistory();
        let S_addr = SenderHistory.add_arr;
        setS_add(S_addr);
        let S_amount = SenderHistory.amount;
        let S_amt1 = [];
        for(var i=0; i<S_amount.length; i++){
            S_amt1.push(S_amount[i].toNumber())
        }
        setS_amt(S_amt1);
        let R_addr = RecieverHistory.add_arr;
        setR_add(R_addr);
        let R_amount = RecieverHistory.amount;
        let R_amt1 = [];
        for(var i=0; i<R_amount.length; i++){
            R_amt1.push(R_amount[i].toNumber())
        }
        setR_amt(R_amt1);

		
	}
   function toFixed(x) {
   if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
         x *= Math.pow(10, e - 1);
         x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
   } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
         e -= 20;
         x /= Math.pow(10, e);
         x += (new Array(e + 1)).join('0');
      }
   }
   return x;
}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

	let tempContract = new ethers.Contract(contractAddress, simple_token_abi, tempSigner);
		setContract(tempContract);	
	}
	

	useEffect(() => {
		if (contract != null) {
			updateBalance();
			updateTokenName();
		}
	}, [contract]);

	const updateTokenName = async () => {
		setTokenName(await contract.name());
	}
	useEffect(() => {
		updateHistory();
	});
	const showSenderList = () => {
		var listitems = [];
    for(var i=0;i<S_add.length;i++){
        listitems.push(<li key={i}>  {S_add[i]}    -{S_amt[i]}</li>)
    }
    return <ul className='list'>{listitems}</ul>;
	
	}
	const ShowRecieverList =() => {
		var listitems = [];
		for (var i =0; i<R_add.length;i++)
		 {
			 listitems.push(<li key={i}> {R_add[i]}    +{R_amt[i]} </li>)
		 }
		 return <ul className='list'>{listitems}</ul>;
	}
	
	
	return (
	<div>
			<h2> {tokenName + " ERC-20 Wallet"} </h2>
			<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

			<div className={styles.walletCard}>
			<div>
				<h3>Address: {defaultAccount}</h3>
			</div>

			<div>
				<h3>{tokenName} Balance: {balance}</h3>
			</div>

			{errorMessage}
		</div>
		<Interactions contract = {contract}/>
		<div>
      
    </div>
	<div className='new'>
			<div className='hist'><h2>History</h2></div>
			<div className='head'><p>Reciever_Address   Amount</p></div>
			  
			{showSenderList()}
			   {ShowRecieverList()} 
			
			
			
		</div>
		
	</div>
	)
}

export default Wallet;