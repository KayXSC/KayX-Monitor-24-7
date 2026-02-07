const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { status } = require('minecraft-server-util');
const net = require('net');

// Leer configuración
const configPath = path.join(__dirname, 'config.yml');
const configFile = fs.readFileSync(configPath, 'utf8');
const config = YAML.parse(configFile);

console.log('🔍 Verificando conexión al servidor...\n');
console.log(`📍 IP: ${config.minecraft.host}`);
console.log(`🔌 Puerto: ${config.minecraft.port}\n`);

// Test 1: Verificar puerto abierto con net
console.log('📡 Test 1: Verificando si el puerto está abierto...');
const socket = net.createConnection(config.minecraft.port, config.minecraft.host);

socket.on('connect', () => {
  console.log('✅ Puerto está ABIERTO\n');
  socket.destroy();
  testMinecraftServer();
});

socket.on('error', (error) => {
  console.log(`❌ Puerto está CERRADO o no se puede acceder: ${error.message}\n`);
  console.log('Posibles problemas:');
  console.log('- IP o puerto incorrectos');
  console.log('- Firewall bloqueando la conexión');
  console.log('- Servidor no está encendido\n');
  process.exit(1);
});

// Test 2: Verificar servidor Minecraft específicamente
async function testMinecraftServer() {
  console.log('📡 Test 2: Verificando protocolo Minecraft...');
  try {
    const response = await status(config.minecraft.host, config.minecraft.port);
    console.log('✅ ¡Servidor ONLINE!\n');
    console.log('Información del servidor:');
    console.log(`  Versión: ${response.version.name}`);
    console.log(`  Jugadores: ${response.players.online}/${response.players.max}`);
    console.log(`  MOTD: ${response.description}`);
  } catch (error) {
    console.log(`❌ Error conectando al servidor Minecraft: ${error.message}\n`);
    console.log('Posibles problemas:');
    console.log('- El servidor Minecraft no está corriendo');
    console.log('- El puerto SRV es diferente a 25565');
    console.log('- Hay un proxy o firewall interfiriendo\n');
    console.log('💡 Prueba estos puertos comunes:');
    console.log('  - 25565 (por defecto)');
    console.log('  - 25566, 25567, etc.');
  }
}
