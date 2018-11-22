import { autoinject } from 'aurelia-framework';
import { RedditArticle } from './models/article';
import { NewsFetch } from './services/news-fetch';
import { ServiceWorkerUtil } from './utils/service-worker-util';

@autoinject
export class App {
  public message = 'Reddit /r/ all PWA';

  // TODO: refactor this to something nicer with a class and stuff
  public articles: RedditArticle[];

  constructor(private swUtil: ServiceWorkerUtil, private newsFetch: NewsFetch) {
  }

  public async activate() {
    await this.swUtil.register();
    this.articles = await this.newsFetch.getRecentArticles();
  }
}
