const discord = require('discord.js')
const webhook = new discord.WebhookClient(process.env.ID, process.env.TOKEN)

const api = require('newsapi')
const NewsApi = new api(process.env.NEWSAPI)

const blacklistedSources = ["Tribunnews.com"]

exports.sendNews = (event, context) => {
    const articles = await NewsApi.v2.topHeadlines({
        country: 'id'
    }).then(news => news.articles)
    
    const embeds = articles.filter(function(article){
            var isBlacklisted = false;
            blacklistedSources.forEach(source => {
                if (article.source.name.includes(source)){
                    isBlacklisted = true;
                }
            });
            return !isBlacklisted;
        }).map(article => ({
            url: article.url,
            thumbnail: {
                width: 400,
                height: 300,
                url: article.urlToImage,
            },
            title: article.title,
            description: article.description,
            timestamp: article.publishedAt
        })).slice(0,5);
    console.log(JSON.stringify(embeds));
    
    webhook.send("KORAN KORAN!\nAmbil ini, tambahlah ilmu pengetahuan",{
        embeds: embeds
    })
    
}