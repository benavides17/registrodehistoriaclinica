// =============================================
// STORAGE — Historias Clínicas Pompeya
// Gestión de datos con localStorage
// =============================================

const DB_KEY = 'pompeya_historias';
const PAC_KEY = 'pompeya_pacientes';

// ---- HISTORIAS ----

function getHistorias() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  } catch { return []; }
}

function saveHistorias(arr) {
  localStorage.setItem(DB_KEY, JSON.stringify(arr));
}

function crearHistoria(datos) {
  const historias = getHistorias();
  const nueva = {
    id: 'HC-' + Date.now(),
    fechaCreacion: new Date().toISOString(),
    ...datos
  };
  historias.unshift(nueva);
  saveHistorias(historias);
  return nueva;
}

function actualizarHistoria(id, datos) {
  const historias = getHistorias();
  const idx = historias.findIndex(h => h.id === id);
  if (idx === -1) return null;
  historias[idx] = { ...historias[idx], ...datos, id };
  saveHistorias(historias);
  return historias[idx];
}

function eliminarHistoria(id) {
  const historias = getHistorias().filter(h => h.id !== id);
  saveHistorias(historias);
}

function buscarHistorias(query) {
  const q = query.toLowerCase().trim();
  if (!q) return getHistorias();
  return getHistorias().filter(h =>
    (h.pacienteNombre || '').toLowerCase().includes(q) ||
    (h.pacienteDoc || '').toLowerCase().includes(q) ||
    (h.motivo || '').toLowerCase().includes(q) ||
    (h.id || '').toLowerCase().includes(q)
  );
}

function getHistoriaById(id) {
  return getHistorias().find(h => h.id === id) || null;
}

// ---- PACIENTES ----

function getPacientes() {
  try {
    return JSON.parse(localStorage.getItem(PAC_KEY) || '[]');
  } catch { return []; }
}

function savePacientes(arr) {
  localStorage.setItem(PAC_KEY, JSON.stringify(arr));
}

function upsertPaciente(datos) {
  const pacientes = getPacientes();
  const idx = pacientes.findIndex(p => p.documento === datos.documento);
  if (idx === -1) {
    const nuevo = { id: 'PAC-' + Date.now(), fechaRegistro: new Date().toISOString(), ...datos };
    pacientes.unshift(nuevo);
    savePacientes(pacientes);
    return nuevo;
  } else {
    pacientes[idx] = { ...pacientes[idx], ...datos };
    savePacientes(pacientes);
    return pacientes[idx];
  }
}

function eliminarPaciente(id) {
  const pacientes = getPacientes().filter(p => p.id !== id);
  savePacientes(pacientes);
}

function buscarPacientes(query) {
  const q = query.toLowerCase().trim();
  if (!q) return getPacientes();
  return getPacientes().filter(p =>
    (p.nombre || '').toLowerCase().includes(q) ||
    (p.documento || '').toLowerCase().includes(q) ||
    (p.telefono || '').toLowerCase().includes(q)
  );
}

// ---- EXPORT / IMPORT ----

function exportarJSON() {
  const data = {
    exportado: new Date().toISOString(),
    sistema: 'Historias Clínicas Pompeya',
    historias: getHistorias(),
    pacientes: getPacientes()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pompeya_backup_' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importarJSON(jsonText) {
  try {
    const data = JSON.parse(jsonText);
    if (data.historias) saveHistorias(data.historias);
    if (data.pacientes) savePacientes(data.pacientes);
    return true;
  } catch { return false; }
}

// ---- STATS ----

function getStats() {
  const historias = getHistorias();
  const hoy = new Date().toDateString();
  const mesActual = new Date().getMonth();
  const anoActual = new Date().getFullYear();

  return {
    totalPacientes: getPacientes().length,
    totalHistorias: historias.length,
    historiasHoy: historias.filter(h => new Date(h.fechaCreacion).toDateString() === hoy).length,
    historiasMes: historias.filter(h => {
      const d = new Date(h.fechaCreacion);
      return d.getMonth() === mesActual && d.getFullYear() === anoActual;
    }).length
  };
}
