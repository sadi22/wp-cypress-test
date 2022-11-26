/**
 * WordPress dependencies
 */

const {
	Fragment,
	useRef
} = wp.element;

const Field = ({
				   id,
				   index,
				   option,
				   min,
				   max,
				   onChange
			   }) => {
	const fieldRef = useRef( null );
	return (
		<div className="wp-block-wpfnl-blocks-sizing-control-item">
			{ option.disabled ? (
				<input
					type="number"
					disabled={ option.disabled }
					className="wp-block-wpfnl-blocks-sizing-control-item-input"
					id={ `wp-block-wpfnl-blocks-sizing-control-item-input-${ index }` }
				/>
			) : (
				<Fragment>
					<input
						type="number"
						className="wp-block-wpfnl-blocks-sizing-control-item-input"
						id={ `wp-block-wpfnl-blocks-sizing-control-item-input-${ index }-${ id }` }
						value={ undefined !== option.value ? option.value : '' }
						min={ min }
						max={ max }
						ref={ fieldRef }
						onChange={ e => onChange( option.type, option.attribute, parseInt( e.target.value ) ) }
					/>
				</Fragment>
			) }

			{ option.label && (
				<label
					className="wp-block-wpfnl-blocks-sizing-control-item-label"
					htmlFor={ `wp-block-wpfnl-blocks-sizing-control-item-input-${ index }-${ id }` }
				>
					{ option.label }
				</label>
			) }
		</div>
	);
};

export default Field;
