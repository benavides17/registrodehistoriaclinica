// =============================================
// APP — Historias Clínicas Pompeya
// Lógica completa de la aplicación
// =============================================

// ========================================
// 1. DASHBOARD
// ========================================

function cargarDashboard() {
  const stats = getStats();
  document.getElementById('totalPacientes').textContent = stats.totalPacientes;
  document.getElementById('historiasHoy').textContent = stats.historiasHoy;
  document.getElementById('historiasmes').textContent = stats.historiasMes;
  document.getElementById('totalHistorias').textContent = stats.totalHistorias;
  cargarTablaRecientes();
}

function cargarTablaRecientes() {
  const historias = getHistorias().slice(0, 5);
  const tbody = document.getElementById('tbodyRecientes');
  
  if (historias.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No hay historias registradas aún. <a href="pages/nueva.html">Crear primera</a></td></tr>';
    return;
  }
  
  tbody.innerHTML = historias.map(h => `
    <tr>
      <td><strong>${h.pacienteNombre || '—'}</strong></td>
      <td>${formatearFecha(h.fechaCreacion)}</td>
      <td>${h.motivo || '—'}</td>
      <td>${h.medico || '—'}</td>
      <td>
        <a href="pages/ver.html?id=${h.id}" onclick="abrirHistoria('${h.id}')">Ver</a>
      </td>
    </tr>
  `).join('');
}

// ========================================
// 2. SIDEBAR
// ========================================

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

function cerrarSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.remove('open');
}

// ========================================
// 3. HISTORIAS CLÍNICAS
// ========================================

function abrirFormularioHistoria() {
  window.location.href = 'pages/nueva.html';
}

function abrirHistoria(id) {
  const historia = getHistoriaById(id);
  if (!historia) {
    mostrarAlerta('Historia no encontrada', 'error');
    return;
  }
  window.location.href = `pages/ver.html?id=${id}`;
}

function guardarHistoria(datos) {
  if (!validarHistoria(datos)) {
    mostrarAlerta('Por favor complete todos los campos requeridos', 'error');
    return false;
  }
  crearHistoria(datos);
  mostrarAlerta('Historia clínica creada exitosamente', 'success');
  setTimeout(() => window.location.href = 'index.html', 1500);
  return true;
}

function actualizarHistoriaUI(id, datos) {
  if (!validarHistoria(datos)) {
    mostrarAlerta('Por favor complete todos los campos requeridos', 'error');
    return false;
  }
  actualizarHistoria(id, datos);
  mostrarAlerta('Historia actualizada exitosamente', 'success');
  setTimeout(() => window.location.href = 'index.html', 1500);
  return true;
}

function eliminarHistoriaUI(id) {
  if (!confirm('¿Está seguro de que desea eliminar esta historia?')) return;
  eliminarHistoria(id);
  mostrarAlerta('Historia eliminada', 'success');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

function cargarHistoriaDetalle(id) {
  const historia = getHistoriaById(id);
  if (!historia) {
    document.body.innerHTML = '<p>Historia no encontrada</p>';
    return;
  }
  rellenarFormularioHistoria(historia);
}

function rellenarFormularioHistoria(historia) {
  const campos = ['pacienteNombre', 'pacienteDoc', 'motivo', 'medico', 'diagnostico', 'tratamiento'];
  campos.forEach(campo => {
    const elem = document.getElementById(campo);
    if (elem) elem.value = historia[campo] || '';
  });
  document.getElementById('idHistoria').value = historia.id;
}

function validarHistoria(datos) {
  return datos.pacienteNombre && datos.pacienteDoc && datos.motivo && datos.medico;
}

// ========================================
// 4. PACIENTES
// ========================================

function abrirFormularioPaciente() {
  window.location.href = 'pages/nuevo-paciente.html';
}

function abrirPaciente(id) {
  window.location.href = `pages/ver-paciente.html?id=${id}`;
}

function guardarPaciente(datos) {
  if (!validarPaciente(datos)) {
    mostrarAlerta('Por favor complete todos los campos requeridos', 'error');
    return false;
  }
  upsertPaciente(datos);
  mostrarAlerta('Paciente guardado exitosamente', 'success');
  setTimeout(() => window.location.href = 'pacientes.html', 1500);
  return true;
}

function eliminarPacienteUI(id) {
  if (!confirm('¿Está seguro de que desea eliminar este paciente?')) return;
  eliminarPaciente(id);
  mostrarAlerta('Paciente eliminado', 'success');
  setTimeout(() => window.location.href = 'pacientes.html', 1000);
}

function cargarPacientes() {
  const pacientes = getPacientes();
  const contenedor = document.getElementById('listaPacientes');
  if (!contenedor) return;
  
  if (pacientes.length === 0) {
    contenedor.innerHTML = '<p>No hay pacientes registrados. <a href="nuevo-paciente.html">Crear uno</a></p>';
    return;
  }
  
  contenedor.innerHTML = pacientes.map(p => `
    <div class="paciente-card">
      <div class="pac-avatar">${p.nombre.charAt(0).toUpperCase()}</div>
      <div class="pac-info">
        <div class="pac-name">${p.nombre}</div>
        <div class="pac-meta">${p.documento} • ${p.telefono || '—'}</div>
      </div>
      <div class="pac-actions">
        <button class="icon-btn" onclick="abrirPaciente('${p.id}')">👁️</button>
        <button class="icon-btn" onclick="editarPaciente('${p.id}')">✏️</button>
        <button class="icon-btn red" onclick="eliminarPacienteUI('${p.id}')">🗑️</button>
      </div>
    </div>
  `).join('');
}

function editarPaciente(id) {
  const paciente = getPacientes().find(p => p.id === id);
  if (!paciente) return;
  window.location.href = `nuevo-paciente.html?id=${id}`;
}

function cargarPacienteDetalle(id) {
  const paciente = getPacientes().find(p => p.id === id);
  if (!paciente) {
    document.body.innerHTML = '<p>Paciente no encontrado</p>';
    return;
  }
  rellenarFormularioPaciente(paciente);
}

function rellenarFormularioPaciente(paciente) {
  const campos = ['nombre', 'documento', 'telefono', 'email', 'direccion', 'fechaNacimiento'];
  campos.forEach(campo => {
    const elem = document.getElementById(campo);
    if (elem) elem.value = paciente[campo] || '';
  });
  document.getElementById('idPaciente').value = paciente.id;
}

function validarPaciente(datos) {
  return datos.nombre && datos.documento && datos.nombre.trim() && datos.documento.trim();
}

// ========================================
// 5. BÚSQUEDA
// ========================================

function buscarHistoriasUI(query) {
  const resultados = buscarHistorias(query);
  mostrarResultadosBusqueda(resultados, 'historias');
}

function buscarPacientesUI(query) {
  const resultados = buscarPacientes(query);
  mostrarResultadosBusqueda(resultados, 'pacientes');
}

function mostrarResultadosBusqueda(resultados, tipo) {
  const contenedor = document.getElementById('resultadosBusqueda');
  if (!contenedor) return;
  
  if (resultados.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron resultados</p>';
    return;
  }
  
  if (tipo === 'historias') {
    contenedor.innerHTML = resultados.map(h => `
      <div class="search-result">
        <strong>${h.pacienteNombre}</strong><br>
        ${h.motivo} • ${formatearFecha(h.fechaCreacion)}<br>
        <a href="ver.html?id=${h.id}">Ver detalles</a>
      </div>
    `).join('');
  } else {
    contenedor.innerHTML = resultados.map(p => `
      <div class="search-result">
        <strong>${p.nombre}</strong><br>
        ${p.documento} • ${p.telefono || '—'}<br>
        <a href="ver-paciente.html?id=${p.id}">Ver detalles</a>
      </div>
    `).join('');
  }
}

function filtrarPorFecha(fecha) {
  const historias = getHistorias().filter(h => {
    const hFecha = new Date(h.fechaCreacion).toDateString();
    return hFecha === new Date(fecha).toDateString();
  });
  return historias;
}

function filtrarPorMes(mes, año) {
  const historias = getHistorias().filter(h => {
    const d = new Date(h.fechaCreacion);
    return d.getMonth() === mes && d.getFullYear() === año;
  });
  return historias;
}

// ========================================
// 6. INTERFAZ DE USUARIO
// ========================================

function mostrarAlerta(mensaje, tipo = 'success') {
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo} show`;
  alerta.textContent = mensaje;
  
  const contenedor = document.body;
  contenedor.insertBefore(alerta, contenedor.firstChild);
  
  setTimeout(() => {
    alerta.classList.remove('show');
    setTimeout(() => alerta.remove(), 300);
  }, 3000);
}

function mostrarModal(titulo, mensaje, acciones = []) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <h3>${titulo}</h3>
    <p>${mensaje}</p>
    <div class="modal-actions">
      ${acciones.map(a => `<button class="btn btn-primary" onclick="${a.callback}">${a.texto}</button>`).join('')}
      <button class="btn btn-ghost" onclick="this.parentElement.parentElement.parentElement.remove()">Cerrar</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
}

function cargarSeccion(seccion) {
  document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
  const elem = document.getElementById(`seccion-${seccion}`);
  if (elem) elem.style.display = 'block';
}

// ========================================
// 7. UTILIDADES
// ========================================

function formatearFecha(fechaISO) {
  return new Date(fechaISO).toLocaleDateString('es-CO');
}

function formatearFechaHora(fechaISO) {
  return new Date(fechaISO).toLocaleString('es-CO');
}

function obtenerParametroURL(parametro) {
  const params = new URLSearchParams(window.location.search);
  return params.get(parametro);
}

function generarID() {
  return 'ID-' + Date.now() + Math.random().toString(36).substr(2, 9);
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarDocumento(doc) {
  return doc && doc.trim().length >= 5;
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// ========================================
// 8. EXPORTACIÓN E IMPORTACIÓN
// ========================================

function exportarDatos() {
  exportarJSON();
}

function importarDatos(archivo) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const contenido = e.target.result;
      if (importarJSON(contenido)) {
        mostrarAlerta('Datos importados exitosamente', 'success');
        setTimeout(() => location.reload(), 1500);
      } else {
        mostrarAlerta('Error al importar los datos', 'error');
      }
    } catch (err) {
      mostrarAlerta('Error al procesar el archivo', 'error');
    }
  };
  reader.readAsText(archivo);
}

function abrirDialogoImportar() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    if (e.target.files[0]) {
      importarDatos(e.target.files[0]);
    }
  };
  input.click();
}

// ========================================
// 9. DATOS DE PRUEBA
// ========================================

function agregarHistoriasDePrueba() {
  const historias = [
    { pacienteNombre: 'Juan García', pacienteDoc: '1234567890', motivo: 'Revisión general', medico: 'Dr. López', diagnostico: 'Buena salud', tratamiento: 'Ninguno' },
    { pacienteNombre: 'María Rodríguez', pacienteDoc: '0987654321', motivo: 'Consulta por dolor de cabeza', medico: 'Dra. Martínez', diagnostico: 'Migraña', tratamiento: 'Paracetamol' },
    { pacienteNombre: 'Carlos Pérez', pacienteDoc: '1111111111', motivo: 'Control de tensión', medico: 'Dr. López', diagnostico: 'Hipertensión leve', tratamiento: 'Losartán' },
    { pacienteNombre: 'Ana Silva', pacienteDoc: '2222222222', motivo: 'Análisis de sangre', medico: 'Dra. González', diagnostico: 'Anemia leve', tratamiento: 'Suplementos' },
    { pacienteNombre: 'Roberto Díaz', pacienteDoc: '3333333333', motivo: 'Revisión dental', medico: 'Dr. Sánchez', diagnostico: 'Caries', tratamiento: 'Empaste' }
  ];
  
  historias.forEach(h => crearHistoria(h));
  cargarDashboard();
  mostrarAlerta('Datos de prueba agregados', 'success');
}

function agregarPacientesDePrueba() {
  const pacientes = [
    { nombre: 'Juan García López', documento: '1234567890', telefono: '3001234567', email: 'juan@example.com', direccion: 'Calle 1 #1' },
    { nombre: 'María Rodríguez Pérez', documento: '0987654321', telefono: '3009876543', email: 'maria@example.com', direccion: 'Calle 2 #2' },
    { nombre: 'Carlos Pérez García', documento: '1111111111', telefono: '3005555555', email: 'carlos@example.com', direccion: 'Calle 3 #3' }
  ];
  
  pacientes.forEach(p => upsertPaciente(p));
  mostrarAlerta('Pacientes de prueba agregados', 'success');
}

function limpiarBaseDatos() {
  if (!confirm('¿Está seguro? Esta acción no se puede deshacer.')) return;
  localStorage.removeItem('pompeya_historias');
  localStorage.removeItem('pompeya_pacientes');
  mostrarAlerta('Base de datos limpiada', 'success');
  setTimeout(() => location.reload(), 1500);
}

// ========================================
// 10. USUARIOS Y AUTENTICACIÓN
// ========================================

function actualizarInfoUsuario() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return;

  const avatar = document.getElementById('userAvatar');
  const nombre = document.getElementById('userName');
  const rol = document.getElementById('userRole');

  if (avatar) avatar.textContent = usuario.email[0].toUpperCase();
  if (nombre) nombre.textContent = usuario.email.split('@')[0];
  if (rol) {
    const rolMap = { admin: 'Administrador', doctor: 'Doctor', usuario: 'Recepción' };
    rol.textContent = rolMap[usuario.rol] || usuario.rol;
  }
}

function cerrarSesionUI() {
  if (confirm('¿Está seguro de que desea cerrar sesión?')) {
    cerrarSesion();
    window.location.href = 'login.html';
  }
}

function actualizarFecha() {
  const fecha = document.getElementById('fecha');
  if (fecha) {
    fecha.textContent = new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

function guardarNuevoPaciente() {
  const nombre = document.getElementById('nombre').value;
  const documento = document.getElementById('documento').value;
  const fechaNacimiento = document.getElementById('fechaNacimiento').value;
  const sexo = document.getElementById('sexo').value;
  const email = document.getElementById('email').value;
  const telefono = document.getElementById('telefono').value;
  const direccion = document.getElementById('direccion').value;
  const tipoSangre = document.getElementById('tipoSangre').value;
  const alergias = document.getElementById('alergias').value;
  const antecedentes = document.getElementById('antecedentes').value;

  if (!nombre || !documento || !fechaNacimiento || !sexo || !email || !telefono || !direccion) {
    mostrarAlerta('⚠️ Completa todos los campos requeridos', 'error');
    return;
  }

  // Verificar documento duplicado
  const pacienteExistente = getPacienteByDocumento(documento);
  if (pacienteExistente) {
    mostrarAlerta('⚠️ Ya existe un paciente con este documento', 'error');
    return;
  }

  const paciente = {
    nombre,
    documento,
    fechaNacimiento,
    sexo,
    email,
    telefono,
    direccion,
    tipoSangre,
    alergias,
    antecedentes,
    fechaRegistro: new Date().toISOString()
  };

  upsertPaciente(paciente);
  mostrarAlerta('✅ Paciente registrado exitosamente', 'success');
  setTimeout(() => window.location.href = 'pacientes.html', 1500);
}

// ========================================
// 10. EVENTOS Y INICIALIZACIÓN
// ========================================

function inicializarAplicacion() {
  // Detectar página actual y cargar contenido apropiado
  const pagina = window.location.pathname.split('/').pop() || 'index.html';
  
  if (pagina === 'index.html' || pagina === 'index (2).html') {
    cargarDashboard();
  } else if (pagina === 'pacientes.html') {
    cargarPacientes();
  }
}

// Ejecutar inicialización al cargar la página
document.addEventListener('DOMContentLoaded', inicializarAplicacion);

// Cerrar sidebar al hacer clic en un link
document.addEventListener('click', (e) => {
  if (e.target.closest('a') && window.innerWidth <= 768) {
    cerrarSidebar();
  }
});

// ========================================
// 11. ASISTENCIA (NUEVO)
// ========================================

function mostrarCitasHoy() {
  const hoy = new Date().toISOString().split('T')[0];
  const filtro = document.getElementById('filtroFecha');
  if (filtro) filtro.value = hoy;
  cargarTablaAsistencia();
}

function mostrarCitasProximas() {
  const hoy = new Date();
  const proximos = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const filtro = document.getElementById('filtroFecha');
  if (filtro) filtro.value = proximos;
  cargarTablaAsistencia();
}

function cargarTablaAsistencia() {
  const fecha = document.getElementById('filtroFecha')?.value || new Date().toISOString().split('T')[0];
  const estado = document.getElementById('filtroEstado')?.value || 'Todos';
  
  let citas = getCitas().filter(c => {
    const citaFecha = c.fecha?.split('T')[0];
    return citaFecha === fecha;
  });
  
  if (estado !== 'Todos') {
    citas = citas.filter(c => c.estado === estado);
  }
  
  const tbody = document.getElementById('tbodyAsistencia');
  if (!tbody) return;
  
  if (citas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Sin citas para este día</td></tr>';
    actualizarResumenAsistencia([]);
    return;
  }
  
  tbody.innerHTML = citas.map(c => {
    const asistencia = getAsistenciaByCita(c.id);
    let asistenciaBadge = '<span style="color: #666;">Pendiente</span>';
    if (asistencia) {
      if (asistencia.estado === 'asistió') asistenciaBadge = '<span style="background: #1a7a3f; color: white; padding: 4px 8px; border-radius: 4px;">✓ Asistió</span>';
      else if (asistencia.estado === 'no-asistió') asistenciaBadge = '<span style="background: #8a2020; color: white; padding: 4px 8px; border-radius: 4px;">✕ No asistió</span>';
      else if (asistencia.estado === 'reprogramada') asistenciaBadge = '<span style="background: #7a3b8a; color: white; padding: 4px 8px; border-radius: 4px;">↻ Reprogramada</span>';
    }
    
    return `
      <tr>
        <td>${c.pacienteNombre || '—'}</td>
        <td>${c.doctorNombre || '—'}</td>
        <td>${c.hora || '—'}</td>
        <td>${c.motivo || '—'}</td>
        <td><span style="background: #e8f0f7; padding: 4px 8px; border-radius: 4px;">${c.estado}</span></td>
        <td>${asistenciaBadge}</td>
        <td>
          <button class="btn-icon" onclick="abrirRegistroAsistencia('${c.id}')" title="Registrar">✓</button>
        </td>
      </tr>
    `;
  }).join('');
  
  actualizarResumenAsistencia(citas);
}

function abrirRegistroAsistencia(citaId) {
  document.getElementById('asistenciaCitaId').value = citaId;
  document.getElementById('modalAsistencia').style.display = 'flex';
}

function cerrarModalAsistencia() {
  document.getElementById('modalAsistencia').style.display = 'none';
  document.getElementById('asistenciaEstado').value = 'asistió';
  document.getElementById('asistenciaNota').value = '';
}

function guardarAsistencia() {
  const citaId = document.getElementById('asistenciaCitaId').value;
  const estado = document.getElementById('asistenciaEstado').value;
  
  if (!citaId) {
    mostrarAlerta('Error: Cita no identificada', 'error');
    return;
  }
  
  registrarAsistencia(citaId, estado);
  mostrarAlerta(`✓ Asistencia registrada (${estado})`, 'success');
  cerrarModalAsistencia();
  cargarTablaAsistencia();
}

function actualizarResumenAsistencia(citas) {
  const asistencias = citas.map(c => getAsistenciaByCita(c.id)).filter(a => a);
  const resumen = {
    programadas: citas.length,
    asistieron: asistencias.filter(a => a.estado === 'asistió').length,
    noAsistieron: asistencias.filter(a => a.estado === 'no-asistió').length,
    reprogramadas: asistencias.filter(a => a.estado === 'reprogramada').length
  };
  
  document.getElementById('resumenProgramadas').textContent = resumen.programadas;
  document.getElementById('resumenAsistieron').textContent = resumen.asistieron;
  document.getElementById('resumenNoAsistieron').textContent = resumen.noAsistieron;
  document.getElementById('resumenReprogramadas').textContent = resumen.reprogramadas;
}

// ========================================
// 12. DOCTORES (COMPLETAR)
// ========================================

function cargarDoctores() {
  const doctores = getDoctores();
  const lista = document.getElementById('listaDoctores');
  if (!lista) return;
  
  if (doctores.length === 0) {
    lista.innerHTML = '<p style="grid-column: 1/-1; color: #8a8680;">No hay doctores registrados. <a href="#" onclick="abrirFormularioDoctor(); return false;">Crear uno</a></p>';
    return;
  }
  
  lista.innerHTML = doctores.map(d => `
    <div class="doctor-card">
      <div class="doctor-avatar">${d.nombre[0].toUpperCase()}</div>
      <h3>${d.nombre}</h3>
      <p class="doctor-specialty">${d.especialidad}</p>
      <p class="doctor-email">📧 ${d.email}</p>
      <p class="doctor-phone">📱 ${d.telefono}</p>
      <p class="doctor-cedula">Cédula: ${d.cedula || '—'}</p>
      <p class="doctor-horario">Horario: ${d.horario || '—'}</p>
      <div class="status-badge" style="background: ${d.estado ? '#1a7a3f' : '#8a8680'}; color: white;">
        ${d.estado ? 'Activo' : 'Inactivo'}
      </div>
      <div class="doctor-actions" style="display: flex; gap: 8px; margin-top: 10px;">
        <button class="btn btn-secondary" style="flex: 1;" onclick="editarDoctor('${d.id}')">✏️ Editar</button>
        <button class="btn ${d.estado ? 'btn-warning' : 'btn-success'}" style="flex: 1;" onclick="toggleEstadoDoctor('${d.id}')">
          ${d.estado ? '🔒 Deactivar' : '🔓 Activar'}
        </button>
        <button class="btn btn-danger" style="flex: 1;" onclick="eliminarDoctorUI('${d.id}')">🗑️ Eliminar</button>
      </div>
    </div>
  `).join('');
}

function abrirFormularioDoctor() {
  document.getElementById('modalDoctor').style.display = 'flex';
  document.getElementById('formDoctor').reset();
  document.getElementById('idDoctor').value = '';
}

function cerrarFormularioDoctor() {
  document.getElementById('modalDoctor').style.display = 'none';
}

function guardarFormularioDoctor() {
  const id = document.getElementById('idDoctor').value;
  const doctor = {
    nombre: document.getElementById('nombreDoctor').value,
    especialidad: document.getElementById('especialidadDoctor').value,
    email: document.getElementById('emailDoctor').value,
    telefono: document.getElementById('telefonoDoctor').value,
    cedula: document.getElementById('cedulaDoctor').value,
    horario: document.getElementById('horarioDoctor').value
  };
  
  if (!doctor.nombre || !doctor.email || !doctor.especialidad) {
    mostrarAlerta('⚠️ Completa los campos requeridos', 'error');
    return;
  }
  
  if (id) {
    actualizarDoctor(id, doctor);
    mostrarAlerta('✅ Doctor actualizado', 'success');
  } else {
    crearDoctor(doctor);
    mostrarAlerta('✅ Doctor creado', 'success');
  }
  
  cerrarFormularioDoctor();
  cargarDoctores();
}

function editarDoctor(id) {
  const doctor = getDoctorById(id);
  if (!doctor) return;
  
  document.getElementById('idDoctor').value = id;
  document.getElementById('nombreDoctor').value = doctor.nombre;
  document.getElementById('especialidadDoctor').value = doctor.especialidad;
  document.getElementById('emailDoctor').value = doctor.email;
  document.getElementById('telefonoDoctor').value = doctor.telefono || '';
  document.getElementById('cedulaDoctor').value = doctor.cedula || '';
  document.getElementById('horarioDoctor').value = doctor.horario || '';
  
  abrirFormularioDoctor();
}

function toggleEstadoDoctor(id) {
  const doctor = getDoctorById(id);
  if (!doctor) return;
  
  if (doctor.estado) {
    desactivarDoctor(id);
    mostrarAlerta('❌ Doctor desactivado', 'success');
  } else {
    activarDoctor(id);
    mostrarAlerta('✅ Doctor activado', 'success');
  }
  
  cargarDoctores();
}

function eliminarDoctorUI(id) {
  if (!confirm('¿Está seguro de eliminar este doctor?')) return;
  eliminarDoctor(id);
  mostrarAlerta('✓ Doctor eliminado', 'success');
  cargarDoctores();
}

// ========================================
// 13. CITAS (COMPLETAR)
// ========================================

function cargarCitas() {
  const citas = getCitas();
  const lista = document.getElementById('listaCitas');
  if (!lista) return;
  
  if (citas.length === 0) {
    lista.innerHTML = '<p>No hay citas registradas. <a href="#" onclick="abrirFormularioCita()">Crear una</a></p>';
    return;
  }
  
  lista.innerHTML = citas.map(c => `
    <tr>
      <td>${c.pacienteNombre || '—'}</td>
      <td>${c.doctorNombre || '—'}</td>
      <td>${c.fecha || '—'} ${c.hora || '—'}</td>
      <td>${c.motivo || '—'}</td>
      <td><span style="background: #e8f0f7; padding: 4px 8px; border-radius: 4px;">${c.estado}</span></td>
      <td>
        <button class="btn btn-secondary" style="font-size: 12px;" onclick="editarCita('${c.id}')">✏️</button>
        <button class="btn btn-danger" style="font-size: 12px;" onclick="eliminarCitaUI('${c.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function abrirFormularioCita() {
  document.getElementById('modalCita').style.display = 'flex';
  document.getElementById('formCita').reset();
  document.getElementById('idCita').value = '';
}

function cerrarFormularioCita() {
  document.getElementById('modalCita').style.display = 'none';
}

function guardarFormularioCita() {
  const id = document.getElementById('idCita').value;
  const cita = {
    pacienteNombre: document.getElementById('pacienteCita').value,
    pacienteId: document.getElementById('pacienteIdCita').value,
    doctorNombre: document.getElementById('doctorCita').value,
    doctorId: document.getElementById('doctorIdCita').value,
    fecha: document.getElementById('fechaCita').value,
    hora: document.getElementById('horaCita').value,
    motivo: document.getElementById('motivoCita').value,
    estado: document.getElementById('estadoCita').value || 'programada'
  };
  
  if (!cita.pacienteNombre || !cita.doctorNombre || !cita.fecha || !cita.hora) {
    mostrarAlerta('⚠️ Completa todos los campos', 'error');
    return;
  }
  
  if (id) {
    actualizarCita(id, cita);
    mostrarAlerta('✅ Cita actualizada', 'success');
  } else {
    crearCita(cita);
    mostrarAlerta('✅ Cita creada', 'success');
  }
  
  cerrarFormularioCita();
  cargarCitas();
}

function editarCita(id) {
  const cita = getCitaById(id);
  if (!cita) return;
  
  document.getElementById('idCita').value = id;
  document.getElementById('pacienteCita').value = cita.pacienteNombre;
  document.getElementById('pacienteIdCita').value = cita.pacienteId || '';
  document.getElementById('doctorCita').value = cita.doctorNombre;
  document.getElementById('doctorIdCita').value = cita.doctorId || '';
  document.getElementById('fechaCita').value = cita.fecha;
  document.getElementById('horaCita').value = cita.hora;
  document.getElementById('motivoCita').value = cita.motivo || '';
  document.getElementById('estadoCita').value = cita.estado || 'programada';
  
  abrirFormularioCita();
}

function eliminarCitaUI(id) {
  if (!confirm('¿Está seguro de eliminar esta cita?')) return;
  eliminarCita(id);
  mostrarAlerta('✓ Cita eliminada', 'success');
  cargarCitas();
}

function cancelarCitaUI(id) {
  if (!confirm('¿Cancelar esta cita?')) return;
  cancelarCita(id);
  mostrarAlerta('✓ Cita cancelada', 'success');
  cargarTabla();
}

// ========================================
// 14. MIS CITAS (DOCTOR)
// ========================================

function cargarMisCitas() {
  const usuario = obtenerUsuarioActual();
  const citas = getCitasPorDoctorHoy(usuario.id);
  const proximas = getCitasPorDoctorProximas(usuario.id, 7);
  
  document.getElementById('citasHoyCount').textContent = citas.length;
  document.getElementById('proximasCount').textContent = proximas.length;
  
  // Cargar citas de hoy
  const citasHoyDiv = document.getElementById('citasHoy');
  if (citasHoyDiv) {
    citasHoyDiv.innerHTML = citas.map(c => `
      <div class="cita-card">
        <h4>${c.pacienteNombre}</h4>
        <p>Hora: ${c.hora}</p>
        <p>Motivo: ${c.motivo}</p>
        <button class="btn btn-small" onclick="abrirRegistro('${c.id}')">Registrar Atención</button>
      </div>
    `).join('') || '<p>Sin citas para hoy</p>';
  }
  
  // Cargar próximas citas
  const proximasDiv = document.getElementById('proximas');
  if (proximasDiv) {
    const tbody = proximasDiv.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = proximas.map(c => `
        <tr>
          <td>${c.pacienteNombre}</td>
          <td>${formatearFecha(c.fecha)} ${c.hora}</td>
          <td>${c.motivo}</td>
          <td>${c.estado}</td>
          <td>
            <button class="btn-icon" onclick="abrirRegistro('${c.id}')">✓</button>
            <button class="btn-icon danger" onclick="cancelarCitaUI('${c.id}')">✕</button>
          </td>
        </tr>
      `).join('');
    }
  }
}

function abrirRegistro(citaId) {
  document.getElementById('registroCitaId').value = citaId;
  document.getElementById('modalRegistrar').style.display = 'flex';
}

function cerrarModalRegistrar() {
  document.getElementById('modalRegistrar').style.display = 'none';
}

function guardarRegistroAtencion() {
  const citaId = document.getElementById('registroCitaId').value;
  const diagnostico = document.getElementById('registroDiagnostico').value;
  const tratamiento = document.getElementById('registroTratamiento').value;
  
  if (!diagnostico || !tratamiento) {
    mostrarAlerta('⚠️ Completa diagnóstico y tratamiento', 'error');
    return;
  }
  
  completarCita(citaId, diagnostico, tratamiento);
  mostrarAlerta('✅ Cita completada', 'success');
  cerrarModalRegistrar();
  cargarMisCitas();
}

// ========================================
// 15. MIS PACIENTES (DOCTOR)
// ========================================

function cargarMisPacientes() {
  const usuario = obtenerUsuarioActual();
  const pacientes = getPacientesPorDoctor(usuario.id);
  
  const lista = document.getElementById('misPacientesGrid');
  if (!lista) return;
  
  lista.innerHTML = pacientes.map(p => `
    <div class="paciente-card">
      <div class="pac-avatar">${p.nombre[0].toUpperCase()}</div>
      <div class="pac-info">
        <h4>${p.nombre}</h4>
        <p>📋 ${p.documento}</p>
        <p>📱 ${p.telefono || '—'}</p>
        <p>🩸 ${p.tipoSangre || '—'}</p>
      </div>
      <button class="btn btn-small" onclick="verHistorialPaciente('${p.id}', '${p.nombre}')">Ver Historial</button>
    </div>
  `).join('') || '<p style="grid-column: 1/-1;">Sin pacientes registrados aún</p>';
}

function verHistorialPaciente(pacienteId, nombrePaciente) {
  const historias = getHistoriasPorPaciente(pacienteId);
  const citas = getCitasPorPaciente(pacienteId);
  
  let contenido = `<h4>${nombrePaciente}</h4>`;
  contenido += '<h5>Historias Clínicas:</h5>';
  contenido += historias.map(h => `<p>• ${h.motivo} - ${formatearFecha(h.fechaCreacion)}</p>`).join('');
  contenido += '<h5>Citas:</h5>';
  contenido += citas.map(c => `<p>• ${c.motivo} - ${c.fecha} ${c.hora}</p>`).join('');
  
  document.getElementById('historialContent').innerHTML = contenido;
  document.getElementById('modalHistorial').style.display = 'flex';
}

function cerrarModalHistorial() {
  document.getElementById('modalHistorial').style.display = 'none';
}

// ========================================
// 16. MI PERFIL (DOCTOR)
// ========================================

function cargarMiPerfil() {
  const usuario = obtenerUsuarioActual();
  const doctor = getDoctorByEmail(usuario.email);
  
  if (doctor) {
    document.getElementById('perfilNombre').textContent = doctor.nombre;
    document.getElementById('perfilEspecialidad').textContent = doctor.especialidad;
    document.getElementById('perfilCedula').textContent = doctor.cedula || '—';
    document.getElementById('perfilEmail').textContent = doctor.email;
    document.getElementById('perfilTelefono').textContent = doctor.telefono;
    document.getElementById('perfilHorario').textContent = doctor.horario || '—';
  }
  
  const pacientes = getPacientesPorDoctor(usuario.id);
  const citas = getCitasPorDoctor(usuario.id);
  const completadas = citas.filter(c => c.estado === 'completada');
  
  document.getElementById('perfilPacientes').textContent = pacientes.length;
  document.getElementById('perfilCitas').textContent = citas.length;
  document.getElementById('perfilCompletadas').textContent = completadas.length;
}

function abrirEditarHorario() {
  document.getElementById('modalHorario').style.display = 'flex';
  const usuario = obtenerUsuarioActual();
  const doctor = getDoctorByEmail(usuario.email);
  if (doctor) {
    document.getElementById('horarioInput').value = doctor.horario || '';
  }
}

function cerrarModalHorario() {
  document.getElementById('modalHorario').style.display = 'none';
}

function guardarHorario() {
  const horario = document.getElementById('horarioInput').value;
  const usuario = obtenerUsuarioActual();
  const doctor = getDoctorByEmail(usuario.email);
  
  if (doctor) {
    actualizarDoctor(doctor.id, { ...doctor, horario });
    mostrarAlerta('✅ Horario actualizado', 'success');
    cerrarModalHorario();
    cargarMiPerfil();
  }
}

function cambiarContraseña() {
  const actual = document.getElementById('passwordActual').value;
  const nueva = document.getElementById('passwordNueva').value;
  const confirmar = document.getElementById('passwordConfirmar').value;
  
  if (!actual || !nueva || !confirmar) {
    mostrarAlerta('⚠️ Completa todos los campos', 'error');
    return;
  }
  
  if (nueva !== confirmar) {
    mostrarAlerta('⚠️ Las contraseñas no coinciden', 'error');
    return;
  }
  
  const usuario = obtenerUsuarioActual();
  if (usuario.password !== actual) {
    mostrarAlerta('⚠️ Contraseña actual incorrecta', 'error');
    return;
  }
  
  usuario.password = nueva;
  actualizarUsuario(usuario.id, usuario);
  mostrarAlerta('✅ Contraseña actualizada', 'success');
  document.getElementById('passwordActual').value = '';
  document.getElementById('passwordNueva').value = '';
  document.getElementById('passwordConfirmar').value = '';
}

// ========================================
// 17. USUARIOS (ADMIN)
// ========================================

function cargarUsuarios() {
  const usuarios = getUsuarios();
  const grid = document.getElementById('usuariosGrid');
  if (!grid) return;
  
  if (usuarios.length === 0) {
    grid.innerHTML = '<p class="empty-state">No hay usuarios. <a href="#" onclick="agregarUsuariosDePrueba()">Crear pruebas</a></p>';
    return;
  }
  
  grid.innerHTML = usuarios.map(u => {
    const rolColor = u.rol === 'admin' ? '#8a2020' : u.rol === 'doctor' ? '#1a5c8a' : '#1a7a3f';
    return `
      <div class="user-card">
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="width: 40px; height: 40px; background: ${rolColor}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
            ${u.email[0].toUpperCase()}
          </div>
          <div style="flex: 1;">
            <h4>${u.nombreCompleto || u.email}</h4>
            <p style="margin: 2px 0; color: #666; font-size: 12px;">${u.email}</p>
            <span style="background: ${rolColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">
              ${u.rol.toUpperCase()}
            </span>
            <span style="background: ${u.estado ? '#e8f5e9' : '#ffebee'}; color: ${u.estado ? '#1a7a3f' : '#8a2020'}; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-left: 5px;">
              ${u.estado ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        <div style="display: flex; gap: 5px; margin-top: 10px;">
          <button class="btn-icon" onclick="editarUsuario('${u.id}')" title="Editar">✏️</button>
          <button class="btn-icon" onclick="toggleUsuarioEstado('${u.id}')" title="Activar/Desactivar">
            ${u.estado ? '🔒' : '🔓'}
          </button>
          <button class="btn-icon danger" onclick="eliminarUsuarioUI('${u.id}')" title="Eliminar">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function abrirFormularioUsuario() {
  document.getElementById('modalUsuario').style.display = 'flex';
  document.getElementById('formUsuario').reset();
  document.getElementById('idUsuario').value = '';
}

function cerrarModalUsuario() {
  document.getElementById('modalUsuario').style.display = 'none';
}

function guardarFormularioUsuario() {
  const id = document.getElementById('idUsuario').value;
  const usuario = {
    email: document.getElementById('emailUsuario').value,
    password: document.getElementById('passwordUsuario').value,
    nombreCompleto: document.getElementById('nombreUsuario').value,
    rol: document.getElementById('rolUsuario').value
  };
  
  if (!usuario.email || !usuario.password || !usuario.rol) {
    mostrarAlerta('⚠️ Completa los campos requeridos', 'error');
    return;
  }
  
  if (id) {
    actualizarUsuario(id, usuario);
    mostrarAlerta('✅ Usuario actualizado', 'success');
  } else {
    crearUsuario(usuario);
    mostrarAlerta('✅ Usuario creado', 'success');
  }
  
  cerrarModalUsuario();
  cargarUsuarios();
}

function editarUsuario(id) {
  const usuario = getUsuarioById(id);
  if (!usuario) return;
  
  document.getElementById('idUsuario').value = id;
  document.getElementById('emailUsuario').value = usuario.email;
  document.getElementById('passwordUsuario').value = usuario.password;
  document.getElementById('nombreUsuario').value = usuario.nombreCompleto || '';
  document.getElementById('rolUsuario').value = usuario.rol;
  
  abrirFormularioUsuario();
}

function toggleUsuarioEstado(id) {
  const usuario = getUsuarioById(id);
  if (!usuario) return;
  
  usuario.estado = !usuario.estado;
  actualizarUsuario(id, usuario);
  mostrarAlerta(usuario.estado ? '✅ Usuario activado' : '❌ Usuario desactivado', 'success');
  cargarUsuarios();
}

function eliminarUsuarioUI(id) {
  if (!confirm('¿Está seguro de eliminar este usuario?')) return;
  eliminarUsuario(id);
  mostrarAlerta('✓ Usuario eliminado', 'success');
  cargarUsuarios();
}

// ========================================
// 18. CONFIGURACIÓN (ADMIN)
// ========================================

function cargarConfiguracion() {
  const config = obtenerConfiguracion();
  
  document.getElementById('nombreClinica').value = config.nombreClinica || '';
  document.getElementById('emailClinica').value = config.email || '';
  document.getElementById('telefonoClinica').value = config.telefono || '';
  document.getElementById('direccionClinica').value = config.direccion || '';
  document.getElementById('horariosAtencion').value = config.horariosAtencion || '';
  
  document.getElementById('duracionCita').value = config.duracionCitaMinutos || 30;
  
  actualizarEstadoSistema();
}

function guardarConfiguracionClinica() {
  const config = {
    nombreClinica: document.getElementById('nombreClinica').value,
    email: document.getElementById('emailClinica').value,
    telefono: document.getElementById('telefonoClinica').value,
    direccion: document.getElementById('direccionClinica').value,
    horariosAtencion: document.getElementById('horariosAtencion').value
  };
  
  const configActual = obtenerConfiguracion();
  actualizarConfiguracion({...configActual, ...config});
  mostrarAlerta('✅ Información de clínica actualizada', 'success');
}

function guardarConfiguracionCitas() {
  const duracion = parseInt(document.getElementById('duracionCita').value);
  
  const config = obtenerConfiguracion();
  actualizarConfiguracion({...config, duracionCitaMinutos: duracion});
  mostrarAlerta('✅ Configuración de citas actualizada', 'success');
}

function exportarTodoJSON() {
  const backup = {
    timestamp: new Date().toISOString(),
    historias: getHistorias(),
    pacientes: getPacientes(),
    doctores: getDoctores(),
    usuarios: getUsuarios(),
    citas: getCitas(),
    asistencia: getAsistencia(),
    configuracion: obtenerConfiguracion()
  };
  
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  mostrarAlerta('✅ Exportación completada', 'success');
}

function exportarTodoCSV() {
  let csv = 'Historias Clínicas\\n';
  const historias = getHistorias();
  csv += 'Paciente,Fecha,Motivo,Médico,Diagnóstico\\n';
  historias.forEach(h => {
    csv += `"${h.pacienteNombre}","${h.fechaCreacion}","${h.motivo}","${h.medico}","${h.diagnostico}"\\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  mostrarAlerta('✅ Exportación CSV completada', 'success');
}

function respaldarBaseDatos() {
  exportarTodoJSON();
}

function limpiarHistorias() {
  if (!confirm('¿Está SEGURO? Eliminará TODAS las historias.')) return;
  vaciarHistorias();
  mostrarAlerta('🗑️ Todas las historias han sido eliminadas', 'success');
  actualizarEstadoSistema();
}

function limpiarPacientes() {
  if (!confirm('¿Está SEGURO? Eliminará TODOS los pacientes.')) return;
  vaciarPacientes();
  mostrarAlerta('🗑️ Todos los pacientes han sido eliminados', 'success');
  actualizarEstadoSistema();
}

function limpiarTodoSistema() {
  if (!confirm('⚠️ ADVERTENCIA: Esto eliminará TODA la base de datos. ¿Está completamente seguro?')) return;
  if (!confirm('Esta acción NO se puede deshacer. ¿Realmente desea continuar?')) return;
  
  limpiarBaseDatos();
  mostrarAlerta('🗑️ Base de datos completamente limpiada', 'success');
  setTimeout(() => location.reload(), 1500);
}

function actualizarEstadoSistema() {
  const estado = obtenerEstadoBD();
  document.getElementById('estadoHistorias').textContent = estado.historias || 0;
  document.getElementById('estadoPacientes').textContent = estado.pacientes || 0;
  document.getElementById('estadoDoctores').textContent = estado.doctores || 0;
  document.getElementById('estadoUsuarios').textContent = estado.usuarios || 0;
  document.getElementById('estadoCitas').textContent = estado.citas || 0;
  
  const espacioKB = (new Blob(Object.values(localStorage)).size / 1024).toFixed(2);
  document.getElementById('espacioUsado').textContent = espacioKB;
}

// ========================================
// 19. BÚSQUEDA GLOBAL
// ========================================

function buscarGlobal() {
  const query = document.getElementById('queryBusqueda').value;
  if (!query) {
    mostrarAlerta('Ingresa un término de búsqueda', 'warning');
    return;
  }
  
  const historias = buscarHistorias(query);
  const pacientes = buscarPacientes(query);
  const citas = buscarCitas(query);
  
  let html = '<h3>Resultados:</h3>';
  
  if (historias.length > 0) {
    html += '<h4>Historias Clínicas:</h4>';
    historias.forEach(h => {
      html += `<p><strong>${h.pacienteNombre}</strong> - ${h.motivo} (<a href="ver.html?id=${h.id}">Ver</a>)</p>`;
    });
  }
  
  if (pacientes.length > 0) {
    html += '<h4>Pacientes:</h4>';
    pacientes.forEach(p => {
      html += `<p><strong>${p.nombre}</strong> - ${p.documento}</p>`;
    });
  }
  
  if (citas.length > 0) {
    html += '<h4>Citas:</h4>';
    citas.forEach(c => {
      html += `<p>${c.pacienteNombre} con ${c.doctorNombre} - ${c.fecha}</p>`;
    });
  }
  
  if (historias.length === 0 && pacientes.length === 0 && citas.length === 0) {
    html = '<p>No se encontraron resultados</p>';
  }
  
  document.getElementById('resultadosBusqueda').innerHTML = html;
}

// ========================================
// 20. NUEVA HISTORIA (FORMULARIO)
// ========================================

function guardarFormulario() {
  const datos = {
    pacienteNombre: document.getElementById('pacienteNombre')?.value,
    pacienteDoc: document.getElementById('pacienteDoc')?.value,
    motivo: document.getElementById('motivo')?.value,
    medico: document.getElementById('medico')?.value,
    diagnostico: document.getElementById('diagnostico')?.value,
    tratamiento: document.getElementById('tratamiento')?.value
  };
  
  guardarHistoria(datos);
}
