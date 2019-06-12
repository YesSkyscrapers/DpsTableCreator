const errorManager = require('./errorManager');
const defines = require('./defines');

const countLinks = (text) => {
    return text.split('<a href="').length - 1;
}

const pullLink = (text) => {
    let linkStartIndex = text.indexOf(`<a href="`) + 9;
    let linkEndIndex = text.indexOf('"', linkStartIndex+1);

    if (linkEndIndex < 0 || linkStartIndex < 0)
    {
        throw { errorType: errorManager.ReportTypes.CANT_PULL_LINK }
    }

    return text.substring(linkStartIndex,linkEndIndex);
} 

const pullDps = (text) => {
    var NUMERIC_REGEXP = /( |<br>|)[-]{0,1}[\d]*[\.]{0,1}[\d]+(| |<br>)/g;

    let dps = text.match(NUMERIC_REGEXP);
    
    if (dps == null)
        throw { errorType: errorManager.ReportTypes.CANT_PULL_DPS }

    if (dps.length > 1)
        throw { errorType: errorManager.ReportTypes.CANT_CHOOSE_DPS }

    return dps[0].trim();
} 

const removeDpsAndLink = (record, dps) => {
    let aTagStartIndex = record.indexOf("<a href=")
    let aTagEndIndex = record.indexOf("</a>", aTagStartIndex)+4;
    return record
        .replace(record.substring(aTagStartIndex, aTagEndIndex), "")
        .replace(dps, "");
}

const pullBoss = (texts) => {
    info = {};

    texts.forEach((text, index) => {
        defines.bosses.forEach(boss => {
            boss.names.forEach(bossName => {
                if (text.toLowerCase().indexOf(bossName.toLowerCase()) >= 0)
                {
                    if (info.boss && info.boss != boss)
                    {
                        throw { errorType: errorManager.ReportTypes.MULTI_BOSSES_MESSAGE }
                    }

                    info.boss = boss;
                    info.usedIndex = index;
                }
            })
        })
    });

    if (!info.boss)
    {
        throw { errorType: errorManager.ReportTypes.CANT_PULL_BOSS }
    }

    return info;
}

const pullSpec = (texts) => {
    info = {};

    texts.forEach((text, index) => {
        defines.classes.forEach(gameClass => {
            gameClass.specs.forEach(spec => {
                spec.specNames.forEach(specName => {
                    if (text.toLowerCase().indexOf(specName.toLowerCase()) >= 0)
                    {
                        if ((info.spec && info.spec != spec) || (info.class && info.class != gameClass))
                        {
                            throw { errorType: errorManager.ReportTypes.MULTI_CLASSES_MESSAGE }
                        }

                        info.class = gameClass;
                        info.spec = spec;
                        info.usedIndex = index;
                    }
                })
            })
        })
    })

    if (!info.spec || !info.class)
    {
        throw { errorType: errorManager.ReportTypes.CANT_PULL_CLASS }
    }

    return info;
}

pullClassDescriptionInfo = (gameClass, texts) => {
    let info = {
        usedIndexes: []
    };

    texts.forEach((text, index) => {
        gameClass.classNames.forEach(className => {
            if (text.toLowerCase().indexOf(className.toLowerCase()) >= 0)
            {
                info.usedIndexes.push(index);
            }
        })
    })

    return info;
}

pullNick = (texts) => {
    let expectedNames = texts;
    switch(true){
        case expectedNames.length == 0:
            throw { errorType: errorManager.ReportTypes.CANT_PULL_NICK }
        case expectedNames.length > 1:
            throw { errorType: errorManager.ReportTypes.MULTI_NICKS_MESSAGE }
        default:
            return expectedNames[0];
    }
}

module.exports = {
    countLinks,
    pullDps,
    pullLink,
    removeDpsAndLink,
    pullBoss,
    pullSpec,
    pullClassDescriptionInfo,
    pullNick
}