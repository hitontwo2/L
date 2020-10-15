const Discord = require("discord.js")
const bot = new Discord.Client;
const db = require("quick.db")
bot.db = require("quick.db");
const moment = require("moment")

const ms = require("parse-ms");









let prefix = ';'
bot.once("ready", () => {
  console.log("im a retard");
});

bot.on("message", async message => {
  
 
  message.mentions.has(bot.user)
    
  

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase()
  
  if(command == 'balance'){
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if (args[0]) {
        user = message.guild.members.cache.get(args[0]).user;
    } else {
        user = message.author;
    }
   


    if (user.bot || user === bot.user) {
        return message.channel.send("This user is a bot.");
        // If the user was a bot, ignore it.
    }

    let balance = db.get(`account.${user.id}.balance`);
    if (!balance) balance = 0;
    else balance = balance;

    const embed = new Discord.MessageEmbed()
    .setColor(0x7289DA)
    .setTitle(`Balance of ${user.tag}`)
    .addField("Balance", `$${(balance).toLocaleString()}`)
    .setThumbnail(user.displayAvatarURL({size: 4096, dynamic: true}))
    .setTimestamp(new Date) // Optional :)
    return message.channel.send(embed);
  }else if (command == "daily"){
    let pad_zero = num => (num < 10 ? '0' : '') + num;
    let cooldown = 8.64e+7; // 24 Hours in ms.
    let amount = 500; // How much user will get it in their dailies.

    let lastDaily = await db.get(`lastDaily.${message.author.id}`);
    let buck = await db.get(`account.${message.author.id}.balance`);

    try {
        
        if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
            let timeObj = ms(cooldown - (Date.now() - lastDaily));

            let hours = pad_zero(timeObj.hours).padStart(2, "0"),
                mins = pad_zero(timeObj.minutes).padStart(2, "0"),
                secs = pad_zero(timeObj.seconds).padStart(2, "0");

            let finalTime = `**${hours}:${mins}:${secs}**`;
            return message.channel.send(`Sorry, you cannot collect your dailies too early. Please wait until ${finalTime}.`);
        } else {
            db.set(`lastDaily.${message.author.id}`, Date.now());
            db.add(`account.${message.author.id}.balance`, amount);
            return message.channel.send(`Great **${message.author.tag}!** You've been received 500 dollars!`);
        }

    } catch (error) {
        console.log(error);
        return message.channel.send(`Oopsie, unknown error I guess: ${error}`);
  }
  }else if (command == 'transfer'){
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if (args[0]) {
        user = message.guild.members.cache.get(args[0]).user;
    }

    let balance = db.get(`account.${message.author.id}.balance`);

    if (!user) return message.channel.send("Please mention the user or input the user ID.");
    if (user.bot || user === bot.user) return message.channel.send("This user is a bot.");
    if (user.id === message.author.id || user === message.author) return message.channel.send("Why you want to transfer a credit to yourself?");

    let amount = parseInt(args[1]);
    if (!amount) return message.channel.send("Please input a credits that you want to transfer it.");
    if (isNaN(amount)) return message.channel.send("Please input a valid number.");
    // isNaN = is Not a Number.

    if (!balance || balance == 0) return message.channel.send("Your wallet is empty.");
    if (amount > balance) return message.channel.send("You don't have an enough credits to transfer. That is way too much.");
    if (amount === 0) return message.channel.send("You transfer, nothing? No. You cannot.");

    await db.add(`account.${user.id}.balance`, amount);
    await db.subtract(`account.${message.author.id}.balance`, amount);

    return message.channel.send(`You've been transferred to your friends (${user.tag}) $${amount} credits!`);

}

  
  
  
})
bot.login("NzYwNzM5MjIyOTQzNDMyNzE1.X3QbnA.cosgAcKBo1ezdsuMO1TwNWRM8ls")