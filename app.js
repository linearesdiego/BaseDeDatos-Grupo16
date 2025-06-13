import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://apxgknwbpfnjllcdauig.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweGdrbndicGZuamxsY2RhdWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0Njc3NjAsImV4cCI6MjA2MjA0Mzc2MH0.18koBi7-s_RvPF7oDUu1v0480t6lRTItM1GzuvNRNNA"
);

// Variables globales
let currentStudentId = null;
const studentForm = document.getElementById("studentForm");
const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");
const resetBtn = document.getElementById("resetBtn");
const studentsTableBody = document.getElementById("studentsTableBody");
const queryHighAvgBtn = document.getElementById("queryHighAvgBtn");
const queryByCareerBtn = document.getElementById("queryByCareerBtn");
const queryJoinBtn = document.getElementById("queryJoinBtn");
const queryResults = document.getElementById("queryResults");

// Función para mostrar notificaciones
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Insertar al principio del contenedor
  const container = document.querySelector(".container");
  container.insertBefore(notification, container.firstChild);

  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Cargar estudiantes al iniciar la página
document.addEventListener("DOMContentLoaded", fetchStudents);

// Función para obtener todos los estudiantes
async function fetchStudents() {
  try {
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    renderStudentsTable(data);
  } catch (error) {
    console.error("Error al cargar estudiantes:", error);
    showNotification("Error al cargar estudiantes: " + error.message, "error");
  }
}

// Función para renderizar la tabla de estudiantes
function renderStudentsTable(students) {
  studentsTableBody.innerHTML = "";

  if (students.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      '<td colspan="7" style="text-align: center;">No hay estudiantes registrados</td>';
    studentsTableBody.appendChild(row);
    return;
  }

  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.nombre}</td>
            <td>${student.apellido}</td>
            <td>${student.edad}</td>
            <td>${student.carrera}</td>
            <td>${student.promedio}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${student.id}">Editar</button>
                <button class="action-btn delete-btn" data-id="${student.id}">Eliminar</button>
            </td>
        `;
    studentsTableBody.appendChild(row);
  });

  // Agregar event listeners a los botones de acción
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => editStudent(button.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => deleteStudent(button.dataset.id));
  });
}

// Función para guardar un nuevo estudiante
async function saveStudent(event) {
  event.preventDefault();

  const formData = new FormData(studentForm);
  const studentData = {
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    edad: Number.parseInt(formData.get("edad")),
    carrera: formData.get("carrera"),
    promedio: Number.parseFloat(formData.get("promedio")),
  };

  try {
    const { data, error } = await supabase
      .from("estudiantes")
      .insert([studentData])
      .select();

    if (error) throw error;

    showNotification("Estudiante guardado correctamente");
    studentForm.reset();
    fetchStudents();
  } catch (error) {
    console.error("Error al guardar estudiante:", error);
    showNotification("Error al guardar estudiante: " + error.message, "error");
  }
}

// Función para cargar datos de un estudiante para editar
async function editStudent(id) {
  try {
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    // Llenar el formulario con los datos
    document.getElementById("nombre").value = data.nombre;
    document.getElementById("apellido").value = data.apellido;
    document.getElementById("edad").value = data.edad;
    document.getElementById("carrera").value = data.carrera;
    document.getElementById("promedio").value = data.promedio;

    // Cambiar el estado de los botones
    saveBtn.disabled = true;
    updateBtn.disabled = false;

    // Guardar el ID del estudiante actual
    currentStudentId = id;
  } catch (error) {
    console.error("Error al cargar estudiante para editar:", error);
    showNotification("Error al cargar estudiante: " + error.message, "error");
  }
}

// Función para actualizar un estudiante
async function updateStudent() {
  if (!currentStudentId) return;

  const formData = new FormData(studentForm);
  const studentData = {
    nombre: formData.get("nombre"),
    apellido: formData.get("apellido"),
    edad: Number.parseInt(formData.get("edad")),
    carrera: formData.get("carrera"),
    promedio: Number.parseFloat(formData.get("promedio")),
  };

  try {
    const { data, error } = await supabase
      .from("estudiantes")
      .update(studentData)
      .eq("id", currentStudentId)
      .select();

    if (error) throw error;

    showNotification("Estudiante actualizado correctamente");
    resetForm();
    fetchStudents();
  } catch (error) {
    console.error("Error al actualizar estudiante:", error);
    showNotification(
      "Error al actualizar estudiante: " + error.message,
      "error"
    );
  }
}

// Función para eliminar un estudiante
async function deleteStudent(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este estudiante?")) return;

  try {
    const { error } = await supabase.from("estudiantes").delete().eq("id", id);

    if (error) throw error;

    showNotification("Estudiante eliminado correctamente");
    fetchStudents();

    // Si estábamos editando este estudiante, resetear el formulario
    if (currentStudentId === id) {
      resetForm();
    }
  } catch (error) {
    console.error("Error al eliminar estudiante:", error);
    showNotification("Error al eliminar estudiante: " + error.message, "error");
  }
}

// Función para resetear el formulario y el estado
function resetForm() {
  studentForm.reset();
  currentStudentId = null;
  saveBtn.disabled = false;
  updateBtn.disabled = true;
}

// Consulta: Estudiantes con promedio mayor a 8
async function queryHighAverage() {
  try {
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .gt("promedio", 8)
      .order("promedio", { ascending: false });

    if (error) throw error;

    displayQueryResults("Estudiantes con promedio mayor a 8", data);
  } catch (error) {
    console.error("Error en la consulta:", error);
    showNotification("Error en la consulta: " + error.message, "error");
  }
}

// Consulta: Agrupar estudiantes por carrera
async function queryByCareer() {
  try {
    // Supabase no soporta directamente GROUP BY, así que hacemos una consulta y agrupamos en el cliente
    const { data, error } = await supabase.from("estudiantes").select("*");

    if (error) throw error;

    // Agrupar por carrera
    const groupedByCareer = data.reduce((acc, student) => {
      if (!acc[student.carrera]) {
        acc[student.carrera] = [];
      }
      acc[student.carrera].push(student);
      return acc;
    }, {});

    // Calcular estadísticas por carrera
    const careerStats = Object.keys(groupedByCareer).map((career) => {
      const students = groupedByCareer[career];
      const count = students.length;
      const avgGrade = students.reduce((sum, s) => sum + s.promedio, 0) / count;

      return {
        carrera: career,
        cantidad: count,
        promedio_general: avgGrade.toFixed(2),
      };
    });

    displayQueryResults("Estudiantes agrupados por carrera", careerStats);
  } catch (error) {
    console.error("Error en la consulta:", error);
    showNotification("Error en la consulta: " + error.message, "error");
  }
}

// Consulta: JOIN con tabla de cursos
async function queryJoinCourses() {
  try {
    const { data, error } = await supabase.from("estudiantes").select(`
                id, 
                nombre, 
                apellido, 
                cursos (
                    id, 
                    nombre_curso, 
                    creditos
                )
            `);

    if (error) throw error;

    displayQueryResults("Estudiantes con sus cursos (JOIN)", data);
  } catch (error) {
    console.error("Error en la consulta JOIN:", error);
    showNotification("Error en la consulta: " + error.message, "error");
  }
}

// Función para mostrar resultados de consultas
function displayQueryResults(title, results) {
  let html = `<h3>${title}</h3>`;

  if (results.length === 0) {
    html += "<p>No se encontraron resultados</p>";
  } else {
    // Determinar si los resultados son objetos simples o complejos (con JOIN)
    const firstResult = results[0];
    const hasNestedData = firstResult.cursos !== undefined;

    if (hasNestedData) {
      // Formato para resultados con JOIN
      html += '<div class="nested-results">';
      results.forEach((student) => {
        html += `
                    <div class="student-card">
                        <h4>${student.nombre} ${student.apellido}</h4>
                        <p><strong>Cursos:</strong></p>
                        ${
                          student.cursos.length > 0
                            ? `<ul>${student.cursos
                                .map(
                                  (course) =>
                                    `<li>${course.nombre_curso} (${course.creditos} créditos)</li>`
                                )
                                .join("")}</ul>`
                            : "<p>No está inscrito en ningún curso</p>"
                        }
                    </div>
                `;
      });
      html += "</div>";
    } else {
      // Formato para resultados simples (tabla)
      html += '<table class="results-table"><thead><tr>';

      // Encabezados de tabla
      Object.keys(firstResult).forEach((key) => {
        html += `<th>${key}</th>`;
      });
      html += "</tr></thead><tbody>";

      // Filas de datos
      results.forEach((item) => {
        html += "<tr>";
        Object.values(item).forEach((value) => {
          html += `<td>${value}</td>`;
        });
        html += "</tr>";
      });

      html += "</tbody></table>";
    }
  }

  queryResults.innerHTML = html;
}

// Event Listeners
studentForm.addEventListener("submit", saveStudent);
updateBtn.addEventListener("click", updateStudent);
resetBtn.addEventListener("click", resetForm);
queryHighAvgBtn.addEventListener("click", queryHighAverage);
queryByCareerBtn.addEventListener("click", queryByCareer);
queryJoinBtn.addEventListener("click", queryJoinCourses);
