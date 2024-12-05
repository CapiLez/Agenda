const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Uso: node mongo.js <contraseña> [nombre] [número]');
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://capiman619:${password}@cluster0.d78ad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (!name || !number) {
    Person.find({})
        .then((result) => {
            console.log('Phonebook:');
            result.forEach((person) => {
                console.log(`${person.name} ${person.number}`);
            });
            mongoose.connection.close();
        })
        .catch((err) => {
            console.error('Error al listar entradas:', err);
            mongoose.connection.close();
        });
} else {
    const person = new Person({
        name: name,
        number: number,
    });

    person.save()
        .then(() => {
            console.log(`added ${name} number ${number} to phonebook`);
            mongoose.connection.close();
        })
        .catch((err) => {
            console.error('Error al guardar la entrada:', err);
            mongoose.connection.close();
        });
}
