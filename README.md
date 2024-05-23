# Tommy Bot

Creator: @MaxZK [R-DEV]Max_

Maintainer: @emilekm [R-CON]cassius23

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
  # Directories where files are stored
  source:
    # Example: /pr//server/mods/pr/demos/
    bf2demos:
    # Example: /pr/server/demos/
    prdemos:
    # Example: /pr/server/json/
    prjson:
  ftp:
    host:
    username:
    password:
    # Directories where files should be uploaded to
    destination:
      # Example: demos/bf2/
      bf2demos:
      # Example: demos/pr/
      prdemos:
      # Example: demos/json/
      prjson:
  channelID:
  urls:
    # URL where BF2Demos can be accessed on the internet (without the filename)
    # Example: https://demos.myserver.gg/bf2/
    bf2demos:
    # URL where PRDemos can be accessed on the internet (without the filename)
    # Example: https://demos.myserver.gg/pr/
    prdemos:
    # URL where tracker viewer can be accesseded
    # Domain needs to be the same as the one used for prdemo (for CORS)
    # Example: https://demos.myserver.gg/realitytracker/
    trackerViewer:
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

Configuration:
```yaml
prban:
  pubChannelID:
  privChannelID:
prunban:
  pubChannelID:
  privChannelID:
```

### Run admin command on the server

**Command**: `/prprism [command]`
