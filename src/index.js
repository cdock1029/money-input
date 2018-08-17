import React from 'react'
import ReactDOM from 'react-dom'
import Dinero from 'dinero.js/build/esm/dinero.js'
import './styles.css'

Dinero.globalLocale = 'en-US'

class App extends React.Component {
	state = {
		digits: '0',
	}

	handleChange = e => {
		const {name, value} = e.target
		const trimmed = parseInt(value).toString()
		this.setState({digits: trimmed})
	}
	render() {
		const {digits} = this.state
		const value = parseInt(digits) || 0
		const money = Dinero({amount: value}).toFormat('$0,0.00')
		console.log('render', {
			digits,
			value,
			money,
		})
		return (
			<div className="App">
				<h1>Hello CodeSandbox</h1>

				{/*<span className="container">
					<label>$ &nbsp;</label>
					<input
						className="dollars"
						onChange={this.handleChange}
						value={dollars}
						name="dollars"
						type="number"
						step="1"
						min="0"
					/>
				</span>*/}

				<div className="box">
					{/*<label>&nbsp;.&nbsp;</label>*/}
					<div className="money">{money}</div>
					<input
						className="cents"
						dir="rtl"
						onChange={this.handleChange}
						value={value || ''}
						name="cents"
						type="number"
						step="1"
						min="0"
						max="99"
					/>
				</div>
			</div>
		)
	}
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
