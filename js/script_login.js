let avatarSeleccionado = null;

const avatar = document.querySelectorAll(".avatar");
const boton = document.getElementById("Ingresar");
const audioError = new Audio("sonidos/audioerror.mp3");

// 🎤 Voz en español (preferir femenina si existe)
let vozEspanol = null;

function cargarVoces() {
    const voces = speechSynthesis.getVoices();

    // Busca voz femenina en español
    vozEspanol =
        voces.find(v => v.lang.startsWith("es") && v.name.toLowerCase().includes("female")) ||
        voces.find(v => v.lang.startsWith("es")) ||
        voces[0];
}

speechSynthesis.onvoiceschanged = cargarVoces;

// 🎤 Función hablar (más natural)
function hablar(texto) {
    const mensaje = new SpeechSynthesisUtterance(texto);

    if (vozEspanol) {
        mensaje.voice = vozEspanol;
    }

    mensaje.lang = "es-ES";
    mensaje.rate = 0.9;   // un poco más lento = más natural
    mensaje.pitch = 1.1;  // tono ligeramente más humano
    mensaje.volume = 1;

    speechSynthesis.cancel();

    // pequeña pausa antes de hablar
    setTimeout(() => {
        speechSynthesis.speak(mensaje);
    }, 150);
}

// ❌ Error con estilo asistente
function error(mensaje) {
    audioError.currentTime = 0;
    audioError.play().catch(() => {});

    hablar("Ups... " + mensaje);
}

// Seleccionar avatar
avatars.forEach(avatar => {
    avatar.addEventListener("click", () => {

        avatars.forEach(a => a.classList.remove("seleccionado"));

        avatar.classList.add("seleccionado");
        avatarSeleccionado = avatar.src;

        hablar("Perfecto, avatar seleccionado.");
    });
});

// Validar
boton.addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();

    if (nombre === "" && !avatarSeleccionado) {
        error("necesitas escribir tu nombre y elegir un avatar.");
        return;
    }

    if (nombre === "") {
        error("por favor, escribe tu nombre.");
        return;
    }

    if (!avatarSeleccionado) {
        error("elige un avatar para continuar.");
        return;
    }

    localStorage.setItem("nombre", nombre);
    localStorage.setItem("avatar", avatarSeleccionado);

    hablar("¡Excelente " + nombre + "! Todo está listo.");

    setTimeout(() => {
        window.location.href = "bienvenida.html";
    }, 2500);
});