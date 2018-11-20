import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import environment from 'environment';

@autoinject
export class ServiceWorkerUtil {
    public isOnline = navigator.onLine;
    public reg;
    private isUpdateAvailable: Promise<{}>;
    private isUpdateResolve: (registerEvent) => void;

    constructor(public ea: EventAggregator) {
        this.isUpdateAvailable = new Promise((resolve) => {
            this.isUpdateResolve = resolve;
        });
    }

    public getRegisterEvent(): Promise<{}> {
        return this.isUpdateAvailable;
    }

    /**
     * Register the service worker file in use to the browser
     */
    public register() {
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        } else {
            console.log('Browser does not support service workers');
        }
        this.installPromptListener();
        this.monitorOfflineOnline();
    }

    public removeEntryFromCache(entry, cacheName) {
        navigator.serviceWorker.controller.postMessage({ id: 'remove-entry', cacheName, entry });
    }

    public deleteCache(cacheName) {
        navigator.serviceWorker.controller.postMessage({ id: 'delete-cache', cacheName });
    }

    private async registerServiceWorker() {
        this.reg = await navigator.serviceWorker.register(environment.swUrl);

        if (this.reg.waiting) { this.isUpdateResolve(this.reg); }

        this.reg.onupdatefound = () => {
            const installingWorker = this.reg.installing;
            installingWorker.onstatechange = () => this.onInstallingChange(installingWorker, this.reg);
        };
    }

    private onInstallingChange(installingWorker, reg) {
        if (installingWorker.state === 'installed') {
            const hasUpdate = !!navigator.serviceWorker.controller;
            this.isUpdateResolve(hasUpdate ? reg : false);
        }
    }

    // Listener for installing the app as native (mobile, some desktops)
    private installPromptListener() {
        window.addEventListener('beforeinstallprompt', (event: any) => {
            event.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompts');
                }
                sessionStorage.promptChoice = choiceResult.outcome;
            });
        });
    }

    private monitorOfflineOnline() {
        window.addEventListener('load', () => {
            this.publishOnlineStatus();
        });
        window.addEventListener('online', () => this.publishOnlineStatus());
        window.addEventListener('offline', () => this.publishOnlineStatus());
    }

    // publish the online status of the app for EventAggregator
    private publishOnlineStatus() {
        this.isOnline = navigator.onLine;
        this.ea.publish('online-status', this.isOnline);
    }
}
