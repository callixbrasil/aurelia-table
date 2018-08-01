import {observable} from 'aurelia-framework';

export class TableSettings {
  @observable pageSize = 10;
  @observable currentPage = 1;
  totalItems = 0;
  items;
  filter;
  loadItemsRequestPromise;

  draw = 0;

  get start() {
    return (this.currentPage - 1) * this.pageSize;
  }

  constructor(getItems) {
    this.getItems = getItems;
  }

  pageSizeChanged(newValue, oldValue) {
    if (oldValue === undefined) {
      return;
    }
    this.loadItems();
  }

  currentPageChanged(newValue, oldValue) {
    if (oldValue === undefined) {
      return;
    }
    this.loadItems();
  }

  loadItems() {
    if (!this.loadItemsRequestPromise) {
      this.loadItemsRequestPromise = new Promise((resolve, reject) => {
        requestAnimationFrame(() => {
          try {
            let query = this.buildQuery();

            let ret = this
              .getItems(query)
              .then(result => {
                this.items = result.items;
                this.totalItems = result.totalItems;
              });

            resolve(ret);
          } catch (err) {
            reject(err);
          } finally {
            this.loadItemsRequestPromise = null;
          }
        });
      });
    }

    return this.loadItemsRequestPromise;
  }

  buildQuery() {
    return {
      draw: this.draw++,
      start: this.start,
      pageSize: this.pageSize,
      filter: this.filter
    };
  }
}

export class TableResult {
  draw;
  totalItems;
  items;
  constructor(result) {
    this.draw = result.draw;
    this.totalItems = result.totalItems;
    this.items = result.items;
  }
}
