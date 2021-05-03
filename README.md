# Proyecto Final del Curso React - BEDU / Santander

## Justificación
La creación de actividades personalizadas es una problemática presente en campo de la enseñanza de idiomas. Encontrar en libros o internet actividades que conincidan con los objetivos y necesidades de cada salón de clases puede ser una tarea muy agotante. Con la pandemia , la necesidad de creación actividades digitales y personalizadas incrementó. Este proyecto intenta crear una herramienta que pueda ser útil para la enseñanza de idiomas de manera personal y virtual.      

## Descripción del Proyecto

Este proyecto consiste en una aplicación para la creación y aplicación de actividades del tipo [cloze](https://en.wikipedia.org/wiki/Cloze_test) digitalmente. En un futuro se espera poder aumentar el rango de actividades que se puedan crear en la aplicación así como habilitar un modo para contestar las actividades en tiempo real. 

El proyecto se divide en dos partes: 

### Editor de texto enriquecido [RTE][rte link]

Se utiliza el framework [Slate JS](https://docs.slatejs.org/) para crear un editor de texto enriquecido totalmente customizable. Actualmente el editor soporta: Estilos de tipografía (títulos, subtítulos), estilos de texto: (negrita, cursiva, subrayado, tachado), alineación de texto y creación de ejercicios tipo cloze (Palabra faltante) así como impresión de actividad.

### Página de práctica

Esta página traduce todo el contenido del [RTE](https://en.wikipedia.org/wiki/Online_rich-text_editor) a una versión interactiva que se pueda contestar usando elementos HTML nativos (select, input, etc.). Actualmente las actividades se pueden realizar y se puede recibir una calificación dependiento de las respuestas correctas.

### Link del Prototipo

Se creó una versión prototipo de la aplicación que funciona usando localStorage para asegurar la persistencia de los datos de manera local. El proyecto esta hosteado en la plataforma Netlify

<https://determined-mayer-9f15a9.netlify.app/>

[rte link]: https://en.wikipedia.org/wiki/Online_rich-text_editor

