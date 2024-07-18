"use strict";
function main(lines) { // lines: Array<string>
  /**
   * このコードは標準入力と標準出力を用いたサンプルコードです。
   * このコードは好きなように編集・削除してもらって構いません。
   *
   * This is a sample code to use stdin and stdout.
   * You can edit and even remove this code as you like.
  */

let jsonData = [];
let jsonStore = [];
let result = [];
let finishedOrdered = [];
let finishedDelivery = [];
let driverWageID = [];
let maxDeliveryTimeID = [];
const numberOfStore = parseInt(lines[0], 10);
// console.log("first",lines[0]);
const stores = lines.slice(1, numberOfStore + 1);
const actions =  lines.slice(numberOfStore + 1 , lines.length - 1);

actions.forEach(line => {
  const tokens = line.split(' ');
  // console.log("token", line);
  if (tokens[2] === 'calculate_sales' || tokens[2] === 'calculate_wages') {
      jsonData.push({
      type: 'action',
      timestamp: tokens[0] + ' ' + tokens[1],
      status: tokens[2],
      name: tokens[3],
      price: null,
      position: {
      long: null,
      lat: null,
      },
      startTime: tokens[4] + '' + tokens[5],
      endTime: tokens[6] + '' + tokens[7],
      },
    );
  } else if(tokens[2] === 'order') {
      jsonData.push({
      type: 'action',
      timestamp: tokens[0] + ' ' + tokens[1],
      status: tokens[2],
      name: tokens[3],
      price: tokens[4],
      position: {
      long: tokens[5],
      lat: tokens[6],
      },
    });
  } else if(tokens[2] === 'set_unavailable') {
      jsonData.push({
      type: 'action',
      timestamp: tokens[0] + ' ' + tokens[1],
      status: tokens[2],
      name: tokens[3],
      price: null,
      position: {
      long: tokens[5] || null,
      lat: tokens[6] || null,
      },
    });
  } 
  else if(tokens[2] === 'set_max_delivery_time') {
      jsonData.push({
      type: 'action',
      timestamp: tokens[0] + ' ' + tokens[1],
      status: tokens[2],
      name: tokens[3],
      price: null,
      time: tokens[4],
      position: {
      long: tokens[5] || null,
      lat: tokens[6] || null,
      },
    });
  } 
  else {
    jsonData.push({
      type: 'action',
      timestamp: tokens[0] + ' ' + tokens[1],
      status: tokens[2],
      name: tokens[3],
      price: tokens[6] ? parseInt(tokens[4]) : null,
      position: {
      long: tokens[6] ? parseInt(tokens[5]) : parseInt(tokens[4]),
      lat: tokens[6] ? parseInt(tokens[6]) : parseInt(tokens[5])
      },
      startTime: null,
      endTime: null,
    });
  }
});
stores.forEach(line => {
  const tokens = line.split(' ');
  // console.log("token", line);
  // if (tokens.length > 3) {
    jsonStore.push({
      type: 'store',
      // status: tokens[2],
      name: tokens[0],
      position: {
      long: parseInt(tokens[1]),
      lat: parseInt(tokens[2]),
      },
      // openTime: tokens[3] ? { 
      //   openTime1: tokens[3],
      //   openTime2: tokens[4] || null,
      //   openTime3: tokens[5] || null,
      //   openTime4: tokens[6] || null,
      //   } : null,
      openTime: tokens[3] ? tokens[3] + ' '+ tokens[4] + ' '+ tokens[5] + ' '+ tokens[6] : null,
    });
});
// console.log("all store", stores);

const jsonStringActions = JSON.stringify(jsonData, 2, null);
const jsonObjectActions = JSON.parse(jsonStringActions);
const jsonStringStores = JSON.stringify(jsonStore, 2, null);
const jsonObjectStores = JSON.parse(jsonStringStores);
let availableDriver = jsonObjectActions.filter(a => a.status === 'set_available');
let index = -1;
// console.log("json", jsonObjectActions.filter(a => a.status === 'set_available' && a.name === 'Bob'));

function getIndexJSON(data, x) {
  data.find(function(item, i){
  if(item.name === x){
    // index = i;
    return index = i;
  }
  });
}
    
function assignDriverFuntion(index, storePosX, storePosY, deliveryLocationX, deliveryLocationY){
  let distance = 10**10;
  let driverTemp = -1; 
  const disDeliveryToStore = Math.abs(deliveryLocationX - storePosX) + Math.abs(deliveryLocationY - storePosY);
  for (let i = 0; i < index; i++){
    const disDriverToStore = Math.abs(jsonObjectActions[i].position.long - storePosX) + Math.abs(jsonObjectActions[i].position.lat - storePosY);
    // console.log("here", disDriverToStore, disDeliveryToStore);
    if((jsonObjectActions[i].status === 'set_max_delivery_time')){
      maxDeliveryTimeID.push(i);
    }
    if(finishedDelivery.includes(i)){     
          // console.log("heredasds"); 
          continue;
    }

    if (jsonObjectActions[i].status === 'set_available'){ 
      // for (let J =0; j < index; j++) {
      if(maxDeliveryTimeID.length != 0){
        for(let j = 0; j < maxDeliveryTimeID.length; j++){
          if(jsonObjectActions[maxDeliveryTimeID[j]].name === jsonObjectActions[i].name){
            // console.log("name", jsonObjectActions[maxDeliveryTimeID[j]].name, jsonObjectActions[i].name)
            const distance = jsonObjectActions[maxDeliveryTimeID[j]].time//travel distance
            // console.log("distance", jsonObjectActions[maxDeliveryTimeID[j]].time, (disDriverToStore + disDeliveryToStore)/1000);
            if(distance*10/60 < (disDriverToStore + disDeliveryToStore)/1000) {
              return driverTemp;
            // }
          }
        }
      }
      }

      if (disDriverToStore  <= distance){
        // console.log("distanceMin", i, distance);
          driverTemp = i;
          distance = disDriverToStore;
          // return driverTemp;
      }
  } 
  } 
  // console.log("at", distance);
  return driverTemp;
}


function getStorePositionX(x) {
  const posistionOfStore = jsonObjectStores.filter(a => a.name === x);
  // console.log("store", posistionOfStore[0].name);
  return posistionOfStore[0]?.position.long;
}
function getStorePositionY(x) {
  const posistionOfStore = jsonObjectStores.filter(a => a.name === x);
  // console.log("store", posistionOfStore[0].name);
  return posistionOfStore[0]?.position.lat;
}
function getStoreOpenedTime(x) {
  const timeOfStore = jsonObjectStores.filter(a => a.name === x);
  // console.log("store", timeOfStore);
  return timeOfStore[0]?.openTime ? timeOfStore[0].openTime : null;
}
// console.log("all stores", jsonObjectStores[0].name);
// console.log("store position", getStoreOpenedTime('UhkKt'));


function deliveryPrice(distance){
  if(distance > 0 && distance < 100) {
    return " 300";
  } else if (distance > 100 && distance < 1000) {
    return " 600";
  } else if (distance > 1000 && distance < 10000) {
    return " 900";
  } else {
    return "1200";
  }
}

function checkCloseTime(arr, orderedTime) {
  // console.log("log", arr);
  const myArray = arr?.split(' ');
  let closeTime = true;
  if (myArray){
  for (let k = 0; k < myArray.length; k++){
    // console.log("is checking", k, openTime);
    const startDateTime = new Date(`1970-01-01T${myArray[k].split('-')[0]}`);
    const endDateTime = new Date(`1970-01-01T${myArray[k].split('-')[1]}`);
    const checkDateTime = new Date(`1970-01-01T${orderedTime.split(' ')[1]}`);
    if(startDateTime <= checkDateTime && checkDateTime <= endDateTime){
      closeTime = true;
      k = myArray.length + 1;
    } else {
      closeTime = false;
    } 
  }
  return closeTime;
} else {
  closeTime = false;
  return closeTime;
}
}
// console.log("order number", jsonObjectActions.filter(a => a.status === 'order').length);

for (let i = 0; i < jsonObjectActions.length; i++) {
  if(jsonObjectActions[i].status === 'order') {
    // console.log("here index", jsonObjectActions[i]);
    const storeLocationX = getStorePositionX(jsonObjectActions[i].name);
    const storeLocationY = getStorePositionY(jsonObjectActions[i].name);
    const restaurant = getStoreOpenedTime(jsonObjectActions[i]?.name);
    // console.log("dadfad", restaurant);
    const orderedTime = jsonObjectActions[i].timestamp;
    
    const deliveryLocationX = jsonObjectActions[i].position.long;
    const deliveryLocationY = jsonObjectActions[i].position.lat;
    const driveID = assignDriverFuntion(i, storeLocationX, storeLocationY, deliveryLocationX, deliveryLocationY);
    const driverLocationX = jsonObjectActions[driveID]?.position.long;
    const driverLocationY = jsonObjectActions[driveID]?.position.lat;
    const driverName = jsonObjectActions[driveID]?.name;
    const disDriverToStore = Math.abs(storeLocationX - driverLocationX) + Math.abs(storeLocationY - driverLocationY);
    const disDeliveryToStore = Math.abs(storeLocationX - deliveryLocationX) + Math.abs(storeLocationY - deliveryLocationY);
    const price = deliveryPrice(disDriverToStore + disDeliveryToStore);
    // console.log("distance",storeLocationX,storeLocationY, driverLocationX, driverLocationY, deliveryLocationX, deliveryLocationY);
    if(checkCloseTime(restaurant, orderedTime) === false) {
    if(driveID != -1){
    result.push(`${orderedTime}` + " " + `${driverName}`+`${price}`);
    finishedDelivery.push(driveID);
    // console.log("i ajer");
    driverWageID.push(`${price}`+`${driveID}`);
    // console.log("driverID", finishedDelivery);
    finishedOrdered.push(`${price}`+`${i}`);
    } else {
      result.push(`${orderedTime}` + " " + "ERROR NO DELIVERY PERSON");
    }} else {
      result.push(`${orderedTime}` + " " + "ERROR CLOSED TIME");
    }
  } else if(jsonObjectActions[i].status === 'set_unavailable') {
    for (let j = 0; j < i; j++){
      if(jsonObjectActions[j].name === jsonObjectActions[i].name) {
        finishedDelivery.push(j);
      }
    }
    finishedDelivery.push(i);
  } else if(jsonObjectActions[i].status === 'calculate_sales'){
    const storeName = jsonObjectActions[i].name;
    let totalSales = 0;
    for (let j = 0; j < finishedOrdered.length; j++){
      const idFinishedOrder =  Math.abs(finishedOrdered[j])% 10;
      // console.log("idF", idFinishedOrder, finishedOrdered[j]);
      if (jsonObjectActions[idFinishedOrder].name === storeName){
        const allSales = parseInt(Math.floor(finishedOrdered[j])/10); //delivery price
        totalSales += jsonObjectActions[idFinishedOrder].price - allSales;
      }
    }
    result.push(`${jsonObjectActions[i].timestamp}` + " SALES " +`${totalSales}`);
  } else if (jsonObjectActions[i].status === 'calculate_wages'){
    const driverName = jsonObjectActions[i].name;
    let totalWages = 0;
    for (let j = 0; j < driverWageID.length; j++){
      const idFinishedOrder =  Math.abs(driverWageID[j])% 10;
      // console.log("idF", idFinishedOrder, driverWageID[j]);
      if (jsonObjectActions[idFinishedOrder].name === driverName){
        const allDeliveryWages = parseInt(Math.floor(driverWageID[j])/10); //delivery price
        totalWages += allDeliveryWages;
      }
    }
    result.push(`${jsonObjectActions[i].timestamp}` + " WAGES " +`${totalWages}`);
  }
}

result.forEach(function(element) {
  console.log(element);
});
// return result;

  // lines.forEach((v, i) => console.log(`lines[${i}]: ${v}`));

}


function runWithStdin() {
  let input = "";
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", v => {
    input += v;
  });
  process.stdin.on("end", () => {
    main(input.split("\n"));
  });
}
runWithStdin();

