import { autoinject } from 'aurelia-framework';
import { NewsFetch } from './services/news-fetch';
import { ServiceWorkerUtil } from './utils/service-worker-util';

@autoinject
export class App {
  public message = 'Registering SW for testing';

  constructor(private swUtil: ServiceWorkerUtil, private newsFetch: NewsFetch) {
  }

  public async activate() {
    await this.swUtil.register();
    this.newsFetch.getRedditFeed();
  }
}
