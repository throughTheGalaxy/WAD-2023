const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

// Body-parser Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));


mongoose.connect('mongodb+srv://canwrob:mopsmopsmops@cluster0.tv4rxwp.mongodb.net/WAD', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String, // Ekelhaft, der sollte gehasht werden
    role: String
}), 'usr'); // Collection name

app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
        return res.status(401).send('Unauthorized');
    }

    // Sendet Benutzerdaten ohne Passwort zurück
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.send(userWithoutPassword);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const Location = mongoose.model('Location', new mongoose.Schema({
    name: String,
    desc: String,
    street: String,
    zip: String,
    city: String,
    state: String,
    lat: Number,
    lon: Number
}), 'loc'); // Collection name

app.post('/loc', async (req, res) => {
    const newLocation = new Location(req.body);
    try {
        await newLocation.save();
        res.status(201).send(newLocation);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/loc', async (req, res) => {
    try {
        const locations = await Location.find({});
        res.send(locations);
    } catch (error) {
        res.status(500).send(error);
    }
});
//Successful HTTP-Response: Der Statuscode 200 und der Content-Type application/json werden automatisch von Express gesetzt, wenn du res.send() mit einem JavaScript-Objekt oder Array verwendest.

app.get('/loc/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).send('Standort nicht gefunden');
        }
        res.send(location);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.put('/loc/:id', async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!location) {
            return res.status(404).send();
        }
        res.status(204).send(); // Ändere dies, um keine Payload zurückzusenden
    } catch (error) {
        res.status(400).send(error);
    }
});


app.delete('/loc/:id', async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            return res.status(404).send();
        }
        res.status(204).send(); // Sendet Status 204 ohne Payload
    } catch (error) {
        res.status(500).send(error);
    }
});

