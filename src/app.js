import { mapListToDOMElements, createDOMElem } from './domInteractions.js';
import { getShowById, getShowsByKey } from './requests.js';

class TvApp {
    constructor() {
        this.viewElems = {};
        this.showNameButtons = {};
        this.selectedName = 'harry';
        this.initilizeApp();
    }

    initilizeApp = () => {
        this.connectDOMElements();
        this.setupListeners();
        this.fetchAndDisplayShows();
    }

    connectDOMElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
        const listOfShowNames = Array.from(
            document.querySelectorAll('[data-show-name]')
        ).map(elem => elem.dataset.showName);
        
        this.viewElems = mapListToDOMElements(listOfIds, 'id');
        this.showNameButtons = mapListToDOMElements(listOfShowNames, 'data-show-name');
    }

    setupListeners = () => {
        Object.keys(this.showNameButtons).forEach(showName => {
            this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter);
        });
    }

    setCurrentNameFilter = event => {
        this.selectedName = event.target.dataset.showName;
        this.fetchAndDisplayShows();
    }

    fetchAndDisplayShows() {
        console.log(getShowsByKey(this.selectedName).then(shows => this.renderCards(shows)));
    }

    renderCards = shows => {
        for (const {show} of shows) {
            this.createShowCard(show);
        }
    }

    createShowCard = show => {
       const divCard = createDOMElem('div', 'Show-Card');
       const img = createDOMElem('img', '', '' ,show.image.medium);
       const h2 = createDOMElem('h2', '', show.name);

       divCard.appendChild(img);
       divCard.appendChild(h2);

       this.viewElems.showsWrapper.appendChild(divCard);
    }
}

document.addEventListener('DOMContentLoaded', new TvApp());