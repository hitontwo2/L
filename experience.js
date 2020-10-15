const Discord = require("discord.js")
const db = require("quick.db")
const bot = new Discord.Client

let recent = bot.recent;

bot.on("message",async message => {

if(message.author.bot || message.author === bot.user)return;
if(recent.has(message.author.id)) return;
  let userprof = db.get(`leveling.${message.author.id}`);
  if(!userprof) return db.set(`leveling.${message.author.id}`, {xp: 0, level:0});
  
  await db.add(`leveling.${message.author.id}.xp`, bot.leveling.gainedXp());
  
  if(bot.leveling.getLevel(userprof.xp) > userprof.level){
    await db.add(`leveling.${message.author.id}.level`, 1);
    userprof.level = bot.leveling.getLevel(userprof.xp)
    message.channel.send(`**${message.author.tag}** **${userprof.level}!** Congratulations`)
  
    let randomTimer = getRandomI
  
  }
    function getRandomInt(min,max){
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1 )) + min;
    }
})
