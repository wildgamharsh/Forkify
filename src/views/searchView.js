import View from './view';

class SearchView extends View {
  _parent = document.querySelector('.search');

  getQuery() {
    const query = this._parent.querySelector('.search__field').value;
    this._parent.querySelector('.search__field').value = '';
    return query;
  }

  addHandler(handler) {
    this._parent.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
