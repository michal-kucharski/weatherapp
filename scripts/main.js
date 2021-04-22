import {getWeatherByCity} from './apiService.js';
import {mapListToDOMElements} from './DOMActions.js';

class WeatherApp {
    constructor() {
        this.viewElems = {}
        this.initializeApp();
    }

    initializeApp = () => {
        this.connectDOMElements();
        this.setupListeners();
    }

    connectDOMElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
        this.viewElems = mapListToDOMElements(listOfIds);
    }

    setupListeners = () => {
        this.viewElems.searchInput.addEventListener('keydown', this.handleSubmit);
        this.viewElems.searchButton.addEventListener('click', this.handleSubmit);
        this.viewElems.returnToSearchBtn.addEventListener('click', this.returnToSearch);
    }

    handleSubmit = () => {
        if (event.type === 'click' || event.key === 'Enter') {
            this.fadeInOut();
            let query = this.viewElems.searchInput.value;
            getWeatherByCity(query)
            .then(data => {
                this.displayWeatherData(data);
            }).catch(() => {
                this.fadeInOut();
                this.viewElems.errorText.classList.remove('hidden');            
                this.viewElems.searchInput.style.borderColor = 'red';
                this.clearInput();               
            });
        }
    }

    fadeInOut = () => {
        if(this.viewElems.mainContainer.style.opacity === '1' || this.viewElems.mainContainer.style.opacity === '') {
            this.viewElems.mainContainer.style.opacity = '0';
        } else {
            this.viewElems.mainContainer.style.opacity = '1';
        }
    }

    switchView = () => {
        if(this.viewElems.weatherSearchView.style.display !== 'none') {
            this.viewElems.weatherSearchView.style.display = 'none';
            this.viewElems.weatherForecastView.style.display = 'block';
        } else {
            this.viewElems.weatherForecastView.style.display = 'none';
            this.viewElems.weatherSearchView.style.display = 'flex';
        }
    }

    returnToSearch = () => {
        if(errorText.classList.length === 0) {
            this.viewElems.errorText.classList.add('hidden');
            this.viewElems.searchInput.style.borderColor = 'inherit';
        }
        this.clearInput();
        this.fadeInOut();
        setTimeout(()=> {
            this.switchView();
            this.fadeInOut();
        }, 500);
    }

    displayWeatherData = data => {
        this.switchView(); 
        this.fadeInOut();
    
        const weather = data.consolidated_weather[0];
    
        this.viewElems.weatherCity.innerText = data.title;
        this.viewElems.weatherIcon.src = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
        this.viewElems.weatherIcon.alt = weather.weather_state_name;
    
        const currentTemp = Math.round(weather.the_temp);
        const maxTemp = Math.round(weather.max_temp);
        const minTemp = Math.round(weather.min_temp);
    
        this.viewElems.weatherCurrentTemp.innerText = `Current temperature: ${currentTemp}°C`;
        this.viewElems.weatherMaxTemp.innerText = `Max temperature: ${maxTemp}°C`;
        this.viewElems.weatherMinTemp.innerText = `Min temperature: ${minTemp}°C`;
    }

    clearInput = () => {
        this.viewElems.searchInput.value = '';  
    }
}

document.addEventListener('DOMContentLoaded', new WeatherApp());