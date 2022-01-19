export default class EntranceForm {
  constructor(selectors) {
    this._input = document.querySelector(selectors.input);
    this._button = document.querySelector(selectors.button);
  }

  disableInput = () => {
    this._input.disabled = true;
    this._button.disabled = true;
  }

  enableInput = () => {
    this._input.disabled = false;
    this._button.disabled = false;
  }
}