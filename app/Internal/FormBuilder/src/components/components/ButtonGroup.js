import './assets/css/buttonGroup.scss'
import Device from './Device'
const { useState } = wp.element
const { Button, ButtonGroup } = wp.components

export default function ({ label, options, value, onChange, additionalClass, responsive, device: activeDevice, onDeviceChange }) {

	const [device, setDevice] = useState('md')
	let responsiveDevice = responsive ? activeDevice ? activeDevice : device : window.mrmTypographyDevice

	const getValue = () => value ? (responsive ? (value[responsiveDevice] || '') : value) : '';
	const onButtonClick = val => onChange(responsive ? Object.assign({}, value, { [responsiveDevice]: val }) : val);

	const updateDevice = newDevice => {
		if (typeof activeDevice !== 'undefined') onChange({ ...value, device: newDevice });
		setDevice(newDevice);
	}

	return (
		<div className={'mrmTypography-field-group-btn mrmTypography-field ' + (responsive ? 'mrmTypography-responsive' : 'mrmTypography-d-flex')}>

			{responsive &&
			<div className="mrmTypography-d-flex mrmTypography-align-center mrmTypography-mb-10">
				{label && <label> {label} </label>}
				{responsive && <Device device={responsiveDevice} commonResponsiveDevice={device} className="mrmTypography-ml-10" onChange={val => { device && onDeviceChange ? onDeviceChange(val) : updateDevice(val) }} />}
			</div>
			}

			{!responsive && label && <label> {label} </label>}

			{/* <ButtonGroup className="mrmTypography-field-child mrmTypography-d-flex">
				{options.map(([title, option]) => {
					const activeBtn = option === getValue() ? 'mrmTypography-active-group-btn' : ''
					return (<Button className={`mrmTypography-group-button ${activeBtn}${additionalClass ? ` ${additionalClass}` : ''}`} onClick={() => onButtonClick(option)}>{title}</Button>)
				})}
			</ButtonGroup> */}
		</div>
	)
}
