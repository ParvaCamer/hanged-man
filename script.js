class HangedMan {
    constructor(wordToFind, hiddenWord) {
        this.wordToFind = wordToFind;
        this.hiddenWord = hiddenWord;
        this.nbTrials = 7;
        this.alreadyProposed = [];
    }

    async getRandomWord() {
        const response = await fetch('../data.json');
        const responseData = await response.json();
        let wordArrays = Object.values(responseData)
        let randomArray = Math.floor(Math.random() * wordArrays.length);
        let randomWord = Math.floor(Math.random() * wordArrays[randomArray].length);
        this.wordToFind = (wordArrays[randomArray][randomWord]).toUpperCase();
        this.hiddenWord = this.wordToFind.replace(/./g, '*');
        document.querySelector('#remaining-guess').innerHTML = this.nbTrials;
        return this.hiddenWord
    }

    replaceLetter(value) {
        if (value !== '') {
            document.querySelector('input[type="text"]').value = "";
            let foundDoubleLetter = false;
            for (let i = 0; i < this.wordToFind.length; i++) {
                if (this.wordToFind[i] === value) {
                    foundDoubleLetter = true;
                    const newHiddenWord = this.hiddenWord.substr(0, i) + value + this.hiddenWord.substr(i + 1);
                    this.hiddenWord = newHiddenWord;
                }
            }
            if (foundDoubleLetter) {
                this.hiddenWord = this.hiddenWord.replace(new RegExp(value, 'g'), value);
                document.querySelector('#random-word').innerHTML = this.hiddenWord;
                this.checkEndGame();
            } else {
                this.checkAlreadyProposed(value);
                this.checkEndGame();
            }
        }
    }


    checkAlreadyProposed(value) {
        if (this.alreadyProposed.length === 0) {
            this.displayLetters(value);
            document.querySelector('aside').style.display = 'block';
        } else {
            for (const letter in this.alreadyProposed) {
                if (this.alreadyProposed[letter] === value) {
                    return
                }
            }
            this.displayLetters(value);
        }
    }

    displayLetters(value) {
        document.getElementById('wrong-letters').innerHTML += value;
        this.alreadyProposed.push(value);
        this.nbTrials--;
        document.querySelector('#remaining-guess').innerHTML = this.nbTrials;
    }

    checkEndGame() {
        if (this.nbTrials == 0) {
            this.displayEndMessage(`You lost ! The word was ${this.wordToFind}.`)
        } else if (this.wordToFind === this.hiddenWord) {
            this.displayEndMessage(`You win the game !`)
        }
    }

    displayEndMessage(message) {
        let div = document.createElement("div");
        div.innerHTML = message;
        document.querySelector(".div-input-word").appendChild(div);
        document.querySelector('label').style.display = 'none';
        document.querySelector('input').style.display = 'none';
    }
}

const player = new HangedMan();

player.getRandomWord().then(word => {
    console.log(word);
    document.querySelector('#random-word').innerHTML = word;
})

document.querySelector('input[type="text"]').addEventListener('keydown', (event) => {
    const { key, keyCode, target: { value } } = event;
    const pattern = /^[a-zA-Z]+$/;
    pattern.test(key) ? (keyCode === 13 && player.replaceLetter(value.toUpperCase())) : event.preventDefault();
});
