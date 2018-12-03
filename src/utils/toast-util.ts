import { autoinject } from 'aurelia-framework';
import { MdToastService } from 'aurelia-materialize-bridge';

@autoinject
export class ToastUtil {
    constructor(public toast: MdToastService) {

    }

    public offlineToast(isOnline) {
        if (!isOnline) {
            this.toast.show('Internet connection lost', 2000, 'error');
        } else {
            this.toast.show('Internet connection returned', 2000, 'success');
        }
    }

    public customToast(message: string, time: number, styleClass: string) {
        this.toast.show(message, time, styleClass);
    }

    public async updateToast(message: string, time: number, styleClass: string, registerEvent) {
        await this.toast.show(message, time, styleClass);
        this.toast.show('Swipe to update', 120000, 'success').then(() => {
            registerEvent.waiting.postMessage({ id: 'skipWaiting' });
            window.location.reload();
        });
    }
}
