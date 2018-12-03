import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { MdToastService } from 'aurelia-materialize-bridge';
import { RedditArticle } from 'models/article';
import { NewsFetch } from 'services/news-fetch';
import { ToastUtil } from './utils/toast-util';

@autoinject
export class Feed {

    public articles: RedditArticle[];
    private sub: Subscription;

    constructor(private newsFetch: NewsFetch, private eventAggregator: EventAggregator, private toast: MdToastService) {
    }

    public async attached() {
        this.articles = await this.newsFetch.getTopHeadlines();
        this.sub = this.eventAggregator.subscribe('feed-update:', async (updatedResponse) => {
            setTimeout(() => {
                this.updateFeed(updatedResponse);
            }, 2000);
        });

    }

    public async updateFeed(updatedResponse) {
        const data = await updatedResponse.json();
        this.toast.show('Swipe to refresh feed from network', 120000, 'blue').then(() => {
            this.articles = data.articles;
            this.toast.show('Feed refreshed!', 2000, 'success');
        });
    }

    public detached() {
        this.sub.dispose();
    }
}
