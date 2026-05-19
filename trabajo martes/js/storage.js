// =============================================
// STORAGE — Historias Clínicas Pompeya
// Gestión completa de datos con localStorage
// =============================================

const DB_KEY = 'pompeya_historias';
const PAC_KEY = 'pompeya_pacientes';

// ========================================
// HISTORIAS CLÍNICAS - CREAR
// ========================================

function crearHistoria(datos) {
  const historias = getHistorias();
  const nueva = {
    id: 'HC-' + Date.now(),
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    ...datos
  };
  historias.unshift(nueva);
  saveHistorias(historias);
  return nueva;
}

// ========================================
// HISTORIAS CLÍNICAS - LEER
// ========================================

function getHistorias() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  } catch { return []; }
}

function getHistoriaById(id) {
  return getHistorias().find(h => h.id === id) || null;
}

function getHistoriasPorPaciente(pacienteDoc) {
  return getHistorias().filter(h => h.pacienteDoc === pacienteDoc);
}

function getHistoriasPorMedico(medico) {
  return getHistorias().filter(h => h.medico === medico);
}

function getHistoriasRecientes(limite = 10) {
  return getHistorias().slice(0, limite);
}

// ========================================
// HISTORIAS CLÍNICAS - ACTUALIZAR
// ========================================

function actualizarHistoria(id, datos) {
  const historias = getHistorias();
  const idx = historias.findIndex(h => h.id === id);
  if (idx === -1) return null;
  historias[idx] = {
    ...historias[idx],
    ...datos,
    id,
    fechaActualizacion: new Date().toISOString()
  };
  saveHistorias(historias);
  return historias[idx];
}

// ========================================
// HISTORIAS CLÍNICAS - ELIMINAR
// ========================================

function eliminarHistoria(id) {
  const historias = getHistorias().filter(h => h.id !== id);
  saveHistorias(historias);
  return true;
}

function eliminarHistoriasPorPaciente(pacienteDoc) {
  const historias = getHistorias().filter(h => h.pacienteDoc !== pacienteDoc);
  saveHistorias(historias);
  return true;
}

// ========================================
// HISTORIAS CLÍNICAS - BÚSQUEDA
// ========================================

function buscarHistorias(query) {
  const q = query.toLowerCase().trim();
  if (!q) return getHistorias();
  return getHistorias().filter(h =>
    (h.pacienteNombre || '').toLowerCase().includes(q) ||
    (h.pacienteDoc || '').toLowerCase().includes(q) ||
    (h.motivo || '').toLowerCase().includes(q) ||
    (h.diagnostico || '').toLowerCase().includes(q) ||
    (h.medico || '').toLowerCase().includes(q) ||
    (h.id || '').toLowerCase().includes(q)
  );
}

function filtrarHistoriasPorFecha(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio).getTime();
  const fin = new Date(fechaFin).getTime();
  return getHistorias().filter(h => {
    const fecha = new Date(h.fechaCreacion).getTime();
    return fecha >= inicio && fecha <= fin;
  });
}

function filtrarHistoriasPorMotivo(motivo) {
  return getHistorias().filter(h =>
    (h.motivo || '').toLowerCase().includes(motivo.toLowerCase())
  );
}

// ========================================
// PACIENTES - CREAR / ACTUALIZAR
// ========================================

function upsertPaciente(datos) {
  const pacientes = getPacientes();
  const idx = pacientes.findIndex(p => p.documento === datos.documento);
  
  if (idx === -1) {
    const nuevo = {
      id: 'PAC-' + Date.now(),
      fechaRegistro: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      ...datos
    };
    pacientes.unshift(nuevo);
    savePacientes(pacientes);
    return nuevo;
  } else {
    pacientes[idx] = {
      ...pacientes[idx],
      ...datos,
      fechaActualizacion: new Date().toISOString()
    };
    savePacientes(pacientes);
    return pacientes[idx];
  }
}

// ========================================
// PACIENTES - LEER
// ========================================

function getPacientes() {
  try {
    return JSON.parse(localStorage.getItem(PAC_KEY) || '[]');
  } catch { return []; }
}

function getPacienteById(id) {
  return getPacientes().find(p => p.id === id) || null;
}

function getPacienteByDocumento(documento) {
  return getPacientes().find(p => p.documento === documento) || null;
}

function getPacientesRecientes(limite = 10) {
  return getPacientes().slice(0, limite);
}

// ========================================
// PACIENTES - ACTUALIZAR
// ========================================

function actualizarPaciente(id, datos) {
  const pacientes = getPacientes();
  const idx = pacientes.findIndex(p => p.id === id);
  if (idx === -1) return null;
  pacientes[idx] = {
    ...pacientes[idx],
    ...datos,
    fechaActualizacion: new Date().toISOString()
  };
  savePacientes(pacientes);
  return pacientes[idx];
}

// ========================================
// PACIENTES - ELIMINAR
// ========================================

function eliminarPaciente(id) {
  const pacientes = getPacientes().filter(p => p.id !== id);
  savePacientes(pacientes);
  return true;
}

function eliminarPacienteByDocumento(documento) {
  const pacientes = getPacientes().filter(p => p.documento !== documento);
  savePacientes(pacientes);
  return true;
}

// ========================================
// PACIENTES - BÚSQUEDA
// ========================================

function buscarPacientes(query) {
  const q = query.toLowerCase().trim();
  if (!q) return getPacientes();
  return getPacientes().filter(p =>
    (p.nombre || '').toLowerCase().includes(q) ||
    (p.documento || '').toLowerCase().includes(q) ||
    (p.telefono || '').toLowerCase().includes(q) ||
    (p.email || '').toLowerCase().includes(q) ||
    (p.direccion || '').toLowerCase().includes(q)
  );
}

function filtrarPacientesPorEdad(edadMin, edadMax) {
  return getPacientes().filter(p => {
    if (!p.fechaNacimiento) return false;
    const edad = calcularEdad(p.fechaNacimiento);
    return edad >= edadMin && edad <= edadMax;
  });
}

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

// ========================================
// ALMACENAMIENTO - GUARDAR / LEER
// ========================================

function saveHistorias(arr) {
  localStorage.setItem(DB_KEY, JSON.stringify(arr));
}

function savePacientes(arr) {
  localStorage.setItem(PAC_KEY, JSON.stringify(arr));
}

// ========================================
// EXPORT / IMPORT
// ========================================

function exportarJSON() {
  const data = {
    exportado: new Date().toISOString(),
    sistema: 'Historias Clínicas Pompeya',
    version: '1.0',
    historias: getHistorias(),
    pacientes: getPacientes()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pompeya_backup_' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function exportarJSON_CSV() {
  let csv = 'Paciente,Documento,Motivo,Medico,Fecha\n';
  getHistorias().forEach(h => {
    csv += `"${h.pacienteNombre}","${h.pacienteDoc}","${h.motivo}","${h.medico}","${new Date(h.fechaCreacion).toLocaleDateString()}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pompeya_historias_' + new Date().toISOString().slice(0, 10) + '.csv';
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

// ========================================
// ESTADÍSTICAS Y REPORTES
// ========================================

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
    }).length,
    medicosMas: obtenerMedicosMasCitados(),
    motivosMas: obtenerMotivosMasFrecuentes()
  };
}

function obtenerMedicosMasCitados(limite = 5) {
  const medicos = {};
  getHistorias().forEach(h => {
    if (h.medico) {
      medicos[h.medico] = (medicos[h.medico] || 0) + 1;
    }
  });
  return Object.entries(medicos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }));
}

function obtenerMotivosMasFrecuentes(limite = 5) {
  const motivos = {};
  getHistorias().forEach(h => {
    if (h.motivo) {
      motivos[h.motivo] = (motivos[h.motivo] || 0) + 1;
    }
  });
  return Object.entries(motivos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }));
}

function reporteHistoriasPorMes() {
  const reporte = {};
  getHistorias().forEach(h => {
    const fecha = new Date(h.fechaCreacion);
    const mes = fecha.getFullYear() + '-' + String(fecha.getMonth() + 1).padStart(2, '0');
    reporte[mes] = (reporte[mes] || 0) + 1;
  });
  return reporte;
}

// ========================================
// ADMINISTRACIÓN - LIMPIAR BD
// ========================================

function limpiarBaseDatos() {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem(PAC_KEY);
  localStorage.removeItem('pompeya_doctores');
  localStorage.removeItem('pompeya_usuarios');
  localStorage.removeItem('pompeya_citas');
  localStorage.removeItem('pompeya_usuario_actual');
}

function vaciarHistorias() {
  localStorage.setItem(DB_KEY, '[]');
}

function vaciarPacientes() {
  localStorage.setItem(PAC_KEY, '[]');
}

function obtenerEstadoBD() {
  return {
    historias: getHistorias().length,
    pacientes: getPacientes().length,
    doctores: getDoctores().length,
    usuarios: getUsuarios().length,
    citas: getCitas().length
  };
}

// ========================================
// DOCTORES - CREAR
// ========================================

function crearDoctor(datos) {
  const doctores = getDoctores();
  const nuevo = {
    id: 'DOC-' + Date.now(),
    fechaRegistro: new Date().toISOString(),
    estado: true,
    ...datos
  };
  doctores.unshift(nuevo);
  saveDoctores(doctores);
  return nuevo;
}

// ========================================
// DOCTORES - LEER
// ========================================

function getDoctores() {
  try {
    return JSON.parse(localStorage.getItem('pompeya_doctores') || '[]');
  } catch { return []; }
}

function getDoctorById(id) {
  return getDoctores().find(d => d.id === id) || null;
}

function getDoctorByEmail(email) {
  return getDoctores().find(d => d.email === email) || null;
}

function getDoctoresActivos() {
  return getDoctores().filter(d => d.estado === true);
}

function buscarDoctores(query) {
  const q = query.toLowerCase().trim();
  if (!q) return getDoctores();
  return getDoctores().filter(d =>
    (d.nombre || '').toLowerCase().includes(q) ||
    (d.especialidad || '').toLowerCase().includes(q) ||
    (d.email || '').toLowerCase().includes(q) ||
    (d.telefono || '').toLowerCase().includes(q)
  );
}

// ========================================
// DOCTORES - ACTUALIZAR
// ========================================

function actualizarDoctor(id, datos) {
  const doctores = getDoctores();
  const idx = doctores.findIndex(d => d.id === id);
  if (idx === -1) return null;
  doctores[idx] = {
    ...doctores[idx],
    ...datos,
    id
  };
  saveDoctores(doctores);
  return doctores[idx];
}

// ========================================
// DOCTORES - ELIMINAR
// ========================================

function eliminarDoctor(id) {
  const doctores = getDoctores().filter(d => d.id !== id);
  saveDoctores(doctores);
  return true;
}

function desactivarDoctor(id) {
  return actualizarDoctor(id, { estado: false });
}

function activarDoctor(id) {
  return actualizarDoctor(id, { estado: true });
}

// ========================================
// ALMACENAMIENTO - GUARDAR DOCTORES
// ========================================

function saveDoctores(arr) {
  localStorage.setItem('pompeya_doctores', JSON.stringify(arr));
}

// ========================================
// USUARIOS - CREAR
// ========================================

function crearUsuario(datos) {
  const usuarios = getUsuarios();
  const existente = usuarios.find(u => u.email === datos.email);
  if (existente) return null;
  
  const nuevo = {
    id: 'USR-' + Date.now(),
    fechaRegistro: new Date().toISOString(),
    estado: true,
    rol: datos.rol || 'usuario',
    ...datos
  };
  usuarios.unshift(nuevo);
  saveUsuarios(usuarios);
  return nuevo;
}

// ========================================
// USUARIOS - LEER
// ========================================

function getUsuarios() {
  try {
    return JSON.parse(localStorage.getItem('pompeya_usuarios') || '[]');
  } catch { return []; }
}

function getUsuarioById(id) {
  return getUsuarios().find(u => u.id === id) || null;
}

function getUsuarioByEmail(email) {
  return getUsuarios().find(u => u.email === email) || null;
}

// ========================================
// USUARIOS - AUTENTICACIÓN
// ========================================

function autenticar(email, password) {
  const usuario = getUsuarioByEmail(email);
  if (!usuario || usuario.contraseña !== password || !usuario.estado) {
    return null;
  }
  localStorage.setItem('pompeya_usuario_actual', JSON.stringify(usuario));
  return usuario;
}

function obtenerUsuarioActual() {
  try {
    const user = localStorage.getItem('pompeya_usuario_actual');
    return user ? JSON.parse(user) : null;
  } catch { return null; }
}

function cerrarSesion() {
  localStorage.removeItem('pompeya_usuario_actual');
  return true;
}

function estaAutenticado() {
  return obtenerUsuarioActual() !== null;
}

function esDoctor() {
  const usuario = obtenerUsuarioActual();
  return usuario && usuario.rol === 'doctor';
}

function esAdmin() {
  const usuario = obtenerUsuarioActual();
  return usuario && usuario.rol === 'admin';
}

// ========================================
// USUARIOS - ACTUALIZAR
// ========================================

function actualizarUsuario(id, datos) {
  const usuarios = getUsuarios();
  const idx = usuarios.findIndex(u => u.id === id);
  if (idx === -1) return null;
  usuarios[idx] = {
    ...usuarios[idx],
    ...datos,
    id
  };
  saveUsuarios(usuarios);
  localStorage.setItem('pompeya_usuario_actual', JSON.stringify(usuarios[idx]));
  return usuarios[idx];
}

// ========================================
// USUARIOS - ELIMINAR
// ========================================

function eliminarUsuario(id) {
  const usuarios = getUsuarios().filter(u => u.id !== id);
  saveUsuarios(usuarios);
  return true;
}

function desactivarUsuario(id) {
  return actualizarUsuario(id, { estado: false });
}

// ========================================
// ALMACENAMIENTO - GUARDAR USUARIOS
// ========================================

function saveUsuarios(arr) {
  localStorage.setItem('pompeya_usuarios', JSON.stringify(arr));
}

// ========================================
// CITAS - CREAR
// ========================================

function crearCita(datos) {
  const citas = getCitas();
  const nueva = {
    id: 'CITA-' + Date.now(),
    fechaCreacion: new Date().toISOString(),
    estado: 'programada',
    ...datos
  };
  citas.unshift(nueva);
  saveCitas(citas);
  return nueva;
}

// ========================================
// CITAS - LEER
// ========================================

function getCitas() {
  try {
    return JSON.parse(localStorage.getItem('pompeya_citas') || '[]');
  } catch { return []; }
}

function getCitaById(id) {
  return getCitas().find(c => c.id === id) || null;
}

function getCitasPorDoctor(doctorId) {
  return getCitas().filter(c => c.doctorId === doctorId);
}

function getCitasPorPaciente(pacienteId) {
  return getCitas().filter(c => c.pacienteId === pacienteId);
}

function getCitasProximas(dias = 7) {
  const ahora = new Date();
  const limite = new Date(ahora.getTime() + dias * 24 * 60 * 60 * 1000);
  return getCitas().filter(c => {
    const fecha = new Date(c.fecha);
    return fecha >= ahora && fecha <= limite && c.estado !== 'cancelada';
  }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

function getCitasHoy() {
  const hoy = new Date().toDateString();
  return getCitas().filter(c => 
    new Date(c.fecha).toDateString() === hoy && c.estado !== 'cancelada'
  ).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

function getCitasPorFecha(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio).getTime();
  const fin = new Date(fechaFin).getTime();
  return getCitas().filter(c => {
    const fecha = new Date(c.fecha).getTime();
    return fecha >= inicio && fecha <= fin;
  });
}

// ========================================
// CITAS - ACTUALIZAR
// ========================================

function actualizarCita(id, datos) {
  const citas = getCitas();
  const idx = citas.findIndex(c => c.id === id);
  if (idx === -1) return null;
  citas[idx] = {
    ...citas[idx],
    ...datos,
    id
  };
  saveCitas(citas);
  return citas[idx];
}

// ========================================
// CITAS - ELIMINAR / CANCELAR
// ========================================

function eliminarCita(id) {
  const citas = getCitas().filter(c => c.id !== id);
  saveCitas(citas);
  return true;
}

function cancelarCita(id) {
  return actualizarCita(id, { estado: 'cancelada' });
}

function confirmarCita(id) {
  return actualizarCita(id, { estado: 'confirmada' });
}

function completarCita(id) {
  return actualizarCita(id, { estado: 'completada' });
}

// ========================================
// CITAS - BÚSQUEDA
// ========================================

function buscarCitas(query) {
  const q = query.toLowerCase().trim();
  if (!q) return getCitas();
  return getCitas().filter(c =>
    (c.pacienteNombre || '').toLowerCase().includes(q) ||
    (c.doctorNombre || '').toLowerCase().includes(q) ||
    (c.motivo || '').toLowerCase().includes(q)
  );
}

// ========================================
// ALMACENAMIENTO - GUARDAR CITAS
// ========================================

function saveCitas(arr) {
  localStorage.setItem('pompeya_citas', JSON.stringify(arr));
}

function reportePacientesRegistrados() {
  const reporte = {};
  getPacientes().forEach(p => {
    const fecha = new Date(p.fechaRegistro);
    const mes = fecha.getFullYear() + '-' + String(fecha.getMonth() + 1).padStart(2, '0');
    reporte[mes] = (reporte[mes] || 0) + 1;
  });
  return reporte;
}

// ========================================
// UTILIDADES DE LIMPIEZA Y SINCRONIZACIÓN
// ========================================

function limpiarBaseDatos() {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem(PAC_KEY);
  return true;
}

function vaciarHistorias() {
  localStorage.removeItem(DB_KEY);
  return true;
}

function vaciarPacientes() {
  localStorage.removeItem(PAC_KEY);
  return true;
}

// ========================================
// ASISTENCIA - NUEVO SISTEMA
// ========================================

const ASI_KEY = 'pompeya_asistencia';

function registrarAsistencia(citaId, estado = 'asistió') {
  const asistencias = getAsistencia();
  asistencias.push({
    id: 'ASI-' + Date.now(),
    citaId: citaId,
    estado: estado, // asistió, no-asistió, reprogramada
    fecha: new Date().toISOString(),
    notasAsistencia: ''
  });
  localStorage.setItem(ASI_KEY, JSON.stringify(asistencias));
  return asistencias[asistencias.length - 1];
}

function getAsistencia() {
  try {
    return JSON.parse(localStorage.getItem(ASI_KEY) || '[]');
  } catch { return []; }
}

function getAsistenciaByCita(citaId) {
  return getAsistencia().find(a => a.citaId === citaId) || null;
}

// ========================================
// CONFIGURACIÓN DEL SISTEMA
// ========================================

const CONFIG_KEY = 'pompeya_configuracion';

function obtenerConfiguracion() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
  } catch {
    return {
      nombreClinica: 'Clínica Pompeya',
      telefono: '(555) 123-4567',
      email: 'info@pompeya.local',
      direccion: 'Calle Principal 123',
      horariosAtencion: 'Lun-Vie 7am-6pm',
      diasLaborales: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
      duracionCitaMinutos: 30
    };
  }
}

function actualizarConfiguracion(config) {
  const actual = obtenerConfiguracion();
  const actualizada = { ...actual, ...config };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(actualizada));
  return actualizada;
}

// ========================================
// CITAS POR DOCTOR
// ========================================

function getCitasPorDoctorHoy(doctorId) {
  const hoy = new Date().toISOString().split('T')[0];
  return getCitasPorDoctor(doctorId).filter(c => 
    c.fecha.startsWith(hoy) && ['programada', 'confirmada'].includes(c.estado)
  );
}

function getCitasPorDoctorProximas(doctorId, dias = 7) {
  const hoy = new Date();
  const inicio = hoy.toISOString().split('T')[0];
  const fin = new Date(hoy.getTime() + dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return getCitasPorDoctor(doctorId).filter(c =>
    c.fecha >= inicio && c.fecha <= fin && ['programada', 'confirmada'].includes(c.estado)
  );
}

function completarCita(citaId, diagnostico = '', tratamiento = '') {
  const citas = getCitas();
  const cita = citas.find(c => c.id === citaId);
  if (cita) {
    cita.estado = 'completada';
    cita.diagnosticoFinal = diagnostico;
    cita.tratamientoFinal = tratamiento;
    cita.fechaCompletada = new Date().toISOString();
    saveCitas(citas);
    return cita;
  }
  return null;
}

// ========================================
// PACIENTES POR DOCTOR
// ========================================

function getPacientesPorDoctor(doctorId) {
  const citas = getCitasPorDoctor(doctorId);
  const pacienteIds = [...new Set(citas.map(c => c.pacienteId))];
  return pacienteIds.map(id => getPacienteById(id)).filter(p => p !== null);
}

// ========================================
// REPORTES AVANZADOS
// ========================================

function reporteCompleto() {
  const hoy = new Date();
  const inicio_mes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fin_mes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  
  return {
    fecha_generacion: new Date().toLocaleString('es-CO'),
    pacientes: {
      total: getPacientes().length,
      nuevos_mes: getPacientes().filter(p => new Date(p.fechaRegistro) >= inicio_mes).length
    },
    historias: {
      total: getHistorias().length,
      mes: getHistorias().filter(h => new Date(h.fechaCreacion) >= inicio_mes).length,
      hoy: getHistorias().filter(h => new Date(h.fechaCreacion).toDateString() === hoy.toDateString()).length
    },
    citas: {
      total: getCitas().length,
      hoy: getCitasHoy().length,
      proximas_7: getCitasProximas(7).length,
      confirmadas: getCitas().filter(c => c.estado === 'confirmada').length,
      completadas: getCitas().filter(c => c.estado === 'completada').length,
      canceladas: getCitas().filter(c => c.estado === 'cancelada').length
    },
    doctores: {
      total: getDoctores().length,
      activos: getDoctoresActivos().length,
      mas_citados: obtenerMedicosMasCitados(5)
    },
    usuarios: {
      total: getUsuarios().length,
      roles: {
        admin: getUsuarios().filter(u => u.rol === 'admin').length,
        doctor: getUsuarios().filter(u => u.rol === 'doctor').length,
        usuario: getUsuarios().filter(u => u.rol === 'usuario').length
      }
    }
  };
}

function reportePorDoctor(doctorId) {
  const citas = getCitasPorDoctor(doctorId);
  const pacientes = getPacientesPorDoctor(doctorId);
  const hoy = new Date();
  
  return {
    doctorId: doctorId,
    fecha_reporte: new Date().toLocaleString('es-CO'),
    total_citas: citas.length,
    citas_completadas: citas.filter(c => c.estado === 'completada').length,
    citas_pendientes: citas.filter(c => ['programada', 'confirmada'].includes(c.estado)).length,
    pacientes_atendidos: pacientes.length,
    citas_proximas: getCitasPorDoctorProximas(doctorId, 30),
    motivos_frecuentes: obtenerMotivosPorDoctor(doctorId)
  };
}

function obtenerMotivosPorDoctor(doctorId) {
  const citas = getCitasPorDoctor(doctorId);
  const motivos = {};
  citas.forEach(c => {
    motivos[c.motivo] = (motivos[c.motivo] || 0) + 1;
  });
  return Object.entries(motivos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([motivo, count]) => ({ motivo, count }));
}

// ========================================
// UTILIDADES DE LIMPIEZA Y SINCRONIZACIÓN
// ========================================

function sincronizarDatos() {
  // Verificar integridad de datos
  const historias = getHistorias();
  const pacientes = getPacientes();
  
  // Remover historias huérfanas (sin paciente válido)
  const historiasValidas = historias.filter(h => h.pacienteNombre && h.pacienteDoc);
  if (historiasValidas.length !== historias.length) {
    saveHistorias(historiasValidas);
  }
  
  return { historiasValidas: historiasValidas.length, pacientesValidos: pacientes.length };
}

function obtenerEstadoBD() {
  return {
    historias: getHistorias().length,
    pacientes: getPacientes().length,
    doctores: getDoctores().length,
    usuarios: getUsuarios().length,
    citas: getCitas().length,
    tamano: JSON.stringify(localStorage).length,
    ultimaActualizacion: new Date().toISOString()
  };
}

// ========================================
// FUNCIONES HELPER - BÚSQUEDAS
// ========================================

function getDoctorByEmail(email) {
  return getDoctores().find(d => d.email === email) || null;
}

// ========================================
// FUNCIONES HELPER - DATOS DE PRUEBA
// ========================================

function agregarDoctoresDePrueba() {
  if (getDoctores().length > 0) return;

  const doctores = [
    {
      nombre: 'Dr. Luis López',
      especialidad: 'Medicina General',
      cedula: '5555555555',
      email: 'luis@pompeya.local',
      telefono: '302 345 6789',
      horario: 'Lun-Vie 7am-3pm',
      estado: true
    },
    {
      nombre: 'Dra. María Martínez',
      especialidad: 'Pediatría',
      cedula: '0987654321',
      email: 'maria@pompeya.local',
      telefono: '301 234 5678',
      horario: 'Lun-Sab 9am-6pm',
      estado: true
    },
    {
      nombre: 'Dr. Carlos González',
      especialidad: 'Cardiología',
      cedula: '1234567890',
      email: 'carlos@pompeya.local',
      telefono: '300 123 4567',
      horario: 'Lun-Vie 8am-5pm',
      estado: true
    }
  ];

  doctores.forEach(d => crearDoctor(d));
}

function agregarCitasDePrueba() {
  if (getCitas().length > 0) return;

  const pacientes = getPacientes();
  const doctores = getDoctores();

  if (pacientes.length === 0 || doctores.length === 0) return;

  const mañana = new Date();
  mañana.setDate(mañana.getDate() + 1);

  crearCita({
    pacienteId: pacientes[0].id,
    pacienteNombre: pacientes[0].nombre,
    doctorId: doctores[0].id,
    doctorNombre: doctores[0].nombre,
    fecha: mañana.toISOString().split('T')[0],
    hora: '06:02',
    motivo: 'Revisión general',
    estado: 'programada'
  });
}

function agregarUsuariosDePrueba() {
  const existentes = getUsuarios().length;
  if (existentes === 0) {
    crearUsuario('admin@pompeya.local', 'admin123', 'Administrador', 'admin');
    crearUsuario('doctor@pompeya.local', 'doctor123', 'Dr. González', 'doctor');
    crearUsuario('recepcion@pompeya.local', 'recepcion123', 'Recepcionista', 'usuario');
  }
}