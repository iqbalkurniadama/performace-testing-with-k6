/**
 * how to run:
 * 1. k6 run script.js
 * 2. k6 run --vus 10 --duration 10s script.js
 */
import { check, group } from "k6";
import http from "k6/http";
// report to html
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export let options = {
  /**
   * 1. load testing
   *  contoh load testing : 
   *  {duration: "1s", target: 5}
   *  {duration: "5s", target: 5}
   * 
   * 2. stress testing
   * contoh stress testing :
   *   {duration: "1s", target: 5},
      {duration: "5s", target: 5},
      {duration: "5s", target: 10},
      {duration: "1s", target: 0},
   * 
   * 3. spike testing
   * contoh spike testing :
   *  {duration: "1s", target: 5},
      {duration: "5s", target: 5},
      {duration: "3s", target: 25},
      {duration: "5s", target: 5},
      {duration: "1s", target: 0},
   */
  
  // iterations: 10,
  stages: [
    {duration: "1s", target: 5},
    {duration: "5s", target: 5},
    {duration: "3s", target: 25},
    {duration: "5s", target: 5},
    {duration: "1s", target: 0},

  ],
}

export default function(){
  // group('K6 Get Test', ()=> {
  //   let response1 = http.get('https://test.k6.io');
  //   check( response1, {
  //       'is status 200': (r) => r.status == 200
  //   })
  // })

  group('reqres api check', () => {
    // group('api post user', () => {
      let url = "https://reqres.in/api/users"
      let body = JSON.stringify({
        "name": "testing",
        "job": "tester"
      })
      let postResponse = http.post(url,body)
      // console.log(JSON.stringify(postResponse.body));
      check(postResponse, {
        'is status 201': (res) => res.status === 201
      })
    // })
    group('api get user', () => {
      let url = "https://reqres.in/api/users/2"
      let getResponse = http.get(url)
      check(getResponse, {
        'is status 200': (res) => res.status === 200
      })
    })
  })
}

// code to export html report
export function handleSummary(data) {
  return {
    "scrript-result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
