let corpCode = "";
const API_KEY = "3421707b4ccdb97f492e171b71a0d13de1bfe4f8";
let COMPANY_CODE = "00164742";
let corpname = "삼성전자";

const companies = [
  { corpcode: "00126380", corpname: "삼성전자" },
  { corpcode: "00164742", corpname: "현대자동차" },
  { corpcode: "00401731", corpname: "LG전자" },
  { corpcode: "00266961", corpname: "NAVER" },
];

let YEAR = "2022";
let REPORT_CODE = "11011"; // 11011: 사업보고서 (나머지는 반기 / 분기 보고서)
let url = new URL(
  `https://corsproxy.io/?https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?corp_code=${COMPANY_CODE}&bsns_year=${YEAR}&reprt_code=${REPORT_CODE}&crtfc_key=${API_KEY}`
);

let data = "";
let writing = document.querySelector("p");
let tabs = document.querySelectorAll(".tab");
let tabSales = document.getElementById("tabSales");

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    toggleActive(tab);
    let activeButton = document.querySelector(".tab.active");
    let textContent = activeButton.textContent.trim();
    console.log(textContent);
    createChart(textContent);
  });
});

const findCorpCodeByName = (name) => {
  const company = companies.find((company) => company.corpname === name);
  return company ? company.corpcode : null;
};

function selectCompany() {
  const selectElement = document.getElementById("mySelect");
  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    corpname = selectedValue;
    COMPANY_CODE = findCorpCodeByName(selectedValue);
    url = new URL(
      `https://corsproxy.io/?https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?corp_code=${COMPANY_CODE}&bsns_year=${YEAR}&reprt_code=${REPORT_CODE}&crtfc_key=${API_KEY}`
    );

    createChart("매출액");
    tabs.forEach(function (tab) {
      tab.classList.remove("active");
      tabSales.classList.add("active");
    });

    // 클릭된 요소에 active 클래스를 추가
    element.classList.add("active");

    createChart("매출액");

    // 여기서 script.js로 값을 전달하거나 원하는 작업을 수행할 수 있습니다.
  });
}

async function createChart(accNm) {
  try {
    const result = await getCompanyInfo(); // dataSample은 Promise를 반환해야 합니다.
    console.log(result); // API로부터 받은 데이터를 콘솔에 출력합니다.
    // const corpCode = result.list[0].corp_code;

    // console.log(corpCode); // corp_code 값을 콘솔에 출력합니다.
    // writing.textContent = `회사코드: ${corpCode}`; // writing은 DOM 요소를 가리키는 변수로 가정합니다.

    // find 메서드를 사용하여 조건에 맞는 객체를 찾습니다.
    let selectedItem = result.list.find(
      (item) => item.account_nm === accNm && item.fs_nm === "재무제표"
    );

    // 조건에 맞는 객체에서 'thstrm_amount' 값을 추출합니다.
    let thisTermAmount = selectedItem ? selectedItem.thstrm_amount : null;
    let formerTermAAmount = selectedItem ? selectedItem.frmtrm_amount : null;
    let beforeFormerAmount = selectedItem
      ? selectedItem.bfefrmtrm_amount
      : null;

    df = [
      ["Company", corpname],
      ["2020", parseInt(beforeFormerAmount.replace(/,/g, ""), 10) / 100000000],
      ["2021", parseInt(formerTermAAmount.replace(/,/g, ""), 10) / 100000000],
      ["2022", parseInt(thisTermAmount.replace(/,/g, ""), 10) / 100000000],
    ];
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);
  } catch (error) {
    console.error("Error accessing the data:", error);
  }
}

const getCompanyInfo = async () => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

function drawChart() {
  const data = google.visualization.arrayToDataTable(df);

  const options = {
    // title: "Revenue",
    vAxis: {
      format: "0,000억", // x 축 단위를 소수점 두 자리로 변경
      gridlines: { count: 2 }, // x 축 그리드 라인 제거
    },
    bar: { groupWidth: "30%" }, // 바 폭 조절
    legend: { position: "bottom" },
    colors: ["#000000"],
  };

  const chart = new google.visualization.ColumnChart(
    document.getElementById("myChart")
  );
  chart.draw(data, options);
}

function toggleActive(element) {
  // 모든 tab 요소에서 active 클래스를 제거
  tabs.forEach(function (tab) {
    tab.classList.remove("active");
  });

  // 클릭된 요소에 active 클래스를 추가
  element.classList.add("active");
}

createChart("매출액");
selectCompany();
