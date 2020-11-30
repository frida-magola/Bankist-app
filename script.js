"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-26T17:01:17.194Z",
    "2020-11-28T23:36:17.929Z",
    "2020-11-22T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const selector = (target) => document.querySelector(target);

const inputLoginUsername = selector(".login__input--user");
const inputLoginPin = selector(".login__input--pin");
const inputTransferTo = selector(".form__input--to");
const inputTransferAmount = selector(".form__input--amount");
const inputLoanAmount = selector(".form__input--loan-amount");
const inputCloseUsername = selector(".form__input--user");
const inputClosePin = selector(".form__input--pin");

// Format date
const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();

  //   return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(locale).format(date);
};

// Formatting currency
const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(Math.abs(value));
};

/**
 * Display movements on the UI
 */
const displayMovements = function (acc, sort = false) {
  // initial movement container
  containerMovements.innerHTML = "";

  // sorting movements in ascending order for the current account
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // loop the movements args
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    // Get the date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);

    // Format the movements
    const formatterMov = formatCurrency(mov, acc.locale, acc.currency);

    // R${Math.abs(mov.toFixed(2))}
    // create a template string
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatterMov}</div>
      </div>`;

    // insert into containerMovements
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/**
 * Display balance on the UI
 */
const displayBalance = function (acc) {
  labelBalance.textContent = "";
  acc.balance = acc.movements.reduce((acc, mov, i) => acc + mov, 0);
  // labelBalance.textContent = `R${acc.balance.toFixed(2)}`;
  // const balance = formatCurrency(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
  // return balance;
};

// Get Summary deposit
const displaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov, i, arr) => mov > 0)
    .reduce((acc, mov, i, arr) => acc + mov, 0);
  // labelSumIn.textContent = `R${incomes.toFixed(2)}`;
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);
  // Out put
  const output = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumOut.textContent = `R${Math.abs(output).toFixed(2)}`;
  labelSumOut.textContent = formatCurrency(output, acc.locale, acc.currency);

  // interest
  const interest = acc.movements
    .filter((mov, i) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  // labelSumInterest.textContent = `R${interest.toFixed(2)}`;
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

/**
 * Computed Usernames
 */
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

// Update UI
const updateUI = (acc) => {
  // Display Movement
  displayMovements(acc);

  // Display Balance
  displayBalance(acc);

  // Display Summary
  displaySummary(acc);
  //
};

// Counter
const startLogOutTimer = () => {
  const tick = function () {
    // convert the time in mining
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call print the remainig time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 second stop the timer and log out the user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;

      containerApp.style.opacity = 0;
    }

    // Decrease one second <=> 1s
    time--;
  };

  // Set the time to 5 minutes
  let time = 100;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// 1. Login Implementation
let currentAccount, timer;

// Fake always login
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 1;

/**
 * EVENT HANDLER
 *
 */

btnLogin.addEventListener("click", function (e) {
  // Preventing
  e.preventDefault();

  // Find the username
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }!`;

    // Create the current Date
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Experiencing API Internationalized Dates
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear inputs value
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // If timer exist already
    if (timer) clearInterval(timer);

    // call start log out timer
    timer = startLogOutTimer();

    // Update the UI
    updateUI(currentAccount);
  } else {
    console.log("User or Pin is incorrect!");
  }
});

// 1. Transfer Money by the current user
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  // find the receiver user
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  // clear inputs
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferTo.blur();

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update the UI
    updateUI(currentAccount);
    console.log("Transfer Valid");

    // Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Close the account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // Find currentAccount user
    console.log("Delete");
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    console.log(index);

    //  Delete currentAccount from the array accounts
    accounts.splice(index, 1);

    // Hide the UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
  inputClosePin.blur();
  console.log("Incorrect Details");
});

// Demand Loan to the bank
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  // const amount = Number(inputLoanAmount.value);
  const amount = Math.floor(inputLoanAmount.value);

  // 10% of the amount
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // add a positive to the current data
      currentAccount.movements.push(amount);

      // add Loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update the Ui
      updateUI(currentAccount);

      // Reset the timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
});

// Button sort handler
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Get the SUM of all accounts
const overralBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overralBalance);

const overralBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overralBalance2);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// ForEach Method on Map array
// console.log("------ForEach Method on Map array--------");
// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Filter method on the array
// const deposit = movements.filter((mov) => mov > 0);
// const withdrawal = movements.filter((mov) => mov < 0);
// console.log(deposit);
// console.log(withdrawal);

// const depositFor = [];
// for (const mov of movements) if (mov > 0) depositFor.push(mov);

// reduce Method onthe array
// console.log(movements);
// const balanceMovement = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iteration ${i} : ${acc}`);
//   return acc + curr;
// }, 0);
// console.log(balanceMovement);

// console.log(depositFor);
// const movUnit = 1.1;
// const movementConvert = movements.map(
//   (mov, i) =>
//     `movement ${i + 1} you ${mov > 0 ? "deposited" : "withdrawal"} ${Math.abs(
//       mov * movUnit
//     )} `
// );
// console.log(movementConvert);

/////////////////////////////////////////////////

// console.log("------Loop an array with for of method-----");
// for (const [i, mov] of movements.entries()) {
//   if (mov > 0) {
//     console.log(`You desiposited: ${i + 1} : movement of ${mov}`);
//   } else {
//     console.log(`You withdrew : ${i + 1} : movement of ${mov}`);
//   }
// }

// console.log("--------ForEach Method-----");
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`You desiposited : ${i + 1} : movement of ${mov}`);
//   } else {
//     console.log(`You withdrew : ${i + 1} : movement of ${mov}`);
//   }
// });

// ForEach Method on set array
// const currenciesUnique = new Set(["EUR", "EUR", "BSG", "FRANC", "USD", "USD"]);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value} : ${value}`);
// });

// challenge array
// const dogsFunc = function (dogsJulia, dogsKate) {
//   let dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0);
//   dogsJuliaCorrected.splice(-2);
//   const newArrayDogs = dogsJuliaCorrected.concat(dogsKate);

//   console.log(newArrayDogs);

//   newArrayDogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`the dog ${i + 1} is  older  with ${dog} year old`);
//     } else {
//       console.log(`the dog ${i + 1} is  punny  with ${dog} year old`);
//     }
//   });
// };

// dogsFunc([1, 2, 5, 8, 9, 4], [3, 6, 1, 9, 4, 10]);

//

// includes, every, some
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// 1.includes verify for equality
console.log(movements.includes(-200));

// Some verify condition
console.log(movements.some((mov) => mov === 1300));

// Every verify only when all the  conditions are true
console.log(movements.every((mov) => mov > 0));

// Flat method
const arr = [[12, 3, 1], [8, 9, 5, 6], 11, 23];
// console.log(arr.flat());

// Sorting, this sorting can work both strings and arrays

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   else return -1;
// });
// console.log(movements);

// // Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   else return 1;
// });
// console.log(movements);

// Short hand of sorting an array
movements.sort((a, b) => a - b);
// console.log(movements);

// Descending
movements.sort((a, b) => b - a);
// console.log(movements);

// Empty array + fill method
const x = new Array(7);
x.fill(1, 3, 5);
// console.log(x);

//  Create an array programmatically
const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

const z = Array.from({ length: 7 }, (cur, i) => i + 1);
// console.log(z);

const allMovs = Array.from(
  document.querySelectorAll(".movements__value"),
  (el) => el.textContent.replace("€", "")
);
// console.log(allMovs);
// setInterval
// setInterval(function () {
//   const now = new Date();

//   console.log(
//     `Timer: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}}`
//   );
// }, 1000);
