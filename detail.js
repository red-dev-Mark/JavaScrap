import config from "./config/apikey.js";

// 공통 사용 변수
const API_KEY = config.apiKey;
const CORP_CODE = "00101488"
const YEAR = "2022"
let url = new URL(`https://corsproxy.io/?https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json?corp_code=${CORP_CODE}&bsns_year=${YEAR}&reprt_code=11011&fs_div=OFS&crtfc_key=${API_KEY}`)
const companies = [
    { corpCode: '00126380', corpName: '삼성전자' },
    { corpCode: '00164742', corpName: '현대자동차' },
    { corpCode: '00164779', corpName: '에스케이하이닉스' },
    { corpCode: '00401731', corpName: 'LG전자' },
    { corpCode: '00258801', corpName: '카카오' },
    { corpCode: '00298270', corpName: '안랩' },
    { corpCode: '00113410', corpName: 'CJ대한통운' },
    { corpCode: '00126186', corpName: '삼성에스디에스' },
    { corpCode: '00759294', corpName: '와이솔' },
    { corpCode: '00145880', corpName: '현대제철' },
    { corpCode: '00106368', corpName: '금호석유화학' },
    { corpCode: '00120030', corpName: '지에스건설' },
    { corpCode: '00540429', corpName: '휴림로봇' },
    { corpCode: '00145109', corpName: '유한양행' },
    { corpCode: '00101488', corpName: '경동나비엔' }
  ];
let corpName;

// class=info 용 변수
const accountNameInfo = ["자산총계", "유동자산", "부채총계", "자본총계", "수익(매출액)", "매출액", "영업수익", "매출원가", "영업비용", "영업이익", "영업이익(손실)", "당기순이익(손실)", "당기순이익"]
let companyFinanceInfo = []
let responseInfo = []


// CORP_CODE에 맞는 기업명 매핑
if (CORP_CODE) {
    let index = companies.findIndex(obj => obj.corpCode === CORP_CODE);
    corpName = companies[index].corpName;
}

const getCompanyInfo = async () => {
    const response = await fetch(url);
    const data = await response.json();
    responseInfo = data.list;
    for (let i=0; i<accountNameInfo.length; i++) {
        let result = responseInfo.filter((value) => {
          try {
            return value.account_nm == accountNameInfo[i]
          } catch (e) {
            console.log(`${value.account_nm} 계정명이 존재하지 않습니다.`) // 예외 메시지 출력
            return false
          }
        })
        if(result.length > 0) {
          companyFinanceInfo.push(result[0])
        }
    }
    // console.log(companyFinanceInfo)
    renderCompanyInfo()
    renderCompanyScorecardInfo()
}

const renderCompanyInfo = () => {
    let companyHTML = `
        <div class="left-company-info col-md-6 col-sm-12">
            <div class="company-code-info">종목코드 ${CORP_CODE}</div>
            <div class="company-name-info">${corpName}</div>
        </div>
        <div class="right-company-info col-md-6 col-sm-12">
            <canvas id="asset-chart-info"></canvas>
        </div>
    `
    document.querySelector(".company-info").innerHTML = companyHTML;
    // 차트 그리기
    const chartOptions = {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: '자산 추이 (연도별)'
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
                display: false,
              },
            beginAtZero: false,
          },
        },
      };

    const ctxInfo = document.getElementById('asset-chart-info').getContext('2d');
    const chartInfo = new Chart(ctxInfo, {
        // 차트 설정
        type: 'line',
        // 차트 데이터
        data: {
            labels: [`${YEAR-2}`, `${YEAR-1}`, `${YEAR}`],
            datasets: [{
                label: '자산 총계',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [`${Number(companyFinanceInfo[0].bfefrmtrm_amount)}`, `${Number(companyFinanceInfo[0].frmtrm_amount)}`, `${Number(companyFinanceInfo[0].thstrm_amount)}`]
            }]
        },
        options: chartOptions,
    });
}

const renderCompanyScorecardInfo = () => {
    let companyScorecardHTML = `
        <div class="scorecard-title-info">
        재무정보 요약
        <span class="scorecard-year-info">(기준년도: ${companyFinanceInfo[0].bsns_year}년)</>
        </div>
    `
    for (let i=0; i<companyFinanceInfo.length; i++) {
        companyScorecardHTML += `
            <div class="scorecard-item-info col-md-6 col-sm-12">
                <span class="account-name-info">${companyFinanceInfo[i].account_nm}</span>
                <span class="current-amount-info">${(Math.round(Number(companyFinanceInfo[i].thstrm_amount) / 10000)).toLocaleString()}만원</span>
            </div>
        `
    }
    document.querySelector(".company-scorecard-info").innerHTML = companyScorecardHTML;
}

getCompanyInfo()