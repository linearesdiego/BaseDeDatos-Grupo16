import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { API_KEY, SUPABASE_URL } from "./config.js";

const supabase = createClient(SUPABASE_URL, API_KEY);

document.addEventListener("DOMContentLoaded", fetchStudents);
document.addEventListener("DOMContentLoaded", fetchCursos);
document.addEventListener("DOMContentLoaded", fetchStudents_cursos);

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
  }
}

async function fetchCursos() {
  try {
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    renderCursosTable(data);
  } catch (error) {
    console.error("Error al cargar cursos:", error);
  }
}

async function fetchStudents_cursos() {
  try {
    const { data, error } = await supabase.from("estudiante_curso").select("*");

    if (error) throw error;

    renderEstudiantesCursosTable(data);
  } catch (error) {
    console.error("Error al cargar la relacion:", error);
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
            
        `;
    studentsTableBody.appendChild(row);
  });
}

function renderCursosTable(cursos) {
  cursosTableBody.innerHTML = "";

  if (cursos.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      '<td colspan="7" style="text-align: center;">No hay cursos registrados</td>';
    cursosTableBody.appendChild(row);
    return;
  }

  cursos.forEach((cursos) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${cursos.id}</td>
            <td>${cursos.nombre_curso}</td>
            <td>${cursos.creditos}</td>
            
        `;
    cursosTableBody.appendChild(row);
  });
}

function renderEstudiantesCursosTable(estudiantes_cursos) {
  students_cursosTableBody.innerHTML = "";

  if (estudiantes_cursos.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      '<td colspan="7" style="text-align: center;">No hay datos</td>';
    students_cursosTableBody.appendChild(row);
    return;
  }

  estudiantes_cursos.forEach((estudiante) => {
    const row = document.createElement("tr");
    row.innerHTML = `     
            <td>${estudiante.estudiante_id}</td>
            <td>${estudiante.curso_id}</td>
            <td>${estudiante.fecha_inscripcion.substring(0, 10)}</td>
           
        `;
    students_cursosTableBody.appendChild(row);
  });
}
