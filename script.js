let main = document.querySelector("main");
const url =
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?elementName=MinT,MaxT,PoP,Wx&Authorization=CWB-3C55E842-2D81-4D33-ADEB-E466D0BE7A6A&locationName=";

// 從氣象局要資料
async function getCityData(city) {
  let req = await fetch(url + city, {
    method: "GET",
  });
  let res = await req.json();
  let data = res.records.location[0].weatherElement;
  let locationName = res.records.location[0].locationName;
  // console.log(res);
  makeContent(data, locationName);
}

// 本來我自己是有貼出來看資料，但怕蓋到別人的東西我這邊就備註掉了
// 大部分備註的東西都不重要，我只是用來確認東西，正式情況會砍掉
function makeContent(data, name) {
  // let wrap = document.querySelector(".wrap");
  for (let i = 0; i < 3; i++) {
    let startTime = data[0].time[i].startTime;
    let endTime = data[0].time[i].endTime;
    let startDate = new Date(startTime.slice(0, 10)).getDay();
    // let endDate = new Date(endTime.slice(0, 10)).getDay();
    let today = new Date();
    let year = today.getFullYear();
    let month = addZero(today.getMonth() + 1);
    let dates = addZero(today.getDate());
    // let hours = addZero(today.getHours());
    // let minutes = addZero(today.getMinutes());
    // let sec = addZero(today.getMinutes());
    // let todaysDate = `${year}-${month}-${dates} ${hours}:${minutes}:${sec}`;
    let todaysDate = `${year}-${month}-${dates}`;
    // console.log(startTime);
    // console.log(todaysDate);
    // console.log(endTime);
    // console.log(startTime < todaysDate);
    let wx = data[0].time[i].parameter.parameterName;
    let wxDescription = parseInt(data[0].time[i].parameter.parameterValue);
    let pop = data[1].time[i].parameter.parameterName;
    let min = data[2].time[i].parameter.parameterName;
    let max = data[3].time[i].parameter.parameterName;
    // let div = document.createElement("div");
    let date = switchDateToChinese(startDate);
    let timeZone = chooseTimeZone(
      startTime.slice(0, 10),
      todaysDate,
      endTime.slice(0, 10)
    );
    let img = chooseImg(wxDescription);
    console.log(
      `${name}, ${startTime.slice(
        0,
        10
      )} ${date}, ${timeZone}, ${min} - ${max}度, 降雨機率 ${pop} %, ${wx} 天氣現象代號 ${wxDescription}, ${img}`
    );
    //   let content = `<div class="infoWrap">
    //   <div id="name">${name}</div>
    //   <div id="time">${startTime.slice(0, 10)} ${date}</div>
    //   <div id="timeZone">${timeZone}</div>
    //   <div id="temp">${min} - ${max}度</div>
    //   <div id="rain">降雨機率 ${pop} %</div>
    //   <div id="describe"> ${wx} 天氣現象代號 ${wxDescription}</div>
    // </div>`;
    //   console.log(div);
    //   div.innerHTML = content;
    //   wrap.append(div);
  }
}

// 把抓出來的星期換成中文
function switchDateToChinese(number) {
  let date = null;
  switch (number) {
    case 0:
      date = "日";
      break;
    case 1:
      date = "一";
      break;
    case 2:
      date = "二";
      break;
    case 3:
      date = "三";
      break;
    case 4:
      date = "四";
      break;
    case 5:
      date = "五";
      break;
    case 6:
      date = "六";
      break;
  }
  return date;
}

// 把抓出來的日期時間如果不到雙位數就加個零
function addZero(num) {
  let time = num;
  if (time < 10) {
    time = "0" + num;
  }
  return time;
}

// 判斷時間區段
function chooseTimeZone(startDate, today, endDate) {
  let timeZone = null;
  if (startDate === today && today === endDate) {
    timeZone = "今日白天";
  } else if (startDate == today && today < endDate) {
    timeZone = "今晚明晨";
  } else {
    timeZone = "明日白天";
  }
  return timeZone;
}

function chooseImg(num) {
  let imgAddress = null;
  // 晴天
  if (num == 1) {
    imgAddress = "icon/076-sun-3.png";
  }
  // 多雲系列
  else if (num > 1 && num < 7) {
    imgAddress = "icon/006-cloudy-12.png";
  }
  // 陰天
  else if (num == 7) {
    imgAddress = "icon/014-cloud-8.png";
  }
  // 陣雨/雨天系列
  else if (
    (num > 7 && num < 12) ||
    (num > 12 && num < 18) ||
    (num > 28 && num < 42)
  ) {
    imgAddress = "icon/019-rain-22.png";
  }
  // 陣雨有太陽
  else if (num == 12 || num == 15 || (num > 17 && num < 24)) {
    imgAddress = "icon/042-storm-9.png";
  }
  // 霧
  else if (num > 23 && num < 29) {
    imgAddress = "icon/111-mist-01.png";
  }

  return imgAddress;
}

getCityData("臺北市");
getCityData("新北市");
getCityData("臺中市");
getCityData("彰化縣");
getCityData("高雄市");
