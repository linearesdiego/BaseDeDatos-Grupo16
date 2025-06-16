import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://apxgknwbpfnjllcdauig.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweGdrbndicGZuamxsY2RhdWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0Njc3NjAsImV4cCI6MjA2MjA0Mzc2MH0.18koBi7-s_RvPF7oDUu1v0480t6lRTItM1GzuvNRNNA"
);

document.addEventListener("DOMContentLoaded", fetchStudents);

// Función para obtener todos los estudiantes
async function fetchStudents() {
  try {
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .order("estudianteid", { ascending: true });

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
