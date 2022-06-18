function newElement(tagName, className) {
	const elemento = document.createElement(tagName)
	elemento.className = className
	return elemento
}

function Barreira(reversa = false) {
	this.elemento = newElement('div', 'barreira')
	const borda = newElement('div', 'borda')
	const corpo = newElement('div', 'corpo')
	this.elemento.appendChild(reversa ? corpo : borda)
	this.elemento.appendChild(reversa ? borda : corpo)

	this.setAltura = altura => (corpo.style.height = `${altura}px`)
}

function ParDeBarreiras(altura, abertura, popsicaoNaTela) {
	this.elemento = newElement('div', 'par-de-barreiras')
	this.superior = new Barreira(true)
	this.inferior = new Barreira(false)

	this.elemento.appendChild(this.superior.elemento)
	this.elemento.appendChild(this.inferior.elemento)

	this.sortearAbertura = () => {
		const alturaSuperior = Math.random() * (altura - abertura)
		const alturaInferior = altura - abertura - alturaSuperior
		this.superior.setAltura(alturaSuperior)
		this.inferior.setAltura(alturaInferior)
	}
	this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
	this.setX = popsicaoNaTela =>
		(this.elemento.style.left = `${popsicaoNaTela}px`)
	this.getLargura = () => this.elemento.clientWidth

	this.sortearAbertura()
	this.setX(popsicaoNaTela)
}

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
	this.pares = [
		new ParDeBarreiras(altura, abertura, largura),
		new ParDeBarreiras(altura, abertura, largura + espaco),
		new ParDeBarreiras(altura, abertura, largura + espaco * 2),
		new ParDeBarreiras(altura, abertura, largura + espaco * 3),
	]

	const deslocamento = 3
	this.animar = () => {
		this.pares.forEach(par => {
			par.setX(par.getX() - deslocamento)

			if (par.getX() < -par.getLargura()) {
				par.setX(par.getX() + espaco * this.pares.length)
				par.sortearAbertura()
			}
			const meio = largura / 2
			const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio
			if (cruzouMeio) {
				notificarPonto()
			}
		})
	}
}

function Coin(alturaJogo, popsicaoNaTela) {
	this.element = newElement('div', 'coin')

	this.setAltura = altura => {
		this.element.style.top = `${altura}px`
	}

	this.sortearAltura = () => {
		const alturaMoeda = Math.random() * alturaJogo
		const alturaMaxima = alturaJogo - 100

		if (alturaMoeda <= 0) {
			this.setAltura(0)
		} else if (alturaMoeda >= alturaMaxima) {
			this.setAltura(alturaMaxima)
		} else {
			this.setAltura(alturaMoeda)
		}
	}

	this.setX = popsicaoNaTela =>
		(this.element.style.left = `${popsicaoNaTela}px`)

	this.getY = () => parseInt(this.element.style.top.split('px')[0])
	this.getX = () => parseInt(this.element.style.left.split('px')[0])
	this.getLargura = () => this.element.clientWidth

	this.sortearAltura()
	this.setX(popsicaoNaTela)
}

function Coins(altura, largura, espaco) {
	this.coins = [
		new Coin(altura, largura - espaco / 2 + 50),
		new Coin(altura, largura + espaco / 2 + 50),
		new Coin(altura, largura + (espaco / 2) * 3 + 50),
		new Coin(altura, largura + (espaco / 2) * 5 + 50),
	]

	const deslocamento = 3
	this.animar = () => {
		this.coins.forEach(coin => {
			coin.setX(coin.getX() - deslocamento)

			if (coin.getX() < -coin.getLargura()) {
				coin.setX(coin.getX() + espaco * this.coins.length)
				coin.sortearAltura()
			}
		})
	}
}

function Mushroom(alturaJogo, popsicaoNaTela) {
	this.element = newElement('div', 'mushroom')

	this.setAltura = altura => {
		this.element.style.top = `${altura}px`
	}

	this.sortearAltura = () => {
		const alturaMushroom = Math.random() * alturaJogo
		const alturaMaxima = alturaJogo - 100

		if (alturaMushroom <= 0) {
			this.setAltura(0)
		} else if (alturaMushroom >= alturaMaxima) {
			this.setAltura(alturaMaxima)
		} else {
			this.setAltura(alturaMushroom)
		}
	}

	this.setX = popsicaoNaTela =>
		(this.element.style.left = `${popsicaoNaTela}px`)

	this.getY = () => parseInt(this.element.style.top.split('px')[0])
	this.getX = () => parseInt(this.element.style.left.split('px')[0])
	this.getLargura = () => this.element.clientWidth

	this.sortearAltura()
	this.setX(popsicaoNaTela)
}

function Mushrooms(altura, largura, espaco) {
	this.mushrooms = [new Mushroom(altura, largura + espaco / 2 + 50)]

	const deslocamento = 3
	const gaps = 5
	this.animar = () => {
		this.mushrooms.forEach(mushroom => {
			mushroom.setX(mushroom.getX() - deslocamento)

			if (mushroom.getX() < -mushroom.getLargura()) {
				mushroom.setX(mushroom.getX() + espaco * gaps * this.mushrooms.length)
				mushroom.sortearAltura()
			}
		})
	}
}

function CreateCharacter(alturaJogo, personagem, tipo, velPersonagem) {
	let voando = false

	this.elemento = newElement('img', 'character')
	this.elemento.src = `assets/imgs/${
		tipo === 'treino' ? 'ghost' : personagem
	}.png`

	this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
	this.setY = y => (this.elemento.style.bottom = `${y}px`)

	window.onkeydown = e => (voando = true)
	window.onkeyup = e => (voando = false)

	this.animar = () => {
		const novoY = this.getY() + (voando ? parseInt(velPersonagem) : -5)
		const alturaMaxima = alturaJogo - this.elemento.clientWidth

		if (novoY <= 0) {
			this.setY(0)
		} else if (novoY >= alturaMaxima) {
			this.setY(alturaMaxima)
		} else {
			this.setY(novoY)
		}
	}
	this.setY(alturaJogo / 2)
}

function Progress() {
	this.elemento = newElement('span', 'progresso')
	this.atualizarPontos = pontos => {
		this.elemento.innerHTML = pontos
	}
	this.atualizarPontos(0)
}

function CoinProgress() {
	const coinCounter = document.querySelector('[coin-counter]')

	this.updateCoinPoints = points => {
		coinCounter.innerHTML = `x ${points}`
	}

	this.updateCoinPoints(0)
}

function estaoSobrepostos(elementoA, elementoB) {
	const a = elementoA.getBoundingClientRect()
	const b = elementoB.getBoundingClientRect()
	const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
	const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

	return horizontal && vertical
}

function colidiu(character, barreiras) {
	let colidiu = false

	barreiras.pares.forEach(parDeBarreiras => {
		if (!colidiu) {
			const superior = parDeBarreiras.superior.elemento
			const inferior = parDeBarreiras.inferior.elemento
			colidiu =
				estaoSobrepostos(character.elemento, superior) ||
				estaoSobrepostos(character.elemento, inferior)
		}
	})
	return colidiu
}

function coinColision(character) {
	let colision = false

	const moedas = document.querySelectorAll('.coin')

	moedas.forEach(coin => {
		if (!colision) {
			colision = estaoSobrepostos(character.elemento, coin)
			colision &&
				(coin.style.display = 'none') &&
				setTimeout(() => (coin.style.display = 'block'), 5000)
		}
	})
	return colision
}

function mushroomColision(character) {
	let colision = false

	const mushrooms = document.querySelectorAll('.mushroom')

	mushrooms.forEach(mushroom => {
		if (!colision) {
			colision = estaoSobrepostos(character.elemento, mushroom)
			colision &&
				(mushroom.style.display = 'none') &&
				setTimeout(() => (mushroom.style.display = 'block'), 5000)
		}
	})
	return colision
}

function FlappyBird(
	nome,
	cenario,
	intervaloCanos,
	distanciaCanos,
	velJogo,
	personagem,
	tipo,
	velPersonagem,
	pontuacao
) {
	let points = 0
	let coinPoints = 0

	const areaDoJogo = document.querySelector('[wm-flappy]')
	areaDoJogo.style.backgroundImage = `url('../assets/gifs/${cenario}.gif')`

	const altura = areaDoJogo.clientHeight
	const largura = areaDoJogo.clientWidth

	const progress = new Progress()
	const coinProgress = new CoinProgress()
	const barreiras = new Barreiras(
		altura,
		largura,
		parseInt(intervaloCanos),
		parseInt(distanciaCanos),
		() => {
			audio_pipe.play()
			progress.atualizarPontos((points += parseInt(pontuacao)))
		}
	)
	const coins = new Coins(altura, largura, parseInt(distanciaCanos))
	const mushrooms = new Mushrooms(altura, largura, parseInt(distanciaCanos))

	let audio_pipe = document.querySelector('[pipe]')
	let audio_die = document.querySelector('[die]')
	let audio_ring = document.querySelector('[ring]')

	const character = new CreateCharacter(altura, personagem, tipo, velPersonagem)

	areaDoJogo.appendChild(progress.elemento)
	areaDoJogo.appendChild(character.elemento)
	barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
	coins.coins.forEach(coin => areaDoJogo.appendChild(coin.element))
	mushrooms.mushrooms.forEach(mushroom =>
		areaDoJogo.appendChild(mushroom.element)
	)

	let mushroomActive = false

	this.start = () => {
		const temporizador = setInterval(() => {
			barreiras.animar()
			coins.animar()
			mushrooms.animar()
			character.animar()

			if (tipo === 'real' && !mushroomActive && colidiu(character, barreiras)) {
				audio_die.play()
				clearInterval(temporizador)
				document.querySelector('[game-over]').style.display = 'flex'

				// captura pontos das argolas
				const ringPoints = document
					.querySelector('[coin-counter]')
					.innerText.split('x')[1]

				// salva pontuação
				localStorage.setItem(
					'points',
					JSON.stringify({
						score: progress.elemento.innerText,
						ringPoints: ringPoints,
					})
				)

				// escreve mensagem da pontuação
				document.querySelector(
					'[score-message]'
				).innerHTML = `${nome} sua pontuacao foi ${progress.elemento.innerText} e voce pegou ${coinPoints} argolas.`
			}

			if (coinColision(character)) {
				audio_ring.play()
				coinProgress.updateCoinPoints(++coinPoints)
			}

			if (mushroomColision(character)) {
				document.querySelector('.character').src = 'assets/imgs/ghost.png'
				mushroomActive = !mushroomActive

				let mushroomEffectDuration = 7000

				const mushroomInterval = setInterval(() => {
					mushroomEffectDuration -= 50

					document.querySelector('[mushroom-counter]').innerHTML =
						mushroomEffectDuration.toString().padStart(4, '0') + 's'
				}, 50)

				setTimeout(() => {
					document.querySelector(
						'.character'
					).src = `assets/imgs/${personagem}.png`
					mushroomActive = !mushroomActive

					clearInterval(mushroomInterval)
				}, mushroomEffectDuration)
			}
		}, velJogo)
	}
}

function setSound(soundElement, sound) {
	const soundValue = sound === 'true'

	soundElement.src = `./assets/imgs/sound-${soundValue ? 'on' : 'off'}.png`

	document.querySelectorAll('audio').forEach(item => {
		item.muted = !soundValue
		item.pause()
	})
}

function toggleSound() {
	const soundElement = document.querySelector('[sound-icon]')
	const sound = soundElement.src.split('sound-')[1].split('.png')[0]

	setSound(soundElement, sound === 'on' ? 'false' : 'true')

	localStorage.setItem('muted', sound === 'on' ? false : true)
}

;(_ => {
	const urlParams = new URLSearchParams(window.location.search),
		nome = urlParams.get('nome'),
		cenario = urlParams.get('cenario'),
		intervaloCanos = urlParams.get('intervalo'),
		distanciaCanos = urlParams.get('distancia'),
		velJogo = urlParams.get('vel-jogo'),
		personagem = urlParams.get('personagem'),
		tipo = urlParams.get('tipo'),
		velPersonagem = urlParams.get('vel-personagem'),
		pontuacao = urlParams.get('pontuacao')

	const soundElement = document.querySelector('[sound-icon]'),
		sound = soundElement.src.split('sound-')[1].split('.png')[0],
		mutedStorage = localStorage.getItem('muted')

	localStorage.setItem(
		'points',
		JSON.stringify({
			score: 0,
			ringPoints: 0,
		})
	)

	if (mutedStorage !== null) {
		setSound(soundElement, mutedStorage)
	} else {
		localStorage.setItem('muted', sound === 'on')
	}

	new FlappyBird(
		nome,
		cenario,
		intervaloCanos,
		distanciaCanos,
		velJogo,
		personagem,
		tipo,
		velPersonagem,
		pontuacao
	).start()
})()
