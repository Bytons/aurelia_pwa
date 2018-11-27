import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';
import { MdToastService } from 'aurelia-materialize-bridge';
import { NewsFetch } from 'services/news-fetch';
import { ToastUtil } from 'utils/toast-util';
import { App } from '../../src/app';
import { ServiceWorkerUtil } from '../../src/utils/service-worker-util';

const ea = new EventAggregator();
const swUtil = new ServiceWorkerUtil(ea);
const httpClient = new HttpClient();
const toastUtil = new ToastUtil(new MdToastService());

// TODO: write some tests?
