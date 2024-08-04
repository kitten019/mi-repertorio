import pool from './db.js';

//Realiza consultas a la base de datos
const consultarDB = (consulta) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await pool.query(consulta);
            resolve(result);
        } catch (error) {
            console.log(error);
            reject("No se pudieron traer los registros.");
        }
    });
};

//Agrega una nueva canción a la db
const nuevaCancion = async (titulo, artista, tono) => {
    try {
        const query = {
            text: "INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3) RETURNING id, titulo, artista, tono",
            values: [titulo, artista, tono],
        };
        let results = await consultarDB(query);
        let cancion = results.rows[0];
        return cancion;    
    } catch (error) {
        console.log('Error en la consulta a la base de datos', error);
        throw new Error(`Error al intentar agregar una nueva canción: ${error.message}`);
    }
};

//Obtenemos todas las canciones de la db
const obtenerCanciones = async () => {
    try {
        let query = "SELECT * FROM canciones ORDER BY id";
        let results = await consultarDB(query);
        return results.rows;     
    } catch (error) {
        console.log('Error en la consulta a la base de datos', error);
        throw new Error("Error al traer los datos de las canciones");
    }
};

//Editar una canción existente en la db
const editarCancion = async (id, titulo, artista, tono) => {
    try {
        const query = {
            text: "UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4 RETURNING id, titulo, artista, tono",
            values: [titulo, artista, tono, id],
        };
        let results = await consultarDB(query);
        return results.rows[0];
    } catch (error) {
        console.log('Error en la consulta a la base de datos', error);
        throw new Error("Error al intentar actualizar la canción");
    }
};

//Eliminar una canción de la db
const eliminarCancion = async (id) => {
    try {
        const query = {
            text: "DELETE FROM canciones WHERE ID = $1 RETURNING id",
            values: [id],
        };
        let result = await consultarDB(query);
        return result.rowCount > 0;
    } catch (error) {
        console.log(error);
        throw new Error("Error al intentar eliminar la canción.");
    }
};


const operaciones = {
    nuevaCancion,
    obtenerCanciones,
    editarCancion,
    eliminarCancion
};

export default operaciones;