let readerEnabled = false;
let currentUtterance = null;
let readAllMode = false;

const toggleBtn = document.getElementById('toggle-reader');
const readAllBtn = document.getElementById('read-all');

toggleBtn.addEventListener('click', () => {
    readerEnabled = !readerEnabled;

    document.body.setAttribute('aria-live', readerEnabled ? 'assertive' : 'off');

    toggleBtn.textContent = readerEnabled ? 'lectura asistida desactivada' : 'lectura asistida activada';

    if (readerEnabled) {
        const msg = new SpeechSynthesisUtterance("Lectura asistida activada. Navega por el contenido y el lector de pantalla leerá en voz alta.");
        window.speechSynthesis.speak(msg);
    } else {
        window.speechSynthesis.cancel();
    }
});

function speakText(text) {
    if (!readerEnabled) return;

    speechSynthesis.cancel();

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = "es-ES";
    window.speechSynthesis.speak(currentUtterance);
}

document.addEventListener('focusin', (e) => {
    if (!readerEnabled) return;

    const readable = e.target.closest('[data-readable]');
    if (!readable) return;
    
    const text = readable.innerText.trim();
    if (text) {
        speakText(text);
    }
});

readAllBtn.addEventListener('click', () => {
    readAllMode = !readAllMode;
    readAllBtn.setAttribute('aria-pressed', readAllMode);
    readAllBtn.textContent = readAllMode ? 'Detener lectura' : 'Leer documento';

    if (readAllMode) {
        const allText = Array.from(document.querySelectorAll('[data-readable]'))
            .map(el => el.innerText.trim())
            .filter(text => text.length > 0)
            .join('. ');

        speakText(allText);
    } else {
        speechSynthesis.cancel();
    }
});

function readDocumentSequentially() {
    const sections = Array.from(document.querySelectorAll('data-readable'));

    let index = 0;

    function readNext() {
        if (!readAllMode || index >= sections.length) {
            readAllMode.textContent = 'Leer documento';
            readAllMode.setAttribute('aria-pressed', 'false');
            return;
        }

        const text = sections[index].innerText.trim();
        index++;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.onend = readNext;

        window.speechSynthesis.speak(utterance);
    }

    speechSynthesis.cancel();
    readNext();
}

document.querySelectorAll("[data-theme-btn]").forEach(btn => {
    btn.addEventListener("click", () => {
        const theme = btn.dataset.themebtn;
        document.documentElement.setAttribute("data-theme", theme);
    })
})