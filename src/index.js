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
		this.wholeRegex = /^\d+\.?\d{0,2}$/
		this.fractionRegex = /^\d{1,2}$/
	}
	handleWhole = e => {
		let {value} = e.target
		// undo Dinero
		value = value.toString().replace(/[, ]/g, '')
		if (value === '') {
			return this.setState({whole: '0'})
		}

		if (!value.match(this.wholeRegex)) {
			console.log('no match', {value})
			return
		}

		if (value.indexOf('.') !== -1) {
			const parts = value.split('.')
			const money = to$(parts[0])
			return this.setState(
				({fraction}) => ({
					whole: money,
					fraction: parts.length > 1 ? parts[1] : fraction,
				}),
				() => {
					this.fraction.current.focus()
				}
			)
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
		//
	}
	handleFraction = e => {
		const {value} = e.target
		// console.log({fraction: value})
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
	fractionKeyDown = e => {
		const {value} = this.fraction.current
		if (value === '' && e.keyCode === 8) {
			this.whole.current.focus()
		}
	}
	render() {
		const {whole, fraction} = this.state
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
					<div className="box">
						<span className="sign">$</span>
						<input
							className="whole"
							type="tel"
							placeholder="0"
							name="whole"
							id="whole"
							ref={this.whole}
							value={whole}
							autoFocus
							onChange={this.handleWhole}
						/>
						<input
							className="fraction"
							type="tel"
							placeholder="00"
							name="fraction"
							id="fraction"
							value={fraction}
							ref={this.fraction}
							onKeyDown={this.fractionKeyDown}
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
