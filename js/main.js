//global data


let globalData = {
  cards: []
}

//Functions

//store the cardId on the transaction table for easy access

const setCurrentCardId = (currentCardId) => {
  let tableElement = document.getElementById("transactionsTable");
  tableElement.currentCardId = currentCardId;
};

//Get the current card id of the transactions table
const getCurrentCardId = () => {
  return document.getElementById("transactionsTable").currentCardId;
};

const setLastTransactionDate = (date) => {
  let tableElement = document.getElementById("transactionsTable");
  tableElement.lastTransactionDate = date;
};

const getLastTransactionDate = () => {
  return document.getElementById("transactionsTable").lastTransactionDate;
};

const sortByTransactionsDate = (array) => {
  //Sorts in chronological order (Most recent to least recent)
  let test = array.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.date) - new Date(a.date);
  });
};

const buildSkeletonRows = () => {
  let tableLoading = true;

  let dummyTransactionTableData = {
    transactions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    card: null,
  };
  let transactionsTableSkeleton = generateTransactionsTable(
    dummyTransactionTableData,
    tableLoading
  );

  let tableContainer = document.getElementById("tableParentContainer");

  tableContainer.appendChild(transactionsTableSkeleton);
};

let infiniteScrollTrigger = async () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight &&
    !globalLoading
  ) {
    console.log("LAST TRANSACTION DATE, INSIDE INF SCROLL TRIGGER....");

    globalLoading = true;

    const lastTransactionDate = getLastTransactionDate();
    const currentCardId = getCurrentCardId();

    buildSkeletonRows();

    let transactions = await fetchTransactionsByCardId(
      currentCardId,
      lastTransactionDate
    );

    sortByTransactionsDate(transactions);

    setLastTransactionDate(transactions[transactions.length - 1].date);

    let transactionsWithCard = {
      transactions,
      currentCardId,
    };

    //Remove Skeleton row items
    document.querySelectorAll("#skeletonRow").forEach((n) => n.remove());

    let transactionsTable = generateTransactionsTable(transactionsWithCard);

    tableContainer.appendChild(transactionsTable);

    globalLoading = false;
  }
};

//Fetch all cards

const fetchCards = async () => {
  const cards = await fetch("http://localhost:8080/cards", {})
    .then(function (response) {
      return response.json();
    })
    .then(function (body) {
      return body;
    })
    .catch(function (err) {
      // There was an error
      console.warn("Something went wrong.", err);
    });

  return cards;
};

// Fetch Transactions By Card Id
//Optional param: lastTransactionDate (ISO 8601 FORMAT)
const fetchTransactionsByCardId = async (cardId, lastTransactionDate) => {
  globalLoading = true;
  let lastTransactionDateValue = "";

  // If no lastTransactionDate, set it to current time UTC. ISO 8601 format.

  if (!lastTransactionDate) {
    //If no value passed, set it to current time
    lastTransactionDateValue = new Date(Date.now()).toISOString();
  } else {
    lastTransactionDateValue = lastTransactionDate;
  }

  const transactions = await fetch(
    `http://localhost:8080/transactions/${cardId}/${lastTransactionDateValue}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (body) {
      return body;
    })
    .catch(function (err) {
      // There was an error
      console.warn("Something went wrong.", err);
    });

  globalLoading = false;
  return transactions;
};

//Determine which card logo to serve

//pass card type + background type needed
// Example: ("visa", "light")
//options for BG: dark, light
let getCardLogoSrc = (cardType, backgroundType) => {
  //light bgs
  if (cardType.toLowerCase() === "mastercard" && backgroundType === "light") {
    return "./assets/mastercard_logo_light_bg.png";
  } else if (cardType.toLowerCase() === "visa" && backgroundType === "light") {
    return "./assets/visa_logo_light_bg.png";
  }

  //dark bgs
  if (cardType.toLowerCase() === "mastercard" && backgroundType === "dark") {
    return "./assets/mastercard_logo_dark_bg.png";
  } else if (cardType.toLowerCase() === "visa" && backgroundType === "dark") {
    return "./assets/visa_logo_dark_bg.png";
  }
};

const createTableHead = () => {
  const tableHeaderNode = document.getElementById("testingId");

  if (!tableHeaderNode) {
    let creditCardContainer = document.getElementById("creditCardContainer");

    let table = document.createElement("table");
    table.classList.add("ttable");
    table.id = "transactionsTable";
    let tableHead = document.createElement("thead");
    tableHead.id = "testingId";
    table.appendChild(tableHead);
    let tableHeaderRow = document.createElement("tr");
    tableHeaderRow.classList.add("ttableHeaderRow");

    tableHead.appendChild(tableHeaderRow);

    let col1Header = document.createElement("th");
    col1Header.classList.add("ttableHeaderCol1");
    col1Header.classList.add("ttableCol1");

    col1Header.innerHTML = "DESCRIPTION";
    tableHeaderRow.appendChild(col1Header);
    let col2Header = document.createElement("th");
    col2Header.classList.add("ttableHeaderCol2");
    col2Header.classList.add("ttableCol2");
    col2Header.innerHTML = "DATE";
    tableHeaderRow.appendChild(col2Header);
    let col3Header = document.createElement("th");
    col3Header.classList.add("ttableHeaderCol3");
    col3Header.classList.add("ttableCol3");
    col3HeaderDiv = document.createElement("div");
    col3HeaderDiv.classList.add("ttableCol3");

    col3HeaderDiv.innerHTML = "AMOUNT";
    col3Header.appendChild(col3HeaderDiv);

    tableHeaderRow.appendChild(col3Header);

    //Create the body

    tableBody = document.createElement("tbody");
    tableBody.classList.add("ttableBody");
    tableBody.id = "transactionTableBody";
    table.appendChild(tableBody);

    //Apend to table container

    creditCardContainer.appendChild(table);
  }
};

const generateTransactionsTable = (data, loading) => {
  const { transactions, card } = data;

  //Map through and create all rows

  //fetch the table

  let table = document.getElementById("transactionsTable");

  transactions.map((item) => {
    let tableRow = document.createElement("tr");
    tableRow.classList.add("ttableRow");

    if (loading) {
      tableRow.id = "skeletonRow";
    }

    //Create each row

    let col1 = document.createElement("td");
    col1.classList.add("ttableCol1");

    let ttalbeTransactionDescription = document.createElement("div");
    ttalbeTransactionDescription.classList.add("ttalbeTransactionDescription");

    if (!loading) {
      ttalbeTransactionDescription.innerHTML = item.description;
    } else if (loading) {
      ttalbeTransactionDescription.classList.add("skeleton");
      ttalbeTransactionDescription.innerHTML = "&nbsp;";
    }

    col1.appendChild(ttalbeTransactionDescription);

    let cardInfo = document.createElement("div");
    cardInfo.classList.add("ttableCardInfo");
    let cardName = document.createElement("div");
    cardName.classList.add("ttableCardNameText");
    let masking = document.createElement("div");
    masking.classList.add("genericSmallMaskingForCC");

    let lastFourDigitsOfCardNumber = document.createElement("div");
    lastFourDigitsOfCardNumber.classList.add("lastFourDigitsOfCardNumber");

    if (!loading) {
      cardName.innerHTML = card.name;
      masking.innerHTML = "•••••";
      lastFourDigitsOfCardNumber.innerHTML = getLastFourAlphaNumericCharacters(
        card.number
      );
    } else if (loading) {
      cardInfo.classList.add("skeleton");
    }

    cardInfo.appendChild(cardName);

    cardInfo.appendChild(masking);
    cardInfo.appendChild(lastFourDigitsOfCardNumber);

    col1.appendChild(cardInfo);

    tableRow.appendChild(col1);

    let col2 = document.createElement("td");
    col2.classList.add("ttableCol2");

    let ttableDateDiv = document.createElement("div");
    ttableDateDiv.classList.add("ttableDateDiv");

    col2.appendChild(ttableDateDiv);

    if (!loading) {
      ttableDateDiv.innerHTML = formatDateToDayMonthYear(item.date)
    } else if (loading) {
      ttableDateDiv.classList.add("skeleton");
      ttableDateDiv.innerHTML = "&nbsp;";
    }
    tableRow.appendChild(col2);

    let col3 = document.createElement("td");
    col3.classList.add("ttableCol3");
    tableRow.appendChild(col3);

    let amountDiv = document.createElement("div");
    amountDiv.classList.add("ttableAmountDiv");

    //Append a + in front of non-negative numbers

    if (!loading) {
      let amount = item.amount.toString();

      if (Array.from(amount)[0] !== "-") {
        amount = "+" + amount;
      }
      amountDiv.innerHTML = amount + " " + "€";
    } else if (loading) {
      amountDiv.innerHTML = "&nbsp;";

      amountDiv.classList.add("skeleton");
    }
    col3.appendChild(amountDiv);

    //append to table

    tableBody.appendChild(tableRow);
  });

  //return table (Append in parent function)
  return table;
};

//Return month/year format for date (string)
let formatDateToMonthYear = (date) => {
  let dateObj = new Date(date);

  return `${dateObj.getMonth()}/${dateObj.getFullYear()}`;
};

//Return day/month/year (31/12/2022) string
let formatDateToDayMonthYear = (date) => {
  let dateObj = new Date(date);

  return `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`;
};

//Hide card number
// Only have the last 4 alphabetic or numeric chars show
//TODO name this MASK

const hideCardNumber = (cardNumber) => {
  // Extract the last 4 alpha-numeric characters
  const lastFourAlphaNumeric = cardNumber.match(/[a-zA-Z0-9-]{4}(?=[^\w]*$)/);

  // Replace all characters with masked value except dashes and spaces
  const maskedStr = cardNumber.replace(/[^ -]/g, "•");

  // Insert back the last 4 alpha-numeric characters and also replace dashes with spaces
  return (maskedStr.slice(0, -4) + lastFourAlphaNumeric[0]).replace(
    /[-]/g,
    " "
  );
};

//Get last 4 digits of card

function getLastFourAlphaNumericCharacters(cardNumber) {
  // Remove all special characters, spaces, and dashes using regex
  const cleanedStr = cardNumber.replace(/[^a-zA-Z0-9]/g, "");

  // Get the last 4 characters of the cleaned string
  const lastFourChars = cleanedStr.slice(-4);

  return lastFourChars;
}

/* const saveCreditCardDataOnElementAsDataAttribute = (data, divId) => {

  const creditCard = document.getElementById(divId)

  //save card number

  //save bank name

  //
} */

const changeActiveCard = async (event) => {


  let creditCardContainer = document.getElementById("creditCardContainer")

  console.log(creditCardContainer)


  //Replace current active node with inactive card

  const currentActiveCard = document.getElementById(getCurrentCardId())

  console.log(currentActiveCard)

  const newInactiveCardData = globalData.cards.find( (item) => item.id === getCurrentCardId())

  console.log(newInactiveCardData)

  const newInactiveCard = buildInactiveCardItem(newInactiveCardData)

  console.log(newInactiveCard)

  creditCardContainer.replaceChild(newInactiveCard, currentActiveCard)


  const clickedCardId = event.target.id
  //Get new active node

  const clickedCard = document.getElementById(clickedCardId)

  console.log(clickedCard)


  const newActiveCardData = globalData.cards.find( (item) => item.id ===  clickedCardId)

  console.log(newActiveCardData)

  const newActiveCard = buildActiveCardItem(newActiveCardData)

  console.log(newActiveCard)

  //replace clicked inactive card with active card

  creditCardContainer.replaceChild(newActiveCard, clickedCard)

  //UPDATE THE CURRENT CARD ID!

  setCurrentCardId(clickedCardId)


  //Append new active to top of list

  creditCardContainer.prepend(newActiveCard)

  newActiveCard.classList.add("newTopCard")


  //Set transaction table to new card

 // ttableRow
  //Remove skeleton rows from transaction table
  document.querySelectorAll(".ttableRow").forEach((n) => n.remove());

  //add skeleton rows

    buildSkeletonRows();

  //Call real data


 

 let transactions = await fetchTransactionsByCardId(getCurrentCardId());

 sortByTransactionsDate(transactions);

 window.lastUpdateDate = transactions[transactions.length - 1].date;

 setLastTransactionDate(transactions[transactions.length - 1].date);


  //Remove skeleton rows from transaction table
  document.querySelectorAll("#skeletonRow").forEach((n) => n.remove());


  //Transaction with Card object

  let transactionsWithCard = {
    transactions,
    card: newActiveCardData,
  };


  //Add real transactions onto table
  generateTransactionsTable(transactionsWithCard);





 
}

const buildActiveCardItem = (item, loading) => {
  const dataElement = document.createElement("div");
  dataElement.classList.add("creditCard");
  dataElement.classList.add("active");
  dataElement.addEventListener("click", changeActiveCard)

  if (loading) {
    dataElement.classList.add("skeleton");
  }

  if (!loading) {
    dataElement.classList.add("loaded");
    dataElement.id = item.id;
    const topElement = document.createElement("div");
    topElement.classList.add("top");
    dataElement.appendChild(topElement);
    const nameLogoContainer = document.createElement("div");
    nameLogoContainer.classList.add("nameLogoContainer");
    topElement.appendChild(nameLogoContainer);
    //Create image element and nest it into nameLogoContainer
    const imageElement = document.createElement("img");
    imageElement.classList.add("cardLogo");
    imageElement.setAttribute("src", item.logo);
    imageElement.setAttribute("alt", `${item.name} logo`);
    nameLogoContainer.appendChild(imageElement);
    //Create Bank Name and nest it into nameLogoContainer
    const bankNameElement = document.createElement("div");
    bankNameElement.classList.add("cardBankName");
    bankNameElement.innerHTML = item.name;
    nameLogoContainer.appendChild(bankNameElement);
    //Create cardLastUpdated div and nest into Top element
    const cardLastUpdatedElement = document.createElement("div");
    cardLastUpdatedElement.classList.add("cardLastUpdated");
    cardLastUpdatedElement.classList.add("smallCardText");
    cardLastUpdatedElement.innerHTML = `Last update: ${formatDateToDayMonthYear(
      item.lastUpdateAt
    )}`;
    topElement.appendChild(cardLastUpdatedElement);
    //Create bottom div and nest into credit card container element
    const bottomElement = document.createElement("div");
    bottomElement.classList.add("bottom");
    bottomElement.classList.add("showOnActive");
    dataElement.appendChild(bottomElement);
    //Create cardNumber div and nest into bottom element
    const cardNumber = document.createElement("div");
    cardNumber.classList.add("cardNumber");
    cardNumber.classList.add("col");
    bottomElement.appendChild(cardNumber);
    //first nested item
    const cardNameElement = document.createElement("div");
    cardNameElement.classList.add("smallCardText");
    cardNameElement.innerHTML = "Card Number";
    cardNumber.appendChild(cardNameElement);

    //second nested item
    const cardNumberElement = document.createElement("div");
    cardNumberElement.classList.add("mediumCardText");
    cardNumberElement.innerHTML = hideCardNumber(item.number);
    cardNumber.appendChild(cardNumberElement);
    //next
    //Create cardExpiry div and nest into bottom element
    const cardExpiryElement = document.createElement("div");
    cardExpiryElement.classList.add("cardExpiry");
    cardExpiryElement.classList.add("col");
    bottomElement.appendChild(cardExpiryElement);
    //first nested item
    const expiryTitleElement = document.createElement("div");
    expiryTitleElement.classList.add("smallCardText");
    expiryTitleElement.innerHTML = "Expiration";
    cardExpiryElement.appendChild(expiryTitleElement);

    //second nested item
    const cardExpirationDateElement = document.createElement("div");
    cardExpirationDateElement.classList.add("mediumCardText");
    cardExpirationDateElement.innerHTML = formatDateToMonthYear(
      item.expiration
    );
    cardExpiryElement.appendChild(cardExpirationDateElement);

    //next
    //Create card type div and nest into bottom element
    const cardTypeElement = document.createElement("div");
    cardTypeElement.classList.add("cardType");
    cardTypeElement.classList.add("col");
    bottomElement.appendChild(cardTypeElement);
    //first nested item
    const cardTypeTitleElement = document.createElement("img");
    cardTypeTitleElement.setAttribute(
      "src",
      getCardLogoSrc(item.circuit, "dark")
    );
    cardTypeTitleElement.classList.add("activeCardLogo");

    cardTypeElement.appendChild(cardTypeTitleElement);

    //second nested item
    const cardType = document.createElement("div");
    cardType.classList.add("mediumCardText");
    cardType.innerHTML = "CREDIT";
    cardTypeElement.appendChild(cardType);
  }
  return dataElement;
};

const buildInactiveCardItem = (item, loading) => {
  const dataElement = document.createElement("div");
  dataElement.classList.add("creditCard");
  dataElement.classList.add("inactive");
  dataElement.addEventListener("click", changeActiveCard)

  if (loading) {
    dataElement.classList.add("skeleton");
  }

  if (!loading) {
    dataElement.id = item.id;

    //leftSectionInactive
    const leftSectionInactive = document.createElement("div");
    leftSectionInactive.classList.add("leftSectionInactive");
    dataElement.appendChild(leftSectionInactive);

    //logoDivInactive
    const logoDivInactive = document.createElement("img");
    logoDivInactive.classList.add("logoInactiveCard");
    logoDivInactive.setAttribute("src", item.logo);
    logoDivInactive.setAttribute("alt", `${item.name} logo`);
    leftSectionInactive.appendChild(logoDivInactive);

    //inactiveNameStatusSection

    const inactiveNameStatusSection = document.createElement("div");
    inactiveNameStatusSection.classList.add("inactiveNameStatusSection");
    leftSectionInactive.appendChild(inactiveNameStatusSection);

    // nameInactiveCard

    const nameInactiveCard = document.createElement("div");
    nameInactiveCard.classList.add("nameInactiveCard");
    nameInactiveCard.innerHTML = item.name;
    inactiveNameStatusSection.appendChild(nameInactiveCard);

    // build status or card numb (based on active status)

    if (item.status === "INACTIVE") {
      const statusPill = document.createElement("div");
      statusPill.classList.add("pill");
      statusPill.classList.add("pillRed");
      statusPill.innerHTML = item.status;
      inactiveNameStatusSection.appendChild(statusPill);
    } else if (item.status === "ACTIVE") {
      const unselectedCardNumber = document.createElement("div");
      unselectedCardNumber.classList.add("unselectedCardNumber");
      unselectedCardNumber.innerHTML = hideCardNumber(item.number);
      inactiveNameStatusSection.appendChild(unselectedCardNumber);
    }

    //rightSectionInactive

    const rightSectionInactive = document.createElement("div");
    rightSectionInactive.classList.add("rightSectionInactive");
    dataElement.appendChild(rightSectionInactive);

    // inactiveCardLogo

    const inactiveCardLogo = document.createElement("img");
    inactiveCardLogo.setAttribute("src", getCardLogoSrc(item.circuit, "light"));
    inactiveCardLogo.classList.add("inactiveCardLogo");
    rightSectionInactive.appendChild(inactiveCardLogo);

    // inactiveCreditOrDebit

    const inactiveCreditOrDebit = document.createElement("div");
    inactiveCreditOrDebit.classList.add("inactiveCardTypeText");
    inactiveCreditOrDebit.innerHTML = "CREDIT";
    rightSectionInactive.appendChild(inactiveCreditOrDebit);
  }
  return dataElement;
};

const initPage = async () => {
  //Create table head (for transactions table)
  //This only needs done upon page load

  const tableHeaderNode = document.getElementById("testingId");

  createTableHead();

  //Load skeleton active card

  let creditCardContainer = document.getElementById("creditCardContainer");

  //Show 1x active card skeleton
  creditCardContainer.appendChild(buildActiveCardItem(null, true));

  //Show 5x inactive card skeletons
  creditCardContainer.appendChild(buildInactiveCardItem(null, true));
  creditCardContainer.appendChild(buildInactiveCardItem(null, true));
  creditCardContainer.appendChild(buildInactiveCardItem(null, true));
  creditCardContainer.appendChild(buildInactiveCardItem(null, true));
  creditCardContainer.appendChild(buildInactiveCardItem(null, true));

  //Build skeleton rows for transaction table
  buildSkeletonRows();

  const cards = await fetchCards();

  console.log(cards)

  //add cards to global data state

  cards.map((item) => {
    console.log(item)
    globalData.cards.push(item)
  })
  

  //store first card ID as current card id.
  setCurrentCardId(cards[0].id);

  let transactions = await fetchTransactionsByCardId(getCurrentCardId());

  sortByTransactionsDate(transactions);

  window.lastUpdateDate = transactions[transactions.length - 1].date;

  setLastTransactionDate(transactions[transactions.length - 1].date);

  window.addEventListener("scroll", infiniteScrollTrigger);

  //Remove all skeleton nodes for Credit Card (left) section
  creditCardContainer.querySelectorAll("*").forEach((n) => n.remove());

  //Add cards to document
  //Do this after transactions are also brought back so we can load it all together

  cards.forEach((item, index) => {
    if (index === 0) {
      creditCardContainer.appendChild(buildActiveCardItem(cards[index]));
    } else {
      creditCardContainer.appendChild(buildInactiveCardItem(cards[index]));
    }
  });

  let transactionsWithCard = {
    transactions,
    card: cards[0],
  };

  //Remove skeleton rows from transaction table
  document.querySelectorAll("#skeletonRow").forEach((n) => n.remove());

  //Add real transactions onto table
  generateTransactionsTable(transactionsWithCard);
};

initPage();
