import { autoinject } from 'aurelia-framework';
import { RedditArticle } from 'models/article';
import { NewsFetch } from 'services/news-fetch';

@autoinject
export class Feed {
    // TODO: refactor this to something nicer with a class and stuff
    public articles: RedditArticle[];

    constructor(private newsFetch: NewsFetch) {
    }

    public async attached() {
        this.articles = await this.newsFetch.getTopHeadlines();
    }
}
