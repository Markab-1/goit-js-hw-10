import * as _ from 'lodash';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';


const DEBOUNCE_DELAY = 500;

const refs = {
    searchText: document.querySelector('#search-box'),
    countriesList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.searchText.addEventListener('input', _.debounce(onSearch, DEBOUNCE_DELAY));

const notiflixOptions = {
    timeout: 5000,
    clickToClose: true,
    fontSize: '20px',
    width: '700px',
};

function onSearch(e) {
    e.preventDefault();

    cleanData(refs.countriesList);
    cleanData(refs.countryInfo);

    const searchQuery = e.target.value.trim();

    if(searchQuery){
        fetchCountries(searchQuery)
            .then(data => renderCountries(data))
            .catch(onError); 
    }
}

function renderCountries(data) {
    if (data.length > 10) {
        Notiflix.Notify.failure('Too many matches found. Please enter a more specific name.', notiflixOptions,);
        return;
    }
    if (data.length >= 2) {
        appendCountriesMarkup(data);
        return;
    }  
    if (data.length == 1) {
        appendCountryMarkup(data);
        return;
    }
}

function onError() {
    Notiflix.Notify.failure('Oops, there is no country with that name.', notiflixOptions,) 
}

function cleanData(data) {
    data.innerHTML = "";
}

function appendCountriesMarkup(data) {
    refs.countriesList.insertAdjacentHTML('beforeend', countriesMarkup(data));
}

function appendCountryMarkup(data) {
    refs.countryInfo.insertAdjacentHTML('beforeend', countryInfoMarkup(data));
}

function countriesMarkup(data) {
    return data.map((dataItem) => `
    <li class="country__item">
    <img 
    width="30px"
    src="${dataItem.flags.svg}" 
    alt="" />
    ${dataItem.name.official}
    </li>
        `).join("");
}

function countryInfoMarkup(data) {
    return data.map((dataItem) => `
    <img 
    width="40px"
    src="${dataItem.flags.svg}" 
    alt="" />
    <span class="country__name">${dataItem.name.official}</span>
    <ul class="country__features">
    <li><span class="country__features_item">Capital:</span> ${dataItem.capital}</li>
    <li><span class="country__features_item">Population:</span> ${dataItem.population}</li>
    <li><span class="country__features_item">Languages:</span> ${[...Object.values(dataItem.languages)].join(", ")}</li>
    </ul>
        `);
}