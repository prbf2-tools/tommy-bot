# Tommy Bot

Creator: @MaxZK [R-DEV]Max_

Maintainer: @emilekm [R-CON]cassius23

## Requirements

- Discord server
- FTP server
- HTTP server
- Node.js

If you're using Windows you might need to follow the installation instructions for [node-gyp](https://github.com/nodejs/node-gyp?tab=readme-ov-file#on-windows).

## Running

```sh
# Install dependencies
npm install
# Run the bot
npm start
```

## Features

Below is a list of features the bot provides along with configuration for each of the features.

The full configuration can be found in `config.yaml.sample`.
Copy the file to `config.yaml` and fill in the required fields.

### PRISM

PRISM is used for running in-game commands, reading chat and alerts.

The general channel is for all chat messages coming into PRISM.
There is a special feed for teamkills, which you can direct to a specific channel.

```yaml
prism:
  auth:
    ip:
    port:
    username:
    password:
  generalChannelID:
  teamkillChannelID:
```

### Demos

Demos are uploaded using FTP at the round end. After upload the bot will post a message with the demo links.

Additionally the bot will upload JSON files produced by the server at the round end.

```yaml
demos:
  channelID:
  ftp:
    host:
    username:
    password:

  # URL where tracker viewer can be accesseded
  # Domain needs to be the same as the one used for prdemo (for CORS)
  # Example: https://demos.myserver.gg/realitytracker/
  trackerViewerUrl:

  # source is the path where the files can be found
  # destination is the path where the files will be uploaded via FTP
  # url is the URL where the files can be accessed on the internet

  bf2:
    # Example: /pr/server/mods/pr/demos/
    source:
    # Example: demos/bf2/
    destination:
    # Example: https://demos.myserver.gg/bf2/
    url:

  pr:
    # Example: /pr/server/demos/
    source:
    # Example: demos/pr/
    destination:
    # Example: https://demos.myserver.gg/pr/
    url:

  json:
    # Example: /pr/server/json/
    source:
    # Example: demos/json/
    destination:
```

### Logs

Join, commands and ban logs are read from files and posted to Discord channels.

Additionally tickets log is used to determine winner of the round.

- `bans` - `mods/pr/settings/banlist_info.log`
- `commands` - `admin/logs/commandlog.log`
- `joins` - `admin/logs/joinlog.log`
- `tickets` - `admin/logs/tickets.log`

Paths need to be absolute.

```yaml
logs:
  bans:
    # {SV_DIR}/mods/pr/settings/banlist_info.log
    path:
    publicChannelID:
    privateChannelID:
  commands:
    # {SV_DIR}/admin/logs/ra_adminlog.txt
    path:
    publicChannelID:
    privateChannelID:
  joinlog:
    # {SV_DIR}/admin/logs/joinlog.log
    path:
    privateChannelID:
  tickets:
    # {SV_DIR}/admin/logs/tickets.log
    path:
```

### Server information

Server information is fetched from PRSPY and posted as two channels names.

First channel is the map name, second contains other details: gamemode, layer and player count.

It is recommended to create a voice channel that no one can join, but everyone can see.

```yaml
prspy:
  # PRSPY server ID
  # Open your server on PRSPY and grab the ID from the URL
  # This ID changes on IP or port change (and probably some other things)
  # Example: ceab9bd17f51d08acc4da77120574bd57e248c98
  id:
  mapChannelID:
  detailsChannelID:
```

## Interactive features

Commands can render buttons for users to interact with the bot or can have a direct action.
Most commands side effect is some kind of log/message on Discord.
Most of them have two types: public and private - first providing less information that the latter.

### ~~Admin Hash ID~~

*This command is currently disabled, this functionality is poorly implemented and needs to be reworked. **Contributions are welcome**.*

### Contact admin

**Command**: `/contactadmin`

This command will render 3 buttons:

- Admin Application
- Ban Appeal
- Report Incident

These 3 buttons will open a form where the user can fill in the required information.

The channel where the form is posted needs to be a Forum channel.
A sent form will be posted to the configured channel as a Post.
Specified tags will be assigned to the post.

It is common to create one Forum channel and direct all forms to it with different tags.

```yaml
contactadmin:
  # The role that should be tagged when a form is posted
  adminRoleID:
  application:
    public:
      channelID:
      tagIDs: []
    private:
      channelID:
      tagIDs: []
  appeal:
    public:
      channelID:
      tagIDs: []
    private:
      channelID:
      tagIDs: []
  report:
    public:
      channelID:
      tagIDs: []
    private:
      channelID:
      tagIDs: []
```

### Ban and unban player

**Commands**:
- `/prban [hashid] [prname] [durationvalue] [durationformat] [reason] <attachment>`
- `/prunban [hashid] [reason]`

This command uses PRISM to ban/unban a player.

It posts a message to two configured channels.

Configuration:
```yaml
prban:
  firsChannelID:
  secondChannelID:
prunban:
  firsChannelID:
  secondChannelID:
```

### Run admin command on the server

**Command**: `/prprism [command]`
