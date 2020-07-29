
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

		const needShadow = this.getAttribute('data-shadow');

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
		clockWrapper.append(select);
		clockWrapper.append(timerWrapper);
		clockWrapper.append(actionButton);
		
		if(!!needShadow) {
			//Start the internal styles of this component
			const style = document.createElement('link');
			style.setAttribute('rel', 'stylesheet');
			style.setAttribute('href', 'styles.css');

			let shadowRoot = this.attachShadow({mode: 'open'});

			shadowRoot.appendChild(style);
			shadowRoot.append(clockWrapper);
		} else {
			//Just a Custom Element
			this.appendChild(clockWrapper);
		}
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