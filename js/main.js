//global var

let cards;

//Functions

//Fetch all cards

const fetchCards = async () => {
  const cards = await fetch("http://localhost:8080/cards", {})
    .then(function (response) {
      console.log("FETCH CARDS FROM BACKEND...");

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
//ISSUE: The API is said to have a param called lastTransactionDate
// which allows to grab by end date, but it does not seem to work
// the API is built to send a batch, so build and do not filter on our side
// other than basic ordering of each specific batch
const fetchTransactionsByCardId = async (cardId) => {

    const transactions = await fetch(`http://localhost:8080/transactions/${cardId}`, {})
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

    console.log("TODO:: make these return in order.")

  return transactions;

}

  //Determine which card logo to serve

  //pass card type + background type needed
  // Example: ("visa", "light")
  //options for BG: dark, light
  let getCardLogoSrc = (cardType, backgroundType) => {


    //light bgs
    if(cardType.toLowerCase() === "mastercard" && backgroundType === "light"){
      return "./assets/mastercard_logo_light_bg.png"
    } else if (cardType.toLowerCase() === "visa" && backgroundType === "light"){
      return "./assets/visa_logo_light_bg.png"
    }


    //dark bgs
    if(cardType.toLowerCase() === "mastercard" && backgroundType === "dark"){
        return "./assets/mastercard_logo_dark_bg.png"
      } else if (cardType.toLowerCase() === "visa" && backgroundType === "dark"){
        return "./assets/visa_logo_dark_bg.png"
      }

  }





const generateTransactionsTable = (data) => {

//data.transcations = an array of transactions
// data.card = object with card info
    //Create the table section
    const {transactions, card} = data

    let table = document.createElement("table")
    table.classList.add("ttable")
    let tableHead = document.createElement("thead")
    table.appendChild(tableHead)
    let tableHeaderRow = document.createElement("tr")
    tableHeaderRow.classList.add("ttableHeaderRow")
    
    tableHead.appendChild(tableHeaderRow)
    
    let col1Header = document.createElement("th")
    col1Header.classList.add("ttableHeaderCol1")
    col1Header.classList.add("ttableCol1")

    col1Header.innerHTML = "DESCRIPTION"
    tableHeaderRow.appendChild(col1Header)
    let col2Header = document.createElement("th")
    col2Header.classList.add("ttableHeaderCol2")
    col2Header.classList.add("ttableCol2")
    col2Header.innerHTML = "DATE"
    tableHeaderRow.appendChild(col2Header)
    let col3Header = document.createElement("th")
    col3Header.classList.add("ttableHeaderCol3")
    col3Header.classList.add("ttableCol3")
    col3HeaderDiv = document.createElement("div")
    col3HeaderDiv.classList.add("ttableCol3")

    col3HeaderDiv.innerHTML = "AMOUNT"
    col3Header.appendChild(col3HeaderDiv)
    
    
    tableHeaderRow.appendChild(col3Header)

    //Create the body

    tableBody = document.createElement("tbody")
    tableBody.classList.add("ttableBody")
    table.appendChild(tableBody)

    //Map through and create all rows

        transactions.map(item => {


        let tableRow = document.createElement("tr")
        tableRow.classList.add("ttableRow")

        //Create each row

        let col1 = document.createElement("td")
        col1.classList.add("ttableCol1")
        col1.innerHTML = item.description

        let cardInfo = document.createElement("div")
        cardInfo.classList.add("ttableCardInfo")
        let cardName = document.createElement("div")
        cardName.classList.add("ttableCardNameText")
        cardName.innerHTML = card.name
        cardInfo.appendChild(cardName)
        let masking = document.createElement("div")
        masking.classList.add("genericSmallMaskingForCC")
        masking.innerHTML = "•••••"
        cardInfo.appendChild(masking)

        let lastFourDigitsOfCardNumber = document.createElement("div")
        lastFourDigitsOfCardNumber.classList.add("lastFourDigitsOfCardNumber")
        lastFourDigitsOfCardNumber.innerHTML = getLastFourAlphaNumericCharacters(card.number)
        cardInfo.appendChild(lastFourDigitsOfCardNumber)



        col1.appendChild(cardInfo)

        tableRow.appendChild(col1)



        

        let col2 = document.createElement("td")
        col2.classList.add("ttableCol2")
        col2.innerHTML = formatDateToDayMonthYear(item.date)
        tableRow.appendChild(col2)


        let col3 = document.createElement("td")
        col3.classList.add("ttableCol3")
        tableRow.appendChild(col3)  

        let amountDiv = document.createElement("div")
        amountDiv.classList.add("ttableAmountDiv")

        //Append a + in front of non-negative numbers

        let amount = item.amount.toString()

        if(Array.from(amount)[0] !== '-'){
           amount = "+" + amount
        }
        amountDiv.innerHTML = amount + " " + "€"
        col3.appendChild(amountDiv)    

        //append to table

        tableBody.appendChild(tableRow)


    })



    //return table (Append in parent function)
    return table

}


//Return month/year format for date (string)
let formatDateToMonthYear = (date) => {
  // console.log(date);
  let dateObj = new Date(date);
  /*     console.log(dateObj);
    console.log(typeof dateObj);
    console.log(dateObj.getMonth());
    console.log(dateObj.getFullYear()); */
  return `${dateObj.getMonth()}/${dateObj.getFullYear()}`;
};

//Return day/month/year (31/12/2022) string
let formatDateToDayMonthYear = (date) => {
  // console.log(date);
  let dateObj = new Date(date);
  /*     console.log(dateObj);
    console.log(typeof dateObj);
    console.log(dateObj.getMonth());
    console.log(dateObj.getFullYear()); */
  return `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`;
};

//Hide card number
// Only have the last 4 alphabetic or numeric chars show
//TODO name this MASK

const hideCardNumber = (cardNumber) => {
  
      // Extract the last 4 alpha-numeric characters
  const lastFourAlphaNumeric = cardNumber.match(/[a-zA-Z0-9-]{4}(?=[^\w]*$)/);

  console.log(lastFourAlphaNumeric)

  // Replace all characters with masked value except dashes and spaces
  const maskedStr = cardNumber.replace(/[^ -]/g, '•');


  // Insert back the last 4 alpha-numeric characters and also replace dashes with spaces
  return (maskedStr.slice(0, -4) + lastFourAlphaNumeric[0]).replace(/[-]/g, ' ')
};


//Get last 4 digits of card

function getLastFourAlphaNumericCharacters(cardNumber) {
    // Remove all special characters, spaces, and dashes using regex
    const cleanedStr = cardNumber.replace(/[^a-zA-Z0-9]/g, '');
  
    // Get the last 4 characters of the cleaned string
    const lastFourChars = cleanedStr.slice(-4);
  
    return lastFourChars;
  }



const buildActiveCardItem = (item) => {
  const dataElement = document.createElement("div");
  dataElement.id = item.id;
  dataElement.classList.add("creditCard");
  dataElement.classList.add("active");
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
  cardNumberElement.innerHTML = item.number;
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
  cardExpirationDateElement.innerHTML = formatDateToMonthYear(item.expiration);
  cardExpiryElement.appendChild(cardExpirationDateElement);

  //next
  //Create card type div and nest into bottom element
  const cardTypeElement = document.createElement("div");
  cardTypeElement.classList.add("cardType");
  cardTypeElement.classList.add("col");
  bottomElement.appendChild(cardTypeElement);
  //first nested item
  const cardTypeTitleElement = document.createElement("img");
  cardTypeTitleElement.setAttribute("src", getCardLogoSrc(item.circuit, "dark"))
  cardTypeTitleElement.classList.add("activeCardLogo");

  cardTypeElement.appendChild(cardTypeTitleElement);


  //second nested item
  const cardType = document.createElement("div");
  cardType.classList.add("mediumCardText");
  cardType.innerHTML = "CREDIT";
  cardTypeElement.appendChild(cardType);

  return dataElement;
};

const buildInactiveCardItem = (item) => {
  const dataElement = document.createElement("div");
  dataElement.id = item.id;
  dataElement.classList.add("creditCard");
  dataElement.classList.add("inactive");

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
  inactiveCardLogo.setAttribute("src", getCardLogoSrc(item.circuit, "light"))
  inactiveCardLogo.classList.add("inactiveCardLogo");
  rightSectionInactive.appendChild(inactiveCardLogo);

  // inactiveCreditOrDebit

  const inactiveCreditOrDebit = document.createElement("div");
  inactiveCreditOrDebit.classList.add("inactiveCardTypeText");
  inactiveCreditOrDebit.innerHTML = "CREDIT";
  rightSectionInactive.appendChild(inactiveCreditOrDebit);

  return dataElement;
};

const initPage = async () => {
  console.log("Init...");
  cards = await fetchCards();
  console.log(cards);


  let creditCardContainer = document.getElementById("creditCardContainer");

  cards.forEach((item, index) => {
    if (index === 0) {
      creditCardContainer.appendChild(buildActiveCardItem(cards[index]));
    } else {
      creditCardContainer.appendChild(buildInactiveCardItem(cards[index]));
    }
  });

  let transactions = await fetchTransactionsByCardId(cards[0].id)

  console.log(transactions)

  let transactionsWithCard = {
    transactions,
    card: cards[0]
  }

  let transactionsTable = generateTransactionsTable(transactionsWithCard)

  let tableContainer = document.getElementById("tableParentContainer");

  tableContainer.appendChild(transactionsTable)


  
};

initPage();
