const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    console.log('---');
    next();
};

app.use(requestLogger);

let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Rutas de la API
app.get('/', (request, response) => {
    response.send('<h1>API REST FROM PERSONS</h1>');
});

// Obtener todas las personas
app.get('/api/persons', (request, response) => {
    response.json(persons);
});

// Obtener una persona específica por ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).send({ error: 'Person not found' });
    }
});

// Eliminar una persona por ID
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
});

// Generar un nuevo ID
const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;
    return maxId + 1;
};

// Agregar una nueva persona
app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name or number is missing' });
    }

    const nameExists = persons.some(p => p.name === body.name);
    if (nameExists) {
        return response.status(400).json({ error: 'Name already exists in the phonebook' });
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(newPerson);
    response.json(newPerson);
});

// Actualizar el número de una persona
app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const body = request.body;
    const person = persons.find(p => p.id === id);

    if (!person) return response.status(404).end();

    const updatedPerson = { ...person, number: body.number };
    persons = persons.map(p => (p.id !== id ? p : updatedPerson));
    response.json(updatedPerson);
});

// Información general
app.get('/info', (request, response) => {
    const totalPersons = persons.length;
    const currentDate = new Date();

    response.send(`
        <p>Phonebook has info for ${totalPersons} people</p>
        <p>${currentDate}</p>
    `);
});

// Configuración del puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
