import { CONTRACT_INTERFACE } from './utils/constants.js';
import { formatNearAmount, formatTokenAmount } from './utils/format.js';
import iconFunctionCall from '../images/function-call.svg';
import iconNear from '../images/near.svg';
import iconAurora from '../images/aurora.png';
import iconBocaChica from '../images/boca-chica.png';
import TransactionParser from './parser/TransactionParser.js';
import parseContractInterface from './parser/parseContractInterface.js';

export default class FunctionCallUpdater {  
  constructor(data) {
    this._trxElement = data.trxElement;
    this._headingElement = data.headingElement;
    this._iconElement = data.iconElement;
    this._currentAccount = data.currentAccount;
    this._contractApi = data.contractApi;
    this._validatorsList = data.validatorsList;
    this._trxParser = new TransactionParser(data.trx);

    this._filter = data.filter;

    this._heading = '';
    this._iconSrc = '';
    this._iconAlt = '';
    this._filterData = '';
  }

  _prepareIcon(src, alt) {
    this._iconSrc = src;
    this._iconAlt = alt;
  }

  _prepareIfAurora() {
    if(this._trxParser.getFunctionCallReceiver() === 'wrap.near'
    && this._trxParser.getFunctionCallMethod() === 'ft_transfer_call'
    && this._trxParser.getFtTransferReceiver() === "aurora") {
      const nearAmount = formatNearAmount(this._trxParser.getFtTransferAmount());
      this._heading = `Wrap ${nearAmount} NEAR and send it to Aurora address 0x${this._trxParser.getFtTransferCallMessage()}`;
      this._prepareIcon(iconAurora, 'Aurora');
      return true;
    }
    return false;
  }

  _isValidator(account) {
    return this._validatorsList.includes(account);
  }

  _prepareIfValidator() {
    if(this._isValidator(this._trxParser.getFunctionCallReceiver())) {
      this._prepareIcon(iconNear, 'NEAR');
      if(this._trxParser.getFunctionCallMethod() === 'deposit_and_stake') {
        const nearAmount = formatNearAmount(this._trxParser.getValidatorDepositAndStakeAmount());
        this._heading = `Deposit and stake ${nearAmount} NEAR to the validator ${this._trxParser.getFunctionCallReceiver()}`;
        this._filterData = this._filter.stakingStake();
        return true;
      }
      else if(this._trxParser.getFunctionCallMethod() === 'unstake') {
        const nearAmount = formatNearAmount(this._trxParser.getValidatorUnstakeAmount());
        this._heading = `Unstake ${nearAmount} NEAR from the validator ${this._trxParser.getFunctionCallReceiver()}`; 
        this._filterData = this._filter.stakingUnstake();       
        return true;
      }
      else if(this._trxParser.getFunctionCallMethod() === 'withdraw_all') {
        this._heading = `Widthdraw all available NEAR from the validator ${this._trxParser.getFunctionCallReceiver()}`;
        this._filterData = this._filter.stakingWithdraw();     
        return true;
      }
      else if(this._trxParser.getFunctionCallMethod() === 'unstake_all') {
        this._heading = `Unstake all available NEAR from the validator ${this._trxParser.getFunctionCallReceiver()}`;
        this._filterData = this._filter.stakingUnstake();     
        return true;
      }
    }
    return false;
  }

  _prepareIfKnownContract() {
    if(this._trxParser.getFunctionCallReceiver() === 'near') {
      this._prepareIcon(iconNear, 'Near');
      const createdAccount = this._trxParser.getNearCreatedAccount();
      if(this._trxParser.getFunctionCallMethod() === 'create_account') {
        this._heading = `Create account ${createdAccount.name} and deposit ${formatNearAmount(createdAccount.deposit)} NEAR into it`;     
        return true;
      }
    }
    else if(this._trxParser.getFunctionCallReceiver() === 'launchpad.bocachica_mars.near') {
      this._prepareIcon(iconBocaChica,'Boca Chica Launchpad');
      if(this._trxParser.getFunctionCallMethod() === 'claim_refund') {
        this._heading = `Claim refund from Boca Chica launchpad sale #${this._trxParser.getBocaChicaSaleId()}`; // todo: sale name and description        
        return true;
      }
      else if(this._trxParser.getFunctionCallMethod() === 'join') {
        this._heading = `Deposit ${formatNearAmount(this._trxParser.getBocaChicaJoinDeposit())} NEAR for joining Boca Chica launchpad`;
        return true;
      }

    }
    return false;
  }

  _prepareFtHeading(metadata) {
    if(metadata.icon && metadata.icon.length > 0) {
      this._prepareIcon(metadata.icon, metadata.name);
    }
    else if(this._trxParser.getFunctionCallReceiver() === 'wrap.near') { // have empty icon in metadata
      this._prepareIcon(iconNear, 'Wrapped NEAR');
    }

    const tokenName = metadata.symbol === metadata.name ? metadata.symbol : `${metadata.symbol} (${metadata.name})`;
    if(this._trxParser.getFunctionCallMethod() === "ft_transfer_call" || this._trxParser.getFunctionCallMethod() === "ft_transfer") {      
      const tokenAmount = formatTokenAmount(this._trxParser.getFtTransferAmount(), metadata.decimals);
      if(this._trxParser.getSignerId() === this._currentAccount) {
        this._heading = `Send ${tokenAmount} ${tokenName} to ${this._trxParser.getFtTransferReceiver()}`;
        return;
      }
      this._heading = `Receive ${tokenAmount} ${tokenName} from ${this._trxParser.getFtTransferReceiver()}`;
      return;
    }
    else if(this._trxParser.getFunctionCallMethod() === "storage_deposit") {
      const tokenAmount = formatNearAmount(this._trxParser.getStorageDepositAmount());
      this._heading = `Deposit ${tokenAmount} NEAR into storage of ${tokenName} contract`;
      if(this._trxParser.getStorageDepositReceiver() != this._currentAccount) {
        this._heading += ` for account ${this._trxParser.getStorageDepositReceiver()}`;
      }
      return;
    }

    else if(this._trxParser.getFunctionCallMethod() === "storage_widthdraw") {// widthraw near from contract storage

    }

    // exclusive FT

    else if(this._trxParser.getFunctionCallReceiver() === 'wrap.near') {
      if(this._trxParser.getFunctionCallMethod() === "near_deposit") {
        const tokenAmount = formatNearAmount(this._trxParser.getWrapNearDepositAmount());
        this._heading = `Wrap ${tokenAmount} NEAR using wrap.near contract`;        
        return;
      }
      else if(this._trxParser.getFunctionCallMethod() === "near_withdraw") {
        const tokenAmount = formatNearAmount(this._trxParser.getWrapNearWidthdrawAmount());
        this._heading = `Unwrap ${tokenAmount} NEAR using wrap.near contract`;        
        return;
      }
    }


    this._heading = `Call function ${this._trxParser.getFunctionCallMethod()} from Fungible token contract ${this._trxParser.getFunctionCallReceiver()}`;
  }

  _prepareNftHeading(metadata) {
    if(metadata.icon && metadata.icon.length > 0) {
      this._prepareIcon(metadata.icon, metadata.name);
    }

    const tokenName = metadata.symbol === metadata.name ? metadata.symbol : `${metadata.symbol} (${metadata.name})`;
    if(this._trxParser.getFunctionCallReceiver() === 'near-punks.near') {
      if(this._trxParser.getFunctionCallMethod() === "master_mint") {
        const mintData = this._trxParser.getNearPunksMasterMint();
        const amount = mintData.nftAmount === 1 ? `1 NFT` : `${mintData.nftAmount} NFTs`;
        this._heading = `Mint ${amount} for ${formatNearAmount(mintData.deposit)} NEAR from contract ${tokenName}`;
      }
      return;
    }

    this._heading = `Interraction with NFT contract ${tokenName}`;
  }

  async _prepareHeading() {
    if(this._prepareIfAurora()) {
      return;
    }

    if(this._prepareIfValidator()) {
      return;
    }

    if(this._prepareIfKnownContract()) {
      return;
    }

    const contractData = await this._contractApi.getContractData(this._trxParser.getFunctionCallReceiver());
    const contractInterface = parseContractInterface(contractData);
    
    if(contractInterface === CONTRACT_INTERFACE.FUNGIBLE_TOKEN) {
      const metadata = await this._contractApi.ft_metadata(this._trxParser.getFunctionCallReceiver());
      this._prepareFtHeading(metadata);
    }
    else if(contractInterface === CONTRACT_INTERFACE.NON_FUNGIBLE_TOKEN) {
      const metadata = await this._contractApi.nft_metadata(this._trxParser.getFunctionCallReceiver());
      this._prepareNftHeading(metadata);
    }   
  }

  async update() {

    await this._prepareHeading();

    if(this._heading.length < 1) {
      this._heading = `Call function ${this._trxParser.getFunctionCallMethod()} from contract ${this._trxParser.getFunctionCallReceiver()}`;
    }

    if(this._iconSrc.length < 1) {
      this._prepareIcon(iconFunctionCall, 'Function Call');
    }

    if(this._filterData.length > 0) {
      this._trxElement.setAttribute('data-filter', this._filterData);
    }

    this._headingElement.innerHTML = this._heading;
    this._iconElement.innerHTML = `<img src="${this._iconSrc}" alt="${this.__iconAlt}" class="transaction__icon-picture">`;
  }
}