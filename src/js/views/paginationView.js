import View from './View.js';


import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');


    _generateMarkup() {

        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const curPage = this._data.page;

        // Page 1, and are other pages
        if (curPage === 1 && numPages > 1) {
            return `
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                   <span>Page ${curPage + 1}</span>
                      <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                      </svg>
                 </button>
            `;
        }



        // Last page
        if (curPage === numPages && numPages > 1) {
            return `
         <button data-goto="${curPage - 1}"  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
            `;
        }


        // Other Page
        if (this._data.page < numPages) {
            return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
               <svg class="search__icon">
                 <use href="${icons}#icon-arrow-left"></use>
               </svg>
               <span>Page ${curPage - 1}</span>
            </button>

           <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">                   <span>Page ${curPage + 1}</span>
                  <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                  </svg>
            </button>
               `;
        }


        // Page 1, and there are NO other Pages

        return '';
    }

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');


            if (!btn) return;
            const goToPage = Number(btn.dataset.goto);
            handler(goToPage);
        })
    }

    _clear() {

        this._parentElement.innerHTML = '';
    }
};

export default new PaginationView();