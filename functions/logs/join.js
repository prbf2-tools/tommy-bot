import geoip from 'geoip-lite';

const LOG_JOIN_CH = '995521059119960144';

export function handleJoin(dataJoin, client) {
    let joinLoglines = dataJoin.trim().split("\n")
    var joinLogFormat = joinLoglines[joinLoglines.length - 1].toString('utf-8')
    var joinLogSplit = joinLogFormat.split('\t')
    if (joinLogSplit[6] == '(LEGACY)') {
        var accType = 'Legacy'
    } else if (joinLogSplit[6] == '(VAC BANNED)') {
        var accType = 'VAC Banned'
    } else if (joinLogSplit[6] == '(LEGACY)(VAC BANNED)') {
        var accType = 'Legacy and VAC Banned'
    } else {
        var accType = 'Standard'
    }
    var geoready = 'INVALID'
    var ip = joinLogSplit[5];
    var geo = geoip.lookup(ip);
    if (geo === null) {
        var geoready = "white";
    } else {
        var geoready = geo.country.toLowerCase();
    }



    const joinLogPost = {
        color: 0X6500B3,
        title: joinLogSplit[3],
        description: '**Hash-ID: **`' + joinLogSplit[1]
            + '`\n**IP: **`' + joinLogSplit[5] + '` :flag_' + geoready
            + ':\n**Account Level: **' + joinLogSplit[2]
            + '\n**Account Type: **' + accType
            + '\n**Creation Date: **' + joinLogSplit[4]
            + '\n**Joined: **' + joinLogSplit[0].replace('[', '').replace(']', ''),
    }
    client.channels.cache.get(LOG_JOIN_CH).send({ embeds: [joinLogPost] });
}
