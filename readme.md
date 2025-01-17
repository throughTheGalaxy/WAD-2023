
Can Wrobel 585031
Nikita Ostrovskii 578966

MongoDB Atlas funktioniert nur bei eingetragener IP Adresse


man kann Curl benutzen um den Server in der Kommandozeile anzupingen
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"username\":\"normalo\", \"password\":\"password\"}"

curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"username\":\"admina\", \"password\":\"password\"}"

curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"username\":\"quatsch\", \"password\":\"password\"}"

*****Testet add Standort auf dem POST Ende des /loc Endpoints******

curl -X POST http://localhost:3000/loc -H "Content-Type: application/json" -d "{\"name\": \"Neuer Standort\",\"desc\": \"Beschreibung\",\"street\": \"Straße\",\"zip\": \"12345\",\"city\": \"Berlin\",\"state\": \"Berlin\",\"lat\": 52.5200,\"lon\": 13.4050}"

**GET LOC Endpoint Test**
curl -X GET http://localhost:3000/loc -H "Content-Type: application/json"

**GET LOC/ID**
curl -X GET http://localhost:3000/loc/6597d5632516be59685e5fbf -H "Content-Type: application/json"

curl -X PUT http://localhost:3000/loc/6597e3e49257534e652c7acf -H "Content-Type: application/json" -d "{\"name\": \"Aktualisierter Standort\"}"

**DELETE**
curl -X DELETE http://localhost:3000/loc/6597e3e49257534e652c7acf

ausschalten zum DEBUGGEN
disableScrolling();

const cors = require('cors');
app.use(cors());

workaround