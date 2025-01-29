import {config} from "./../../config/index.js"
import twilio from 'twilio';


const smsconfig = config.smsConfig;

export const sendSMS = async (data, mensaje) => {
  const accountSid = smsconfig.sid_twilio; // Obtén tu SID de cuenta desde Twilio
  const authToken = smsconfig.token_twilio;   // Obtén tu token de autenticación desde Twilio

  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: mensaje,
      from: '+17633143352', // Tu número de Twilio
      to: `+502${data.telefonoUsuario}`            // Número de destino
    });
    return { success: true, messageSid: message.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createMessage = (data) => {
  // Verifica si los valores existen antes de intentar hacer el split
  const nombre = data.nombreUsuario ? data.nombreUsuario.split(" ")[0] : "Desconocido";
  const apellido = data.apellidoUsuario ? data.apellidoUsuario.split(" ")[0] : "Desconocido";

  const nombreMensaje = `${nombre} ${apellido}`;

  return `        ${nombreMensaje} se ha creado tu usuario para https://sangabrielpanaderia.vercel.app/
          Usuario: ${data.usuario}
          Contraseña: ${data.contrasena}`;
}



export default sendSMS;