export default class ProgressBar {
  constructor(cfg) {
    this._progressBar = document.querySelector(cfg.progressBar);
    this._loader = this._progressBar.querySelector(cfg.loader);
    this._text = this._progressBar.querySelector(cfg.text);
    this._current = this._progressBar.querySelector(cfg.current);
    this._total = this._progressBar.querySelector(cfg.total);

    this._progressBarVisible = cfg.progressBarVisible;
    this._loaderHidden = cfg.loaderHidden;
  }

  reset(total) {
    this._text.textContent = 'Processing transactions:';
    this._current.textContent = '0';
    this._total.textContent = total;

    this._progressBar.classList.add(this._progressBarVisible);
    this._loader.classList.remove(this._loaderHidden);
  }

  increment() {
    this._current.textContent = parseInt(this._current.textContent) + 1;
  }

  finish() {
    this._text.textContent = 'Processing done:';
    this._loader.classList.add(this._loaderHidden);
  }

}