import previewView from './previewView';
import View from './view';

class BookmarksView extends View {
  _parent = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks found! ';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
