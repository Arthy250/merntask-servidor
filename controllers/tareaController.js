const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crear una tarea
exports.crearTarea = async (req, res) => {

  //Revisar si hay errores
  const errores = validationResult(req);
  if( !errores.isEmpty() ){
    return res.status(400).json({
      errores: errores.array()
    })
  }

  try {

    //Extraer el proyecto y comprobar si existe
    const {proyecto} = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    //Verificar si el proyecto existe
    if (!existeProyecto) {
      return res.status(400).json({
        msg: 'Proyecto no encontrado'
      })
    }

    //Revisar si el proyecto pertenece al usuario logeado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: 'Acceso no autorizado'
      })
    }

    //Crear tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea })
    
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }

}

//Obtener tareas por proyecto
exports.obtenerTareas = async(req, res) => {

  try {
    
    //Extraer el proyecto y comprobar si existe
    const {proyecto} = req.query;

    const existeProyecto = await Proyecto.findById(proyecto);

    //Verificar si el proyecto existe
    if (!existeProyecto) {
      return res.status(400).json({
        msg: 'Proyecto no encontrado'
      })
    }

    //Revisar si el proyecto pertenece al usuario logeado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: 'Acceso no autorizado'
      })
    }

    //Obtener las tareas por proyecto
    const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
    res.json({ tareas });

  } catch (error) {
    console.log(error)
    res.status(500).send('Hubo un error')
  }

}

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {

  try {

    //Extraer el proyecto y comprobar si existe
    const {proyecto, nombre, estado} = req.body;
  
    //Verificar si el proyecto existe
    const existeProyecto = await Proyecto.findById(proyecto);

    //Verificar si el proyecto existe
    if (!existeProyecto) {
      return res.status(400).json({
        msg: 'Proyecto no encontrado'
      })
    }
    
    //Revisar si el proyecto pertenece al usuario logeado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: 'Acceso no autorizado'
      })
    }

    //Verificar si la tarea existe
    let tarea = await Tarea.findById(req.params.id);

    if(!tarea) {
      return res.status(404).json({
        msg: 'La tarea no existe'
      })
    }
    
    //Crear un objeto con la nueva información
    const nuevaTarea = {...req.body};
    nuevaTarea.estado = estado;
    nuevaTarea.nombre = nombre;
    
    //Guardar tarea
    tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
    res.json({ tarea });
    
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }

}

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {

  try {

    //Extraer el proyecto y comprobar si existe
    const {proyecto} = req.query;
  
    //Verificar si el proyecto existe
    const existeProyecto = await Proyecto.findById(proyecto);

    //Verificar si el proyecto existe
    if (!existeProyecto) {
      return res.status(400).json({
        msg: 'Proyecto no encontrado'
      })
    }

    //Revisar si el proyecto pertenece al usuario logeado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: 'Acceso no autorizado'
      })
    }

    //Verificar si la tarea existe
    let tarea = await Tarea.findById(req.params.id);

    if(!tarea) {
      return res.status(404).json({
        msg: 'La tarea no existe'
      })
    }

    //Eliminar tarea
    await Tarea.findByIdAndRemove({ _id: req.params.id });
    res.json({ msg: 'Tarea eliminada' });
    
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }

}