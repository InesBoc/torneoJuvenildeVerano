export const generarTabla = (partidos) => {
  const tabla = {};

  partidos.forEach((p) => {
    // Solo contamos partidos que ya fueron jugados y tienen equipos definidos
    if (!p.jugado || p.local.includes("Part") || p.visitante.includes("Part")) return;

    // Inicializar equipos si no existen en el objeto tabla
    [p.local, p.visitante].forEach((equipo) => {
      if (!tabla[equipo]) {
        tabla[equipo] = { equipo, pj: 0, pts: 0, gf: 0, gc: 0, dg: 0 };
      }
    });

    const eqL = tabla[p.local];
    const eqV = tabla[p.visitante];

    eqL.pj += 1;
    eqV.pj += 1;
    eqL.gf += p.golesLocal;
    eqL.gc += p.golesVisitante;
    eqV.gf += p.golesVisitante;
    eqV.gc += p.golesLocal;

    if (p.golesLocal > p.golesVisitante) {
      eqL.pts += 3;
    } else if (p.golesLocal < p.golesVisitante) {
      eqV.pts += 3;
    } else {
      eqL.pts += 1;
      eqV.pts += 1;
    }

    eqL.dg = eqL.gf - eqL.gc;
    eqV.dg = eqV.gf - eqV.gc;
  });

  // Convertir a array y ordenar por puntos, luego por diferencia de gol
  return Object.values(tabla).sort((a, b) => b.pts - a.pts || b.dg - a.dg);
};