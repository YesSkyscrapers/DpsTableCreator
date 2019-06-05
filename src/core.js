const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

const fsManager = require('./fileManager');
const processManager = require('./processManager');
const templateManager = require('./templateManager');
const errorManager = require('./errorManager');
const fetchingManager = require('./fetchingManager');

readline.question(`С какой страницы обрабатывать данные? `, (page) => {
    readline.question(`До какой страницы обрабатывать данные?(включительно) `, (lastPage) => {
    
        if (page > lastPage)
        {
            console.log('Неправильный промежуток страниц')
            return;
        }

        fetchingManager.loadMessages(page, lastPage).then(messages => {
            messages.forEach(processManager.processMessage);

            fsManager.saveNewTableCode(templateManager.fillNewTable());

            errorManager.logErrorsToFile();

            console.log('processed')
        })
        .catch(err => console.log(err))

        readline.close()
    });
})