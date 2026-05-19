# 📋 Referencia Completa de Funciones
## Historias Clínicas Pompeya

---

## 1️⃣ FUNCIONES DE HISTORIAS CLÍNICAS

### Crear
- **`crearHistoria(datos)`** - Crea una nueva historia clínica
- **`agregarHistoriasDePrueba()`** - Agrega historias de prueba al sistema

### Leer / Obtener
- **`getHistorias()`** - Obtiene todas las historias
- **`getHistoriaById(id)`** - Obtiene una historia por ID
- **`getHistoriasPorPaciente(pacienteDoc)`** - Obtiene historias de un paciente
- **`getHistoriasPorMedico(medico)`** - Obtiene historias de un médico
- **`getHistoriasRecientes(limite)`** - Obtiene N historias recientes
- **`cargarHistoriaDetalle(id)`** - Carga y muestra detalles de una historia

### Actualizar
- **`actualizarHistoria(id, datos)`** - Actualiza una historia existente
- **`actualizarHistoriaUI(id, datos)`** - Actualiza y recarga la UI
- **`rellenarFormularioHistoria(historia)`** - Rellena un formulario con datos de una historia

### Eliminar
- **`eliminarHistoria(id)`** - Elimina una historia por ID
- **`eliminarHistoriaUI(id)`** - Elimina con confirmación y UI
- **`eliminarHistoriasPorPaciente(pacienteDoc)`** - Elimina todas las historias de un paciente

### Búsqueda y Filtrado
- **`buscarHistorias(query)`** - Busca historias por texto
- **`buscarHistoriasUI(query)`** - Busca y muestra resultados en UI
- **`filtrarHistoriasPorFecha(fechaInicio, fechaFin)`** - Filtra por rango de fechas
- **`filtrarHistoriasPorMotivo(motivo)`** - Filtra por motivo de consulta
- **`filtrarPorFecha(fecha)`** - Filtra historias de una fecha específica
- **`filtrarPorMes(mes, año)`** - Filtra historias de un mes específico

### Guardado Local
- **`saveHistorias(arr)`** - Guarda historias en localStorage
- **`guardarHistoria(datos)`** - Valida y guarda una nueva historia

---

## 2️⃣ FUNCIONES DE PACIENTES

### Crear / Actualizar
- **`upsertPaciente(datos)`** - Crea o actualiza un paciente
- **`guardarPaciente(datos)`** - Valida y guarda un paciente
- **`agregarPacientesDePrueba()`** - Agrega pacientes de prueba

### Leer / Obtener
- **`getPacientes()`** - Obtiene todos los pacientes
- **`getPacienteById(id)`** - Obtiene un paciente por ID
- **`getPacienteByDocumento(documento)`** - Obtiene un paciente por documento
- **`getPacientesRecientes(limite)`** - Obtiene N pacientes recientes
- **`cargarPacientes()`** - Carga y muestra lista de pacientes
- **`cargarPacienteDetalle(id)`** - Carga detalles de un paciente
- **`rellenarFormularioPaciente(paciente)`** - Rellena formulario con datos de paciente

### Actualizar
- **`actualizarPaciente(id, datos)`** - Actualiza datos de un paciente
- **`editarPaciente(id)`** - Abre formulario de edición

### Eliminar
- **`eliminarPaciente(id)`** - Elimina un paciente
- **`eliminarPacienteUI(id)`** - Elimina con confirmación
- **`eliminarPacienteByDocumento(documento)`** - Elimina por documento

### Búsqueda
- **`buscarPacientes(query)`** - Busca pacientes por texto
- **`buscarPacientesUI(query)`** - Busca y muestra resultados
- **`filtrarPacientesPorEdad(edadMin, edadMax)`** - Filtra por rango de edad

### Guardado
- **`savePacientes(arr)`** - Guarda pacientes en localStorage

---

## 3️⃣ FUNCIONES DE NAVEGACIÓN Y UI

### Dashboard
- **`cargarDashboard()`** - Inicializa y carga el dashboard
- **`cargarTablaRecientes()`** - Carga tabla de historias recientes

### Sidebar
- **`toggleSidebar()`** - Abre/cierra el sidebar
- **`cerrarSidebar()`** - Cierra el sidebar

### Modales y Alertas
- **`mostrarAlerta(mensaje, tipo)`** - Muestra alerta temporal (success/error)
- **`mostrarModal(titulo, mensaje, acciones)`** - Muestra modal con acciones

### Navegación de Formularios
- **`abrirFormularioHistoria()`** - Abre formulario de nueva historia
- **`abrirHistoria(id)`** - Abre detalle de una historia
- **`abrirFormularioPaciente()`** - Abre formulario de nuevo paciente
- **`abrirPaciente(id)`** - Abre detalle de un paciente

### Búsqueda en UI
- **`mostrarResultadosBusqueda(resultados, tipo)`** - Muestra resultados de búsqueda
- **`cargarSeccion(seccion)`** - Carga una sección específica

---

## 4️⃣ FUNCIONES DE UTILIDADES

### Formateo
- **`formatearFecha(fechaISO)`** - Formatea fecha a formato local
- **`formatearFechaHora(fechaISO)`** - Formatea fecha y hora

### Validación
- **`validarHistoria(datos)`** - Valida datos de historia
- **`validarPaciente(datos)`** - Valida datos de paciente
- **`validarEmail(email)`** - Valida formato de email
- **`validarDocumento(doc)`** - Valida documento de identidad

### Utilidades Generales
- **`obtenerParametroURL(parametro)`** - Obtiene parámetro de URL
- **`generarID()`** - Genera ID único
- **`capitalizar(texto)`** - Capitaliza primer carácter
- **`calcularEdad(fechaNacimiento)`** - Calcula edad desde fecha nacimiento

---

## 5️⃣ FUNCIONES DE EXPORTACIÓN E IMPORTACIÓN

### Exportar
- **`exportarDatos()`** - Exporta todos los datos como JSON
- **`exportarJSON()`** - Exporta archivo JSON de respaldo
- **`exportarJSON_CSV()`** - Exporta histórico en formato CSV

### Importar
- **`importarDatos(archivo)`** - Importa datos desde archivo
- **`importarJSON(jsonText)`** - Importa JSON de texto
- **`abrirDialogoImportar()`** - Abre diálogo para seleccionar archivo

---

## 6️⃣ FUNCIONES DE ESTADÍSTICAS Y REPORTES

### Estadísticas
- **`getStats()`** - Obtiene estadísticas generales del sistema
- **`obtenerMedicosMasCitados(limite)`** - Obtiene médicos más usados
- **`obtenerMotivosMasFrecuentes(limite)`** - Obtiene consultas más frecuentes

### Reportes
- **`reporteHistoriasPorMes()`** - Reporte de historias mensuales
- **`reportePacientesRegistrados()`** - Reporte de pacientes registrados
- **`obtenerEstadoBD()`** - Obtiene estado general de la BD

---

## 7️⃣ FUNCIONES DE ADMINISTRACIÓN Y LIMPIEZA

### Mantenimiento
- **`limpiarBaseDatos()`** - Elimina todos los datos
- **`vaciarHistorias()`** - Elimina solo las historias
- **`vaciarPacientes()`** - Elimina solo los pacientes
- **`sincronizarDatos()`** - Verifica integridad de datos

---

## 8️⃣ FUNCIONES DE INICIALIZACIÓN

- **`inicializarAplicacion()`** - Inicializa la app según página actual
- **`cargarSeccion(seccion)`** - Carga una sección del dashboard

---

## 📊 RESUMEN DE CONTEOS

| Categoría | Cantidad |
|-----------|----------|
| Historias | 23 funciones |
| Pacientes | 18 funciones |
| UI/Navegación | 12 funciones |
| Utilidades | 8 funciones |
| Exportación | 6 funciones |
| Estadísticas | 5 funciones |
| Administración | 4 funciones |
| Inicialización | 2 funciones |
| **TOTAL** | **78 funciones** |

---

## 🚀 EJEMPLOS DE USO

### Crear una historia
```javascript
const historia = crearHistoria({
  pacienteNombre: 'Juan Pérez',
  pacienteDoc: '1234567890',
  motivo: 'Consulta general',
  medico: 'Dr. López'
});
```

### Buscar historias
```javascript
const resultados = buscarHistorias('Juan');
buscarHistoriasUI('Juan');
```

### Exportar datos
```javascript
exportarDatos(); // Descarga JSON
exportarJSON_CSV(); // Descarga CSV
```

### Obtener estadísticas
```javascript
const stats = getStats();
console.log(stats.totalHistorias);
console.log(stats.historiasHoy);
console.log(stats.medicosMas);
```

### Filtrar historias
```javascript
const historiasEnero = filtrarPorMes(0, 2026);
const historiasHoy = filtrarPorFecha(new Date());
```

---

**✅ Todas las funciones están completamente implementadas y listas para usar.**
