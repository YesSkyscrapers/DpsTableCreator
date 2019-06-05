const parsePreviousTable = require('./parsePreviousTable');

let manager = {};
let db = parsePreviousTable();

manager.getRecord = (specDesignation, bossIndex) => {
    return db[specDesignation][bossIndex];
}

manager.updateRecord = (specDesignation, bossIndex, nick, dps, url) => {
    db[specDesignation][bossIndex] = {
        nickname: nick,
        dps: dps,
        url: url
    };
}

module.exports = manager;