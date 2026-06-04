# Wireless Security Auditing with Aircrack-ng Suite

La suite Aircrack-ng es el conjunto de herramientas estándar para auditar la seguridad de redes inalámbricas 802.11 (WiFi). Cubre desde la monitorización y captura de tramas hasta la inyección y el cracking de contraseñas.

---

## 1. Configuración del Modo Monitor (`airmon-ng`)

### Habilitar Modo Monitor
* **Comando:**
  ```bash
  sudo airmon-ng start wlan0
  ```
* **Qué esperar (Resultado):** La interfaz cambiará su nombre a `wlan0mon` (en núcleos modernos puede mantener su nombre original pero indicará `(monitor mode enabled)`). A partir de este momento, la tarjeta dejará de estar asociada a tu router para escuchar todas las tramas aéreas del canal seleccionado.
* **Uso:** Preparar la interfaz antes de realizar cualquier escaneo o captura.

---

## 2. Captura y Reconocimiento (`airodump-ng`)

### Captura Dirigida a un Access Point
* **Comando:**
  ```bash
  sudo airodump-ng --bssid 00:11:22:33:44:55 --channel 6 -w handshake_capture wlan0mon
  ```
* **Qué esperar (Resultado):** Verás una tabla dinámica en consola. En la parte superior se listará el Access Point objetivo con su nivel de señal (PWR) y contador de tramas (#Beacons). En la parte inferior se mostrarán las estaciones (clientes) conectadas a ese AP con su respectivo tráfico de datos.
* **Uso:** Concentrar la tarjeta en un único canal para capturar un handshake WPA/WPA2 sin perder paquetes por salto de canal.

---

## 3. Inyección y Desautenticación (`airoplay-ng`)

### Desautenticación Selectiva
* **Comando:**
  ```bash
  sudo airoplay-ng --deauth 10 -a 00:11:22:33:44:55 -c AA:BB:CC:DD:EE:FF wlan0mon
  ```
* **Qué esperar (Resultado):** Se enviarán 10 tramas de desautenticación simulando provenir del router hacia el dispositivo del cliente. El cliente perderá la conexión inmediatamente y se reconectará. Si `airodump-ng` está corriendo en segundo plano, capturará las tramas del saludo de 4 vías y mostrará el aviso en la esquina superior derecha: `WPA Handshake: 00:11:22:33:44:55`.
* **Uso:** Forzar la reconexión de un cliente para obtener el handshake de forma rápida.

---

## 4. Auditoría Avanzada Sin Clientes (PMKID)

### Obtención del PMKID
* **Comando:**
  ```bash
  sudo hcxdumptool -i wlan0mon -o pmkid_capture.pcapng --enable_status=3
  ```
* **Qué esperar (Resultado):** La herramienta enviará tramas de asociación al router y esperará recibir el frame RSN IE que contiene el PMKID. Si tiene éxito, se imprimirá un mensaje indicando `FOUND PMKID` y guardará la firma directamente en el archivo. No se requiere que haya ningún usuario conectado al WiFi en ese momento.

---

## 5. Resolución de Errores Comunes (Troubleshooting)

### Error: `Device or resource busy` (al activar modo monitor)
* **Causa:** Procesos en segundo plano (como NetworkManager, dhclient o wpa_supplicant) están intentando tomar el control de la interfaz WiFi para conectarse a internet, bloqueando el modo monitor.
* **Solución:** Ejecuta el comando de limpieza antes de habilitar el modo monitor:
  ```bash
  sudo airmon-ng check kill
  ```

### Problema: El cliente no se desconecta durante el ataque de desautenticación (`--deauth`)
* **Causa 1:** Estás muy lejos del cliente o del Access Point y la potencia de inyección de tu tarjeta inalámbrica es insuficiente.
* **Causa 2:** El dispositivo cliente soporta tramas de gestión protegidas (802.11w / PMF - Protected Management Frames), lo que hace inmune al dispositivo frente a desautenticaciones falsificadas.
* **Solución:** Reubica tu antena para mejorar la señal (PWR > -70 dBm). Si la red usa PMF de forma obligatoria, deberás recurrir a auditorías pasivas (esperar a que un cliente se conecte de forma natural) o usar ataques PMKID.

### Error: `Channel -1 / Fixed Channel` en airoplay-ng
* **Causa:** La tarjeta de red se queda enganchada saltando canales en lugar de fijarse en el canal del AP objetivo.
* **Solución:** Al ejecutar `airodump-ng`, asegúrate de incluir el parámetro `--channel X` para bloquear la tarjeta en la frecuencia correcta antes de lanzar `airoplay-ng`.
