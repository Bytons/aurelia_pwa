import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, observable } from 'aurelia-framework';
import { ToastUtil } from 'utils/toast-util';
import { ServiceWorkerUtil } from './utils/service-worker-util';

@autoinject
export class App {
    public message = 'Top-10 trending posts from reddit';
    // These control the color scheme of the application, changes affect whole app.
    public primaryColor = '#ed5757;;';
    public errorColor = '#f44336';
    public successColor = '#4caf50';
    public linkColor = '#039be5';
    public pageContent: HTMLElement;
    @observable
    public isOnline = navigator.onLine;

    constructor(private swUtil: ServiceWorkerUtil, private eventAgggregator: EventAggregator, private toastUtil: ToastUtil) { }

    public async activate() {
        await this.swUtil.register();
        this.toggleNightMode(this.isOnline);
        this.eventAgggregator.subscribe('online-status', (isOnline) => {
            this.toastUtil.offlineToast(isOnline);
            this.toggleNightMode(isOnline);
        });
    }

    public toggleNightMode(isOnline) {
        if (!isOnline) {
            document.documentElement.classList.add('document-nightmode');
        } else {
            document.documentElement.classList.remove('document-nightmode');
        }
    }
}
