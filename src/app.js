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
        console.log(document.querySelectorAll('[data-show-name]'))
        
        this.viewElems = mapListToDOMElements(listOfIds, 'id');
        this.showNameButtons = mapListToDOMElements(listOfShowNames, 'data-show-name');
    }

    setupListeners = () => {
        Object.keys(this.showNameButtons).forEach(showName => {
            this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter);
        });

        this.viewElems.showSearchForm.addEventListener('submit', event => {
            event.preventDefault();
            this.selectedName = event.target[0].value;
            this.viewElems.showSearchInput.blur();
            this.fetchAndDisplayShows();
        });
    }

    setCurrentNameFilter = event => {
        this.selectedName = event.target.dataset.showName;
        this.fetchAndDisplayShows();
    }

    fetchAndDisplayShows() {
        getShowsByKey(this.selectedName).then(shows => this.renderCards(shows));
    }

    renderCards = shows => {
        this.viewElems.showsWrapper.innerHTML = '';

        this.viewElems.searchedKeywordLabel.innerText = `${this.selectedName} (${shows.length})`;

        for (const {show} of shows) {
            this.viewElems.showsWrapper.appendChild(this.createShowCard(show));
        }
    }

    createShowCard = show => {
        const divCard = createDOMElem('div', 'Show-Card');
        const h2 = createDOMElem('h2', '', show.name);
        let img;

        if (show.image) {
            img = createDOMElem('img', '', '', show.image.medium);
        } else {
            img = createDOMElem('img', '', '', 'https://via.placeholder.com/210x295');
        }

         divCard.appendChild(img);
         divCard.appendChild(h2);

        divCard.dataset.showId = show.id;
        divCard.addEventListener('click', this.renderModal);
    

        return divCard;
    }

    renderModal = e => {
        const showId = e.currentTarget.dataset.showId;
        getShowById(showId).then(show => {
            this.viewElems.showPreviewModal.style.display = 'block';
            this.viewElems.mainContent.classList.add('Blurred-Main');
            this.viewElems.showPreviewModal.appendChild(this.createShowModal(show));

        })
    }

    closeModal = e => {
        this.viewElems.showPreviewModal.style.display = 'none';
        this.viewElems.mainContent.classList.remove('Blurred-Main');
        this.viewElems.showPreviewModal.innerHTML = '';
    }

   createShowModal = show => {

        let _displayRating = rating => {
            let stars = '';
            for (let i = 0; i < Math.round(rating); i++) {
                stars += '⭐';
            }
            return stars;
        }

        const showModalContainer = createDOMElem('div', 'Show-Preview-Container');
        const img = createDOMElem('img', '', '', show.image.medium);
        const showPreviewDetails = createDOMElem('div', 'Show-Preview-Details');
        const h2 = createDOMElem('h2', '', show.name);
        const p = createDOMElem('p', '', show.summary);
        const ratings = createDOMElem('div', '', _displayRating(show.rating.average));
        const closeBtn = createDOMElem('button', 'Show-Preview-Close-Btn', '', '');
        const closeIcon = createDOMElem('img', 'Show-Pewview-Close-Icon', '', 'src/close.png');

       

        showPreviewDetails.appendChild(h2);
        showPreviewDetails.appendChild(p);
        showPreviewDetails.appendChild(ratings);

        showModalContainer.appendChild(img);
        showModalContainer.appendChild(showPreviewDetails);

        closeBtn.appendChild(closeIcon);
        showModalContainer.appendChild(closeBtn);

        closeBtn.addEventListener('click', this.closeModal);

        return showModalContainer;
    }

}

document.addEventListener('DOMContentLoaded', new TvApp());