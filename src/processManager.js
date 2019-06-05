const processUtils = require('./processUtils');
const errorManager = require('./errorManager');
const dbManager = require('./dbManager');
const defines = require('./defines');

let manager = {};

const processDpsRecord = (recordObject) => {

    let record = recordObject.text;

    let dpsRecord = {
        link: '',
        dps: ''
    }

    try
    {
        dpsRecord.link = processUtils.pullLink(record);
        dpsRecord.dps = processUtils.pullDps(record);
    
        let leftText = processUtils.removeDpsAndLink(record, dpsRecord.dps);
        let dividedLeftText = leftText.split(' ').filter(text => text.length > 1);
        let usedIndexes = [];

        let pullBossInfo = processUtils.pullBoss(dividedLeftText);
        usedIndexes.push(pullBossInfo.usedIndex);
        dpsRecord.boss = pullBossInfo.boss;

        let pullSpecInfo = processUtils.pullSpec(dividedLeftText);
        usedIndexes.push(pullSpecInfo.usedIndex);
        dpsRecord.class = pullSpecInfo.class;
        dpsRecord.spec = pullSpecInfo.spec; 
        
        usedIndexes = usedIndexes.concat(processUtils.pullClassDescriptionInfo(dpsRecord.class, dividedLeftText).usedIndexes);     
        dpsRecord.nick = processUtils.pullNick(dividedLeftText.filter((text, index) => !usedIndexes.includes(index)));

        let previousRecord = dbManager.getRecord(dpsRecord.spec.designation, defines.bosses.findIndex((boss) => boss == dpsRecord.boss));
        if (parseFloat(previousRecord.dps) >= parseFloat(dpsRecord.dps))
        {
            throw { errorType: errorManager.ReportTypes.UNBEATEN_RECORD }
        }

    }catch(err)
    {
        if (!Object.values(errorManager.ReportTypes).includes(err.errorType))
            throw err;

        errorManager.push(err.errorType, recordObject);
        return;
    }

    dbManager.updateRecord(
        dpsRecord.spec.designation, 
        defines.bosses.findIndex((boss) => boss == dpsRecord.boss),
        dpsRecord.nick, 
        dpsRecord.dps, 
        dpsRecord.link
    );
}

const processMultiDpsRecords = (message) => {
    message.text
        .split('<br>\n')
        .forEach(row => {if (row.length > 2) processDpsRecord({number: message.number, text: row})});
}

manager.processMessage = (message) => {
    
    let linksCount = processUtils.countLinks(message.text);
    switch(true){
        case linksCount == 0:
            errorManager.push(errorManager.ReportTypes.HAVENT_LINK, message);
            break;
        case linksCount == 1:
            message.text = message.text.replaceAll('<br>\n', ' ');
            processDpsRecord(message);
            break;
        case linksCount > 1:
            processMultiDpsRecords(message);
            break;
    }
}

module.exports = manager;