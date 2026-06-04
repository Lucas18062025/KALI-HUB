# Network Analysis with Wireshark and Tshark

Wireshark es el analizador de protocolos de red más utilizado en el mundo. Tshark es su contraparte para línea de comandos, ideal para automatización de capturas, análisis remoto y scripting de bajo nivel.

---

## 1. Captura de Tráfico y Resultados Esperados (Tshark)

### Captura Básica
* **Comando:**
  ```bash
  tshark -i eth0 -w dump.pcapng
  ```
* **Qué esperar (Resultado):** Tshark comenzará a escuchar en la interfaz seleccionada y mostrará en la terminal un contador dinámico de paquetes capturados (`Packets: X`). Los paquetes se almacenarán crudos en el archivo `dump.pcapng` sin procesar filtros de visualización en ese momento.
* **Uso:** Captura desatendida en servidores o entornos sin interfaz gráfica.

---

## 2. Extracción Estructurada de Datos

### Filtrado y Conversión a CSV
* **Comando:**
  ```bash
  tshark -r dump.pcapng -T fields -e ip.src -e ip.dst -e tcp.dstport -E separator=, -E header=y > flujos.csv
  ```
* **Qué esperar (Resultado):** Se generará un archivo plano `flujos.csv` con columnas estructuradas de origen, destino y puertos, listo para importar en Excel, pandas de Python o bases de datos relacionales para análisis estadístico de comportamiento de red.

### Extracción de Peticiones DNS
* **Comando:**
  ```bash
  tshark -r dump.pcapng -Y "dns.flags.response == 0" -T fields -e ip.src -e dns.qry.name | sort -u
  ```
* **Qué esperar (Resultado):** Verás una lista limpia y sin duplicados en tu terminal con la IP del cliente y el dominio web que intentó resolver (por ejemplo: `192.168.1.150  example.com`).

---

## 3. Resolución de Errores Comunes (Troubleshooting)

### Error: `Permission denied (arg: -i)`
* **Causa:** El usuario actual no tiene privilegios de superusuario ni pertenece al grupo del sistema configurado para capturar paquetes de red en bruto (raw sockets).
* **Solución:** 
  1. En Linux, ejecuta el comando anteponiendo `sudo`: `sudo tshark -i eth0`.
  2. Para permitir que usuarios no root capturen paquetes en Debian/Ubuntu: ejecuta `sudo dpkg-reconfigure wireshark-common`, selecciona **Sí** y añade tu usuario al grupo con `sudo usermod -aG wireshark $USER` (requiere reiniciar sesión).

### Problema: Tshark consume el 100% de la CPU y pierde paquetes (Packet Drops)
* **Causa:** Aplicar filtros de visualización complejos (`-Y`) durante capturas en vivo de redes de alto tráfico consume demasiados recursos.
* **Solución:** Captura el tráfico de forma pura a disco usando filtros de captura (`-f` con sintaxis BPF) y realiza el filtrado de visualización (`-Y`) posteriormente sobre el archivo guardado:
  ```bash
  # Capturar con filtro de captura eficiente
  tshark -i eth0 -f "tcp port 80 or tcp port 443" -w trafico_web.pcapng
  
  # Analizar posteriormente
  tshark -r trafico_web.pcapng -Y "http.request"
  ```

### Problema: Los paquetes WiFi capturados se muestran como "IEEE 802.11" cifrados y no puedo ver la capa TCP/IP
* **Causa:** Las tramas inalámbricas están protegidas por el cifrado WPA/WPA2 de la red.
* **Solución:** Wireshark/Tshark requieren el handshake de la conexión del cliente y la contraseña de la red para derivar las claves temporales. Añade la contraseña en las preferencias:
  * **Ruta:** Preferences -> Protocols -> IEEE 802.11 -> Enable Decryption -> Decryption Keys -> Add `wpa-pwd` con formato `contraseña:SSID`.
