import icons from 'url:../img/icons.svg';
export default class View {
  _data;

  renderSpinner() {
    const markup = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
    `;
    this.clear();
    this._parent.insertAdjacentHTML('afterbegin', markup);
  }

  render(data, render = true) {
    if (render) {
      if (!data || (Array.isArray(data) && data.length === 0))
        return this.renderMessage(
          'No results found for your query. Try something else. '
        );
    }
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this.clear();
    this._parent.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parent.querySelectorAll('*'));
    newElements.forEach((el, i) => {
      const curEl = curElements[i];
      if (!el.isEqualNode(curEl) && el.firstChild?.nodeValue?.trim() !== '') {
        curEl.textContent = el.textContent;
      }
      if (!el.isEqualNode(curEl)) {
        Array.from(el.attributes).forEach(attr => {
          console.log(attr);
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderMessage(message = 'Search for a recipe and get the results here.') {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this.clear();
    this._parent.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = 'An error occurred!') {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this.clear();
    this._parent.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this._parent.innerHTML = '';
  }
}
