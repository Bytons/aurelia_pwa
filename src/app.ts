import { autoinject } from 'aurelia-framework';
import { ServiceWorkerUtil } from './utils/service-worker-util';

@autoinject
export class App {
  public message = 'Registering SW for testing';

  constructor(private swUtil: ServiceWorkerUtil) {
  }

  public async activate() {
    await this.swUtil.register();
  }
}
