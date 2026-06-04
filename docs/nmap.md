# Network Auditing and Discovery with Nmap

Nmap (Network Mapper) es una herramienta estándar de la industria utilizada para auditorías de seguridad y descubrimiento de redes. Permite a los analistas identificar qué hosts están activos y qué servicios y puertos están expuestos.

---

## 1. Metodologías de Escaneo y Resultados Esperados

### Descubrimiento de Hosts (Ping Scan)
* **Comando:**
  ```bash
  nmap -sn 192.168.1.0/24
  ```
* **Qué esperar (Resultado):** Nmap enviará paquetes ICMP Echo, TCP SYN al puerto 80, TCP ACK al puerto 443 e ICMP Timestamp. Responderá con una lista de IPs que respondieron ("Host is up") y sus respectivas direcciones MAC. No escaneará puertos.
* **Uso:** Rápido mapeo inicial de una subred para saber qué equipos están encendidos.

### Escaneo TCP SYN (Sigiloso / Stealth)
* **Comando:**
  ```bash
  sudo nmap -sS 192.168.1.100
  ```
* **Qué esperar (Resultado):** Nmap enviará paquetes SYN. Si el puerto responde con SYN-ACK, está abierto (Nmap enviará inmediatamente un RST para cerrar la conexión sin registrar un handshake completo). Si responde con RST, está cerrado. Si no hay respuesta o se recibe un error ICMP, el estado será `filtered`.
* **Uso:** Determinar el estado de los puertos de forma rápida y con baja tasa de registro en logs de aplicación.

### Detección de OS y Versiones de Servicio
* **Comando:**
  ```bash
  sudo nmap -sS -sV -O -sC 192.168.1.100
  ```
* **Qué esperar (Resultado):** Un reporte detallado con las versiones exactas del software que corre en cada puerto (por ejemplo, `Apache httpd 2.4.41` en lugar de solo `http`) y una estimación porcentual del sistema operativo del objetivo.
* **Uso:** Identificación precisa de la superficie de ataque para buscar exploits específicos.

---

## 2. Evasión de Firewalls & Técnicas Avanzadas

### Suplantación de Puerto de Origen (Source Port Spoofing)
* **Comando:**
  ```bash
  sudo nmap -sS -g 53 192.168.1.100
  ```
* **Qué esperar (Resultado):** El tráfico de escaneo aparentará provenir del puerto DNS (53). Muchos firewalls antiguos están configurados para permitir ciegamente el tráfico entrante si proviene del puerto 53 o 80 para evitar cortes de conexión.

### Escaneo con Señuelos (Decoys)
* **Comando:**
  ```bash
  sudo nmap -D 192.168.1.2,192.168.1.3,ME 192.168.1.100
  ```
* **Qué esperar (Resultado):** En los logs del firewall del objetivo se registrarán escaneos simultáneos provenientes de las direcciones IP señuelo y de tu IP real (`ME`), haciendo casi imposible determinar el origen real sin un análisis avanzado de tiempos.

---

## 3. Resolución de Errores Comunes (Troubleshooting)

### Error: `dnet: failed to open device` (en Windows)
* **Causa:** El controlador de captura de paquetes (Npcap) no está instalado o no se está ejecutando con los permisos necesarios.
* **Solución:** 
  1. Abre la terminal como Administrador.
  2. Reinstala Npcap asegurándote de activar la opción "Install Npcap in WinPcap API-compatible mode".
  3. Ejecuta `net start npcap` en PowerShell.

### Error: `You request a Scan Type which requires root privileges.`
* **Causa:** Los escaneos sigilosos como `-sS` (SYN), `-sU` (UDP), `-O` (detección de OS) requieren la creación de sockets crudos (raw sockets) que solo el kernel permite a usuarios con privilegios elevados.
* **Solución:** Antepone `sudo` en sistemas Linux/macOS, o ejecuta la consola de comandos como Administrador en Windows.

---

## 4. Consejos Profesionales

> [!TIP]
> **Guarda siempre tus escaneos**
> Utiliza el parámetro `-oA` para exportar simultáneamente en tres formatos: normal (.nmap), XML (.xml) y grepable (.gnmap). Esto asegura un registro de auditoría completo y listo para análisis posterior o parseo con herramientas automáticas.
> ```bash
> sudo nmap -sS -sV -oA reporte_auditoria 192.168.1.100
> ```
