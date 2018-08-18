import React from 'react'
import ReactDOM from 'react-dom'
import Dinero from 'dinero.js/build/esm/dinero.js'
import './styles.css'

Dinero.globalLocale = 'en-US'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			whole: '0',
			fraction: '',
		}
		this.whole = React.createRef()
		this.fraction = React.createRef()
		this.numberRegex = /^\d+\.?$/g
	}
	componentDidMount() {
		this.whole.current.focus()
	}
	handleWhole = e => {
		const {value: fuck} = e.target
		const value = fuck.trim()
		if (value === '') {
			return this.setState({whole: '0'})
		}
		if (!value.match(this.numberRegex)) {
			console.log('no match', {value})
			return
		}
		if (value.indexOf('.') !== -1) {
			return this.fraction.current.focus()
		}

		console.log('down here', {value})
		let fixed = value
		if (fixed.length > 1) {
			if (fixed.charAt(0) === '0') {
				fixed = fixed.substr(1)
			}
		}

		this.setState({whole: fixed})
	}
	handleFraction = e => {
		const {value} = e.target
		this.setState({fraction: value})
	}
	render() {
		const {whole, fraction} = this.state
		return (
			<div
				className="App"
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<div>
					<h1>&nbsp;</h1>
					<label htmlFor="whole">Amount</label>
					<div style={{display: 'flex'}}>
						<span>$</span>
						<input
							type="tel"
							placeholder="0"
							name="whole"
							id="whole"
							ref={this.whole}
							value={whole}
							onChange={this.handleWhole}
						/>
						<input
							type="tel"
							placeholder="00"
							name="fraction"
							id="fraction"
							value={fraction}
							ref={this.fraction}
							onChange={this.handleFraction}
						/>
					</div>
				</div>
			</div>
		)
	}
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
