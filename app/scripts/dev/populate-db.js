'use strict';

const process = require('process');
const Database = require('../../classes/Database');
const dbData = require('./db-test-data.json');

let clientIds = [];
let finishedCount = 0;
let maxFinishedCount = 3;

Database.connectAll()
  .then(() => {
    populateClients()
      .then((ids) => {
        clientIds = ids;
        populateSubscriptions(clientIds)
          .then()
          .catch(console.error)
          .finally(() => {
            finishedCount += 1;
          })
      })
      .catch((err) => {
        console.error(err);
        maxFinishedCount -= 1;  // because populateSubscriptions will never run
      })
      .finally(() => {
        finishedCount += 1;
      })

    populateDevices()
      .then()
      .catch(console.error)
      .finally(() => {
        finishedCount += 1;
      });
  })
  .catch(() => {
  });


async function populateClients() {
  return new Promise((resolve, reject) => {
    const data = dbData.Clients;
    let currIndex = 0;
    let docIds = [];
    let addDoc = function(obj) {
      Database.clients.addClient(obj.email, obj)
        .then((doc) => {
          docIds.push(doc._id);
        })
        .catch((err) => {
          console.error('Failed to populate client', err);
        })
        .finally(() => {
          currIndex++;
          if (currIndex >= data.length) {
            resolve(docIds);
          }
          else {
            addDoc(data[currIndex]);
          }
        });
    }
    addDoc(data[currIndex]);
  });
}


async function populateDevices() {
  return new Promise((resolve, reject) => {
    const data = dbData.Devices;
    let currIndex = 0;
    let addDoc = function(obj) {
      Database.devices.addDevice(obj.imei, obj.iccid, obj.model, obj)
        .then()
        .catch((err) => {
          console.error('Failed to populate device', err);
        })
        .finally(() => {
          currIndex++;
          if (currIndex >= data.length) {
            resolve();
          }
          else {
            addDoc(data[currIndex]);
          }
        });
    }
    addDoc(data[currIndex]);
  });
}


async function populateSubscriptions(clientIds) {
  return new Promise((resolve, reject) => {
    if(!clientIds || clientIds.length === 0) { reject('No client ids provided to populateSubscriptions'); return; }
    const data = dbData.Subscriptions;
    let clientIndex = 0;
    let currIndex = 0;
    let docIds = [];
    let addDoc = function(obj) {
      Database.subscriptions.addSubscription(clientIds[clientIndex], obj.platform, obj.platform_id, obj)
        .then((doc) => {
          docIds.push(doc._id);
          clientIndex++;
          if(clientIndex >= clientIds.length) {
            clientIndex = 0;
          }
        })
        .catch((err) => {
          console.error('Failed to add subscription', err);
        })
        .finally(() => {
          currIndex++;
          if (currIndex >= data.length) {
            resolve(docIds);
          }
          else {
            addDoc(data[currIndex]);
          }
        });
    }
    addDoc(data[currIndex]);
  });
}

let heartbeatInterval = setInterval(function() {
  console.log(`-heartbeat (${finishedCount}/${maxFinishedCount})-`);
  if(finishedCount === maxFinishedCount) {
    clearInterval(heartbeatInterval);
    console.log('Finished!');
    process.exit();
  }
}, 1000 * 3);