import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { RedditArticle } from 'models/article';
import { NewsFetch } from 'services/news-fetch';
import { ToastUtil } from './utils/toast-util';

@autoinject
export class Feed {

    public articles: RedditArticle[];
    private sub: Subscription;

    constructor(private newsFetch: NewsFetch, private eventAggregator: EventAggregator, private toastUtil: ToastUtil) {
    }

    public async attached() {
        this.articles = await this.newsFetch.getTopHeadlines();
    }

    public async updateFeed() {
        this.sub = this.eventAggregator.subscribe(`feed-update:`, async (updatedResponse) => {
            this.articles = await this.newsFetch.getTopHeadlines(updatedResponse);
            this.toastUtil.customToast('Feed refreshed', 2000, 'success');
        });

    }

    public detached() {
        this.sub.dispose();
    }
}
