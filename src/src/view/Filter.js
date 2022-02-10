import { FILTER_SECTION } from "../utils/constants";

export default class Filter {
  constructor(cfg) {
    this._filter = document.querySelector(cfg.selFilter);    
    this._filterList = document.querySelector(cfg.selFilterList);
    this._filterItemTemplate = document.querySelector(cfg.selFilterItemTemplate);
    this._filterSectionItemTemplate = document.querySelector(cfg.selFilterSectionItemTemplate);
    this._filterShowAll = this._filter.querySelector(cfg.selFilterShowAll);
    this._filterHideAll = this._filter.querySelector(cfg.selFilterHideAll);

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

    this._addButtonsLisnteners();
  }

  _hideFilter() {
    this._filter.classList.remove(this._classFilterVisible);
  }

  _showFilter() {
    this._filter.classList.add(this._classFilterVisible);
  }

  _addButtonsLisnteners = () => {

    this._filterShowAll.addEventListener('click', () => {
      this._filter.querySelectorAll(this._selFilterCheckbox).forEach((item) => {
        if(!item.checked) {
          item.click();
        }
      });
    });

    this._filterHideAll.addEventListener('click', () => {
      this._filter.querySelectorAll(this._selFilterCheckbox).forEach((item) => {
        if(item.checked) {
          item.click();
        }
      });
    });
  };

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

  _getActiveFilters() {
    const inputs = this._filter.querySelectorAll(this._selFilterCheckbox);
    if(inputs.length === 0) {
      return [];
    }

    return [...inputs].reduce((prev, cur) => {
      if(cur.checked) {
        prev.push(cur.getAttribute(this._attrFilter));
      }
      return prev;
   }, []);
  }

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
          filterCheckbox.setAttribute(this._attrFilter, filterString);

          filterCheckbox.addEventListener('change', () => {
            const transactions = document.querySelectorAll(`${this._selTransaction}[${this._attrFilter}*='${filterString}']`);
            if(transactions.length > 0) {
              const activeFilters = this._getActiveFilters();
              transactions.forEach((trx) => {
                const trxFilters = trx.getAttribute(this._attrFilter).split(' ');           
                if(activeFilters.some(r=> trxFilters.includes(r))) {
                  trx.classList.remove(this._classTransactionHidden);
                }
                else {
                  trx.classList.add(this._classTransactionHidden);
                }            
              });  
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