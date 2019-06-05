var fsManager = require("./fileManager");

const ReportTypes = {
    HAVENT_LINK: 0,
    CANT_PULL_LINK: 1,
    CANT_PULL_DPS: 2,
    CANT_CHOOSE_DPS: 3,
    MULTI_BOSSES_MESSAGE: 4,
    CANT_PULL_BOSS: 5,
    MULTI_CLASSES_MESSAGE: 6,
    CANT_PULL_CLASS: 7,
    CANT_PULL_NICK: 8,
    MULTI_NICKS_MESSAGE: 9,
    UNBEATEN_RECORD: 10
}

const ReportTypesMessages = [
    'Сообщения без ссылок',
    'Не получилось выцепить ссылку',
    'Не получилось выцепить дпс',
    'Не понятно, что является дпсом',
    'Указано более 1 босса на скрин',
    'Не указан босс',
    'Указано более 1 класса на скрин',
    'Не указан класс',
    'Не указано имя персонажа',
    'Не удалость распознать ник персонажа. Слишком много постороннего текста',
    'Предыдущий рекорд был лучше'
]

let manager = {};
let errors = [];

manager.ReportTypes = ReportTypes;

manager.logErrorsToFile = () => {
    let text = '';

    Object.keys(ReportTypes).forEach((errorType, errIndex) => {
        let filteredErrors = errors.filter(error => error.type == ReportTypes[errorType]);
        if (filteredErrors.length > 0)
        {
            text += `${(errIndex == 0) ? "":"\n\n"}${ReportTypesMessages[errIndex]}: \n\n`;
            filteredErrors.forEach(error => {
                text += `${error.number}: ${error.message}\n`;
            })
        }
    })

    fsManager.saveErrorMessages(text);
}

manager.push = (type, message) => {
    errors.push({type: type, number: message.number, message: message.text.replaceAll('\n', '')});
}

module.exports = manager;