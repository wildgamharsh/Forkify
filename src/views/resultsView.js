import previewView from './previewView.js';
import View from './view.js';

class ResultsView extends View {
  _parent = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again.';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
