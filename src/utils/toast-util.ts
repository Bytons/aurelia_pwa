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
}
