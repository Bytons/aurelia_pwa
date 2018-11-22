import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';
import { NewsFetch } from 'services/news-fetch';
import { App } from '../../src/app';
import { ServiceWorkerUtil } from '../../src/utils/service-worker-util';

const ea = new EventAggregator();
const swUtil = new ServiceWorkerUtil(ea);
const httpClient = new HttpClient();
const newsFecth = new NewsFetch(httpClient);

describe('the app', () => {
  it('Should display reddit r-all PWA', () => {
    expect(new App(swUtil, newsFecth).message).toBe('Reddit /r/ all PWA');
  });
});
