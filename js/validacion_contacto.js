//Obtención de elementos del DOM del formulario
const formulario = document.querySelector("#formulario");
const campoNombre = document.querySelector("#nombre");
const campoEmail = document.querySelector("#email");
const campoComentarios = document.querySelector("#comentarios");

//Elementos del DOM para mensajes de error o mensaje exitoso
const errorNombre = document.querySelector("#error-nombre");
const errorEmail = document.querySelector("#error-email");
const errorComentarios = document.querySelector("#error-comentarios");
const mensajeError = document.querySelector("#mensaje-error");
const mensajeExito = document.querySelector("#mensaje-exito");

const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_COMENTARIOS = 1000;

//funcion para limpiar los mensajes de error y las clases de validacion de cada campo
function limpiarMensajes() {
    if (errorNombre) errorNombre.textContent = "";
    if (errorEmail) errorEmail.textContent = "";
    if (errorComentarios) errorComentarios.textContent = "";
    if (mensajeError) mensajeError.textContent = "";
    if (mensajeExito) mensajeExito.textContent = "";

    if (campoNombre) campoNombre.classList.remove("campo-error");
    if (campoEmail) campoEmail.classList.remove("campo-error");
    if (campoComentarios) campoComentarios.classList.remove("campo-error");
}

formulario.addEventListener("submit", (evento) => {
    const email = campoEmail ? campoEmail.value.trim() : "";
    const comentarios = campoComentarios ? campoComentarios.value.trim() : "";
    const nombre = campoNombre ? campoNombre.value.trim() : "";

    limpiarMensajes();

    //validación del campo nombre (obligatorio)
    if (nombre === "") {
        evento.preventDefault();
        if (campoNombre) campoNombre.classList.add("campo-error");
        if (errorNombre) errorNombre.textContent = "El nombre es obligatorio.";
        if (mensajeError) mensajeError.textContent = "Revisá el campo nombre.";
        if (campoNombre) campoNombre.focus();
        return;
    }

    //validación del campo email (obligatorio y formato)
    if (email === "") {
        evento.preventDefault();
        if (campoEmail) campoEmail.classList.add("campo-error");
        if (errorEmail) errorEmail.textContent = "El correo electrónico es obligatorio.";
        if (mensajeError) mensajeError.textContent = "Revisá el campo email.";
        if (campoEmail) campoEmail.focus();
        return;
    }

    if (!expresionEmail.test(email)) {
        evento.preventDefault();
        if (campoEmail) campoEmail.classList.add("campo-error");
        if (errorEmail) errorEmail.textContent = "Ingresá una dirección de correo válida.";
        if (mensajeError) mensajeError.textContent = "Revisá el formato del campo email.";
        if (campoEmail) campoEmail.focus();
        return;
    }

    if (comentarios === "") {
            evento.preventDefault();
            if (campoComentarios) campoComentarios.classList.add("campo-error");
            if (errorComentarios) errorComentarios.textContent = "El comentario es obligatorio.";
            if (mensajeError) mensajeError.textContent = "Revisá el campo comentarios.";
            if (campoComentarios) campoComentarios.focus();
            return;
        }

    //validación de comentarios (máximo de caracteres)
    if (comentarios.length > MAX_COMENTARIOS) {
        evento.preventDefault();
        if (campoComentarios) campoComentarios.classList.add("campo-error");
        if (errorComentarios) {
            errorComentarios.textContent = `El mensaje no puede superar los ${MAX_COMENTARIOS} caracteres.`;
        }
        if (mensajeError) mensajeError.textContent = "El comentario supera el máximo permitido.";
        if (campoComentarios) campoComentarios.focus();
        return;
    }

    //Agrego un mensaje de éxito para asegurar que los datos fueron enviados
    evento.preventDefault();
    if (mensajeExito) {
        mensajeExito.textContent = "Los datos fueron enviados correctamente. ¡Gracias por tu mensaje!";
    }
});