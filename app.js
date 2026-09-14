let ganancias = 120;
let estres = 35;
let estadoIA = "ESPERANDO";

function actualizarUI() {
    document.getElementById('lblGanancias').innerText = `$${ganancias.toFixed(2)} MXN`;
    document.getElementById('lblEstres').innerText = `${estres}%`;
    document.getElementById('valEstadoIA').innerText = estadoIA;

    const jsonOutput = {
        "metadatos_simulacion": {
            "usuario": "Doña Mari",
            "timestamp": new Date().toISOString(),
            "dragon_stack": "v6-adaptive"
        },
        "estado_actual": { "financiero": ganancias, "estres": estres, "motor_ia": estadoIA }
    };
    document.getElementById('jsonBlock').innerText = JSON.stringify(jsonOutput, null, 2);
}

function procesarDecision(tipo) {
    estadoIA = "PROCESANDO_ML";
    actualizarUI();
    
    setTimeout(() => {
        if(tipo === 'amable') {
            ganancias += 65;
            estres = Math.max(estres - 15, 10);
            estadoIA = "EXITO_ADAPTATIVO";
            document.getElementById('burbujaTexto').innerText = '"¡Muchas gracias por la atención! Me llevo dos órdenes más."';
            document.getElementById('avatarCliente').innerText = "🤩";
            document.getElementById('statusFeedback').innerText = "Reacción óptima.";
        } else {
            ganancias -= 30;
            estres = Math.min(estres + 35, 100);
            estadoIA = "CRISIS_EVENT";
            document.getElementById('burbujaTexto').innerText = '"Sabe qué, mejor déjelo así. Qué mal servicio."';
            document.getElementById('avatarCliente').innerText = "😡";
            document.getElementById('statusFeedback').innerText = "Fricción crítica.";
        }
        actualizarUI();
    }, 600);
}

function activarMicrofono() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("API de voz no compatible.");
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    
    document.getElementById('btnVoz').innerText = "🎙️ Escuchando...";
    recognition.start();
    
    recognition.onresult = function(event) {
        const texto = event.results[0][0].transcript.toLowerCase();
        document.getElementById('statusFeedback').innerText = `Escuchado: "${texto}"`;
        if (texto.includes("disculpa") || texto.includes("favor") || texto.includes("ahorita")) {
            procesarDecision('amable');
        } else {
            procesarDecision('ofensivo');
        }
        restaurarBoton();
    };
    recognition.onerror = function() { restaurarBoton(); };
}

function restaurarBoton() {
    document.getElementById('btnVoz').innerText = "Análisis de Voz (Web Speech API)";
}

actualizarUI();
