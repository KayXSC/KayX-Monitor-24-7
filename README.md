# 🤖 Bot de Discord - Notificador de Minecraft

Bot automatizado que notifica en Discord cuando tu servidor de Minecraft se enciende o se apaga.

## 📋 Requisitos

- Node.js 16 o superior
- Token de un bot de Discord
- Acceso al ID del servidor (servidor) y canal de Discord

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar el bot en Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. En la sección "Bot", crea un nuevo bot
4. Copia el **TOKEN** - lo necesitarás en `config.yml`
5. En "OAuth2 > URL Generator":
   - Selecciona permisos: `bot`
   - Scopes: `Send Messages`, `Send Messages in Threads`, `Embed Links`
   - Copia la URL generada y abre en tu navegador para invitar el bot a tu servidor

### 3. Obtener los IDs necesarios

En Discord, activa el **Modo Desarrollador** (User Settings > Advanced > Developer Mode)

- **Guild ID**: Click derecho en tu servidor > "Copiar ID del servidor"
- **Channel ID**: Click derecho en el canal > "Copiar ID del canal"

### 4. Configurar `config.yml`

Abre el archivo `config.yml` y completa:

```yaml
discord:
  token: "YOUR_BOT_TOKEN_HERE"
  guildId: "YOUR_SERVER_ID"
  channelId: "YOUR_CHANNEL_ID"

minecraft:
  host: "192.168.1.100"  # IP de tu servidor
  port: 25565            # Puerto (por defecto 25565)
  checkInterval: 30      # Verificar cada 30 segundos
```

## ▶️ Ejecutar el bot

```bash
npm start
```

El bot debe mostrar algo como:
```
✅ Bot conectado como MyBot#1234
🎮 Monitoreando servidor en 192.168.1.100:25565
📢 Canal de notificaciones: 123456789
⏱️  Intervalo de verificación: cada 30 segundos
```

## 🎯 Características

- ✅ Detección automática del estado del servidor
- ✅ Notificaciones en Discord cuando se enciende/apaga
- ✅ **Sin comandos**, totalmente automático
- ✅ Configuración en YAML (sin .env)
- ✅ Menciones de rol opcionales
- ✅ Mensajes personalizables

## ⚙️ Opciones avanzadas en config.yml

### Mensajes personalizados

```yaml
messages:
  online: "🟢 ¡Servidor ENCENDIDO!"
  offline: "🔴 ¡Servidor APAGADO!"
```

### Mencionar roles

```yaml
mentions:
  onlineRole: "123456789"  # ID del rol a mencionar cuando se encienda
  offlineRole: null        # null para no mencionar
```

## 🔧 Solución de problemas

### "Bot no está online"
- Verifica que el token está correcto en `config.yml`
- Comprueba que el bot tiene permisos en el servidor

### "No se envían mensajes"
- Verifica que el `channelId` es correcto
- Comprueba que el bot tiene permiso de escribir en ese canal

### "No detecta el servidor de Minecraft"
- Verifica la IP y puerto del servidor
- Asegúrate de que el servidor de Minecraft está corriendo
- Comprueba que puedes hacer ping al servidor: `ping SERVIDOR_IP`

## 📝 Notas

- El bot verifica el estado cada X segundos (configurable en `checkInterval`)
- Solo envía mensajes cuando hay un **cambio de estado** (no cada vez que verifica)
- Los logs se muestran en consola para debugging

## 📦 Dependencias utilizadas

- **discord.js**: Cliente de Discord
- **yaml**: Parser de archivos YAML
- **minecraft-server-util**: Verificación del estado del servidor de Minecraft
