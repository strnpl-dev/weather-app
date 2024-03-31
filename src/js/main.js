import '../scss/style.scss';
// import { langArr } from './rulang'

'use strict'

window.addEventListener('DOMContentLoaded', () => {

    const locationBtn = document.querySelector('.weather__btns-wrapper'),
        languageChange = document.querySelector('#languageChange'),
        fahrsToggle = document.querySelector('#degree_far'),
        celsToggle = document.querySelector('#degree_cels'),
        controlBtns = document.querySelectorAll('.degree_btns'),
        cityName = document.querySelector('.weather__city'),
        date = document.querySelector('.weather__time-date'),
        time = document.querySelector('.weather__hour'),
        weatherNum = document.querySelector('.weather__conditions-num'),
        weatherDescription = document.querySelector('.weather__condition-text'),
        futureNums = document.querySelectorAll('.weather__item-num'),
        windSpeed = document.querySelector('.windSpeed'),
        humidityNum = document.querySelector('.humidityNum'),
        feelsLike = document.querySelector('.feelsLike'),
        locationForm = document.querySelector('#weather_form'),
        formInput = document.querySelector('#weather_form input'),
        latitude = document.querySelector('.latitude'),
        longitude = document.querySelector('.longitude'),
        apiLink = 'http://api.weatherapi.com/v1/current.json?key=81cd96a4cf8f4303b5e111110242903&q=',
        weatherIcon = document.querySelector('.weather__conditions-icon')


    locationBtn.addEventListener('click', () => {
        yourLocationWeather()
    })


    const yourLocationWeather = () => {

        function success(position) {

            navigator.geolocation.getCurrentPosition((position) => {
                fetchData(`${position.coords.latitude}, ${position.coords.longitude}`);
            });
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
        localStorage.setItem('preferredDeg', 'fahr')
    })

    celsToggle.addEventListener('click', () => {
        feelsLike.textContent = trimDegrees(store.feelslike_c)
        weatherNum.textContent = trimDegrees(store.temp_c)
        localStorage.setItem('preferredDeg', 'cels')
    })

    if (localStorage.getItem('preferredDeg') === 'fahr') {
        fahrsToggle.checked = true;
    } else {
        celsToggle.checked = true;
    }

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
            }
        } = newData

        // console.log(newData)

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
            condition: text
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
        } else {
            feelsLike.textContent = trimDegrees(store.feelslike_c)
            weatherNum.textContent = trimDegrees(store.temp_c)
        }
    }

    fetchData('Moscow')

    locationForm.addEventListener('submit', (evt) => {
        evt.preventDefault()

        const inputName = document.getElementById('form__name').value
        fetchData(inputName)

        formInput.value = ''

    })

    initMap();

    async function initMap() {
        await ymaps3.ready;

        const { YMap, YMapDefaultSchemeLayer } = ymaps3;

        const map = new YMap(
            document.getElementById('map'),
            {
                location: {
                    center: [37.588144, 55.733842],
                    zoom: 10
                }
            }


        );

        map.setLocation({
            center: [store.lat, store.lon],
            zoom: 5
        });

        map.addChild(new YMapDefaultSchemeLayer());
    }

})
