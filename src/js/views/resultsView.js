import View from './View.js';

import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';


class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'We could not find any recipes with that search. Please try again!';
    _message = '';


    // _generateMarkup() {
    //     return this._data.map(rec => this._generateMarkupPreview(rec)).join('');
    // }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
    _clear() {
        this._parentElement.innerHTML = '';
    }

    // _generateMarkupPreview(data) {


    //     const id = window.location.hash.slice(1);


    //     return `
    //     <li class="preview">
    //     <a class="preview__link" href="#${data.id}">
    //       <figure class="preview__fig">
    //         <img src="${data.image}" alt="${data.title}" />
    //       </figure>
    //       <div class="preview__data">
    //         <h4 class="preview__title">${data.title}</h4>
    //         <p class="preview__publisher">${data.publisher}</p>

    //       </div>
    //     </a>
    //   </li>
    //  `;
    // }
}


export default new ResultsView();