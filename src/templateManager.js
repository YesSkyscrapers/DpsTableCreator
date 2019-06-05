const fsManager = require('./fileManager');
const dbManager = require('./dbManager');
const defines = require('./defines');

let manager = {};

manager.fillNewTable = () => {
    let reportText = fsManager.loadTemplate();

    defines.classes.forEach(gameClass => {
        gameClass.specs.forEach(spec =>{
            //dragon soul
            let reportRow = ``;
            defines.bosses.forEach((boss, index) => {
                if (index == 8)
                    return;

                let dbRecord = dbManager.getRecord(spec.designation, index);
                if (dbRecord && dbRecord.url)
                    reportRow +=  `	[td][FONT=Comic Sans MS][SIZE=3][url=${dbRecord.url}]${dbRecord.dps} ${dbRecord.nickname}[/url][/SIZE][/FONT][/td]${defines.bosses.length - 1 == index ? '' : '\n'}`
                else
                    reportRow += `	[td][/td]${defines.bosses.length - 1 == index ? '' : '\n'}`
            })
            reportText = reportText.replaceAll(`placeforreplace${spec.designation}placeforreplace`, reportRow);

            //firelands
            reportRow = ``;
            let dbRecord = dbManager.getRecord(spec.designation, 8);
            if (dbRecord && dbRecord.url)
                reportRow +=  `	[td][url=${dbRecord.url}]${dbRecord.dps} ${dbRecord.nickname}[/url][/td]\n`
            else
                reportRow += `	[td]здесь мог быть ты[/td]\n`
        
            reportText = reportText.replaceAll(`placeforreplace2${spec.designation}placeforreplace2`, reportRow);
        })
    })

    return reportText;
}

module.exports = manager;