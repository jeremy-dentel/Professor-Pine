"use strict";

const log = require('loglevel').getLogger('AutosetCommand'),
  Commando = require('discord.js-commando'),
  {CommandGroup} = require('../../app/constants'),
  Helper = require('../../app/helper'),
  Pokemon = require('../../app/pokemon'),
  settings = require('../../data/settings');

class AutosetCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'auto-set',
      group: CommandGroup.ADMIN,
      memberName: 'auto-set',
      description: 'Adds a new raid boss.',
      examples: ['\t!auto-set magnemite 1'],
      args: [
        {
          key: 'pokemon',
          prompt: 'What pokémon are you defaulting a tier to?\nExample: `lugia`\n',
          type: 'pokemon'
        },
        {
          key: 'tier',
          prompt: 'What tier are you defaulting? (`1`, `2`, `3`, `4`, `5`, `ex`)',
          type: 'string'
        }
      ],
      guildOnly: true
    });

    client.dispatcher.addInhibitor(message => {
      if (!!message.command && message.command.name === 'raid-boss') {
        if (!Helper.isBotManagement(message)) {
          return ['unauthorized', message.reply('You are not authorized to use this command.')];
        }
      }

      return false;
    });
  }

  async run(message, args) {
    const pokemon = args['pokemon'],
      tier = args['tier'];

    Pokemon.setDefaultTierBoss(pokemon.name, tier)
      .then(result => {
        message.react(Helper.getEmoji(settings.emoji.thumbsUp) || '👍');
      }).catch(err => log.error(err));
  }
}

module.exports = AutosetCommand;
