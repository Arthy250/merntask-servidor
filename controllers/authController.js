const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

  //Revisar si existen errores
  const errores = validationResult(req);
  if( !errores.isEmpty() ){
    return res.status(400).json({
      errores: errores.array()
    })
  }

  //extraer email y password
  const { email, password } = req.body;

  try {
    //Revisar que el usuario este registrado
    let usuario = await Usuario.findOne({ email });
    
    if (!usuario) {
      return res.status(400).json({
        msg: 'El usuario no existe'
      });
    }

    //Verificar password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({
        msg: 'Contraseña incorrecta'
      })
    }

    //Si todo es correcto crear y firmar JWT
    const payload = {
      usuario:{
        id: usuario.id
      }
    };

    //firmar JWT
    jwt.sign(payload, process.env.SECRETA, {
      expiresIn: '1hr'
    }, (error, token) => {
      if (error) throw error;

      //mensaje de confirmación
      res.json({ token });
    });

  } catch (error) {
    console.log(error);
    res.json('Hubo un error');
  }

}

//Obtiene que usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {
  try {
    
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json({ usuario });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hubo un error'
    })
  }
}