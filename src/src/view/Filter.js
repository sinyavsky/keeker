// todo: I should think how to refactor it, since it's super weird
export default class Filter {
  constructor(cfg) {
    this._filter = document.querySelector(cfg.filter);

    this._data = {
      near: {
        name: 'Near transfers',
        items: {
          in: { name: 'In', count: 0 },
          out: { name: 'Out', count: 0 },
        },
      },
      accessKeys: {
        name: 'Access keys',
        items: {
          add: { name: 'Add', count: 0 },
          delete: { name: 'Delete', count: 0 },
        },
      },
      contractDeploy: {
        name: 'Contract deploying',
        items: {
          deploy: { name: 'Deploy contract', count: 0 },
        },
      },
    };
  }

  clear = () => {
    Object.values(this._data).forEach((section) => {
      Object.values(section.items).forEach((item) => {
        item.count = 0;
      });
    });

    this._filter.classList.remove('filter_visible');
    this._filter.querySelector('.filter__list').textContent = '';
  };
  
  _generateData = (section, item) => {
    return `filter-${Object.keys(this._data).indexOf(section)}-${Object.keys(this._data[section].items).indexOf(item)}`;
  };

  render = () => {
    this._filter.classList.add('filter_visible');
    Object.entries(this._data).forEach((sectionEntry) => {
      const [sectionKey, section] = sectionEntry;
      let haveElements = false;
      const sectionItem = document.querySelector('.filter-item-template').content.cloneNode(true);
      const sectionList = sectionItem.querySelector('.filter__section-list');
      Object.entries(section.items).forEach((itemEntry) => {
        const [itemKey, item] = itemEntry;
        if(item.count > 0) {
          haveElements = true;
          const elementItem = document.querySelector('.filter-section-item-template').content.cloneNode(true);
          elementItem.querySelector('.filter__label').insertAdjacentText('beforeend', `${item.name} (${item.count})`);
          const filterString = this._generateData(sectionKey, itemKey);
          const filterCheckbox = elementItem.querySelector('.filter__checkbox');
          filterCheckbox.setAttribute('data-filter', this._generateData(sectionKey, filterString));
          filterCheckbox.addEventListener('change', (event) => {
            const transactions = document.querySelectorAll(`.transaction[data-filter='${filterString}']`);
            if(transactions.length > 0) {
              if(event.currentTarget.checked) {
                transactions.forEach((trx) => {
                  trx.classList.remove('transaction_hidden');
                });
              }
              else {
                transactions.forEach((trx) => {
                  trx.classList.add('transaction_hidden');
                });
              }
            }
            
          });
          sectionList.append(elementItem);
        }
      });
      if(haveElements) {
        sectionItem.querySelector('.filter__section-heading').textContent = section.name;
        const filterList = this._filter.querySelector('.filter__list');        
        filterList.append(sectionItem);
      }
    });
  };

  nearTransferIn() {
    this._data.near.items.in.count ++;
    return this._generateData('near', 'in');
  }

  nearTransferOut() {
    this._data.near.items.out.count ++;
    return this._generateData('near', 'out');
  }

  accessKeysAdd() {
    this._data.accessKeys.items.add.count ++;
    return this._generateData('accessKeys', 'add');
  }

  accessKeysDelete() {
    this._data.accessKeys.items.delete.count ++;
    return this._generateData('accessKeys', 'delete');
  }

  contractDeploy() {
    this._data.contractDeploy.items.deploy.count ++;
    return this._generateData('contractDeploy', 'deploy');
  }

  
}