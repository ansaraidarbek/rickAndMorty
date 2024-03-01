require("./style.css")
import render from "./render"
import {toggleFavourite} from "./favourites"
import {info} from "./modal"

let obj = JSON.parse(localStorage.getItem('localCache'));
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');
const favButton = document.querySelector('.favourite');
const showPage = document.querySelector('.page');
const modalWindow = document.querySelector('.modalWindow');
const leftWindow = document.querySelector('.leftWindow');
const rightWindow = document.querySelector('.rightWindow');
const closeWindow = document.querySelector('.closeWindow');
nextButton.setAttribute('disabled', true);
prevButton.setAttribute('disabled', true);
let page = obj ? obj.page : 1;
let limit = obj ? obj.storage?.info?.pages : null;
let possiblePrev = obj?.storage?.info?.prev ? true : false;
let possibleNext = obj?.storage?.info?.next ? true : false;
let active = JSON.parse(localStorage.getItem('active')) || false;
let activeLoaders = [];
showPage.innerHTML = page;

if (active) { 
    favButton.classList.toggle('active'); 
    showPage.innerHTML = 'favourites';
}
const ul = document.querySelector('.main');

const configureInformation = ([pPrev, pNext, pageMax]) => {
    limit = limit ? limit : pageMax;
    [possiblePrev, possibleNext] = (pPrev !== null && pNext !== null) ? [pPrev, pNext] : [possiblePrev, possibleNext];
    if (possibleNext) nextButton.removeAttribute('disabled');
    if (!possibleNext) nextButton.setAttribute('disabled', true);
    if (possiblePrev) prevButton.removeAttribute('disabled');
    if (!possiblePrev) prevButton.setAttribute('disabled', true);
}

const notify = async (id) => {
    toggleFavourite(id);
    await render(ul, activeLoaders, page, active);
}

const addUlListiner = () => {
    ul.addEventListener('click', async (e)=>{
        e.preventDefault();
        const returnLi = (target) => {
            while (target.tagName !== "LI") {
                target = target.parentNode;
            }
            return target
        }
        if (e.target.classList.contains('fav')) {
            const target = returnLi(e.target);
            toggleFavourite(target.id);
            await render(ul, activeLoaders, page, active);

        }
        if (e.target.classList.contains('info')) {
            const target = returnLi(e.target);
            modalWindow.style.display = 'flex';
            info(active, target.id, leftWindow, rightWindow, notify);
        }
    });
}

const firstRender = async () => {
    const results = await render(ul, activeLoaders, page, active);
    addUlListiner();
    configureInformation(results);
}

const renderAgain = async (option) => {
    let results = [null, null, null];
    results = (option === 0) ? await render(ul, activeLoaders, page, active) : results;
    results = (option > 0 && possibleNext && (!limit || page < limit)) ? await render(ul, activeLoaders, ++page, active) : results;
    results = (option < 0 && possiblePrev) ? await render(ul, activeLoaders, --page, active) : results;
    if (results) {
        configureInformation(results);
    }
}

nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (possibleNext) {
        showPage.innerHTML = page + 1;
        renderAgain(1);
    }
});

prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (possiblePrev) {
        showPage.innerHTML = page - 1;
        renderAgain(-1);
    }
});

closeWindow.addEventListener('click', (e) => {
    e.preventDefault();
    modalWindow.style.display = 'none';
});

modalWindow.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('modalWindow')) {
        modalWindow.style.display = 'none';
    }
});

favButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.classList.toggle('active');
    active = e.target.classList.contains('active');
    showPage.innerHTML = active ? 'favourites' : page;
    localStorage.setItem("active", JSON.stringify(active));
    renderAgain(0);
});


firstRender();