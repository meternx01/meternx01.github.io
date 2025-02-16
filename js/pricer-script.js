// Helper: Convert string to Title Case.
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  
  // Returns the vendor price: if NoSale is "1" or BaseSell is "0", item is not vendorable.
  function getVendorPrice(baseSell, noSale) {
    const price = parseInt(baseSell, 10);
    return (parseInt(noSale, 10) === 1 || price === 0) ? null : price;
  }
  
  // Calculate minimum AH posting price for a SINGLE item.
  function calcSinglePrice(vendorPrice) {
    let basePrice = (vendorPrice + 2) / 0.99;
    const fee = 0.01 * basePrice + 1;
    if (fee > 10000) {
      basePrice = vendorPrice + 1 + 10000;
    }
    return Math.ceil(basePrice);
  }
  
  // Calculate minimum AH posting price for a STACK of size 'stackSize'
  // where we want to net (vendorPrice + 1) for each item.
  function calcStackPrice(vendorPrice, stackSize) {
    const totalWanted = (vendorPrice + 1) * stackSize;
    let basePrice = (totalWanted + 4) / 0.995;
    const fee = 0.005 * basePrice + 4;
    if (fee > 10000) {
      basePrice = totalWanted + 10000;
    }
    return Math.ceil(basePrice);
  }
  
  // Filter items based on search query (checks both sortname and name).
  function filterItems(query) {
    query = query.toLowerCase();
    return item_basic.filter(item =>
      item.sortname.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query)
    );
  }
  
  // Render results as cards.
  function renderResults(itemList) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
  
    if (itemList.length === 0) {
      const noRes = document.createElement('p');
      noRes.className = 'no-results';
      noRes.textContent = 'No items found.';
      resultsDiv.appendChild(noRes);
      return;
    }
  
    itemList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
  
      // Title: sortname in Title Case.
      const title = document.createElement('h2');
      title.textContent = toTitleCase(item.sortname);
      card.appendChild(title);
  
      // Vendor price or "Not Vendorable".
      const vendorPrice = getVendorPrice(item.BaseSell, item.NoSale);
      const vendorElem = document.createElement('p');
      vendorElem.className = 'vendor';
      vendorElem.textContent = vendorPrice !== null ? `Vendor: ${vendorPrice.toLocaleString('en-US')} gil` : "Not Vendorable";
      card.appendChild(vendorElem);
  
      // AH pricing information in one line.
      const priceElem = document.createElement('h4');
      if (item.aH === '@NONE') {
        priceElem.textContent = "Not AH Sellable";
      } else if (vendorPrice !== null) {
        const singlePrice = calcSinglePrice(vendorPrice);
        let priceText = `${singlePrice.toLocaleString('en-US')} gil`;
        const stackSize = parseInt(item.stackSize, 10);
        if (stackSize > 1) {
          const stackPrice = calcStackPrice(vendorPrice, stackSize);
          priceText += ` | ${stackPrice.toLocaleString('en-US')} gil (${stackSize})`;
        }
        priceElem.textContent = priceText;
      } else {
        priceElem.textContent = "";
      }
      card.appendChild(priceElem);
  
      resultsDiv.appendChild(card);
    });
  }
  
  // Debounce for smoother typing.
  let debounceTimer;
  function doSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = document.getElementById('searchBox').value.trim();
      const filtered = filterItems(query);
      renderResults(filtered);
    }, 300);
  }
  
  const searchBox = document.getElementById('searchBox');
  const searchButton = document.getElementById('searchButton');
  
  searchBox.addEventListener('input', doSearch);
  searchButton.addEventListener('click', doSearch);
  
  // Initial render.
  renderResults(item_basic);
  