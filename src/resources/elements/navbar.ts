import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import environment from 'environment';

@autoinject
export class Navbar {
    protected githubUrl = 'https://github.com/bytons/aurelia_pwa';
    protected isOnline = navigator.onLine;
    protected baseUrl = environment.baseUrl;

    constructor(private ea: EventAggregator) { }

    public attached() {
        this.ea.subscribe('online-status', (isOnline) => {
            this.isOnline = isOnline;
        });
    }
}
