const STYLES = `
.clock-container{
	width: 15em;
	margin: 0 auto;
	padding: 20px;
	background: #3550b1;
	border-radius: 30px;
	box-shadow: 0px 5px 8px 1px #0009, -5px -5px 10px -8px #FA0;
}

.timer{
	display: block;
	text-align: center;
	font-family: sans-serif;
	font-size: 35px;
	font-weight: 600;
	color: white;
	text-shadow: -5px 2px 9px black;
}

.btn{
	background: #FFF;
	border: none;
	width: 100%;	
	height: 35px;
	font-size: 25px;
	border-radius: 35px;
	margin: 10px 10px 10px 0;
}

.btn:focus{
	outline: none;
}

.btn:hover{
	box-shadow: -3px 3px 7px 2px #00000069 inset;
}

.btn:active{
	background: #dadada;
}

.opt-box{
	display: block;
	width: 100%;
	font-family: sans-serif;
	font-size: 25px;
	font-weight: bold;
	color: #ffffff;
	background: transparent;
	border: navajowhite;
	border-bottom: 1px solid white;
	filter: drop-shadow(-5px 2px 9px black);
	margin-bottom: 10px;
}
`


// Create a class for the element
class TimerClock extends HTMLElement{

	/**
	 * Holds the setInterval 
	 * @type number
	 */
	timer = null;

	/**
	 * When setInterval stops,
	 * this variable store almost the exact the same moment that stops
	 * @type Date
	 */
	date = null;

	/**
	 * Wraps the container of the whole component
	 * @type HTMLDivElement
	 */
	clockWrapper = null;

	/**Locale Date options */
	locale = 'es-DO';

	/**
	 * @type Intl.DateTimeFormatOptions
	 */
	options = {
		day: 'numeric',
		weekday: 'long', 
		month: 'long', 
		year: 'numeric', 
		hour: '2-digit', 
		minute: '2-digit', 
		second: 'numeric'
	};

	constructor() {
		super();
		
		//Start the internal styles of this component
		const style = document.createElement('style');
		style.textContent = STYLES;

		//Create the wrapper of this component
		const clockWrapper = document.createElement('div');
		clockWrapper.setAttribute('class', 'clock-container');
		
		//Creates the the element that display the time/date
			/**
		 * Create the content that is going to update periodically
		 * each 1 second (By default I set it in the setInterval)
		 * @type HTMLSpanElement
		 */
		const timerWrapper = document.createElement('span');
		timerWrapper.setAttribute('class', 'timer');
		this.runTimer(timerWrapper);

		// Create the Selector with its options
		const select = document.createElement('select');
		select.setAttribute('class', 'opt-box');

		select.addEventListener('change', (e) => {
			this.locale = e.path[0].value;
			timerWrapper.textContent = this.date.toLocaleString(this.locale, this.options);
		})

		/**
		 * @type HTMLOptionElement[]
		 */
		const options = ['es-DO', 'en-US', 'zh'].map(locale => {
			const opt = document.createElement('option')
			opt.setAttribute('value', locale)
			opt.textContent = locale;

			return opt;
		});

		select.setAttribute('name', 'locale')
		select.append(...options);

	
		
		/**
		 * Create the button with its addEventListener that is going
		 * to pause or resume the update of the timeWrapper
		 */
		const actionButton = document.createElement('button');
		actionButton.setAttribute('class', 'btn');
		actionButton.textContent = 'Pause'
		
		actionButton.addEventListener('click', () => {
			if(actionButton.innerText === 'Pause') {
				actionButton.textContent = 'Resume';
				clearInterval(this.timer);
			} else {
				actionButton.textContent = 'Pause';
				this.runTimer(timerWrapper);
			}
		})

		//Append in order each element inside the clockWrapper
		clockWrapper.appendChild(style);
		clockWrapper.append(select);
		clockWrapper.append(timerWrapper);
		clockWrapper.append(actionButton);

		let shadowRoot = this.attachShadow({mode: 'open'});

		shadowRoot.append(clockWrapper);
	}
	
	/**
	 * Keep the timer running undefinitely
	 */
	runTimer(clock) {
		this.timer = setInterval(() => {
			clock.textContent = new Date().toLocaleString(this.locale, this.options);
		}, 500)
	}

  }
  
  // Define the new element
  customElements.define('timer-clock', TimerClock);