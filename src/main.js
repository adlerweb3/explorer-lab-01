import "./css/index.css"
import IMask from "imask"

// #app > section > div.cc-bg > svg > g > g:nth-child(1)
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")

//#app > section > div.cc-bg > svg > g > g:nth-child(2)
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

//#app > section > div.cc-logo > span:nth-child(2) > img
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["#808080", "#000000"],
    test: ["green", "blue"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

/**
 * Security Code Mask Handler
 */
// document.querySelector("#security-code")
// <input id="security-code">
// /html/body/div/form/div[3]/div[2]/input
// //*[@id="security-code"]
// const cvcInput2 = document.querySelector("#security-code")
const securityCode = document.getElementById("security-code")
const securityCodePattern = { mask: "0000" }
const securityCodeMasked = IMask(securityCode, securityCodePattern)

/**
 * EXPIRATION DATE MASK
 */
const expirationDate = document.getElementById("expiration-date")
let maxViableYear = 10
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: Number(String(new Date().getFullYear()).slice(2)),
      to: Number(String(new Date().getFullYear()).slice(2)) + maxViableYear,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

/**
 * CARD NUMBER MASK
 */
const cardNumber = document.getElementById("card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    /*const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    )*/
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    // console.log(foundMask.cardtype)
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.getElementById("add-card")
addButton.addEventListener("click", () => {
  alert("Cart??o adicionado")
})

/**
 * Prevents reload page on the submit action [button click]
 */
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

// ----------------
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  let cardHolderInput = document.querySelector(".cc-holder .value")

  cardHolderInput.innerText =
    cardHolder.value.length === 0 ? "JOHN DOE DA SILVA" : cardHolder.value
})

// ----------------
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  let ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

// ----------------
cardNumberMasked.on("accept", () => {
  let cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)

  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  let ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

// ----------------
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  let ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
