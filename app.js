import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { API_KEY, SUPABASE_URL } from "./config.js";

const supabase = createClient(SUPABASE_URL, API_KEY);

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
