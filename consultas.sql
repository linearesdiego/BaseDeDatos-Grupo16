

-- Crear tabla de estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
    estudianteid SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    edad INTEGER CHECK (edad >= 18 AND edad <= 100),
    carrera VARCHAR(100) NOT NULL,
    promedio DECIMAL(4,2) CHECK (promedio >= 0 AND promedio <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nombre_curso VARCHAR(200) NOT NULL,
    creditos INTEGER NOT NULL CHECK (creditos > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de relación (muchos a n estudiante-cursmuchos)
CREATE TABLE IF NOT EXISTS estudiante_curso (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER REFERENCES estudiantes(id) ON DELETE CASCADE,
    curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(estudiante_id, curso_id)
);


-- Insertar datos de ejemplo en la tabla estudiantes
INSERT INTO estudiantes (nombre, apellido, edad, carrera, promedio)
VALUES 
    ('Juan', 'Pérez', 22, 'Informática', 8.5),
    ('María', 'González', 21, 'Ingeniería', 9.2),
    ('Carlos', 'Rodríguez', 23, 'Medicina', 7.8),
    ('Ana', 'Martínez', 20, 'Derecho', 8.9),
    ('Luis', 'Sánchez', 24, 'Informática', 6.7),
    ('Laura', 'Díaz', 22, 'Ingeniería', 9.5),
    ('Pedro', 'López', 25, 'Medicina', 8.3),
    ('Sofía', 'Ramírez', 21, 'Derecho', 7.6),
    ('Diego', 'Lineares', 24, 'Informática', 8.6);

-- Insertar datos de ejemplo en la tabla cursos
INSERT INTO cursos (nombre_curso, creditos)
VALUES 
    ('Programación I', 6),
    ('Bases de Datos', 8),
    ('Algoritmos Avanzados', 6),
    ('Redes de Computadoras', 4),
    ('Inteligencia Artificial', 6),
    ('Desarrollo Web', 5);

-- Insertar relaciones entre estudiantes y cursos
INSERT INTO estudiante_curso (estudiante_id, curso_id)
VALUES 
    (20, 1), -- Juan toma Programación I
    (20, 2), -- Juan toma Bases de Datos
    (21, 2), -- María toma Bases de Datos
    (21, 5), -- María toma Inteligencia Artificial
    (23, 4), -- Carlos toma Redes de Computadoras
    (24, 3), -- Ana toma Algoritmos Avanzados
    (25, 1), -- Luis toma Programación I
    (25, 6), -- Luis toma Desarrollo Web
    (26, 5), -- Laura toma Inteligencia Artificial
    (27, 4), -- Pedro toma Redes de Computadoras
    (28, 3); -- Sofía toma Algoritmos Avanzados



--operador de conjuntos
SELECT e.id,e.nombre,e.apellido 
FROM estudiantes e
JOIN estudiante_curso ec ON ec.estudiante_id = e.id
JOIN cursos c ON c.id = ec.curso_id
WHERE c.nombre_curso = 'Programación I'
INTERSECT
SELECT e.id,e.nombre,e.apellido 
FROM estudiantes e
JOIN estudiante_curso ec ON ec.estudiante_id = e.id
JOIN cursos c ON c.id = ec.curso_id
WHERE c.nombre_curso = 'Bases de Datos';

