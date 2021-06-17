const { writeToDb, findUser } = require('./database/db-operations');
const { nanoid } = require('nanoid');

const menu = require('./menu.json');

function diffOfTime(orders) {
  const todayCheck = new Date();
  let msec = todayCheck.getTime() - new Date(orders[i].orderCreated).getTime();
  let mins = Math.floor(msec / 60000);
  let hrs = Math.floor(mins / 60);
  let days = Math.floor(hrs / 24);
  let yrs = Math.floor(days / 365);
  let orderDone = true;

  if (mins < orders[i].eta) {
    orderDone = false;
  }
  let diff = {
    orderDone: orderDone,
    orderId: orders[i].id,
    orderCreated: orders[i].orderCreated,
    OrderlifeTime: { mins: mins }
  };

  let calMinutes = hrs * 60;
  let calHours = days * 24;
  let caldays = yrs * 365;

  if (!diff.orderDone) {
    diff.timeLeft = orders[i].eta - mins;
  }

  if (mins >= 60) {
    diff = {
      ...diff,
      OrderlifeTime: { hours: hrs, mins: mins - calMinutes }
    };

    if (hrs >= 24) {
      diff = {
        ...diff,
        OrderlifeTime: {
          days: days,
          hours: hrs - calHours,
          mins: mins - calMinutes
        }
      };

      if (days >= 365) {
        diff = {
          ...diff,
          OrderlifeTime: {
            years: yrs,
            days: days - caldays,
            hours: hrs - calHours,
            mins: mins - calMinutes
          }
        };
      }
    }
  }

  return diff;
}

function calDiffInTime(orders) {
  let orderHistory = [];
  for (i = 0; i < orders.length; i++) {
    orderHistory.push([diffOfTime(orders)]);

    for (x = 0; x < orders[i].itemId.length; x++) {
      const findId = menu['menu'].find((element) => element.id === orders[i].itemId[x]);

      orderHistory[i].push({
        id: findId.id,
        title: findId.title,
        price: findId.price
      });
    }
  }

  return orderHistory;
}
// se lektion-29-april node.js-account kollar om user finns
function checkUser(account) {
  const usernameExists = findUser('username', account.username);
  const emailExists = findUser('email', account.email);

  account.userid = nanoid();

  const result = {
    success: false,
    usernameExists: false,
    emailExists: false
  };

  if (usernameExists) {
    result.usernameExists = true;
  }
  if (emailExists) {
    result.emailExists = true;
  }
  if (!result.usernameExists && !result.emailExists) {
    writeToDb('accounts', account);
    result.success = true;
    result.user = { username: account.username, email: account.email, userid: account.userid };
  } else if (!result.usernameExists || !result.emailExists) {
    result.user = { Error: 'Wrong username or email' };
  } else {
    result.user = { username: usernameExists.username, email: emailExists.email, userid: usernameExists.userid };
  }
  return result;
}

function createOrder(order) {
  let today = new Date();
  order.orderCreated = today;
  order.id = nanoid();
  order.eta = Math.floor(Math.random() * 15) + 2;
  console.log(order);
  writeToDb('orders', order);
  let orderResult = {
    eta: order.eta,
    orderid: order.id
  };
  return orderResult;
}


module.exports = { calDiffInTime, checkUser, createOrder };
