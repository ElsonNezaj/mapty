'use strict'

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form')
const containerWorkouts = document.querySelector('.workouts')
const inputType = document.querySelector('.form__input--type')
const inputDistance = document.querySelector('.form__input--distance')
const inputDuration = document.querySelector('.form__input--duration')
const inputCadence = document.querySelector('.form__input--cadence')
const inputElevation = document.querySelector('.form__input--elevation')

class Workout {
  date = new Date()
  id = (Date.now() + '').slice(-10)

  constructor(coords, distance, duration) {
    this.coords = coords // [lat, lng]
    this.distance = distance // km
    this.duration = duration // min
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, candence) {
    super(coords, distance, duration)
    this.candence = candence
    this.calcPace()
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration)
    this.elevationGain = elevationGain
    this.calcSpeed()
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60)
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178)
// const cycle1 = new Cycling([39, -12], 27, 95, 523)
// console.log(run1, cycle1)

//////////////////////////////////////////////////
// APPLICATION STRUCTURE
class App {
  #map
  #mapEvent
  constructor() {
    this._getPosition()

    form.addEventListener('submit', this._newWorkout.bind(this))

    inputType.addEventListener('change', this._toggleElevationField)
  }

  // Get Current Position
  _getPosition() {
    // Getting Current Position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // Akseson _loadMap() nese eshte successful
        function () {
          alert('Could not get your position')
        }
      )
    }
  }

  // Krijon Map
  _loadMap(pos) {
    const { latitude } = pos.coords
    const { longitude } = pos.coords
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`)

    // Displaying Map on current Location (LEAFLET)
    const coords = [latitude, longitude]
    this.#map = L.map('map').setView(coords, 13)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map)

    // New marker onclick
    this.#map.on('click', this._showForm.bind(this)) // _showForm() si handler per te shfaqur form kur klikojme mbi map
  }

  // Shfaq formen input
  _showForm(mapE) {
    this.#mapEvent = mapE
    form.classList.remove('hidden')
    inputDistance.focus()
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
  }

  // Krijon markerin qe do te ruaj pozicionin
  _newWorkout(e) {
    e.preventDefault()

    // CLear input fields
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        ''

    // Display Marker
    const { lat, lng } = this.#mapEvent.latlng
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup()
  }
}

const app = new App()