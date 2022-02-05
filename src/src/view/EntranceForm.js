export default class EntranceForm {
  constructor(selectors) {
    this._form = document.querySelector(selectors.form);
    this._account = this._form.querySelector(selectors.account);
    this._button = this._form.querySelector(selectors.button);
  }

  addSubmitListener(listener) {
    this._form.addEventListener('submit', listener);
  }

  getAccountName() {
    return this._account.value;
  }

  disableInput = () => {
    this._account.disabled = true;
    this._button.disabled = true;
  };

  enableInput = () => {
    this._account.disabled = false;
    this._button.disabled = false;
  };
}