export default class TransactionParser {
  constructor(trx) {
    this._trx = trx;
  }

  getActionKind() {
    return this._trx.action_kind;
  }

  getHash() {
    return this._trx.hash;
  }

  getBlockHash() {
    return this._trx.block_hash;
  }

  getBlockTimestamp() {
    return this._trx.block_timestamp;
  }

  getSignerId() {
    return this._trx.signer_id;
  }

  getNearAmount() {
    return this._trx.args.deposit;
  }

  getNearReceiverId() {
    return this._trx.receiver_id;
  }

  getAddedPublicKey() {
    return this._trx.args.public_key;
  }

  getDeletedPublicKey() {
    return this._trx.args.public_key;
  }

  getAddedPublicKeyPermission() {
    return this._trx.args.access_key.permission.permission_kind;
  }

  getAddedPublicKeyReceiver() {
    return (this._trx.args.access_key.permission.permission_details && this._trx.args.access_key.permission.permission_details.receiver_id) ? 
      this._trx.args.access_key.permission.permission_details.receiver_id :
      undefined;
  }

  getCreatedAccount() {
    return this._trx.receiver_id;
  }

  getDeletedAccount() {
    return this._trx.receiver_id;
  }

  getDeletedAccountBeneficiary() {
    return this._trx.args.beneficiary_id;
  }

  getFunctionCallReceiver() {
    return this._trx.receiver_id;
  }

  getFunctionCallMethod() {
    return this._trx.args.method_name;
  }

  getFtTransferReceiver() {
    return this._trx.args.args_json.receiver_id;
  }

  getFtTransferAmount() {
    return this._trx.args.args_json.amount;
  }

  getFtTransferCallMessage() {
    return this._trx.args.args_json.msg;
  }

}