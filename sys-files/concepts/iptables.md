# Conceptos Clave: iptables & Netfilter

`iptables` es la herramienta de espacio de usuario para interactuar y configurar las tablas y reglas provistas por el subsistema **Netfilter** del kernel de Linux. Permite implementar firewalls perimetrales, filtrado de paquetes y traducción de direcciones de red (NAT).

---

## 1. Arquitectura: Tablas y Cadenas

Netfilter organiza el flujo de paquetes a través de **Tablas** especializadas, y dentro de cada tabla existen **Cadenas** (Chains) que corresponden a diferentes etapas del ciclo de vida del paquete de red.

### Tablas Principales:
* **`filter`** (Por defecto): Filtrado y toma de decisiones sobre permitir o bloquear paquetes.
  - Cadenas: `INPUT`, `FORWARD`, `OUTPUT`.
* **`nat`**: Traducción de direcciones y puertos de red (Network Address Translation).
  - Cadenas: `PREROUTING`, `POSTROUTING`, `OUTPUT`.
* **`mangle`**: Modificación especializada de cabeceras de paquetes (TOS, TTL, marcas de control de tráfico QoS).
  - Cadenas: `PREROUTING`, `INPUT`, `FORWARD`, `OUTPUT`, `POSTROUTING`.
* **`raw`**: Configuración previa al seguimiento de conexiones (`conntrack`), útil para directivas `NOTRACK`.

---

## 2. Flujo del Paquete en Netfilter

```
[Paquete Entrante]
        │
        ▼
   PREROUTING (raw / mangle / nat [DNAT])
        │
        ├─────────────────────────────┐
        ▼ (Destinado al host local)    ▼ (Destinado a otro host)
      INPUT (mangle / filter)       FORWARD (mangle / filter)
        │                             │
        ▼                             │
 [Proceso Local]                      │
        │                             │
        ▼                             │
      OUTPUT (raw / mangle / nat / filter)
        │                             │
        └──────────────┬──────────────┘
                       ▼
                 POSTROUTING (mangle / nat [SNAT/MASQUERADE])
                       │
                       ▼
               [Paquete Saliente]
```

---

## 3. Comandos Esenciales de Inspección

```bash
# Listar todas las reglas de la tabla filter con números de línea y detalle
sudo iptables -L -n -v --line-numbers

# Listar reglas de la tabla NAT
sudo iptables -t nat -L -n -v

# Vaciar (Flush) todas las reglas existentes
sudo iptables -F
sudo iptables -t nat -F
sudo iptables -X
```

---

## 4. Configuración Segura Estándar (Hardening)

Un enfoque defensivo establece una política por defecto de **DROP** (denegar todo) y habilita únicamente el tráfico explícitamente necesario:

```bash
# 1. Establecer políticas por defecto a DROP
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# 2. Permitir tráfico de loopback interno (indispensable para servicios locales)
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT

# 3. Permitir conexiones establecidas y relacionadas (Stateful Inspection)
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 4. Permitir acceso SSH administrativo (puerto 22)
sudo iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -j ACCEPT

# 5. Permitir tráfico web HTTP (80) y HTTPS (443)
sudo iptables -A INPUT -p tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -m conntrack --ctstate NEW -j ACCEPT

# 6. Permitir ping ICMP entrante con límite para evitar ataques de inundación (ICMP Flood)
sudo iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT
```

---

## 5. Network Address Translation (NAT) y Reenvío de Puertos

### Enmascaramiento para Router / Gateway (SNAT / MASQUERADE):
Permite que equipos de una red privada LAN (ej. `192.168.1.0/24`) naveguen a Internet a través de la interfaz externa `eth0`:
```bash
sudo iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 -j MASQUERADE
```

### Port Forwarding (DNAT):
Redirige el tráfico entrante al puerto público `8080` de `eth0` hacia el puerto `80` de un servidor interno en `192.168.1.50`:
```bash
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.50:80
sudo iptables -A FORWARD -p tcp -d 192.168.1.50 --dport 80 -m conntrack --ctstate NEW,ESTABLISHED,RELATED -j ACCEPT
```

---

## 6. Persistencia de Reglas

En distribuciones basadas en Debian/Ubuntu:
```bash
# Guardar reglas actuales
sudo iptables-save | sudo tee /etc/iptables/rules.v4

# Restaurar reglas manualmente
sudo iptables-restore < /etc/iptables/rules.v4

# Paquete para persistencia automática en el arranque
sudo apt install iptables-persistent
```

En Red Hat / Fedora / Arch:
```bash
sudo iptables-save > /etc/iptables/iptables.rules
sudo systemctl enable --now iptables
```
