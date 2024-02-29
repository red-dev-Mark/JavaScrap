const API_KEY = `2r0uWdZQtrPmhz0X6LdIUJCI9oierX%2FHiSG2judZYpMdbDlewh%2BeiUKqFIz9%2BGFItTlAr7OIczip2DbaDybkRQ%3D%3D`;
let stocksList = [];

const getStock = async () => {
    url = new URL(`https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${API_KEY}&resultType=json`);

    const response = await fetch(url);
    const data = await response.json();

    stocksList = data.response.body.items.item;
    render();

    console.log('stock', stocksList);
};


const render = () => {
  const stocksHTML = stocksList.map(
    (stocks) => `            <div class="row">
      <div class="col-12">
          <a href="#" class="stock">
              <div class="stock-title">
                  <span>${stocks.itmsNm}</span>
              </div>
  
              <div class="stock-price">
                  <h1>${Number(stocks.mkp).toLocaleString('ko-KR')}</h1>
              </div>
  
              <div class="fluctuation-rate">
                  <span>▾${stocks.vs}</span>
                  <span>${stocks.fltRt}%</span>
              </div>
  
              <div class="stock-date">
                  ${stocks.basDt}
              </div>
          </a>
      </div>
  </div>`
  ).join('');

  document.getElementById('stocks').innerHTML = stocksHTML;
};

getStock();