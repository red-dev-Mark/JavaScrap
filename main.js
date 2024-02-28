import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fetch from "node-fetch";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(cors({
    origin: 'https://opendart.fss.or.kr'
  }));
  

// 정적 파일을 제공하기 위해 express.static 미들웨어를 사용합니다.
app.use(express.static(__dirname));

// "/" 경로로 들어오는 요청에 대해 현재 디렉토리의 index.html 파일을 제공합니다.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

// import express from 'express';
// import cors from 'cors';
// import fetch from 'node-fetch';

// const app = express();
// const port = 3000; // 원하는 포트 번호로 변경 가능


// const API_KEY = "3421707b4ccdb97f492e171b71a0d13de1bfe4f8";
// let COMPANY_CODE = "00126380"; // 삼성전자 코드
// let YEAR = "2022";
// let REPORT_CODE = "11011"; // 11011: 사업보고서 (나머지는 반기 / 분기 보고서)

// app.use(cors()); // 모든 도메인의 요청을 허용

// // 프록시 엔드포인트 설정
// app.get('/proxy', async (req, res) => {
//   // 클라이언트로부터 받은 요청을 바탕으로 외부 API URL 구성
//   const { COMPANY_CODE, YEAR, REPORT_CODE, API_KEY } = req.query;
//   const url =   `https://opendart.fss.or.kr/api/fnlttSinglAcnt.json?corp_code=${COMPANY_CODE}&bsns_year=${YEAR}&reprt_code=${REPORT_CODE}&crtfc_key=${API_KEY}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     res.json(data); // 외부 API의 응답을 클라이언트에게 전달
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Proxy server running on http://localhost:${port}`);
// });
