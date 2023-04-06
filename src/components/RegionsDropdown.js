import React, { Component, createRef } from 'react';
//import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { loadScript } from '../utilities';
import { getRegionsList } from '../actions/cart';

class RegionsDropdown extends Component {

	constructor(props) {
		super(props);
		this.selectRef = createRef(null)
		this.state = {
			regions: props.regions,
			status: props.status,
			selectedValue: typeof props.selectedValue !== 'undefined' ? props.selectedValue : null
		};

		this._unMounted = false;
		this.loaded = false;
		this.loadScript = this.loadScript.bind(this);
		this.change = this.change.bind(this);
	}

	componentWillMount() {
		if (!this.state.regions.length) {
			this.props.getRegionsList();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.status !== this.state.status && nextProps.compName === 'regions') {
			!this._unMounted && this.setState({
				regions: nextProps.regions,
				status: nextProps.status,
				selectedValue: nextProps.selectedValue
			});
		}
	}

	componentWillUnmount() {
		this._unMounted = true;
	}

	loadScript() {
		const { selectedValue } = this.state;
		if (selectedValue && this.selectRef) {
			window.$$("#region_id").val(selectedValue);
			!this._unMounted && this.setState({
				selectedValue: null
			});
		}
		if (this.loaded === true) {
			if (selectedValue && window.$$("#region_id")) {
				window.$$("#region_id").selectpicker('refresh');
				!this._unMounted && this.setState({
					selectedValue: null
				});
			}
			return;
		}
		this.loaded = true;
		if (this.refs && window.$$("#region_id")) {
			window.$$("#region_id").selectpicker();
			window.$$("#region_id").on("change", (e) => {
				if (typeof this.props.callback !== 'undefined') {
					this.change(e);
				}
			});
		}
	}

	change(e) {
		const { regions } = this.state;
		const { value } = e.target;
		const { callback } = this.props;
		if (typeof callback === 'undefined')
			return;

		let selectedRegion = regions.filter(region => {
			return region.region_id === value;
		})[0];

		if (typeof selectedRegion === 'undefined') {
			selectedRegion = { region_id: "", code: "", name: "" };
		}

		callback(selectedRegion.region_id, selectedRegion.code, selectedRegion.name, regions);
	}

	componentDidUpdate() {
		const { regions } = this.state;
		if (regions.length > 0) {
			window.addEventListener('load', () => loadScript(this.loadScript, 'select-dropdown', '/assets/js/bootstrap-select.min.js'));

			if (document.readyState === "complete" || document.readyState === "interactive") {
				loadScript(this.loadScript, 'select-dropdown', '/assets/js/bootstrap-select.min.js');
			}
		}
	}

	render() {
		const { regions } = this.state;

		return (
			<select ref={this.selectRef} className="selectpicker style-select-block" id="region_id" name="region_id">
				<option value="">Select a State</option>
				{
					regions.map((region) => {
						return <option value={region.region_id} key={region.region_id}>{region.name}</option>
					})
				}
			</select>
		);
	}
}

const mapStatesToProps = (state) => {
	return {
		regions: [...state.Cart.regions],
		status: state.Cart.status,
		compName: state.Cart.compName
	}
}

// const dropdown = reduxForm({
//   form: 'delivery_address' // a unique identifier for this form
// })(RegionsDropdown);

export default connect(mapStatesToProps, { getRegionsList })(RegionsDropdown);