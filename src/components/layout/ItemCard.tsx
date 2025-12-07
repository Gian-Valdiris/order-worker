import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';

import QuantityButton from '#components/base/QuantityButton';
import { TMenu } from '#utils/database/models/menu';
import { formatCOP } from '#utils/helper/formatHelper';

import './itemCard.scss';

const ItemCard = (props: TItemCardProps) => {
	const { className, item, staticCard, increaseQuantity, decreaseQuantity } = props;
	const [cardRef, inView] = useInView({ triggerOnce: true, threshold: 0 });
	const getTotalPrice = () => {
		return item.quantity ? item.price * item.quantity : item.price;
	};

	const classList = clsx(
		'itemCard',
		className,
		staticCard && 'staticCard',
	);

	return (
		<div className={classList} ref={cardRef}>
			{
				inView
				&& <>
					{
						item.image?.[0]
						&& <div className='picture'>
							<span style={{ background: `url(${item.image[0]})` }} />
						</div>
					}
					<div className='options'>
						<p className='title'>{item.name}</p>
						<div className='footer'>
							<div className='price'>
								{!staticCard && <p className='rupee'>{ formatCOP(getTotalPrice()) }</p>}
								{
									staticCard && <p className='rupee'>
										{ formatCOP(item.price) } <span>✕</span> {item.quantity}
									</p>
								}
							</div>
							{
								staticCard
									? <div className='totalAmount rupee'>{ formatCOP(getTotalPrice()) }</div>
									: (
										<QuantityButton className='addToCart'
											quantity={item.quantity}
											increaseQuantity={() => increaseQuantity?.(item)}
											decreaseQuantity={() => decreaseQuantity?.(item)}
										/>
									)
							}
						</div>
					</div>
				</>
			}
		</div>
	);
};

export default ItemCard;

type TItemCardProps = {
	className?: string
	item: TMenuCustom
	staticCard?: boolean
	increaseQuantity?: (item: TMenuCustom) => void
	decreaseQuantity?: (item: TMenuCustom) => void
}

type TMenuCustom = TMenu & {quantity: number}
