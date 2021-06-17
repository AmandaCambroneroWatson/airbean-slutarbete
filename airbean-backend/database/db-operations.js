const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('accounts.json');
const database = lowdb(adapter);

function writeToDb(array, object) {
  database.get(array).push(object).write();
}

function findUser(key, value) {
  if (key === 'username') {
    return database.get('accounts').find({ username: value }).value();
  } else if (key === 'email') {
    return database.get('accounts').find({ email: value }).value();
  } else return database.get('accounts').value();
}

function filterOrders(userId) {
  return database.get('orders').filter({ userId: userId }).orderBy('orderCreated', 'desc').value();
}

function findOrder(orderId) {
  return database.get('orders').filter({ id: orderId }).value();
}

module.exports = { database, writeToDb, findUser, filterOrders, findOrder };