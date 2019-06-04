const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var fs = require("fs");
const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const nightmare = Nightmare({show: false});

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

const bosses = [
    {
        names: ['Морх']
    },
    {
        names: ['Зоноз', "Зон'оз"]
    },
    {
        names: ['Йорик', "Йор'садж", 'Йорсадж', 'Йорсардж']
    },
    {
        names: ['Хагара']
    },
    {
        names: ['Ультра', 'Ультраксион']
    },
    {
        names: ['Воевода']
    },
    {
        names: ['Спина', 'Хребет']
    },
    {
        names: ['Безумие', 'Меднес']
    }
]


let classes = [
    {
        classNames: ['рыцарь смерти', 'дк'], 
        specs: [
            {designation: 'adk', specNames: ['адк', 'анхоли', 'нечестивость']}, 
            {designation: 'fdk', specNames: ['фдк', 'фрост','лед','лёд']}
        ]
    }, 
    {
        classNames: ['воин', 'вар'], 
        specs: [
            {designation: 'awar', specNames: ['авар', 'армс', 'оружие']}, 
            {designation: 'fwar', specNames: ['фвар', 'фури', 'неистовство']}
        ]
    }, 
    {
        classNames: ['паладин', 'пал'], 
        specs: [
            {designation: 'rpal', specNames: ['рпал', 'ретри','воздаяние']}, 
            {designation: 'miss', specNames: []}
        ]
    }, 
    {
        classNames: ['шаман', 'шам'], 
        specs: [
            {designation: 'elem', specNames: ['элем', 'стихии']}, 
            {designation: 'enh', specNames: ['энх', 'совершенствование']}
        ]
    },
    {
        classNames: ['охотник', 'хант'], 
        specs: [
            {designation: 'surf', specNames: ['схант', 'сурв', 'выживание']}, 
            {designation: 'mm', specNames: ['мхант','мм', 'стрельба']}
        ]
    }, 
    {
        classNames: ['разбойник', 'рога'], 
        specs: [
            {designation: 'combat', specNames: ['крога', 'комбат', 'бой']}, 
            {designation: 'likvid', specNames: ['лрога','ликвидация', 'мути']}, 
            {designation: 'skrit', specNames: ['срога','скрытность', 'шд', 'саб']}
        ]
    },   
    {
        classNames: ['друид', 'дру'], 
        specs: [
            {designation: 'bear', specNames: ['мишка', 'медведь']}, 
            {designation: 'balance', specNames: ['сова','баланс', 'мунк']}, 
            {designation: 'cat', specNames: ['кот']}
        ]
    },  
    {
        classNames: ['маг', 'волшебник'], 
        specs: [
            {designation: 'amage', specNames: ['аркан', 'тайная магия']}, 
            {designation: 'fmage', specNames: ['фаер','огонь']}
        ]
    },  
    {
        classNames: ['чернокнижник', 'лок', 'варлок'], 
        specs: [
            {designation: 'destro', specNames: ['дестрик', 'разрушение']}, 
            {designation: 'demon', specNames: ['демон','демонология']}, 
            {designation: 'aflic', specNames: ['афлик', 'колдовство']}
        ]
    },  
    {
        classNames: ['прист', 'жрец'], 
        specs: [
            {designation: 'shp', specNames: ['шп', 'тьма', 'шэдоу']}
        ]
    }]
let table = {};
let newMessages = [];

const getPostUrl = (page) => `https://forum.wowcircle.com/showthread.php?t=751575&page=${page}`;

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

const loadPreviousTable = () => {
    
    var text = fs.readFileSync("./previousTable.txt", 'utf-8');

    let index = 0;

    for (index = 0; index < classes.length; index ++)
    {
        let currentClass = classes[index].specs;
        let index2 = 0;
        let TableObject = findTagObject('table',text);
        let TrObject = findTagObject('tr',TableObject.content);
        TableObject.content = TableObject.content.replace(TrObject.fullText, '');

        for (index2 = 0; index2 < currentClass.length; index2 ++)
        {
            //console.log(`loading spec ${currentClass[index2]}`);
            table[currentClass[index2].designation] = {};

            TrObject = findTagObject('tr',TableObject.content);
            
            //console.log(TrObject.content)

            let TdObject = findTagObject('td', TrObject.content);
            TrObject.content = TrObject.content.replace(TdObject.fullText, '');

            let index3 = 0;

            for (index3 = 0; index3 < 8; index3 ++)
            {
                TdObject = findTagObject('td', TrObject.content);
                let URLObject = findTagObject('url', TdObject.content);
                //console.log(currentClass[index2], index3, URLObject.content, URLObject.parametr);

                table[currentClass[index2].designation][index3] = {
                    nickname: URLObject.content.replace( /\s\s+/g, ' ' ).split(' ')[1],
                    dps: URLObject.content.replace( /\s\s+/g, ' ' ).split(' ')[0],
                    url: URLObject.parametr
                }

                TrObject.content = TrObject.content.replace(TdObject.fullText, '');
            }

            TableObject.content = TableObject.content.replace(TrObject.fullText, '');
        }

        text = text.replace(TableObject.fullText, '');
    }
}
  
let reportMessages = [];

let logReportMessages = () => {
    let report = '';

    Object.keys(ReportTypes).forEach((errorType, errIndex) => {
        let filteredReports = reportMessages.filter(reportMessage => reportMessage.type == ReportTypes[errorType]);
        if (filteredReports.length > 0)
        {
            report += `${(errIndex == 0) ? "":"\n\n"}${ReportTypesMessages[errIndex]}: \n\n`;
            filteredReports.forEach(reportMessage => {
                report += `${reportMessage.number}: ${reportMessage.message}\n`;
            })
        }
    })

    fs.writeFileSync("reportMessages.txt", report, 'utf-8')
}

let saveReportMessage = (type, message) => {
    reportMessages.push({type: type, number: message.number, message: message.text.replaceAll('\n', '')});
}

let countLinks = (text) => {
    return text.split('<a href="').length - 1;
}

let pullLink = (text) => {
    let linkStartIndex = text.indexOf(`<a href="`) + 9;
    let linkEndIndex = text.indexOf('"', linkStartIndex+1);

    if (linkEndIndex < 0 || linkStartIndex < 0)
    {
        throw { errorType: ReportTypes.CANT_PULL_LINK }
    }

    return text.substring(linkStartIndex,linkEndIndex);
} 

let pullDps = (text) => {
    var NUMERIC_REGEXP = /( |<br>)[-]{0,1}[\d]*[\.]{0,1}[\d]+( |<br>)/g;

    let dps = text.match(NUMERIC_REGEXP);
    if (dps == null)
        throw { errorType: ReportTypes.CANT_PULL_DPS }

    if (dps.length > 1)
        throw { errorType: ReportTypes.CANT_CHOOSE_DPS }

    return dps[0].trim();
} 

let clearRecord = (record, dpsRecord) => {
    let aTagStartIndex = record.indexOf("<a href=")
    let aTagEndIndex = record.indexOf("</a>", aTagStartIndex)+4;
    return record
        .replace(record.substring(aTagStartIndex, aTagEndIndex), "")
        .replace(dpsRecord.dps, "");
}

let processDpsRecord = (recordObject) => {

    let record = recordObject.text;

    let dpsRecord = {
        link: '',
        dps: ''
    }

    try
    {
        dpsRecord.link = pullLink(record);
        dpsRecord.dps = pullDps(record);
    }catch(err)
    {
        saveReportMessage(err.errorType, recordObject);
        return;
    }
    let leftText = clearRecord(record, dpsRecord);

    let dividedLeftText = leftText.split(' ').filter(text => text.length > 1);
    let usedIndexes = [];

    //определение босса
    dividedLeftText.forEach((partOfText, index) => {
        bosses.forEach(boss => {
            boss.names.forEach(bossName => {
                if (partOfText.toLowerCase().indexOf(bossName.toLowerCase()) >= 0)
                {
                    if (dpsRecord.boss && dpsRecord.boss != boss)
                    {
                        saveReportMessage(ReportTypes.MULTI_BOSSES_MESSAGE, recordObject);
                        return;
                    }

                    dpsRecord.boss = boss;
                    usedIndexes.push(index);
                }
            })
        })
    })

    if (!dpsRecord.boss)
    {
        saveReportMessage(ReportTypes.CANT_PULL_BOSS, recordObject);
        return;
    }

    //определение класса
    dividedLeftText.forEach((partOfText, index) => {
        classes.forEach(gameClass => {
            gameClass.specs.forEach(spec => {
                spec.specNames.forEach(specName => {
                    if (partOfText.toLowerCase().indexOf(specName.toLowerCase()) >= 0)
                    {
                        if ((dpsRecord.spec && dpsRecord.spec != spec) || (dpsRecord.class && dpsRecord.class != gameClass))
                        {
                            saveReportMessage(ReportTypes.MULTI_CLASSES_MESSAGE, recordObject);
                            return;
                        }

                        dpsRecord.class = gameClass;
                        dpsRecord.spec = spec;
                        usedIndexes.push(index);
                    }
                })
            })
        })
    })

    if (!dpsRecord.spec || !dpsRecord.class)
    {
        saveReportMessage(ReportTypes.CANT_PULL_CLASS, recordObject);
        return;
    }

    //console.log(dpsRecord.class);
    
    //Чистка от имена класса
    dividedLeftText.forEach((partOfText, index) => {
        dpsRecord.class.classNames.forEach(className => {
            if (partOfText.toLowerCase().indexOf(className.toLowerCase()) >= 0)
            {
                usedIndexes.push(index);
            }
        })
    })

    let expectedName = dividedLeftText.filter((partOfText, index) => !usedIndexes.includes(index));
    switch(true){
        case expectedName.length == 0:
            saveReportMessage(ReportTypes.CANT_PULL_NICK, recordObject);
            return;
        case expectedName.length > 1:
            saveReportMessage(ReportTypes.MULTI_NICKS_MESSAGE, recordObject);
            return;
        default:
            dpsRecord.nick = expectedName[0];
    }

    let previousRecord = table[dpsRecord.spec.designation][bosses.findIndex((boss) => boss == dpsRecord.boss)];
    if (parseFloat(previousRecord.dps) >= parseFloat(dpsRecord.dps))
    {
        saveReportMessage(ReportTypes.UNBEATEN_RECORD, recordObject);
        return;
    }

    let newDbRecord = {
        nickname: dpsRecord.nick,
        dps: dpsRecord.dps,
        url: dpsRecord.link
    }

    table[dpsRecord.spec.designation][bosses.findIndex((boss) => boss == dpsRecord.boss)] = newDbRecord;
}

let processMultiDpsRecords = (records) => {
    records.text
        .split('<br>\n')
        .forEach(record => {if (record.length > 2) processDpsRecord({number: records.number, text: record})});
}

let processMessage = (message) => {
    
    let linksCount = countLinks(message.text);
    switch(true){
        case linksCount == 0:
            saveReportMessage(ReportTypes.HAVENT_LINK, message);
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

let createNewTable = () => {
    let reportText = fs.readFileSync('tableTemplate.txt', 'utf-8');
    classes.forEach(gameClass => {
        gameClass.specs.forEach(spec =>{
            let reportRow = ``;
            bosses.forEach((boss, index) => {
                let dbRecord = table[spec.designation][index];
                if (dbRecord && dbRecord.url)
                    reportRow +=  `	[td][FONT=Comic Sans MS][SIZE=3][url=${dbRecord.url}]${dbRecord.dps} ${dbRecord.nickname}[/url][/SIZE][/FONT][/td]${bosses.length - 1 == index ? '' : '\n'}`
                else
                    reportRow += `	[td][/td]${bosses.length - 1 == index ? '' : '\n'}`
            })
            reportText = reportText.replaceAll(`placeforreplace${spec.designation}placeforreplace`, reportRow);
        })
    })

    fs.writeFileSync('newTable.txt', reportText, 'utf-8');
}

readline.question(`С какой страницы обрабатывать данные? `, (page) => {

    readline.question(`До какой страницы обрабатывать данные?(включительно) `, (lastPage) => {
    
        loadPreviousTable();

        let messages = [];

        let getData = html => {
            data = [];
            const $ = cheerio.load(html, { decodeEntities: false });

            $('blockquote.postcontent.restore').each(function(i, elem) {
                if ($(elem).parent().attr('id').indexOf('post_message') >= 0)
                {
                    $(elem).children('.bbcode_container').each(function(index, element) {
                        $(element).remove();
                    });
                    messages.push({number: ($($(elem).parent().parent().parent().parent().parent().parent().children('.posthead').children('.nodecontrols').children().get(1))).attr('name'), text: $(elem).eq(0).html().trim()});
                }
            });

        };
        

        let currentPage = page;

        let loadingPromise =  () => new Promise((resolve, rej) => {
            console.log(`${currentPage}/${lastPage}`)
            if (currentPage == lastPage)
            {
                return nightmare
                .goto(getPostUrl(currentPage))
                .wait('body')
                .evaluate(()=>document.querySelector('body').innerHTML)
                .end()
                .then(res => {
                    getData(res)
                    return resolve();
                })

            }
            else
            {
                return nightmare
                .goto(getPostUrl(currentPage++))
                .wait('body')
                .evaluate(()=>document.querySelector('body').innerHTML)
                .then(res => {
                    getData(res)
                    return loadingPromise().then(res => resolve());
                })
            }
        });
        
        loadingPromise().then(res => {
            console.log('processing')
            fs.writeFileSync('temp.txt', JSON.stringify(messages), 'utf-8')

            messages.forEach(processMessage);

            createNewTable();

            logReportMessages();
        })
        .catch(err => console.log(err))

        readline.close()
    });
})