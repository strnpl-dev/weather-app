import '../scss/style.scss';
import i18next from 'https://deno.land/x/i18next/index.js';
import { updateMap } from './map';


'use strict'

window.addEventListener('DOMContentLoaded', () => {

    const locationBtn = document.querySelector('.weather__btns-wrapper'),
        languageChange = document.querySelector('#languageChange'),
        fahrsToggle = document.querySelector('.weather__btns-degree_far'),
        celsToggle = document.querySelector('.weather__btns-degree_cel'),
        controlBtns = document.querySelectorAll('.degree_btns'),
        cityName = document.querySelector('.weather__city'),
        date = document.querySelector('.weather__time-date'),
        time = document.querySelector('.weather__hour'),
        weatherNum = document.querySelector('.weather__conditions-num'),
        weatherDescription = document.querySelector('.weather__condition-text'),
        daytimeCond = Array.from(document.querySelectorAll('[data-daytime]')),
        windSpeed = document.querySelector('.windSpeed'),
        humidityNum = document.querySelector('.humidityNum'),
        feelsLike = document.querySelector('.feelsLike'),
        locationForm = document.querySelector('#weather_form'),
        formInput = document.querySelector('#weather_form input'),
        latitude = document.querySelector('.latitude'),
        longitude = document.querySelector('.longitude'),
        apiLink = 'http://api.weatherapi.com/v1/forecast.json?key=81cd96a4cf8f4303b5e111110242903&q=',
        weatherIcon = document.querySelector('.weather__conditions-icon'),
        forecastIcons = Array.from(document.querySelectorAll('.weather__item-icon img')),
        morningLang = document.querySelector('.morningLang'),
        afterLang = document.querySelector('.afterLang'),
        nightLang = document.querySelector('.nightLang'),
        feelsLang = document.querySelector('.feelsLang'),
        windLang = document.querySelector('.windLang'),
        humidityLang = document.querySelector('.humidityLang')

    // i18next.init({
    //     lng: 'en',
    //     debug: true,
    //     resources: {
    //         en: {
    //             translation: {
    //                 "feelsLike": "Feels like:",
    //                 'wind': 'Wind:',
    //                 'humidity': 'Longitude:',
    //                 'morning': 'morning',
    //                 'afternoon': 'morning',
    //                 'night': 'morning',
    //                 'placeholder': 'Enter city name',
    //                 'btn': 'Search',
    //                 'lat': 'Latitude',
    //                 'lon': 'Longitude'
    //             }
    //         },
    //         ru: {
    //             translation: {
    //                 "feelsLike": "Ощущается:",
    //                 'wind': 'Ветер:',
    //                 'humidity': 'Влажность:',
    //                 'morning': 'утро',
    //                 'afternoon': 'день',
    //                 'night': 'ночь',
    //                 'placeholder': 'Введите название города',
    //                 'btn': 'Искать',
    //                 'lat': 'Ширина',
    //                 'lon': 'Долгота'
    //             }
    //         }
    //     },
    //     parseElements: ['span'],
    // }, function (err, t) {
    //     updateContent();
    // });

    // function updateContent() {
    //     morningLang.textContent = i18next.t('morning');
    //     afterLang.textContent = i18next.t('afternoon');
    //     nightLang.textContent = i18next.t('night');
    //     feelsLang.textContent = i18next.t('feelsLike')
    // }

    // function changeLng(lng) {
    //     i18next.changeLanguage(lng);
    // }

    // i18next.on('languageChanged', () => {
    //     updateContent();
    // });

    // languageChange.addEventListener('change', (evt) => {
    //     if (evt.target.value === 'rus') {
    //         changeLng('ru');
    //     } else {
    //         changeLng('en');
    //     }
    // });


    const yourLocationWeather = () => {

        function success(position) {

            navigator.geolocation.getCurrentPosition((position) => {
                fetchData(`${position.coords.latitude}, ${position.coords.longitude}`);
            });

            localStorage.setItem('lastLocation', `${position.coords.latitude}, ${position.coords.longitude}`)

        }

        function error() {
            alert("Unable to retrieve your location");
        }

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }

    locationBtn.addEventListener('click', yourLocationWeather)

    function getMonthName(month) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return monthNames[month];
    }

    function formatDate(inputDate) {
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const dateParts = inputDate.split('-');
        const year = dateParts[0];
        const month = parseInt(dateParts[1]) - 1;
        const day = dateParts[2];

        const dateObj = new Date(year, month, day);
        const dayName = days[dateObj.getDay()];
        const monthName = getMonthName(dateObj.getMonth());

        return `${dayName} ${day} ${monthName}`;
    }

    function trimDegrees(num) {
        if (`${num}`.length > 2) {
            return `${num}`.slice(0, -2) + '°'
        } else {
            return `${num}` + '°'
        }
    }

    fahrsToggle.addEventListener('click', () => {
        feelsLike.textContent = trimDegrees(store.feelslike_f)
        weatherNum.textContent = trimDegrees(store.temp_f)

        daytimeCond[0].textContent = trimDegrees(store.forecastday[0].hour[0].temp_f)
        daytimeCond[1].textContent = trimDegrees(store.forecastday[0].hour[12].temp_f)
        daytimeCond[2].textContent = trimDegrees(store.forecastday[0].hour[21].temp_f)

        localStorage.setItem('preferredDeg', 'fahr')
    })

    celsToggle.addEventListener('click', () => {
        feelsLike.textContent = trimDegrees(store.feelslike_c)
        weatherNum.textContent = trimDegrees(store.temp_c)

        daytimeCond[0].textContent = trimDegrees(store.forecastday[0].hour[0].temp_c)
        daytimeCond[1].textContent = trimDegrees(store.forecastday[0].hour[12].temp_c)
        daytimeCond[2].textContent = trimDegrees(store.forecastday[0].hour[21].temp_c)

        localStorage.setItem('preferredDeg', 'cels')
    })

    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            controlBtns.forEach(el => {
                if (el !== btn) {

                    el.classList.remove('active_btn')
                }
            })

            btn.classList.add('active_btn')
        })
    })

    if (localStorage.getItem('preferredDeg') === 'fahr') {
        fahrsToggle.checked = true;
        fahrsToggle.classList.add('active_btn')
        celsToggle.classList.remove('active_btn')

    } else if (localStorage.getItem('preferredDeg') === 'cels') {
        celsToggle.checked = true;
        fahrsToggle.classList.remove('active_btn')
        celsToggle.classList.add('active_btn')
    } else {
        celsToggle.classList.add('active_btn')
        console.log('1')
    }

    let store = {
        city: 'Moscow',
        country: 'Russia',
        feelslike_c: 0,
        feelslike_f: 0,
        temp_f: 0,
        temp_c: 0,
        wind_kph: 0,
        humidity: 0,
        lat: 0,
        lon: 0,
        localtime: 0,
        weatherIcon: 0,
        text: ''
    }

    const fetchData = async (cityInp) => {
        const res = await fetch(apiLink + cityInp)
        const newData = await res.json()

        let { current: { feelslike_c, feelslike_f, temp_f, temp_c, wind_kph, humidity, condition: text },
            location: {
                name: city, country, lat, lon, localtime
            },
            forecast: { forecastday }
        } = newData

        store = {
            ...store,
            city,
            country,
            feelslike_c,
            feelslike_f,
            temp_f,
            temp_c,
            wind_kph,
            humidity,
            lat,
            lon,
            localtime,
            condition: text,
            forecastday
        }

        switch (store.condition.text) {
            case ("Partly cloudy"):
                weatherIcon.src = '/public/icons/partly.png'
                break;

            case ("Sunny"):
                weatherIcon.src = '/public/icons/sunny.png'
                break;

            case ("Cloudy"):
                weatherIcon.src = '/public/icons/cloud.png'
                break;

            case ("Clear"):
                weatherIcon.src = '/public/icons/clear.png'
                break;

            case ("Mist"):
                weatherIcon.src = '/public/icons/fog.png'
                break;
        }

        forecastIcons[0].src = store.forecastday[0].hour[0].condition.icon
        forecastIcons[1].src = store.forecastday[0].hour[12].condition.icon
        forecastIcons[2].src = store.forecastday[0].hour[21].condition.icon

        weatherDescription.textContent = store.condition.text
        date.textContent = formatDate(store.localtime.split(' ')[0])
        cityName.textContent = store.city
        latitude.textContent = store.lat
        longitude.textContent = store.lon
        time.textContent = store.localtime.split(' ')[1]
        windSpeed.textContent = store.wind_kph + ' kph'
        humidityNum.textContent = store.humidity + '%'

        if (fahrsToggle.checked) {
            feelsLike.textContent = trimDegrees(store.feelslike_f)
            weatherNum.textContent = trimDegrees(store.temp_f)

            daytimeCond[0].textContent = trimDegrees(store.forecastday[0].hour[0].temp_f)
            daytimeCond[1].textContent = trimDegrees(store.forecastday[0].hour[12].temp_f)
            daytimeCond[2].textContent = trimDegrees(store.forecastday[0].hour[21].temp_f)
        } else {
            feelsLike.textContent = trimDegrees(store.feelslike_c)
            weatherNum.textContent = trimDegrees(store.temp_c)

            daytimeCond[0].textContent = trimDegrees(store.forecastday[0].hour[0].temp_c)
            daytimeCond[1].textContent = trimDegrees(store.forecastday[0].hour[12].temp_c)
            daytimeCond[2].textContent = trimDegrees(store.forecastday[0].hour[21].temp_c)
        }
        updateMap(store.lat, store.lon);
    }

    if (localStorage.getItem('lastLocation') !== '' && localStorage.getItem('lastLocation') !== null) {
        fetchData(localStorage.getItem('lastLocation'))
    } else {
        fetchData('Moscow')
    }

    locationForm.addEventListener('submit', (evt) => {
        evt.preventDefault()

        const inputName = document.getElementById('form__name').value
        fetchData(inputName)
        localStorage.setItem('lastLocation', inputName)

        formInput.value = ''

    })
})
