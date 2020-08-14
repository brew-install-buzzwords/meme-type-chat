const axios = require('axios');
const meme_type = require('meme-type-npm');

const commandMapping = {
    '/spaceify': meme_type.spaceify,
    '/clapify': meme_type.clapify,
    '/emojify': meme_type.emojify,
    '/l33t1fy': (x) => meme_type.l33t1fy(x, {substitutionType: 'numbers'}),
    '/smashify': meme_type.smashify,
    '/altcapify': meme_type.altCapify,
    '/start': welcome,
    '/help': help,
};

function welcome () {
    return 'Welcome to meme-type! If you\'re new to using this bot, type /help for more info';
}

function help () {
    return [
        'meme-type is a translator for internet speak.',
        'Use one of the following commands, followed by the text you\'d like to translate.',
        '/spaceify - s p a c e d o u t',
        '/clapify - CLAPS 👏 AND 👏 ALL 👏 CAPS',
        '/emojify - rise 💯💯 and grind 😎😎😎',
        '/l33t1fy - 83c0m3 h4ck3r',
        '/smashify - ahdfgld;',
        '/altcapify - aRe yOu mOcKiNg mE',
    ].join('\n');
}

const commands = Object.keys(commandMapping);

const parseCommand = (message) => {

    const command = message ? message.split(' ')[0] : '';
    console.log(command);
    if (command && command[0] === '/' && commands.includes(command)) {
        const s = message.replace(`${command} `, '');
        console.log(s);
        const s2 = commandMapping[command](s);
        console.log(`${command}: ${s2}`);
        return s2;
    }

    return 'ERROR: command not recognized';
}

const sendMessage = async (chatId, inputText) => {
    const token = process.env.TOKEN;

    console.log(`sendMessage chatId: ${chatId}`);
    console.log(`sendMessage text: ${text}`);
    let message = inputText;

    const parsed = parseCommand(inputText);
    if (parsed) {
        message = parsed;
    }

    const data = {
        chat_id: chatId,
        text: message,
    };

    await axios.post(`https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage?chat_id=${encodeURIComponent(chatId)}&text=${encodeURIComponent(message)}`, data).then(response => {
        console.log(response);
    });
}

const getBody = (event) => {
    return JSON.parse(event.body);
}

const getChatId = (requestBody) => {    
    if (requestBody && requestBody.message && requestBody.message.chat) {
        return requestBody.message.chat.id;
    }
}

const getMessage = (requestBody) => {
    if (requestBody && requestBody.message) {
        return requestBody.message.text;
    }
}

exports.handler = async (event) => {
    console.log(event);

    try {
        const requestBody = getBody(event);
        const requestMessage = getMessage(requestBody);
        const chatId = getChatId(requestBody);

        console.log(`requestMessage: ${requestMessage}`);
        console.log(`chatId: ${chatId}`);

        await sendMessage(chatId, requestMessage);

        return JSON.stringify(
            {
                statusCode: 200,
            }
        );
    } catch (e) {
        console.error(e);
        return JSON.stringify(
            {
                statusCode: 500,
                body: JSON.stringify('failed to send message'),
            }
        );
    }
};
