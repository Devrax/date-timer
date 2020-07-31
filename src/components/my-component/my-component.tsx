import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {

  /**works for stopping the setInterval */
  @State() timer: number = 0;
  @State() isStop = false;

  /**Locale Date options */
	@State() locale = 'es-DO';

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

  @State() dateMessage: number = Date.now();

  connectedCallback() {
    this.runTimer();
  }

  render() {
    const time = new Date(this.dateMessage).toLocaleDateString(this.locale, this.options);

    const content = (
      <div class="clock-container">
        <select class="opt-box" name="locale" onChange={this.selector.bind(this)}>
          {['es-DO', 'en-US', 'zh'].map(locale => <option value={locale}>{locale}</option>)}
        </select>
        <span class="timer">{time}</span>
        <button class="btn" onClick={this.stopTimer.bind(this)}>{this.isStop ? 'Resume' : 'Pause'}</button>
      </div>)

    return content;
  }

  selector(element) {
    this.locale = element.path[0].value;
  }

  stopTimer() {
    if(!this.isStop) {
      clearInterval(this.timer);
    } else {
      this.runTimer();
    }

    this.isStop = !this.isStop;
  }

   /**
	 * Keep the timer running undefinitely
	 */
	runTimer() {
		this.timer = window.setInterval(() => {
			this.dateMessage = Date.now();
		}, 200)
	}

}
