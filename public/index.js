
let map;

alert('Willkommen! Bitte melden Sie sich an, um die Karte zu sehen.');


function disableScrolling() {
    document.body.style.overflow = 'hidden';
}

function enableScrolling() {
    document.body.style.overflow = '';
}

// Zum Deaktivieren des Scrollens
disableScrolling();

// Zum Reaktivieren des Scrollens
// enableScrolling();


let originalName = ""; // Globale Variable zum Speichern des ursprünglichen Namens

function setOriginalName(name) {
    originalName = name;
}

var erfolgGeoMk2 = false;

function fillGeoCoordinatesOfUpdate() {
    var street = document.getElementById('update-street').value;
    var zip = document.getElementById('update-zip').value;
    var city = document.getElementById('update-city').value;
    // var state = document.getElementById('location').value;

    var address = `${street}, ${zip}, ${city}, ${state}`;

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=AIzaSyDHOlKv8ldnm6kvvJ1a83y9PkFdVA16zHA')
    .then(response => response.json())
    .then(data => {
        if (data.results.length > 0) {
            var results = data.results[0].geometry.location;
            document.getElementById('update-lat').value = results.lat;
            document.getElementById('update-lon').value = results.lng;
            return true;
            // Hier können Sie Code hinzufügen, um den Add-Screen zu schließen und den neuen Eintrag hinzuzufügen
        } else {
            erfolgGeoMk2 = false;

            alert('Keine Geokoordinaten gefunden. Bitte überprüfen Sie die Adresse oder brechen Sie ab.');

            alert(erfolgGeoMk2)


        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Fehler bei der Anfrage. Bitte versuchen Sie es später erneut.');
    });
}


async function updateStandort(originalName, updatedData) {
    const locToUpdate = standorte.find(loc => loc.name === originalName);
    if (locToUpdate) {
        try {
            const response = await fetch(`http://localhost:3000/loc/${locToUpdate._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            loadStandorte(); // Standorte neu laden
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Standorts:', error);
        }
    } else {
        alert('Standort nicht gefunden.');
    }
}


document.getElementById('update').addEventListener('click', async() => {
    erfolgGeoMk2 = true;
    let nameStehtNix =     document.getElementById('update-name').value == '';
    let straßeStehtNix =     document.getElementById('update-street').value == '';
    let zipStehtNix =     document.getElementById('update-zip').value == '';
    let cityStehtNix =     document.getElementById('update-city').value == '';
    if (nameStehtNix || straßeStehtNix || zipStehtNix || cityStehtNix){
        alert("Da fehlt ein Feld!")
        return
    }
    // Weitere Aktionen nach dem Update
    fillGeoCoordinatesOfUpdate(); // Warten auf das Ergebnis der Funktion

    alert(erfolgGeoMk2)
    delay(1000)
    if (!erfolgGeoMk2) {
        // Wenn fillGeoCoordinatesOfUpdate false zurückgibt, brechen Sie den Prozess ab
        return;
    }
    
    if (erfolgGeoMk2){
        delay(500).then(() => {
            if (!erfolgGeoMk2) {
                // Wenn fillGeoCoordinatesOfUpdate false zurückgibt, brechen Sie den Prozess ab
                return;
            }
            const updatedData = {
                name: document.getElementById('update-name').value,
                desc: document.getElementById('update-description').value,
                street: document.getElementById('update-street').value,
                zip: document.getElementById('update-zip').value,
                city: document.getElementById('update-city').value,
                // state: document.getElementById('location').value,
                lat: parseFloat(document.getElementById('update-lat').value),
                lon: parseFloat(document.getElementById('update-lon').value)
            };
            updateStandort(originalName, updatedData);
            initMap();        // Fügen Sie hier weiteren Code ein, der nach der Verzögerung ausgeführt werden soll
            document.getElementById('mapscontainermk2').scrollIntoView({
                // behavior: 'smooth', // Glattes Scrollen
                block: 'start' // Start des Elements wird an den Anfang des sichtbaren Bereichs gebracht
            });
        });
    }
});






function addStandort() {
    alert('Standort wurde hinzugefügt.');
    const name = document.getElementById('add-name').value;
    const desc = document.getElementById('add-description').value;
    const street = document.getElementById('street').value;
    const zip = document.getElementById('zip').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const lat = document.getElementById('add-lat').value;
    const lon = document.getElementById('add-lon').value;

    const newStandort = {
        name: name,
        desc: desc,
        street: street,
        zip: zip,
        city: city,
        state: state,
        lat: parseFloat(lat),
        lon: parseFloat(lon)
    };

    addStandortserver(newStandort);
    // Hier können Sie zusätzliche Logik hinzufügen, um die Liste und die Karte zu aktualisieren
}

async function addStandortserver(newStandort) {
    try {
        const response = await fetch('http://localhost:3000/loc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStandort),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        loadStandorte(); // Standorte neu laden
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Standorts:', error);
    }
}



function fillGeoCoordinates() {
    var street = document.getElementById('street').value;
    var zip = document.getElementById('zip').value;
    var city = document.getElementById('city').value;
    // var state = document.getElementById('state').value;

    var address = `${street}, ${zip}, ${city}, ${state}`;

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=AIzaSyDHOlKv8ldnm6kvvJ1a83y9PkFdVA16zHA')
    .then(response => response.json())
    .then(data => {
        if (data.results.length > 0) {
            var results = data.results[0].geometry.location;
            document.getElementById('add-lat').value = results.lat;
            document.getElementById('add-lon').value = results.lng;
            // Hier können Sie Code hinzufügen, um den Add-Screen zu schließen und den neuen Eintrag hinzuzufügen
            return true

        } else {
            alert('Keine Geokoordinaten gefunden. Bitte überprüfen Sie die Adresse oder brechen Sie ab.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Fehler bei der Anfrage. Bitte versuchen Sie es später erneut.');
    });
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearAddLocationForm() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-description').value = '';
    document.getElementById('street').value = '';
    document.getElementById('zip').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = 'berlin'; // Standardwert für das Dropdown-Menü
    document.getElementById('add-lat').value = '';
    document.getElementById('add-lon').value = '';
}

// Beispiel, wie Sie die Funktion aufrufen könnten:
// clearAddLocationForm();

document.getElementById('saveLocation').addEventListener('click', function() {
    erfolgGeoMk2 = true;
    let nameStehtNix =     document.getElementById('add-name').value == '';
    let straßeStehtNix =     document.getElementById('street').value == '';
    let zipStehtNix =     document.getElementById('zip').value == '';
    let cityStehtNix =     document.getElementById('city').value == '';
    if (nameStehtNix || straßeStehtNix || zipStehtNix || cityStehtNix){
        alert("Da fehlt ein Feld!")
        return;
    }

    var street = document.getElementById('street').value;
    var zip = document.getElementById('zip').value;
    var city = document.getElementById('city').value;
    // var state = document.getElementById('state').value;

    var address = `${street}, ${zip}, ${city}, `;

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=AIzaSyDHOlKv8ldnm6kvvJ1a83y9PkFdVA16zHA')
    .then(response => response.json())
    .then(data => {
        if (data.results.length > 0) {
            var results = data.results[0].geometry.location;
            document.getElementById('add-lat').value = results.lat;
            document.getElementById('add-lon').value = results.lng;
            // Hier können Sie Code hinzufügen, um den Add-Screen zu schließen und den neuen Eintrag hinzuzufügen
            

        } else {
            alert('Keine Geokoordinaten gefunden. Bitte überprüfen Sie die Adresse oder brechen Sie ab.');
            erfolgGeoMk2 = false;
            return; 
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Fehler bei der Anfrage. Bitte versuchen Sie es später erneut.');
    });
    
    delay(500).then(() => {
        if (!erfolgGeoMk2) {
            return;
        }
        addStandort();
        standorte = standorte.filter(loc => loc.name !== name);
        document.getElementById('standorteListe').innerHTML = "";
        initMap();        // Fügen Sie hier weiteren Code ein, der nach der Verzögerung ausgeführt werden soll
        document.getElementById('mapscontainermk2').scrollIntoView({
            // behavior: 'smooth', // Glattes Scrollen
            block: 'start' // Start des Elements wird an den Anfang des sichtbaren Bereichs gebracht
        });
        clearAddLocationForm()
    });
    
    
    
});


let adminaIstEingeloggt = false;

document.getElementById('addSome').addEventListener('click', function(event){
    document.getElementById('addscreen').scrollIntoView({
        // behavior: 'smooth', // Glattes Scrollen
        block: 'start' // Start des Elements wird an den Anfang des sichtbaren Bereichs gebracht
    });
    adminaIstEingeloggt=false;
});

document.getElementById('logout').addEventListener('click', function(event){
    document.getElementById('mainscreen').scrollIntoView({
        // behavior: 'smooth', // Glattes Scrollen
        block: 'start' // Start des Elements wird an den Anfang des sichtbaren Bereichs gebracht
    });
    adminaIstEingeloggt=false;
});
document.getElementById('cancel-add').addEventListener('click', function(event){
    document.getElementById('mapscontainermk2').scrollIntoView({
        // behavior: 'smooth', // Glattes Scrollen
        block: 'start' // Start des Elements wird an den Anfang des sichtbaren Bereichs gebracht
    });
});

document.getElementById('cancel-update').addEventListener('click', function(event){
    document.getElementById('mapscontainermk2').scrollIntoView({
        // behavior: 'smooth', // Glattes Scrollen
        block: 'start' // Start des Elements wird an den Anfang des sichtbaren Bereichs gebracht
    });
});



document.getElementById('loginLink').addEventListener('click', async function(event) {
    event.preventDefault(); // Verhindert die Standardaktion des Links

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Anmeldefehler');
        }

        const user = await response.json();

        // Reaktion auf die Benutzerrolle
        if (user.role === 'admin') {
            alert('Admin-Benutzer angemeldet');
            adminaIstEingeloggt = true;
            document.getElementById('welcome').textContent = `Welcome, ${user.name}! Look at existing locations or add/update some.`;
            document.getElementById('detail-text').textContent = 'Detail-Screen: You can edit or delete';
            document.getElementById('delete').style.display = 'block';
            document.getElementById('update').style.display = 'block';
            document.getElementById('cancel-update').textContent = 'cancel';
    
            document.getElementById('mapscontainermk2').scrollIntoView({
                // behavior: 'smooth', // Glattes Scrollen
                block: 'start' // Start des Elements wird an den Anfang des sichtbaren Bereichs gebracht
            });
            document.getElementById('addSome').style.display = 'inline'; // oder 'inline', je nach gewünschtem Layout
        } else if (user.role === 'non-admin') {
            alert('Normaler Benutzer angemeldet');
            document.getElementById('addSome').style.display = 'none';
            document.getElementById('welcome').textContent = `Welcome, ${user.name}! Look at existing locations.`;
            document.getElementById('cancel-update').textContent = 'close';
    
            document.getElementById('detail-text').textContent = 'Detail-Screen: You can only look at the details.';
            document.getElementById('update').style.display = 'none';
            document.getElementById('delete').style.display = 'none';
            document.getElementById('mapscontainermk2').scrollIntoView({
                // behavior: 'smooth', // Glattes Scrollen
                block: 'start' // Start des Elements wird an den Anfang des sichtbaren Bereichs gebracht
            });
    
        }

    } catch (error) {
        console.error('Fehler bei der Anmeldung:', error);
        alert('Login fehlgeschlagen!');
    }
});





function deleteStandort(name) {
    deleteStandortserver(name);
    document.getElementById('standorteListe').innerHTML = "";
    initMap();
    // Hier könnten Sie zusätzliche Logik hinzufügen, um die Karte zu aktualisieren
}

async function deleteStandortserver(name) {
    const locToDelete = standorte.find(loc => loc.name === name);
    if (locToDelete) {
        try {
            const response = await fetch(`http://localhost:3000/loc/${locToDelete._id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            loadStandorte(); // Standorte neu laden
        } catch (error) {
            console.error('Fehler beim Löschen des Standorts:', error);
        }
    } else {
        alert('Standort nicht gefunden.');
    }
}


// Beispielhafte Nutzung:
// updateStandort("Heizkraftwerk Klingenberg", { street: "Neue Straße 123", lat: 52.50, lon: 13.400 });
// deleteStandort("Heizkraftwerk Klingenberg 3");

let standorte = [];

async function loadStandorte() {
    try {
        const response = await fetch('http://localhost:3000/loc');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        standorte = await response.json();
        initMap(); // Karte initialisieren, nachdem Standorte geladen wurden
    } catch (error) {
        console.error('Fehler beim Laden der Standorte:', error);
    }
}

loadStandorte();




document.getElementById('delete').addEventListener('click', () => {
    const nameToDelete = document.getElementById('update-name').value;
    deleteStandort(nameToDelete);
    document.getElementById('mapscontainermk2').scrollIntoView({
        // behavior: 'smooth', // Glattes Scrollen
        block: 'start' // Start des Elements wird an den Anfang des sichtbaren Bereichs gebracht
    });
    // Aktualisieren Sie die Anzeige entsprechend
});

async function initMap() {
    document.getElementById('standorteListe').innerHTML = "";
    // Request needed libraries.
    //@ts-ignore
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Initialize the map
    map = new Map(document.getElementById("map"), {
        zoom: 11,
        center: { lat: 52.49, lng: 13.495 },
        mapId: "DEMO_MAP_ID",
    });

    // Create a marker and an info window for each location
    standorte.forEach(loc => {
        const marker = new AdvancedMarkerElement({
            map: map,
            position: { lat: loc.lat, lng: loc.lon },
            title: loc.name,
        });

        // Create an info window
        const infoWindow = new InfoWindow({
            content: `<p>${loc.name}<p>`
        });

        // Open the info window immediately
        infoWindow.open(map, marker);
    });

    const standorteListe = document.getElementById('standorteListe');
    standorte.forEach(loc => {
        const listItem = document.createElement('div');
        listItem.id = loc.name.replace(/\s+/g, '-').toLowerCase(); // Ersetzt Leerzeichen durch Bindestriche und wandelt in Kleinbuchstaben um
        listItem.className = 'standort-item'; // Fügt die Klasse für Stilisierung hinzu
        listItem.innerHTML = `<h4>${loc.name}</h4><p>${loc.desc}</p>`;
    
        listItem.addEventListener('click', () => {
            fillUpdateForm(loc);
    
            // Hier fügen wir die zusätzliche Logik ein
            if (true) { // Ihre Bedingung - momentan immer wahr
                document.querySelector('.update-container.container-wrapper').scrollIntoView({
                    // behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    
        standorteListe.appendChild(listItem);
    });
    
}

function fillUpdateForm(loc) {
    setOriginalName(loc.name);
    document.getElementById('update-name').value = loc.name;
    document.getElementById('update-description').value = loc.desc;
    document.getElementById('update-street').value = loc.street;
    document.getElementById('update-zip').value = loc.zip;
    document.getElementById('update-city').value = loc.city;
    // Hier müssen Sie die Logik für die Auswahl des Bundeslandes hinzufügen
    // Beispiel:
    document.getElementById('location').value = loc.state.toLowerCase();
    document.getElementById('update-lat').value = loc.lat;
    document.getElementById('update-lon').value = loc.lon;
    // Achten Sie darauf, dass die Werte im select-Tag mit den Standort-States übereinstimmen
    // Für Lat und Lon
    // Fügen Sie entsprechende IDs in Ihren HTML-Input-Feldern für Lat und Lon hinzu und aktualisieren Sie sie hier
}

initMap();
