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

	const commandStringRegExp = new RegExp('^(' + commands.join('(\\s|)|') + '(\\s|))+');
    const commandRegExp = new RegExp(commands.join('|'), 'g');

    const commandString = commandStringRegExp.test(message) ? message.match(commandStringRegExp).shift() : '';
    console.log(commandString);

    if (commandString) {
        let s = message.replace(commandString, '');
        console.log(s);
        if(!s){
        	return;
        }

        for(command of commandString.match(commandRegExp)){
        	if(command){
        		s = commandMapping[command](s);
        	}
        }

        console.log(`${commandString}: ${s}`);
        return s;
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
    let response = {
            statusCode: 200,
        };

    const parsed = parseCommand(inputText);
    if (parsed) {
        message = parsed;
        response.body = JSON.stringify(
            {
                method: 'sendMessage',
                chat_id: chatId,
                text: message
            }
        );
    }

    return response;

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
        if(requestMessage){
            return buildResponse(chatId, requestMessage);
        }

        return JSON.stringify(
            {
                statusCode: 200
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
}
