const { WebhookClient } = require('discord.js')
const webhook = new WebhookClient({ url: process.env.WEBHOOK_URL })

const api = require('newsapi')
const NewsApi = new api(process.env.NEWSAPI)

const blacklistedSources = ["Tribunnews.com"]

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
}

function getRandomColor() {
    return Math.floor(Math.random()*16777215);
}

exports.sendNews = (event, context) => {
    NewsApi.v2.topHeadlines({
        country: 'id'
    }).then(news => {
	const randomColor = getRandomColor();
        const embeds = news.articles.filter(function(article){
                var isBlacklisted = false;
                blacklistedSources.forEach(source => {
                    if (article.source.name.includes(source)){
                        isBlacklisted = true;
                    }
                });
                return (!isBlacklisted && validURL(article.url));
            }).map(article => ({
                color: randomColor,
                url: article.url,
                thumbnail: {
                    url: article.urlToImage
                },
                title: article.title,
                description: article.description,
                timestamp: article.publishedAt
            })).slice(0,5);
        console.log(JSON.stringify(embeds));
        
        webhook.send({
            content: "KORAN KORAN!\nAmbil ini, tambahlah ilmu pengetahuan",
            embeds: embeds
        })
    }).catch((error) => {
        assert.isNotOk(error,'Promise error');
        console.log( error.stack )
    });
}
