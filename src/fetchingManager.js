const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const nightmare = Nightmare({show: false});

let manager = {};

const getPostUrl = (page) => `https://forum.wowcircle.com/showthread.php?t=751575&page=${page}`;

const parsePage = html => {
    data = [];
    const $ = cheerio.load(html, { decodeEntities: false });

    $('blockquote.postcontent.restore').each(function(i, elem) {
        if ($(elem).parent().attr('id').indexOf('post_message') >= 0)
        {
            $(elem).children('.bbcode_container').each(function(index, element) {
                $(element).remove();
            });
            data.push({number: ($($(elem).parent().parent().parent().parent().parent().parent().children('.posthead').children('.nodecontrols').children().get(1))).attr('name'), text: $(elem).eq(0).html().trim()});
        }
    });

    return data;
};

manager.loadMessages = (currentPage, endPage) => new Promise((resolve, rej) => {

    console.log(`${currentPage}/${endPage}`)

    let loadingThread = nightmare
    .goto(getPostUrl(currentPage))
    .wait('body')
    .evaluate(()=>document.querySelector('body').innerHTML);

    return ((currentPage != endPage) ? 
        loadingThread : 
        loadingThread.end())
            .then(page => {
                let currentPageData = parsePage(page)
                return (currentPage == endPage) ? 
                    resolve(currentPageData) : 
                    manager
                        .loadMessages(++currentPage, endPage)
                        .then(nextData => 
                            resolve(currentPageData.concat(nextData))
                        );
            })
});

module.exports = manager;