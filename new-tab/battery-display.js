class BatteryDisplay {
    eventNames = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange'];

    constructor(element) {
        this.element = element;
        this.render();
        this.listenForUpdates()
    }

    async getBattery() {
        let battery = await navigator.getBattery()
            .catch(() => reportError("Error reading battery."));

        battery.secsLeft = Math.min(battery.chargingTime, battery.dischargingTime)
        battery.isFull = battery.level === 1

        return battery
    }

    async render() {
        let battery = await this.getBattery()

        this.element.textContent = battery.isFull ? "Fully Sane" : [
            this.getPercentMessage(battery),
            this.getChargingMessage(battery),
            this.getTimeMessage(battery)
        ].join(" ~ ");
    }

    getPercentMessage(battery) {
        return `Sanity: ${Math.round(battery.level * 100)}%`
    }

    getChargingMessage(battery) {
        return battery.charging ? "Geting sanity" : "Going insane"
    }

    getTimeMessage(battery) {
        let direction = battery.charging ? "sane" : "insane"

        let hoursLeft = Math.floor(battery.secsLeft / 3600)
        let minsLeft = Math.floor(battery.secsLeft % 3600 / 60);
        minsLeft = String(minsLeft).padStart(2, 0) // 8:9 to 8:09 etc

        return `You have ${hoursLeft}:${minsLeft} until your ${direction}`
    }

    async listenForUpdates() {
        let battery = await this.getBattery();

        for (let eventName of this.eventNames) {
            battery.addEventListener(eventName, this.render.bind(this))
        }
    }
}

export { BatteryDisplay }
