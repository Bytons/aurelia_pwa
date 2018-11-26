import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { ToastUtil } from 'utils/toast-util';
import { ServiceWorkerUtil } from './utils/service-worker-util';

@autoinject
export class App {
    public message = 'Top 10 trending reddit - PWA';
    // These control the color scheme of the application, changes affect whole app.
    public primaryColor = '#007bff;';
    public secondaryColor = '#00BBD3';
    public errorColor = '#f44336';
    public successColor = '#4caf50';
    public linkColor = '#039be5';

    constructor(private swUtil: ServiceWorkerUtil, private eventAgggregator: EventAggregator, private toastUtil: ToastUtil) { }

    public async activate() {
        await this.swUtil.register();
        this.eventAgggregator.subscribe('online-status', (isOnline) => {
            this.toastUtil.offlineToast(isOnline);
        });
    }
}
