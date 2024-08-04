import express from 'express';
import operaciones from './crud.js';
import * as path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

//Inicializar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Endpoints

//Ruta principal 
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

//Crear una nueva canción (POST)
app.post('/cancion', async (req, res) => {
    try {
        const { titulo, artista, tono } = req.body;
        //verificar datos ngresados por el body
        if (!titulo || !artista || !tono) {
            return res.status(400).json({
                message: 'Debe proporcionar todos los valores requeridos [titulo, artista, tono].'
            });
        }
        //Se agrega la nueva canción a la base de datos
        const nuevaCancion = await operaciones.nuevaCancion(titulo, artista, tono);
        res.status(201).json({
            message: 'Canción agregada con éxito!',
            cancion: nuevaCancion
        });
    } catch (error) {
        console.log('Error al intentar agregar la canción.', error);
        res.status(500).json({
            message: 'Error del servidor, no se pudo agregar la canción'
        });
    }
});

//Ruta para obtener todas las canciones (GET)
app.get('/canciones', async (req, res) => {
    try {
        let canciones = await operaciones.obtenerCanciones();
        res.status(200).json(canciones);
    } catch (error) {
        log('Error al intentar obtener las canciones.', error);
        res.status(500).json({
            message: 'Error del servidor, no se han podido encontrar las canciones'
        });
    }
});

//Actualizar una canción existente (PUT)
app.put('/cancion/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    //verificar datos ingresados por el body
    if (!titulo || !artista || !tono) {
        return res.status(400).json({
            message: 'Todos los campos [titulo, artista, tono] son requeridos para actualizar la canción.'
        });
    }
    try {
        const cancionActualizada = await operaciones.editarCancion(id, titulo, artista, tono);
        if (cancionActualizada) {
            res.status(200).json({
                message: 'Canción actualizada con éxito.',
                cancion: cancionActualizada
            });
        } else {
            res.status(404).json({ message: `Canción con ID ${id} no encontrada.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor, no se pudo actualizar la canción'});
    }
});

//Ruta para eliminar una canción (DELETE)
app.delete('/cancion/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cancionEliminada = await operaciones.eliminarCancion(id);
        if (cancionEliminada) {
            res.status(200).json({ message: `Canción ID ${id} eliminada correctamente.` });
        } else {
            res.status(404).json({ message: `Canción con id ${id} no encontrada.` });
        }
    } catch (error) {
        console.error('Error al eliminar la canción', error);
        res.status(500).json({ message: 'Error del servidor al eliminar la canción.'});
    }
});

//Ruta default para páginas no encontradas
app.all('*', (req, res) => {
    res.status(404).send('Lo sentimos! Esta página no existe 😔');
});