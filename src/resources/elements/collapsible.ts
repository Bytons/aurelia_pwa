import { MdCollapsible } from 'aurelia-materialize-bridge';
export class Collapsible {
    protected items: any[];
    private collapsible: MdCollapsible;

    public async activate(model) {
        this.items = model;
    }

    protected toggleN(n: number) {
        for (let i = 0; i < n; i++) {
            this.collapsible.open(i);
        }
    }
}
