let corpCode = "";
const API_KEY = "3421707b4ccdb97f492e171b71a0d13de1bfe4f8";
let COMPANY_CODE = "00126380"; // 삼성전자 코드
let YEAR = "2022";
let REPORT_CODE = "11011"; // 11011: 사업보고서 (나머지는 반기 / 분기 보고서)
// const url = new URL(
//   `https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?corp_code=${COMPANY_CODE}&bsns_year=${YEAR}&reprt_code=${REPORT_CODE}&crtfc_key=${API_KEY}`
// );
const url = new URL(
  `https://cors-anywhere.herokuapp.com/https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?corp_code=${COMPANY_CODE}&bsns_year=${YEAR}&reprt_code=${REPORT_CODE}&crtfc_key=${API_KEY}`
);
let data = "";
let writing = document.querySelector("p");
let tabs = document.querySelectorAll(".tab");

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    toggleActive(tab);
    let activeButton = document.querySelector('.tab.active');
    let textContent = activeButton.textContent.trim();
    console.log(textContent);
    createChart(textContent);
   
  });
});



async function createChart(textContent) {
  try {
    const result = await getCompanyInfo(); // dataSample은 Promise를 반환해야 합니다.
    console.log(result); // API로부터 받은 데이터를 콘솔에 출력합니다.
    const corpCode = result.list[0].corp_code;

    console.log(corpCode); // corp_code 값을 콘솔에 출력합니다.
    writing.textContent = corpCode; // writing은 DOM 요소를 가리키는 변수로 가정합니다.

    // find 메서드를 사용하여 조건에 맞는 객체를 찾습니다.
    let selectedItem = result.list.find(
      (item) => item.account_nm === "당기순이익"?textContent==="당기순이익":"매출액" && item.fs_nm === "재무제표"
    );

    // 조건에 맞는 객체에서 'thstrm_amount' 값을 추출합니다.
    let thisTermAmount = selectedItem ? selectedItem.thstrm_amount : null;
    let formerTermAAmount = selectedItem ? selectedItem.frmtrm_amount : null;
    let beforeFormerAmount = selectedItem
      ? selectedItem.bfefrmtrm_amount
      : null;

    df = [
      ["Company", "Samsung"],
      ["2020", parseInt(beforeFormerAmount.replace(/,/g, ""), 10)],
      ["2021", parseInt(formerTermAAmount.replace(/,/g, ""), 10)],
      ["2022", parseInt(thisTermAmount.replace(/,/g, ""), 10)],
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
    title: "Revenue",
    hAxis: {
      title: "Year",
      format: '0억원' // x 축 단위를 억원으로 변경
    },
    bar: { groupWidth: '50%' }, // 바 폭 조절
    colors: ['#808080', '#808080', '#000000'], // 바의 색상 지정
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

createChart();

