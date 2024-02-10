let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden; //hidden card with dealer
let deck;

let canHit = true; //allows the player to draw while yourSum <=21


window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
}


function buildDeck() {
    let types = ["C", "D", "H", "S"];
    let values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
    console.log('Brand new deck:');
    console.log(deck);
    console.log('----------');
}


function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let rand = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.999) that's why using floor
        [deck[i], deck[rand]] = [deck[rand], deck[i]];
    }
    console.log('Shuffled deck:');
    console.log(deck);
}


function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    console.log(`Hidden card for dealer is: ${hidden}`);
    console.log(`Current dealer sum is: ${dealerSum}`);
    console.log(`Number of Aces of dealer in hidden is: ${dealerAceCount}`);

    while (dealerSum < 12) {
        //<img src="img/cards/10-D.png" alt="some_card">
        let cardImg = document.createElement('img');
        let card = deck.pop();
        cardImg.src = `img/cards/${card}.png`
        cardImg.alt = `card: ${card}`;
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById('dealer_cards').append(cardImg);
    }
    console.log(`Number of Aces of dealer is: ${dealerAceCount}`);
    console.log(`Dealer sum is: ${dealerSum}`);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement('img');
        let card = deck.pop();
        cardImg.src = `img/cards/${card}.png`;
        cardImg.alt = `card: ${card}`;
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById('your_cards').append(cardImg);
    }
    console.log(`Your number of Aces is: ${yourAceCount}`);
    console.log(`Your sum is: ${yourSum}`);

    document.getElementById('hit').addEventListener('click', hit);
    document.getElementById('stay').addEventListener('click', stay);
}


function hit() {
    if (!canHit) {
        alert(`Your sum is: ${yourSum}, you can't hit anymore`);
        return;
    } else {
        let cardImg = document.createElement('img');
        let card = deck.pop();
        cardImg.src = `img/cards/${card}.png`;
        cardImg.alt = `card: ${card}`;
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById('your_cards').append(cardImg);

        if (reduceAce(yourSum, yourAceCount) > 21) {
            canHit = false;
        }
    }
}


function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    console.log(`zero dealer sum je ${dealerSum}`);

    let helpAce = dealerAceCount;

    console.log(`helpAce is ${helpAce}`);

    if (dealerAceCount === 1) {
        dealerAceCount = 0;
    }

    console.log(`On start dealer has ${dealerAceCount} Aces`);

    canHit = false;
    document.getElementById('hidden').src = `img/cards/${hidden}.png`;

    let message = "";
    if (yourSum > 21) {
        message = 'You Lost!';
    }
    else if (dealerSum > 21) {
        message = 'You Won!';
    } //both player <=21
    else if (yourSum < dealerSum) {
        message = 'You Lost';
    }
    else if (yourSum == dealerSum) {
        message = "It's a Tie!";
    }
    else if (yourSum > dealerSum) {
        while (yourSum > dealerSum) {
            let cardImgNew = document.createElement('img');
            let cardNew = deck.pop();
            cardImgNew.src = `img/cards/${cardNew}.png`
            cardImgNew.alt = `card: ${cardNew}`;

            dealerSum += getValue(cardNew);
            console.log(`first dealer sum is ${dealerSum}`);

            dealerAceCount += checkAce(cardNew);
            console.log(`dealer has ${dealerAceCount} Aces`);

            dealerSum = reduceAce(dealerSum, dealerAceCount);

            helpAce += dealerAceCount;
            console.log(`middle helpAce: ${helpAce}`);

            if (dealerAceCount === 1) {
                dealerAceCount = 0;
            }

            // console.log(`dealer posle skidanja ima ${dealerAceCount} keceva`);
            // console.log(`drugi dealer sum je ${dealerSum}`);

            if (helpAce > 0) {
                for (let i = 0; i < helpAce; i++) {
                    dealerSum = reduceAce(dealerSum, helpAce);
                }
                console.log(`third dealer sum is ${dealerSum}`);
                helpAce--;
                console.log(`At the end helpAce is: ${helpAce}`);
            }

            document.getElementById('dealer_cards').append(cardImgNew);
        }
        if (dealerSum > 21 || yourSum > dealerSum) {
            message = 'You Won!';
        } else if (yourSum == dealerSum) {
            message = "It's a Tie!";
        } else {
            message = 'You Lost!';
        }
    }

    document.querySelector('#dealer_sum').innerText = dealerSum;
    document.querySelector('#your_sum').innerText = yourSum;
    let resultsEl = document.querySelector('#results');

    resultsEl.innerText = message;
    resultsEl.style.display = 'block';

    let reload = document.querySelector('#reload');
    reload.style.display = 'inline-block';
}


function getValue(card) {
    let data = card.split("-"); //"4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //"A", "Q", "K"..
        // (value == "A") ? 11 : 10;
        if (value == "A") {
            return 11;
        } else {
            return 10;
        }
    } else {
        return parseInt(value);

    }
}


function checkAce(card) {
    //card is a string. card [0] is first letter in the name of card
    if (card[0] == "A") {
        return 1;
    } else {
        return 0;
    }
}


function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}


const rulesEl = document.querySelector('.rules_modal');
const closeEl = document.querySelector('#closeModal');
const showEl = document.querySelector('#rules');

closeEl.addEventListener('click', () => {
    rulesEl.style.display = 'none'
})


showEl.addEventListener('click', () => {
    rulesEl.style.display = 'block'
})