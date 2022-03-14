async function getDashboardData (link='/data.json'){
	const response = await fetch(link);
	const data = await response.json();
		
	return data;
}

class BuildDashboardItem{
	constructor(data, container='.statspanel', view='weekly'){
		this.data = data;
		this.container = document.querySelector(container);
		this.view = view;

		this._createMarkup(this.data);
	}

	static keywords = {
			daily: 'day',
			weekly: 'week',
			monthly: 'month'
		};

	changeView(view) {
        this.view = view.toLowerCase();

        const {current, previous} = this.data.timeframes[this.view];
		const timeframes = this.data.timeframes;

        this.totalTime.innerHTML = `<h4>${timeframes[this.view].current} hrs</h4>`;
        this.lastPeriod.innerHTML = `<p>Last ${BuildDashboardItem.keywords[this.view]} - ${timeframes[this.view].previous}hrs</p>`;
	}

	_createMarkup (data){
		const {title, timeframes} = data;
		const {current, previous } = timeframes[this.view];
		
		//чтобы не хардкодить фон
		const id = title.toLowerCase().replace(/ /g,'');

		this.container.insertAdjacentHTML('beforeend', `
			
			<div class="statspanel__block statspanel__block--${id}">
				
				<div class="statscard">
					<div class="header">
						<h5 class="header__activityname">${title}</h5>
						<img class="header__button" src="./images/icon-ellipsis.svg" />
					</div>
				
					<div class="stats">
						<div class="stats__total">
							<h4>${timeframes[this.view].current} hrs</h4>
						</div>
						<div class="stats__lastperiod">
							<p>Last ${BuildDashboardItem.keywords[this.view]} - ${timeframes[this.view].previous}hrs</p>
						</div>
					</div>
				</div>

			</div>
	`
	  );

	  this.totalTime=this.container.querySelector(`.statspanel__block--${id} .stats__total`);
	  this.lastPeriod = this.container.querySelector(`.statspanel__block--${id} .stats__lastperiod`);
	}

}

document.addEventListener('DOMContentLoaded', async()=>{
	const data = await getDashboardData();
	
	const activities = data.map(item=> new BuildDashboardItem (item));

	const switchers = document.querySelectorAll('.switcher__block');



	switchers.forEach( switcher =>
		switcher.addEventListener('click', function(){
			switchers.forEach(s=>s.classList.remove('switcher__block--active'));
			switcher.classList.add('switcher__block--active');

			const currentView = switcher.innerText.trim().toLowerCase();
			
			activities.forEach(activity => activity.changeView(currentView));
		})
		)
})

