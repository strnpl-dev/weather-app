let myMap

function updateMap(lat, lon) {
    if (myMap) {
        myMap.setCenter([lat, lon]);
    } else {
        myMap = new ymaps.Map("map", {
            center: [lat, lon],
            zoom: 10,
        });
    }
}

let scriptElement = document.querySelector('script[src="https://api-maps.yandex.ru/2.1/?apikey=83c35695-8da5-419d-81ae-38b8f3a6dcc0&lang=ru_RU"]');


function changeMapLang() {

    let newScriptElement = document.createElement('script');
    newScriptElement.setAttribute('src', 'https://api-maps.yandex.ru/2.1/?apikey=83c35695-8da5-419d-81ae-38b8f3a6dcc0&lang=en_RU');

    scriptElement.parentNode.replaceChild(newScriptElement, scriptElement);
}

export { updateMap }