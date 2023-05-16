import datetime
import os
import discord
from discord.ext import tasks
from dotenv import load_dotenv
from pysondb import db
import pytz
import requests

tz = pytz.timezone('Europe/Berlin')

a = db.getDb("../db.json")
intents = discord.Intents.default()
intents.message_content = True
client = discord.Client(intents=intents)


@client.event
async def on_ready():
    print("Bot is ready")
    await save.start()
    # await client.close()


yesterday = datetime.datetime.today().now().replace(hour=0, second=0, microsecond=0, minute=0) - datetime.timedelta(
    days=1)
print(yesterday)


@tasks.loop(hours=1.0)
async def save(limit=None, after=yesterday):
    url = "http://localhost:3000/api/images/loadJson"
    a.deleteAll()
    channelsId = CHANNELS
    for channelId in channelsId:
        channel = client.get_channel(int(channelId))
        messages = [message async for message in channel.history(limit=limit, after=after)]
        for message in messages:
            try:
                url = message.attachments[0].url
            except:
                print("Skipping: No attachments")
            else:
                if url[0:26] == "https://cdn.discordapp.com":  # look to see if url is from discord
                    reactions = map(lambda reaction: reaction.emoji, message.reactions)
                    if ("Image #" in message.content or "Upscaled" in message.content) \
                            and "🙈" not in reactions:
                        message_id = message.id
                        if not a.getByQuery({"message": message_id}):
                            prompt = message.content
                            a.add({"message": message_id, "prompt": prompt, "url": url})
                        else:
                            print("Skipping: Image already saved")
    x = requests.get("http://localhost:3000/api/images/loadJson")
    print(x.status_code)


load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
CHANNELS = os.getenv('CHANNELS').split(",")


def getImages():
    client.run(TOKEN)


getImages()
