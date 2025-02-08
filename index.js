const fetch = require('node-fetch');
var http = require('http');
const tmi = require('tmi.js'),


    { channel, username, password, Clientid, secret } = require('./settings.json');
   
    const client = new tmi.Client(
        {
            options: { debug: true },
            connection: {
                reconnect: true,
                secure: true,
            },
            identity: {
                username,
                password
            },
            channels: [channel]
        }
    );

client.connect().catch(console.error);

client.on('subscription', (channel, username, method, message, userstate) => {
    console.log('subscription', { channel, username, method, message, userstate });
    client.say(channel, `Thanks for subscribing, ${username}!`);
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate, sharedStreak, cumulativeMonths) => {
    let senderCount = ~~userstate["msg-param-sender-count"];
    if (senderCount > 1) {
        client.say(channel, `${username} has Gifted ${senderCount} subs Thank you`)
    }
    else {
        client.say(channel, `${username} has Gifted a sub to ${recipient} thank you`)}

    if (sharedStreak) {
            client.say(channel, `Thanks for resubscribing for ${streakMonths} consecutive months, ${username}!`);
    }
    else {
            client.say(channel, `Thanks for resubscribing for ${cumulativeMonths} months, ${username}!`);
    }
});

client.on("anongiftpaidupgrade", (channel, username, userstate) => {
    client.say(channel, `${userstate.username} has upgraded their sub Thank you`)
});

client.on('resub', (channel, username, _months, message, userstate, methods) => {
    console.log('resub', { channel, username, message, userstate, methods });
    let streakMonths = userstate['msg-param-streak-months'];
    let cumulativeMonths = userstate['msg-param-cumulative-months'];
    let sharedStreak = userstate['msg-param-should-share-streak'];
    if (sharedStreak) {
        client.say(channel, `Thanks for resubscribing for ${streakMonths} consecutive months, ${username}!`);
    }
    else {
        client.say(channel, `Thanks for resubscribing for ${cumulativeMonths} months, ${username}!`);
    }
});

client.on("cheer", (channel, userstate, message) => {
    client.say(channel, `${userstate.username} has cheered ${userstate.bits} bits thank you`)
});

client.on("raided", (channel, username, viewers) => {
    client.say(channel, ` ${username} has raided with ` + viewers + ` viewer(s)`)
    console.log('test')
});

client.on("message", (channel, userstate, message, self, user, username) => {
    if (message == '!hello') {
        client.say(channel, "Working");
    }

    if (message == '!welcome') {
        client.say(channel, `Welcome Into the Channel I hope you enjoy your Stay!`);
    }

    if (message.startsWith("!roll")) {
        if (message.includes(" ")) {
            const split = message.split(" ");
            if (!isNaN(parseInt(split[1]))) {
                client.say(channel, `@${user.username} rolled a ${Math.floor(Math.random() * parseInt(split[1])) + 1}!`);
            } else {
                client.say(channel, `@${user.username} Please use numbers`);
            }
        } else {
            client.say(channel, `@${user.username} Please use numbers`);
        }
    }

    if (message == '!yt') {
        client.say(channel, `Regen's youtube link is https://www.youtube.com/channel/UC74a9DHia0rDbDIPdi_x4Hw`);
    }

    if (message == '!discord') {
        client.say(channel, `The Regeneration Station's Link is https://discord.gg/DYERhSKsED`);
    }

    if (message == 'lol') {
        client.say(channel, `OMEGALUL KEKW OMEGALUL KEKW OMEGALUL KEKW OMEGALUL KEKW`)
    }

    if (message == `!sellout`) {
        client.say(channel, `!youtube !discord`)
    }

    if (message == `!send`) {
        client.say(channel, `Ima just Sendddd it`)
    }

    if (message == `!commands`) {
        client.say(channel, `The Commands are !roll #, !discord, !nut, !yt, !hype, !Bad, and tiggers are , lol`)
    }
    
    if (message == `!disconnect`) {
        client.disconnect()
    }

    if (message == `Hydrate`) {
        client.say(channel, `Yall Best be getting water.... Chat this includes yall as well`)
    }

    if (message == `!21st`) {
        client.say(channel, `Do you remember
            The 21st night of September?
            Love was changin' the minds of pretenders
            While chasin' the clouds away`)
    }

    if (message.startsWith("!so")) {
        if (message.includes("!so ")) {
            const split = message.split(" ");
            getUserId(split[1], channel, client);
        }
    }

});


async function getUserId(username, channel, client) {
    const responce = await fetch("https://api.twitch.tv/helix/users?login=" + username.replace('@', ""), {
        headers: {
            'Authorization': 'Bearer ' + password,
            'Client-Id': Clientid
        }
    });

    try {
        const json = await responce.json();
        completeShoutout(json.data[0].id, channel, client);
    }
    catch (error) {
        completeShoutout("0", channel, client);
    }
};

function completeShoutout(id, channel, client) {
    if (id != "0") {
        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));;
        let url = "https://api.twitch.tv/helix/channels?broadcaster_id=" + id;
        let settings = {
            headers: {
                'Authorization': 'Bearer ' + password,
                'Client-Id': Clientid
            },
            method: 'GET'
        };

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                var username = json.data[0].broadcaster_name;
                var game = json.data[0].game_name;
                var link = "https://www.twitch.tv/" + json.data[0].broadcaster_name;

                client.say(channel, "Thank you " + username + " for the host/raid. " + link + " They last played " + game);
            })
            .catch(function (error) {
                client.say(channel, "Insert no user found");
            });
        console.log('testing something');

    } else {
        client.say(channel, "Insert no user found");
    }
}

