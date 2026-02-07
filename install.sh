#!/bin/bash

# Script de instalación del bot de Discord para Minecraft

echo "🚀 Instalando bot de Discord para Minecraft..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

echo ""
echo "✅ ¡Instalación completada!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Abre 'config.yml' con tu editor de texto favorito"
echo "2. Completa los datos:"
echo "   - discord.token: Tu token de bot de Discord"
echo "   - discord.guildId: ID de tu servidor Discord"
echo "   - discord.channelId: ID del canal donde recibir notificaciones"
echo "   - minecraft.host: IP de tu servidor de Minecraft"
echo "   - minecraft.port: Puerto de tu servidor (por defecto 25565)"
echo ""
echo "3. Ejecuta: npm start"
echo ""
echo "¡Para ayuda, mira el archivo README.md!"
