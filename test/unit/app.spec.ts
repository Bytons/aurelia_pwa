import { EventAggregator } from 'aurelia-event-aggregator';
import { App } from '../../src/app';
import { ServiceWorkerUtil } from '../../src/utils/service-worker-util';

const ea = new EventAggregator();
const swUtil = new ServiceWorkerUtil(ea);

describe('the app', () => {
  it('Should ask to register SW', () => {
    expect(new App(swUtil).message).toBe('Registering SW for testing');
  });
});
