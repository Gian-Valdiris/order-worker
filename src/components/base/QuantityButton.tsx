import clsx from 'clsx';

import './quantityButton.scss';

const QuantityButton = (props: TQuantityButtonProps) => {
	const { className, disabled, filled, quantity, increaseQuantity, decreaseQuantity } = props;

	const classList = clsx('quantityButton',
		className,
		disabled && 'disabled',
		filled && 'filled',
		quantity && 'quantityValue',
	);

	return (
		<div className={classList}>
			<div className='hiddenContainer'>
				{!props.disabled && <div className='quantity decrease' onClick={decreaseQuantity}>
					<i className='fa-solid fa-minus'></i>
				</div>}
				<div className='value'>
					{disabled && <i className='fa-solid fa-x'></i>}
					<p>{quantity || '0'}</p>
				</div>
			</div>
			{!disabled && <div className='quantity increase' onClick={increaseQuantity}>
				{quantity ? <i className='fa-solid fa-plus'></i> : 'Add' }
			</div>}
		</div>
	);
};

export default QuantityButton;

type TQuantityButtonProps = {
	className?: string,
	disabled?: boolean,
	filled?: boolean,
	quantity: number
	increaseQuantity: () => void,
	decreaseQuantity: () => void,
}
