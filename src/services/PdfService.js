import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native'; 

export const generarPdfBuenaFe = async (datosClub, equipo) => {
  const filasJugadoras = equipo.jugadoras.map((j, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${j.apellido.toUpperCase()}, ${j.nombre}</td>
      <td>${j.dni}</td>
      <td>${j.fechaNac}</td>
    </tr>
  `).join('');

  const html = `
    <html>
      <body style="font-family: sans-serif; padding: 20px;">
        <h1 style="text-align: center;">LISTA DE BUENA FE</h1>
        <h2 style="text-align: center; color: #D32F2F;">${equipo.nombre}</h2>
        <p><strong>Club:</strong> ${datosClub.nombre} | <strong>Ciudad:</strong> ${datosClub.ciudad}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #EEE;">
              <th style="border: 1px solid #000; padding: 5px;">#</th>
              <th style="border: 1px solid #000; padding: 5px;">Jugadora</th>
              <th style="border: 1px solid #000; padding: 5px;">DNI</th>
              <th style="border: 1px solid #000; padding: 5px;">F. Nacimiento</th>
            </tr>
          </thead>
          <tbody>${filasJugadoras}</tbody>
        </table>
        <div style="margin-top: 30px; padding: 10px; border: 1px solid #000;">
          <p><strong>Cuerpo Tecnico:</strong></p>
          <p> DT: ${equipo.staff?.dt || '---'} | Ayudante: ${equipo.staff?.ac || '---'}</p>
          <p> PF: ${equipo.staff?.pf || '---'} | Jefe de Equipo: ${equipo.staff?.jefe || '---'}</p>
        </div>
      </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    win.focus();
  } else {
    const Print = require('expo-print');
    const Sharing = require('expo-sharing');
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  }
};