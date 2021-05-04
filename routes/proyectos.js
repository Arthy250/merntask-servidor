const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//CRUD proyectos
//Type: POST
// api/proyectos

//Crear proyecto
router.post('/',
  auth,
  [
    check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
  ],
  proyectoController.crearProyecto
);

//Obtener todos los proyectos del usuario
router.get('/',
  auth,
  proyectoController.obtenerProyectos
);

//Actualizar un proyecto
router.put('/:id',
  auth,
  [
    check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
  ],
  proyectoController.actualizarProyecto
);

//Eliminar un proyecto
router.delete('/:id',
  auth,
  proyectoController.eliminarProyecto
);


module.exports = router;