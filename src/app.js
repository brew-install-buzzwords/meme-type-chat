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

function parseCommand(message) {

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

/**
 * Builds response
 * @param {*} chatId
 * @param {*} inputText 
 */
function buildResponse(chatId, inputText) {
    let message = inputText;

    const parsed = parseCommand(inputText);
    if (parsed) {
        message = parsed;
    }

    return {
        statusCode: 200,
        body: JSON.stringify(`${chatId}: ${message}`),
    };
}

/**
 * Gets the request event body
 * @param {*} event the request event
 */
function getBody(event) {
    return JSON.parse(event.body);
}

/**
 * Gets the chatId from the request body
 * @param {*} requestBody the request body
 */
function getChatId(requestBody) {    
    if (requestBody && requestBody.message && requestBody.message.chat) {
        return requestBody.message.chat.id;
    }
}

/**
 * Gets the message from the request body
 * @param {*} requestBody the request body
 */
function getMessage(requestBody) {
    if (requestBody && requestBody.message) {
        return requestBody.message.text;
    }
}

exports.telegramHandler = async (event) => {
    console.log(event);

    try {
        const requestBody = getBody(event);
        const requestMessage = getMessage(requestBody);
        const chatId = getChatId(requestBody);

        console.log(`requestMessage: ${requestMessage}`);
        console.log(`chatId: ${chatId}`);

        return buildResponse(chatId, requestMessage);
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
