# 🐉 KALI-HUB v1.2.0 — Manual Técnico & Auditoría

[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-00a8ff?style=flat-square&logo=kali-linux)](https://github.com/Lucas18062025)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20(Vanilla)-38ef7d?style=flat-square)](https://github.com/Lucas18062025)
[![Focus](https://img.shields.io/badge/Focus-Pentesting%20%7C%20Packet%20Analysis-007acc?style=flat-square)](https://github.com/Lucas18062025)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

*Manual técnico interactivo local y repositorio de referencia estructurado con comandos reales, pro-tips de evasión, diagnóstico de errores de ejecución y resultados esperados para Nmap, Wireshark, Tshark y la suite Aircrack-ng. Diseñado con una interfaz oscura fluida inspirada en Kali Linux.*

---

## 🚀 Características

* **Ajuste Técnico Kali Linux**: Entorno visual con paleta pizarra-azul fría, tipografía monoespaciada de consola y un isotipo vectorizado del dragón de Kali.
* **Consolas Virtuales con Copiado Inteligente**: Los comandos se visualizan en réplicas de terminales Linux. La directiva CSS deshabilita la selección del indicador de línea (`kali@kali:~$`), permitiendo copiar únicamente el comando limpio ejecutable con doble clic o mediante el botón de clipboard.
* **Buscador Dinámico**: Filtro instantáneo de comandos en tiempo real por bandera, nombre, descripción o código de error.
* **Manual Integrado**: Desglose técnico que detalla qué esperar (resultados) tras ejecutar cada comando y cómo solucionar fallos de red inalámbrica, sockets crudos o captura de paquetes.

---

## ⚙️ Requisitos

| Componente | Versión recomendada | Notas |
| :--- | :--- | :--- |
| **Sistema Operativo** | Linux (Kali / Debian), Windows 10/11, macOS | Compatibilidad multiplataforma para el visor web. |
| **Tarjeta WiFi** | Chipset compatible con inyección y modo monitor | Requerido únicamente para ejecutar comandos de `airmon-ng` / `airoplay-ng`. |
| **Npcap / WinPcap** | Última versión disponible | Necesario en Windows si ejecutas `nmap` de manera local. |
| **Navegador Web** | Chrome, Firefox, Edge, Safari (modernos) | Sin dependencias externas; renderizado inmediato de HTML/CSS/JS locales. |

---

## 📥 Instalación

Sigue estos pasos para descargar y montar el repositorio localmente:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Lucas18062025/KALI-HUB.git

# 2. Acceder al directorio
cd KALI-HUB
```

---

## 💻 Uso

### Interfaz Web Local
Para abrir el visor interactivo y utilizar la barra de búsqueda y copiado rápido:
1. Haz doble clic en el archivo `index.html` o ábrelo directamente desde tu navegador.
2. Navega entre las pestañas laterales y usa el filtro de búsqueda.

### Lectura por Terminal
Las guías de referencia completas se encuentran disponibles en formato Markdown estructurado dentro de la carpeta `docs/`:
```bash
# Leer guía de escaneo de red (Nmap)
cat docs/nmap.md

# Leer guía de auditoría WiFi (Aircrack-ng Suite)
cat docs/wireless.md

# Leer guía de análisis de tráfico (Wireshark/Tshark)
cat docs/wireshark.md
```

---

## 📁 Estructura del Proyecto

```text
KALI-HUB/
│
├── docs/                   # Guías técnicas detalladas en Markdown
│   ├── nmap.md             # Evasión de firewalls, escaneos y NSE
│   ├── wireless.md         # Captura de handshakes, PMKID y deauth
│   └── wireshark.md        # Filtros de display, tshark y descifrado
│
├── index.html              # Interfaz de usuario interactiva
├── style.css               # Hoja de estilos con tema Kali Linux
├── app.js                  # Lógica de búsqueda y base de datos de comandos
└── README.md               # Documentación principal del repositorio
```

---

## ⚠️ Aviso Legal

*Este software y sus guías de referencia han sido diseñados exclusivamente con fines educativos, de aprendizaje y auditoría de seguridad bajo entornos controlados y con autorización explícita del propietario. El uso indebido o malicioso de las herramientas mencionadas es responsabilidad única del operador.*

---

## 👤 Operador

**Lucas Villagra** — *Cybersecurity Analyst, Ethical Hacker Student - Red Team / Blue Team - NOA, Argentina*

[![Github](https://img.shields.io/badge/Github-Lucas18062025-101420?style=flat-square&logo=github)](https://github.com/Lucas18062025)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Lucas--Villagra-007acc?style=flat-square&logo=linkedin)](https://linkedin.com/in/lucas-villagra-cybersecurity)
[![Google](https://img.shields.io/badge/Google-Cybersecurity%20Certificate-38ef7d?style=flat-square&logo=google)](https://github.com/Lucas18062025)
