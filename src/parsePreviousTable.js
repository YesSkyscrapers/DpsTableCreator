const fsManager = require('./fileManager');
const defines = require('./defines');
const fs = require('fs');
const findTagObject =(tag,text) => {
    let result = {};

    result.startTagStartIndex = text.indexOf(`[${tag}`);
    result.startTagEndIndex = text.indexOf(']', result.startTagStartIndex);
    result.endTagStartIndex = text.indexOf(`[/${tag}]`);
    result.endTagEndIndex = result.endTagStartIndex + `[/${tag}]`.length;
    result.parametrStartIndex = text.indexOf('=', result.startTagStartIndex)+1;
    result.parametrEndIndex = text.indexOf(']', result.parametrStartIndex)-1;
    if (result.parametrStartIndex >=0)
    {
        result.parametr = text.substring(result.parametrStartIndex, result.parametrEndIndex+1);
    }
    result.fullText = text.substring(result.startTagStartIndex, result.endTagEndIndex);
    result.content = text.substring(result.startTagEndIndex+1, result.endTagStartIndex);
    return result;
}

const parsePreviousTable = () => {
    let db = {};
    let code = fsManager.loadPreviousTableCode();

    for (let index = 0; index < defines.classes.length; index ++)
    {
        let currentClass = defines.classes[index].specs;
        let TableObject = findTagObject('table',code);
        let TrObject = findTagObject('tr',TableObject.content);

        TableObject.content = TableObject.content.replace(TrObject.fullText, '');

        for (let index2 = 0; index2 < currentClass.length; index2 ++)
        {
            db[currentClass[index2].designation] = {};

            TrObject = findTagObject('tr',TableObject.content);
            let TdObject = findTagObject('td', TrObject.content);
            TrObject.content = TrObject.content.replace(TdObject.fullText, '');

            for (let index3 = 0; index3 < 8; index3 ++)
            {
                TdObject = findTagObject('td', TrObject.content);
                let URLObject = findTagObject('url', TdObject.content);

                db[currentClass[index2].designation][index3] = {
                    nickname: URLObject.content.replace( /\s\s+/g, ' ' ).split(' ')[1],
                    dps: URLObject.content.replace( /\s\s+/g, ' ' ).split(' ')[0],
                    url: URLObject.parametr
                }

                TrObject.content = TrObject.content.replace(TdObject.fullText, '');
            }

            TableObject.content = TableObject.content.replace(TrObject.fullText, '');
        }

        code = code.replace(TableObject.fullText, '');
    }


 

    let ragnaTable = findTagObject('table', code);
    defines.classes.forEach(gameClass => {
        gameClass.specs.forEach(spec => {
            let trObject = findTagObject('tr', ragnaTable.content);

            let tdObject = findTagObject('td', trObject.content);
            trObject.content = trObject.content.replace(tdObject.fullText, '');

            tdObject = findTagObject('td', trObject.content);
            let URLObject = findTagObject('url', tdObject.content);
            db[spec.designation][8] = URLObject.content == 'здесь мог быть ты' ? {} : {
                nickname: URLObject.content.replace( /\s\s+/g, ' ' ).split(' ')[1],
                dps: URLObject.content.replace( /\s\s+/g, ' ' ).split(' ')[0],
                url: URLObject.parametr
            };


            ragnaTable.content = ragnaTable.content.replace(trObject.fullText, '');
        })
    })

    return db;
}

module.exports = parsePreviousTable;