const API_KEY = `2r0uWdZQtrPmhz0X6LdIUJCI9oierX%2FHiSG2judZYpMdbDlewh%2BeiUKqFIz9%2BGFItTlAr7OIczip2DbaDybkRQ%3D%3D`;
let stocksList = [];
let stocksDetailList = [];
let stockPrices = [];


const getStock = async () => {
  url = new URL(`https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${API_KEY}&resultType=json&pageNo=1&numOfRows=50`);
  url2 = new URL(`https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${API_KEY}&resultType=json&pageNo=1&numOfRows=50&beginBasDt=20240101`);
  
  const response = await fetch(url,url2);
  const data = await response.json();
  
  stocksList = data.response.body.items.item;

  stocksList.forEach((stock) => {
    const price = stock.mkp;
    const timestamp = stock.basDt;
    stockPrices.push({ price, timestamp });
  });

  stockRender();
};



const stockRender = () => {
  let stocksHTML = stocksList
    .map((stocks) => {
      const date = `${stocks.basDt}`;
      const formattedDate = `${date.substr(4, 2)}.${date.substr(6, 2)}`;

      let fltRtColor = '';
      if (stocks.fltRt > 0) {
        fltRtColor = 'red';
        stocks.fltRt = `+${stocks.fltRt}`;
      } else if (stocks.fltRt == 0) {
        fltRtColor = 'gray';
      }

      return `          
      <a href="stock-detail.html?stockName=${stocks.itmsNm}">
      <div class="stock-info">
      <div class="stock-market">
      <strong>${stocks.mrktCtg}</strong>
      </div>
      <div class="stock-title">
      <span>${stocks.itmsNm}</span>
      </div>
      
      <div class="stock-price">
      <h1>${Number(stocks.mrktTotAmt).toLocaleString('ko-KR')}</h1>
      </div>
      
      <div class="fluctuation-rate">
      <span style="color: ${fltRtColor};">${stocks.fltRt}%</span>
      </div>
      
      <div class="stock-date">
      ${formattedDate}
      </div>
      </div>
      <div id="stock-graph-${stocks.itmsNm.replace(/\s/g,'')}" class="stock-graph">
        <canvas id="stock-chart-${stocks.itmsNm.replace(/\s/g,'')}" class="stock-chart"></canvas>
      </div>
      </a>`;
    })
    .join('');

  document.getElementById('carousel').innerHTML = stocksHTML;

  stocksList.forEach((stock) => {
    const chartData = {
      labels: stockPrices.map((stock) => Number(stock.timestamp)),
      datasets: [
        {
          label: 'stock-price',
          data: stockPrices.map((stock) => Number(stock.price)),
          borderWidth: 1.5,
          pointRadius: 0,
        },
      ],
    };

    const chartOptions = {
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            display: false,
          },
        },
        y: {
          beginAtZero: false,
        },
      },
      tooltips: {
        mode: 'nearest',
        intersect: true,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
    };

    const ctx = document
      .getElementById(`stock-chart-${stock.itmsNm.replace(/\s/g, '')}`)
      .getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
  });
};

getStock();