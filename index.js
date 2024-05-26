const { Client, GatewayIntentBits } = require('discord.js');
const keep_alive = require('./keep_alive.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages 
    ] 
});

const mySecret = process.env['TOKEN']; // Acceder al token desde los secretos

const ROLE_IDS = ['1237182711337062471', '1237183193292210216', '1238018483091148812', '1237183190817574953', '1237183192612606003', '1238877270869938197', '1237182878388064256', '1237183185138356276', '1237183191811362847', '1237208448668667994', '1244322093311594548']; // Agrega más IDs de roles si es necesario
const CHANNEL_IDS = ['1244411222539894815', '1235005964042764349']; // Agrega más IDs de canales si es necesario
const WELCOME_CHANNEL_ID = '1235005928265351279'; // ID del canal donde no se borrará el mensaje

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('dando la bienvenida a los nuevos miembros', { type: 'PLAYING' });
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    for (const roleId of ROLE_IDS) {
        if (!oldMember.roles.cache.has(roleId) && newMember.roles.cache.has(roleId)) {
            let role = newMember.guild.roles.cache.get(roleId).name; // Obtener el nombre del rol
            let welcomeMessage = `:wave: **Un nuevo usuario se ha unido al equipo!**

¡Por favor, demos una cálida bienvenida a ${newMember} al proyecto!

Bienvenido, ${newMember}! Eres parte del area **${role}** en el proyecto.
Recuerda visitar estos canales para estar al tanto del proyecto:
┃ <#1244411222539894815>
┃ <#1235005964042764349>`;

            // Enviar mensajes temporales en los canales especificados
            for (const channelId of CHANNEL_IDS) {
                const channel = newMember.guild.channels.cache.get(channelId);
                if (channel) {
                    try {
                        const message = await channel.send(`Lee este canal ${newMember}!`);
                        setTimeout(() => message.delete(), 5000); // Borra el mensaje después de 5 segundos
                    } catch (error) {
                        console.error(`No se pudo enviar el mensaje en el canal ${channelId}:`, error);
                    }
                }
            }

            // Enviar mensaje de bienvenida en el canal principal que no se borra
            const welcomeChannel = newMember.guild.channels.cache.get(WELCOME_CHANNEL_ID);
            if (welcomeChannel) {
                try {
                    await welcomeChannel.send(welcomeMessage);
                } catch (error) {
                    console.error(`No se pudo enviar el mensaje en el canal de bienvenida ${WELCOME_CHANNEL_ID}:`, error);
                }
            }
        }
    }
});

keepAlive();
client.login(mySecret); // Usar el token obtenido desde los secretos
