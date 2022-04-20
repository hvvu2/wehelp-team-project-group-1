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
  return data;
}

async function makeContent(city, htmlId, timeNum = 0) {
  let data = await getCityData(city);
  let datePlace = document.querySelectorAll(`${htmlId} span`)[0];
  let timeZonePlace = document.querySelectorAll(`${htmlId} span`)[1];
  let tempPlace = document.querySelectorAll(`${htmlId} span`)[2];
  let imgPlaces = document.querySelectorAll(`${htmlId} img`);
  let wxPlaces = document.querySelectorAll(`${htmlId} p`);
  let startTime = data[0].time[timeNum].startTime;
  let endTime = data[0].time[timeNum].endTime;
  // 當筆資料的月日
  let dataDate = data[0].time[timeNum].startTime.slice(8, 10);
  // 決定日期星期幾
  let dayOfWeekEn = new Date(startTime.slice(0, 10)).getDay();
  let today = new Date();

  // 時間區段用
  let year = today.getFullYear();
  let month = addZero(today.getMonth() + 1);
  let dates = addZero(today.getDate());
  let todaysDate = `${year}-${month}-${dates}`;

  // 天氣參數
  let wx = data[0].time[timeNum].parameter.parameterName;
  let wxDescription = parseInt(data[0].time[timeNum].parameter.parameterValue);
  let pop = data[1].time[timeNum].parameter.parameterName;
  let min = data[2].time[timeNum].parameter.parameterName;
  let max = data[3].time[timeNum].parameter.parameterName;
  let dayOfWeekCn = switchDayToChinese(dayOfWeekEn);

  // 決定時間的區段
  let timeZone = chooseTimeZone(
    startTime.slice(0, 10),
    todaysDate,
    endTime.slice(0, 10)
  );
  let imgAddress = chooseImg(wxDescription);

  datePlace.textContent = `${month}/${dataDate} ${dayOfWeekCn}`;
  timeZonePlace.textContent = timeZone;
  tempPlace.textContent = `${min} - ${max}°C`;
  imgPlaces[0].src = "icon/5546088-046-01.png";
  imgPlaces[1].src = imgAddress;
  wxPlaces[0].textContent = `${wx}`;
  wxPlaces[1].textContent = `降雨機率 ${pop} %`;
}

function makeArrows(cityName, htmlId) {
  let cardWraps = document.querySelector(`${htmlId}`);
  let currentTimeNum = 0;
  for (let i = 0; i < 1; i++) {
    let img1 = document.createElement("img");
    let img2 = document.createElement("img");
    img1.classList.add("leftArrow");
    img2.classList.add("rightArrow");
    cardWraps.append(img1);
    cardWraps.append(img2);
    img1.src = "icon/leftArrow.png";
    img1.style.cursor = "pointer";
    img2.src = "icon/rightArrow.png";
    img2.style.cursor = "pointer";
    img1.addEventListener("click", function () {
      if (currentTimeNum == 0) {
        currentTimeNum = 2;
      } else {
        currentTimeNum -= 1;
      }
      makeContent(cityName, htmlId, currentTimeNum);
    });
    img2.addEventListener("click", function () {
      if (currentTimeNum == 2) {
        currentTimeNum = 0;
      } else {
        currentTimeNum += 1;
      }
      makeContent(cityName, htmlId, currentTimeNum);
    });
  }
}

// 把抓出來的星期換成中文
function switchDayToChinese(number) {
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

async function showContent(cityName, htmlId, timeNum) {
  makeContent(cityName, htmlId, timeNum);
  makeArrows(cityName, htmlId);
}

showContent("臺北市", "#js-taipei");
showContent("新北市", "#js-new-taipei");
showContent("臺中市", "#js-taichung");
showContent("彰化縣", "#js-changhua");
