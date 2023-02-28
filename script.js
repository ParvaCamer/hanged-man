class HangedMan {
    constructor(wordToFind, hiddenWord) {
        this.wordToFind = wordToFind;
        this.hiddenWord = hiddenWord;
        this.nbTrials = 7;
        this.alreadyProposed = [];
        this.canWrite = false;
    }

    async getRandomWord() {
        const response = await fetch('https://parvacamer.github.io/hanged-man/data.json');
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
            document.querySelector('#death').src = "./asset/death-2.png";
            //document.querySelector('#death').style.width = "150px";
            this.displayLetters(value);
            document.querySelector('aside').classList.add('display-aside');
            document.querySelector('aside').style.opacity = 1;
        } else {
            for (const letter in this.alreadyProposed) {
                if (this.alreadyProposed[letter] === value) {
                    return
                }
            }
            this.playAnimation(true);
            this.displayLetters(value);
            setTimeout(() => {
                this.playAnimation(false);
            }, 1000);
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
            document.querySelector('#death').style.opacity = 0;
            document.querySelector('#human').src = './asset/dead-human.png';
            document.querySelector('#human').style.width = '300px';
            this.displayEndMessage(`You lost ! The word was ${this.wordToFind}.`)
        } else if (this.wordToFind === this.hiddenWord) {
            this.displayEndMessage(`You win the game !`)
        }
    }

    displayEndMessage(message) {
        let div = document.createElement("p");
        div.innerHTML = message;
        document.querySelector(".div-input-word").appendChild(div);
        document.querySelector('input').style.display = 'none';
        document.querySelector('.button').style.display = 'inline-block';
    }

    playAnimation(value) {
        if (value) {
            this.canWrite = true;
            document.querySelector('input[type=text]').disabled = this.canWrite;
            document.querySelector('#death').classList.remove('paused');
            document.querySelector('#death').classList.add('run');
        } else {
            this.canWrite = false;
            document.querySelector('input[type=text]').disabled = this.canWrite;
            document.querySelector('#death').classList.remove('run');
            document.querySelector('#death').classList.add('paused');
        }
    }
}

let player = new HangedMan();

player.getRandomWord().then(word => {
    document.querySelector('#random-word').innerHTML = word;
})

document.querySelector('input[type="text"]').addEventListener('keydown', (event) => {
    const { key, keyCode, target: { value } } = event;
    const pattern = /^[a-zA-Z]+$/;
    pattern.test(key) ? (keyCode === 13 && player.replaceLetter(value.toUpperCase())) : event.preventDefault();
});

document.querySelector('.button').addEventListener('click', () => {
    window.location.reload()
})