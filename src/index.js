import React from 'react'
import ReactDOM from 'react-dom'
import Dinero from 'dinero.js/build/esm/dinero.js'
import './styles.css'

Dinero.globalLocale = 'en-US'
const FORMAT = '0,0'
const PRETTY = '$0,0.00'

function to$(whole, fraction = '0', fmt = FORMAT) {
	return Dinero({
		amount: 100 * parseInt(whole || '0') + parseInt(fraction || '0'),
	}).toFormat(fmt)
}

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			whole: '0',
			fraction: '',
		}
		this.whole = React.createRef()
		this.fraction = React.createRef()
		this.wholeRegex = /^\d+\.?$/
		this.fractionRegex = /^\d{1,2}$/
	}
	componentDidMount() {
		this.whole.current.focus()
	}
	handleWhole = e => {
		let {value} = e.target
		if (value === '') {
			return this.setState({whole: '0'})
		}
		// undo Dinero
		value = value.toString().replace(',', '')

		if (!value.match(this.wholeRegex)) {
			console.log('no match', {value})
			return
		}

		if (value.charAt(value.length - 1) === '.') {
			const chopped = value.substr(0, value.length - 1)
			const money = to$(chopped)

			return this.setState({whole: money}, () => {
				this.fraction.current.focus()
			})
		}

		console.log('down here', {value})
		let fixed = value
		if (fixed.length > 1) {
			if (fixed.charAt(0) === '0') {
				fixed = fixed.substr(1)
			}
		}
		const money = to$(fixed)
		console.log({fixed, money})
		this.setState({whole: money})
	}
	handleFraction = e => {
		const {value} = e.target
		console.log({fraction: value})
		if (value.trim() === '') {
			return this.setState({fraction: value.trim()}, () => {
				this.whole.current.focus()
			})
		}
		if (!value.match(this.fractionRegex)) {
			return
		}
		this.setState({fraction: value})
	}
	render() {
		const {whole, fraction} = this.state
		console.log({whole, fraction})
		const money = to$(whole.replace(',', ''), fraction, PRETTY)
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
					<h1>{money}</h1>
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
