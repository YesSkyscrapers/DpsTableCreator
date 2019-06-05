var fs = require("fs");

const TEXT_PATH = './texts/'
const TEMPLATE_FILE = TEXT_PATH+'tableTemplate.txt';
const PREV_TABLE_FILE = TEXT_PATH+'previousTable.txt';
const NEXT_TABLE_FILE = TEXT_PATH+'newTable.txt';
const REPORT_MESSAGES_FILE = TEXT_PATH+'reportMessages.txt';

let manager = {};

manager.loadPreviousTableCode = () => {
    return fs.readFileSync(PREV_TABLE_FILE, 'utf-8');
}

manager.saveErrorMessages = (messages) => {
    fs.writeFileSync(REPORT_MESSAGES_FILE, messages, 'utf-8')
}

manager.loadTemplate = () => {
    return fs.readFileSync(TEMPLATE_FILE, 'utf-8');
}

manager.saveNewTableCode = (code) => {
    fs.writeFileSync(NEXT_TABLE_FILE, code, 'utf-8');
}

module.exports = manager;