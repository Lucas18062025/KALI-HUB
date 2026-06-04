/**
 * Database containing cybersecurity tool metadata, instructions, commands, and best practices.
 * Formatted for Kali Linux style commands, pro-tips, expectations, and error troubleshooting.
 */
const TOOLS_DATABASE = {
    nmap: {
        category: "Escaneo de Redes y Descubrimiento",
        title: "Nmap Network Mapper",
        description: "Herramienta estándar de la industria utilizada para auditorías de seguridad y descubrimiento de redes. Permite a los analistas identificar qué hosts están activos y qué servicios y puertos están expuestos.",
        sections: [
            {
                type: "commands",
                title: "Metodologías de Escaneo y Resultados Esperados",
                items: [
                    {
                        name: "Descubrimiento de Hosts (Ping Scan)",
                        tag: "Ping Scan",
                        desc: "Mapea rápidamente una subred para determinar qué direcciones IP tienen equipos encendidos sin realizar un escaneo de puertos.",
                        code: "nmap -sn 192.168.1.0/24",
                        expectation: "Nmap responderá con una lista de IPs activas ('Host is up') y sus respectivas direcciones MAC. No escaneará puertos abiertos.",
                        troubleshooting: "Si no ves hosts que sabes que están encendidos, es posible que bloqueen ICMP. Intenta forzar otros protocolos con `-PS` (TCP SYN Ping) o usa `-Pn` para omitir el descubrimiento."
                    },
                    {
                        name: "Escaneo TCP SYN (Sigiloso / Half-Open)",
                        tag: "SYN Scan",
                        desc: "Escanea puertos rápidamente de forma discreta. Envía un paquete SYN y responde con un paquete RST para cerrar la conexión antes de completar el saludo de 3 vías de TCP.",
                        code: "sudo nmap -sS 192.168.1.100",
                        expectation: "Los puertos que respondan con SYN-ACK figurarán como 'open'. Los que respondan con RST figurarán como 'closed'. Si no hay respuesta, el estado será 'filtered'.",
                        troubleshooting: "Requiere privilegios elevados. Si obtienes el error 'requires root privileges', antepone siempre 'sudo' al comando."
                    },
                    {
                        name: "Detección de OS y Versiones de Servicio",
                        tag: "Version/OS Detect",
                        desc: "Identifica las versiones del software corriendo en cada puerto y determina el sistema operativo basándose en firmas de respuesta de red.",
                        code: "sudo nmap -sS -sV -O -sC 192.168.1.100",
                        expectation: "Un reporte con los nombres exactos y versiones del software (ej. Apache httpd 2.4.41) y un estimado porcentual del sistema operativo.",
                        troubleshooting: "Si la detección de OS falla o no es concluyente, puedes forzarla agregando `--osscan-guess` para que Nmap intente aproximar de forma más agresiva."
                    }
                ]
            },
            {
                type: "commands",
                title: "Evasión de Firewalls & Técnicas Pro",
                items: [
                    {
                        name: "Suplantación de Puerto de Origen (Source Port)",
                        tag: "Firewall Evasion",
                        desc: "Fuerza a Nmap a realizar el escaneo originando todo el tráfico desde un puerto específico, como DNS (53) o HTTP (80).",
                        code: "sudo nmap -sS -g 53 --source-port 53 192.168.1.100",
                        expectation: "Bypass de firewalls antiguos configurados para permitir ciegamente el tráfico entrante si proviene de puertos confiables de infraestructura.",
                        troubleshooting: "Si el puerto especificado ya está ocupado por un servicio local, Nmap lanzará un error de bind. Asegúrate de detener servicios locales temporales si es necesario."
                    },
                    {
                        name: "Escaneo con Señuelos (Decoys)",
                        tag: "Decoys Scan",
                        desc: "Mezcla la dirección IP de tu máquina con otras direcciones IP activas para encubrir la IP de auditoría real.",
                        code: "sudo nmap -D 192.168.1.2,192.168.1.3,ME 192.168.1.100",
                        expectation: "En los logs del objetivo figurarán múltiples escaneos simultáneos desde las IPs señuelo, enmascarando tu IP real (representada por 'ME').",
                        troubleshooting: "Asegúrate de usar IPs señuelo que realmente estén activas. De lo contrario, podrías saturar la red con respuestas muertas o levantar alertas por inundación de rutas (routing floods)."
                    }
                ]
            },
            {
                type: "callouts",
                title: "Mejores Prácticas y Consejos Profesionales",
                items: [
                    {
                        style: "warning",
                        title: "Error común: 'dnet: failed to open device' en Windows",
                        desc: "Este error ocurre porque el controlador de captura de paquetes (Npcap) no está instalado correctamente, no tiene privilegios o no está iniciado.",
                        code: "net start npcap"
                    },
                    {
                        style: "success",
                        title: "Guarda siempre tus escaneos",
                        desc: "Usa el parámetro `-oA` para exportar simultáneamente en tres formatos: normal (.nmap), XML (.xml) y grepable (.gnmap). Esto asegura un registro de auditoría completo y listo para análisis posterior o automatizaciones.",
                        code: "sudo nmap -sS -sV -oA reporte_auditoria 192.168.1.100"
                    }
                ]
            }
        ]
    },
    wireless: {
        category: "Auditoría de Seguridad Inalámbrica",
        title: "Aircrack-ng Suite",
        description: "Conjunto completo de herramientas para auditar la seguridad de redes WiFi 802.11. Se especializa en monitoreo de paquetes, inyección de tráfico, desautenticación de clientes y cracking de llaves WPA/WPA2/WEP.",
        sections: [
            {
                type: "commands",
                title: "Configuración y Captura de Paquetes",
                items: [
                    {
                        name: "Matar Procesos en Conflicto",
                        tag: "airmon-ng",
                        desc: "Identifica y finaliza procesos en segundo plano que intentan tomar control de la tarjeta de red e interfieren con el modo monitor.",
                        code: "sudo airmon-ng check kill",
                        expectation: "Se cerrarán servicios como NetworkManager o wpa_supplicant. Perderás la conexión a internet en esa máquina durante la prueba.",
                        troubleshooting: "Si el modo monitor sigue fallando o la tarjeta vuelve a modo gestionado, ejecuta este comando nuevamente antes de iniciar."
                    },
                    {
                        name: "Habilitar Modo Monitor",
                        tag: "airmon-ng",
                        desc: "Establece la interfaz inalámbrica en modo monitor, permitiéndole capturar todo el tráfico de radio aéreo.",
                        code: "sudo airmon-ng start wlan0",
                        expectation: "La interfaz cambiará su estado a monitor y pasará a llamarse wlan0mon (o mantendrá su nombre pero indicará monitor habilitado).",
                        troubleshooting: "Si tu interfaz no aparece, asegúrate de que el hardware soporte inyección y modo monitor en Linux."
                    },
                    {
                        name: "Capturar Tráfico Dirigido de AP",
                        tag: "airodump-ng",
                        desc: "Bloquea la tarjeta en un solo canal para recopilar beacons e identificar clientes conectados a un Access Point específico, guardando las capturas a disco.",
                        code: "sudo airodump-ng --bssid 00:11:22:33:44:55 --channel 6 -w handshake_capture wlan0mon",
                        expectation: "Verás una interfaz visual interactiva en consola mostrando beacons, tramas de datos y clientes conectados con sus MACs y nivel de señal (PWR).",
                        troubleshooting: "Si no aparecen clientes en la lista inferior, asegúrate de que el canal coincida exactamente con el canal de transmisión de la red WiFi objetivo."
                    }
                ]
            },
            {
                type: "commands",
                title: "Ataques e Inyección",
                items: [
                    {
                        name: "Desautenticación Selectiva (Targeted)",
                        tag: "airoplay-ng",
                        desc: "Envía tramas de desautenticación falsificadas de forma directa hacia un cliente para obligarlo a reconectarse y así capturar el WPA 4-Way Handshake.",
                        code: "sudo airoplay-ng --deauth 10 -a 00:11:22:33:44:55 -c AA:BB:CC:DD:EE:FF wlan0mon",
                        expectation: "El cliente perderá la conexión a la red WiFi por unos segundos. En la ventana de airodump-ng aparecerá el indicador: 'WPA Handshake: [BSSID]'.",
                        troubleshooting: "Si el cliente no se desconecta, puede deberse a que la red usa Tramas de Gestión Protegidas (802.11w PMF) o a que estás muy lejos del cliente. Prueba aumentando tu proximidad."
                    },
                    {
                        name: "Ataque PMKID (Clientless/Sin Clientes)",
                        tag: "hcxdumptool",
                        desc: "Captura el identificador PMKID del Access Point objetivo sin necesidad de que haya clientes conectados, reduciendo el ruido e impacto en la red.",
                        code: "sudo hcxdumptool -i wlan0mon -o pmkid_capture.pcapng --enable_status=3",
                        expectation: "La terminal registrará solicitudes de asociación falsas hacia el AP y mostrará un mensaje indicando que se ha capturado el hash PMKID en disco.",
                        troubleshooting: "Requiere que el Access Point soporte WPA2 con RSN IE activo. Si el AP no responde tras unos minutos, probablemente tenga mitigaciones o no sea vulnerable al ataque directo."
                    }
                ]
            },
            {
                type: "callouts",
                title: "Resolución de Errores Comunes de Red Inalámbrica",
                items: [
                    {
                        style: "warning",
                        title: "Error: 'Device or resource busy' al activar modo monitor",
                        desc: "Esto ocurre porque el sistema operativo bloquea la tarjeta para mantener la conexión inalámbrica local del usuario.",
                        code: "sudo airmon-ng check kill"
                    },
                    {
                        style: "warning",
                        title: "Error: 'Channel -1 / Fixed Channel' en airoplay-ng",
                        desc: "Ocurre cuando la tarjeta de red no está bloqueada en un solo canal. Ejecuta airodump-ng forzando el canal deseado antes de lanzar la inyección.",
                        code: "sudo airodump-ng -c 6 wlan0mon"
                    }
                ]
            }
        ]
    },
    wireshark: {
        category: "Análisis y Monitoreo de Red",
        title: "Wireshark & Tshark",
        description: "Analizadores de protocolo líderes en la industria. Wireshark proporciona una interfaz visual rica, mientras que Tshark actúa como su potente versión en línea de comandos para automatización y escaneos de alto rendimiento.",
        sections: [
            {
                type: "commands",
                title: "Capturas de Consola y Análisis",
                items: [
                    {
                        name: "Captura de Tráfico Básico (Tshark)",
                        tag: "tshark",
                        desc: "Captura paquetes en la interfaz seleccionada de forma pura, escribiendo el volcado a disco en un archivo pcapng.",
                        code: "tshark -i eth0 -w dump.pcapng",
                        expectation: "La terminal mostrará un contador de paquetes ascendente ('Packets: X'). La captura continuará hasta que presiones Ctrl+C.",
                        troubleshooting: "Si obtienes el error 'Permission denied', ejecuta el comando con sudo o añade tu usuario al grupo wireshark del sistema."
                    },
                    {
                        name: "Extracción Directa de Campos a CSV",
                        tag: "tshark",
                        desc: "Filtra un archivo de captura pcapng para extraer únicamente IPs y puertos TCP de interés, exportándolos a un formato CSV limpio.",
                        code: "tshark -r dump.pcapng -T fields -e ip.src -e ip.dst -e tcp.dstport -E separator=, -E header=y > flujos.csv",
                        expectation: "Se creará un archivo flujos.csv estructurado con columnas de origen, destino y puertos, listo para analítica externa.",
                        troubleshooting: "Asegúrate de que el archivo de entrada dump.pcapng exista en el directorio actual o proporciona su ruta completa."
                    },
                    {
                        name: "Carving de Archivos en Tránsito (HTTP)",
                        tag: "tshark",
                        desc: "Extrae automáticamente todos los objetos de capa de aplicación (imágenes, scripts, binarios) transmitidos en texto plano por HTTP.",
                        code: "tshark -r dump.pcapng --export-objects http,directorio_salida",
                        expectation: "Tshark creará la carpeta 'directorio_salida' e insertará todos los archivos que detectó fluyendo de forma insegura por la red.",
                        troubleshooting: "Esta técnica solo funciona para HTTP. No extraerá objetos transmitidos sobre HTTPS (puerto 443) a menos que se hayan importado las claves SSL en Tshark."
                    }
                ]
            },
            {
                type: "callouts",
                title: "Solución a Problemas de Análisis de Red",
                items: [
                    {
                        style: "warning",
                        title: "Error: 'Permission denied' al capturar interfaces",
                        desc: "Esto ocurre porque tu usuario no tiene privilegios de red del Kernel para escuchar interfaces físicas en modo promiscuo.",
                        code: "sudo dpkg-reconfigure wireshark-common\nsudo usermod -aG wireshark $USER"
                    },
                    {
                        style: "success",
                        title: "Diferencia Pro: Filtros de Captura vs Visualización",
                        desc: "Los filtros de captura (-f con sintaxis BPF) se procesan en el kernel del SO, descartando de inmediato paquetes no deseados para ahorrar CPU/disco. Los filtros de visualización (-Y) se ejecutan posteriormente sobre los datos ya almacenados.",
                        code: "tshark -i eth0 -f \"tcp port 80 or tcp port 443\" -w trafico_web.pcapng"
                    }
                ]
            }
        ]
    }
};

/* ==========================================================================
   APP CONTROLLER LOGIC
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    const contentArea = document.getElementById("content-area");
    const searchInput = document.getElementById("search-input");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    
    let currentTool = "nmap";

    // Nav Switcher
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            currentTool = item.getAttribute("data-tool");
            renderTool(currentTool);
            // Clear search when switching tools
            searchInput.value = "";
        });
    });

    // Search function
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        renderTool(currentTool, query);
    });

    // Display Notification Toast
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    // Dynamic Render Function
    function renderTool(toolKey, searchQuery = "") {
        const data = TOOLS_DATABASE[toolKey];
        if (!data) return;

        let html = `
            <div class="tool-header">
                <span class="tool-category">${data.category}</span>
                <h1 class="tool-title">${data.title}</h1>
                <p class="tool-description">${data.description}</p>
            </div>
        `;

        let matchCount = 0;

        data.sections.forEach(section => {
            let sectionHTML = "";

            if (section.type === "commands") {
                const filteredItems = section.items.filter(item => {
                    if (!searchQuery) return true;
                    return item.name.toLowerCase().includes(searchQuery) ||
                           item.tag.toLowerCase().includes(searchQuery) ||
                           item.desc.toLowerCase().includes(searchQuery) ||
                           item.code.toLowerCase().includes(searchQuery) ||
                           (item.expectation && item.expectation.toLowerCase().includes(searchQuery)) ||
                           (item.troubleshooting && item.troubleshooting.toLowerCase().includes(searchQuery));
                });

                if (filteredItems.length > 0) {
                    sectionHTML += `<h2 class="section-title">${section.title}</h2>`;
                    sectionHTML += `<div class="command-grid">`;
                    filteredItems.forEach(item => {
                        sectionHTML += `
                            <div class="command-card">
                                <div class="card-header">
                                    <span class="card-name">${item.name}</span>
                                    <span class="card-tag">${item.tag}</span>
                                </div>
                                <p class="card-desc">${item.desc}</p>
                                
                                <!-- Mock Kali linux terminal window -->
                                <div class="terminal-window">
                                    <div class="terminal-header">
                                        <div class="terminal-dots">
                                            <span class="terminal-dot red"></span>
                                            <span class="terminal-dot yellow"></span>
                                            <span class="terminal-dot green"></span>
                                        </div>
                                    </div>
                                    <div class="terminal-body">
                                        <span class="terminal-prompt">kali@kali:~$</span>
                                        <span class="code-text">${escapeHtml(item.code)}</span>
                                        <button class="copy-btn" onclick="copyToClipboard(this)">
                                            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                ${item.expectation ? `
                                    <div class="practice-block">
                                        <strong>Qué esperar (Resultado):</strong> ${item.expectation}
                                    </div>
                                ` : ''}
                                
                                ${item.troubleshooting ? `
                                    <div class="practice-block" style="border-left-color: var(--accent-warning); margin-top: 6px;">
                                        <strong>Corrección de errores:</strong> ${item.troubleshooting}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                        matchCount++;
                    });
                    sectionHTML += `</div>`;
                }
            } else if (section.type === "callouts") {
                const filteredItems = section.items.filter(item => {
                    if (!searchQuery) return true;
                    return item.title.toLowerCase().includes(searchQuery) ||
                           item.desc.toLowerCase().includes(searchQuery) ||
                           (item.code && item.code.toLowerCase().includes(searchQuery));
                });

                if (filteredItems.length > 0) {
                    sectionHTML += `<h2 class="section-title">${section.title}</h2>`;
                    filteredItems.forEach(item => {
                        const styleClass = item.style === "warning" ? "warning" : (item.style === "success" ? "success" : "");
                        const styleLabel = item.style === "warning" ? "Resolución de errores" : (item.style === "success" ? "Pro-Tip" : "Información");
                        
                        sectionHTML += `
                            <div class="callout ${styleClass}">
                                <div class="callout-header">
                                    <span>${styleLabel}: ${item.title}</span>
                                </div>
                                <p class="callout-desc">${item.desc}</p>
                                ${item.code ? `
                                    <div class="terminal-window" style="margin-top: 14px;">
                                        <div class="terminal-header">
                                            <div class="terminal-dots">
                                                <span class="terminal-dot red"></span>
                                                <span class="terminal-dot yellow"></span>
                                                <span class="terminal-dot green"></span>
                                            </div>
                                        </div>
                                        <div class="terminal-body">
                                            <span class="terminal-prompt">kali@kali:~$</span>
                                            <span class="code-text">${escapeHtml(item.code)}</span>
                                            <button class="copy-btn" onclick="copyToClipboard(this)">
                                                <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                        matchCount++;
                    });
                }
            }

            html += sectionHTML;
        });

        if (searchQuery && matchCount === 0) {
            html += `
                <div style="text-align: center; padding: 60px 0; color: var(--text-muted);">
                    <svg style="width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No se encontraron resultados para "${searchQuery}"</p>
                </div>
            `;
        }

        contentArea.innerHTML = html;
    }

    // Helper to escape HTML tags inside code blocks
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Global copy to clipboard setup (Grabs ONLY the text inside code-text, bypassing the prompt)
    window.copyToClipboard = function(button) {
        let code = "";
        
        // Find the sibling elements that contain the code.
        // In our structure, the code is placed inside a span with the class 'code-text'
        const parentBody = button.parentElement;
        if (parentBody) {
            const codeTextEl = parentBody.querySelector(".code-text");
            if (codeTextEl) {
                code = codeTextEl.textContent || codeTextEl.innerText;
            }
        }
        
        if (!code) return;

        navigator.clipboard.writeText(code.trim()).then(() => {
            showToast("Comando copiado al portapapeles");
            
            // Temporary success indicator on the icon
            const origIconHTML = button.innerHTML;
            button.innerHTML = `
                <svg class="copy-icon" style="color: var(--accent-success);" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            `;
            setTimeout(() => {
                button.innerHTML = origIconHTML;
            }, 1500);
        }).catch(err => {
            console.error("Fallo al copiar: ", err);
        });
    };

    // Initial render
    renderTool(currentTool);
});
