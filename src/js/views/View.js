import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  // Public api

  /**
   * Renders the provided object(s) to the DOM or returns a markup string.
   * 
   * @param {Object|Object[]} data - The data to be rendered (e.g., recipe). Can be a single object or an array of objects.
   * @param {boolean} [render=true] - If true, the data will be rendered to the DOM. If false, a markup string will be created instead of rendering to the DOM. Defaults to true.
   * @returns {string|void} - Returns a markup string if `render` is false; otherwise, renders directly to the DOM and returns nothing.
  * @this {Object} View instance 
  * @author Borche Kojikj
  */
  render(data, render = true) {
    // Check if data is empty or not provided
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();  // Handle the error case
    }

    this._data = data;

    // Generate the markup based on the data
    const markup = this._generateMarkup();

    // Return the markup string if render is false
    if (!render) return markup;

    // Clear the existing content of the container
    this._clear();

    // Insert the generated markup into the DOM
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {

    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed Text
      if (!newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
        // console.log(newEl.firstChild?.nodeValue.trim(), '🥳🥳');
      }

      // Update changed Attribute
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        )
      }



    })
  }
  renderSpinner() {
    const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div> 
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
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
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

  }

  renderMessage(message = this._message) {
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
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

  }



}