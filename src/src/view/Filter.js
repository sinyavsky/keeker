import { FILTER_SECTION } from "../utils/constants";

export default class Filter {
  constructor(cfg) {
    this._filter = document.querySelector(cfg.selFilter);    
    this._filterList = document.querySelector(cfg.selFilterList);
    this._filterItemTemplate = document.querySelector(cfg.selFilterItemTemplate);
    this._filterSectionItemTemplate = document.querySelector(cfg.selFilterSectionItemTemplate);

    this._selFilterSectionHeading = cfg.selFilterSectionHeading;
    this._selFilterSectionList = cfg.selFilterSectionList;
    this._selFilterLabel = cfg.selFilterLabel;
    this._selFilterCheckbox = cfg.selFilterCheckbox;
    this._selTransaction = cfg.selTransaction;

    this._classFilterVisible = cfg.classFilterVisible;
    this._classTransactionHidden = cfg.classTransactionHidden;

    this._attrFilter = cfg.attrFilter;

    this._data = {};
    Object.values(FILTER_SECTION).forEach((section) => {
      this._data[section] = {
        name: section,
        items: {},
      };
    });
  }

  _hideFilter() {
    this._filter.classList.remove(this._classFilterVisible);
  }

  _showFilter() {
    this._filter.classList.add(this._classFilterVisible);
  }

  clear = () => {
    Object.values(this._data).forEach((section) => {
      Object.values(section.items).forEach((item) => {
        item.count = 0;
      });
    });

    this._hideFilter();
    this._filterList.textContent = '';
  };
  
  _generateData = (section, item) => {
    return `filter-${Object.keys(this._data).indexOf(section)}-${Object.keys(this._data[section].items).indexOf(item)}`;
  };

  render = () => {
    this._showFilter();
    Object.entries(this._data).forEach((sectionEntry) => {
      const [sectionKey, section] = sectionEntry;
      let hasElements = false;
      const sectionItem = this._filterItemTemplate.content.cloneNode(true);
      const sectionList = sectionItem.querySelector(this._selFilterSectionList);
      Object.entries(section.items).forEach((itemEntry) => {
        const [itemKey, item] = itemEntry;
        if(item.count > 0) {
          hasElements = true;
          const elementItem = this._filterSectionItemTemplate.content.cloneNode(true);
          elementItem.querySelector(this._selFilterLabel).insertAdjacentText('beforeend', `${item.name} (${item.count})`);
          const filterString = this._generateData(sectionKey, itemKey);
          const filterCheckbox = elementItem.querySelector(this._selFilterCheckbox);
          filterCheckbox.setAttribute(this._attrFilter, this._generateData(sectionKey, filterString));
          filterCheckbox.addEventListener('change', (event) => {
            const transactions = document.querySelectorAll(`${this._selTransaction}[${this._attrFilter}='${filterString}']`);
            if(transactions.length > 0) {
              if(event.currentTarget.checked) {
                transactions.forEach((trx) => {
                  trx.classList.remove(this._classTransactionHidden);
                });
              }
              else {
                transactions.forEach((trx) => {
                  trx.classList.add(this._classTransactionHidden);
                });
              }
            }
            
          });
          sectionList.append(elementItem);
        }
      });
      if(hasElements) {
        sectionItem.querySelector(this._selFilterSectionHeading).textContent = section.name;       
        this._filterList.append(sectionItem);
      }
    });
  };

  addItem(section, item) {
    if(Object.prototype.hasOwnProperty.call(this._data[section].items, item)) {
      this._data[section].items[item].count ++;
    }
    else {
      this._data[section].items[item] = {
        name: item,
        count: 1,
      };
    }
    return this._generateData(section, item);
  }  
}