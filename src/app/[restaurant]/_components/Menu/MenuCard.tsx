import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';
import { Icon } from 'xtreme-ui';

import QuantityButton from '#components/base/QuantityButton';
import { TMenu } from '#utils/database/models/menu';
import { formatCOP } from '#utils/helper/formatHelper';

import './menuCard.scss';

const vegIcon = {
	'veg': 'f4d8',
	'non-veg': 'f6d6',
	'contains-egg': 'f7fb',
} as const;

const MenuCard = (props: TMenuCardProps) => {
	const { className, show, restrictOrder, showInfo, setShowInfo, item, quantity, onItemClick } = props;
	const [cardRef, inView] = useInView({ threshold: 0 });

	const classList = clsx(
		'menuCard ',
		className,
		restrictOrder && 'restrictOrder',
		showInfo && 'showInfo',
		!item.image && 'withoutImage',
		window.matchMedia('(hover: hover)').matches && 'hoverSupported',
	);

	if (!show) return null;

	return (
		<div className={classList + (!inView ? 'blank' : '')} ref={cardRef}>
			{
				inView
				&& <>
				{
					item.image?.[0] &&
					<div className='picture' onClick={() => onItemClick?.(item)} style={{ cursor: onItemClick ? 'pointer' : 'default' }}>
						<span style={{ background: `url(${item.image[0]})` }} />
						<div className='description'>{item.description}</div>
					</div>
				}
					<div className='options'>
						<div className='title'>
							<span>{item.name}</span>
							{
								item.image?.[0] &&
								<div className='info' onClick={() => setShowInfo(showInfo ? false : !!item._id)}>
									<Icon code={showInfo ? 'f00d' : 'f05a'} />
								</div>
							}
						</div>
						{ !item.image?.[0] && <div className='description'>{item.description}</div> }
						<div className='footer'>
							{!item.image?.[0] && <div className='priceNoImage rupee'>{formatCOP(item.price)}</div>}
							<QuantityButton className='addToCart' quantity={quantity} filled
								increaseQuantity={() => props.increaseQuantity(item)}
								decreaseQuantity={() => props.decreaseQuantity(item)}
							/>
						</div>
					</div>
					{
						item.image?.[0] &&
						<div className='price rupee'>
							<div className='ribbonTop' />
							<div className='ribbonBottom' />
							<span>{formatCOP(item.price)}</span>
						</div>
					}
				</>
			}
		</div>
	);
};

export default MenuCard;

type TMenuCardProps = {
	className?: string,
	show?: boolean,
	restrictOrder?:boolean,
	showInfo?: boolean,
	setShowInfo: (showInfo: boolean) => void,
	item: TMenuCustom,
	quantity: number,
	increaseQuantity: (item: TMenuCustom) => void,
	decreaseQuantity: (item: TMenuCustom) => void,
	onItemClick?: (item: TMenuCustom) => void,
}

type TMenuCustom = TMenu & {quantity: number}
