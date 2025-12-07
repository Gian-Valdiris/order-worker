import React, { useState, useEffect } from 'react';

import { Icon, Button } from 'xtreme-ui';

import QuantityButton from '#components/base/QuantityButton';
import Modal from '#components/layout/Modal';
import { TMenu } from '#utils/database/models/menu';
import { formatCOP } from '#utils/helper/formatHelper';

import './productDetailModal.scss';

const vegIcon = {
	'veg': 'f4d8',
	'non-veg': 'f6d6',
	'contains-egg': 'f7fb',
} as const;

const ProductDetailModal = (props: TProductDetailModalProps) => {
	const { open, setOpen, item, quantity = 0, increaseQuantity, decreaseQuantity, onAddToOrder } = props;
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [localQuantity, setLocalQuantity] = useState(quantity);

	// Obtener todas las imágenes válidas
	const validImages = React.useMemo(() => {
		if (!item?.image || !Array.isArray(item.image)) return [];
		return item.image.filter(img => {
			if (!img || typeof img !== 'string') return false;
			const trimmed = img.trim();
			return trimmed.length > 0 && (
				trimmed.startsWith('http://') || 
				trimmed.startsWith('https://') || 
				trimmed.startsWith('/') || 
				trimmed.startsWith('data:')
			);
		});
	}, [item?.image]);

	React.useEffect(() => {
		if (open) {
			setCurrentImageIndex(0);
			// Si la cantidad actual es 0, establecer en 1 por defecto para hacerlo más intuitivo
			setLocalQuantity(quantity > 0 ? quantity : 1);
		}
	}, [open, quantity]);

	if (!item) return null;

	const nextImage = () => {
		if (validImages.length > 0) {
			setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
		}
	};

	const prevImage = () => {
		if (validImages.length > 0) {
			setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
		}
	};

	const handleIncreaseQuantity = () => {
		setLocalQuantity(prev => prev + 1);
	};

	const handleDecreaseQuantity = () => {
		setLocalQuantity(prev => Math.max(0, prev - 1));
	};

	const handleAddToOrder = () => {
		if (item && localQuantity > 0 && increaseQuantity) {
			// Calcular cuánto agregar desde la cantidad actual
			const currentQuantity = quantity || 0;
			const quantityToAdd = localQuantity - currentQuantity;
			
			if (quantityToAdd > 0) {
				// Agregar la diferencia
				for (let i = 0; i < quantityToAdd; i++) {
					increaseQuantity({ ...item, quantity: 1 } as TMenuCustom);
				}
			} else if (quantityToAdd < 0 && decreaseQuantity) {
				// Reducir la cantidad si se seleccionó menos
				for (let i = 0; i < Math.abs(quantityToAdd); i++) {
					decreaseQuantity({ ...item, quantity: 1 } as TMenuCustom);
				}
			}
			
			if (onAddToOrder) {
				onAddToOrder();
			}
			setOpen(false);
		}
	};

	return (
		<Modal open={open} setOpen={setOpen} closeIcon=''>
			<div className='productDetailModal'>
				<button className='closeBtn' onClick={() => setOpen(false)} title='Cerrar'>
					<i className='fa-solid fa-x'></i>
				</button>

				{validImages.length > 0 && (
					<div className='imageGallery'>
						<div className='mainImage'>
							<img 
								src={validImages[currentImageIndex]} 
								alt={item.name}
								onError={(e) => {
									e.currentTarget.style.display = 'none';
								}}
							/>
							{validImages.length > 1 && (
								<>
									<button className='navButton prevButton' onClick={prevImage} aria-label='Imagen anterior'>
										<i className='fa-solid fa-arrow-left'></i>
									</button>
									<button className='navButton nextButton' onClick={nextImage} aria-label='Siguiente imagen'>
										<i className='fa-solid fa-arrow-right'></i>
									</button>
									<div className='imageCounter'>
										{currentImageIndex + 1} / {validImages.length}
									</div>
								</>
							)}
						</div>
						{validImages.length > 1 && (
							<div className='thumbnailContainer'>
								{validImages.map((img, index) => (
									<button
										key={index}
										className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
										onClick={() => setCurrentImageIndex(index)}
									>
										<img src={img} alt={`${item.name} ${index + 1}`} />
									</button>
								))}
							</div>
						)}
					</div>
				)}

				<div className='productInfo'>
					<div className='productHeader'>
						<h2 className='productName'>{item.name}</h2>
					{item.veg && (
						<div className={`vegBadge ${item.veg}`}>
							<Icon className={`icon ${item.veg}`} type='duotone' size={16} code={vegIcon[item.veg]} />
							<span className='label'>{item.veg.replace(/-/g, ' ')}</span>
						</div>
					)}
					</div>

					{item.description && (
						<div className='productDescription'>
							<p>{item.description}</p>
						</div>
					)}

					<div className='productPrice'>
						<span className='priceLabel'>Precio:</span>
						<span className='priceValue rupee'>{formatCOP(item.price)}</span>
					</div>

					{increaseQuantity && decreaseQuantity && (
						<div className='productActions'>
							<div className='quantitySelector'>
								<label className='quantityLabel'>Cantidad:</label>
								<QuantityButton
									className='modalQuantityButton'
									quantity={localQuantity}
									filled
									increaseQuantity={handleIncreaseQuantity}
									decreaseQuantity={handleDecreaseQuantity}
								/>
							</div>
							<Button
								className='addToOrderButton'
								type='primary'
								size='large'
								label={localQuantity > 0 ? `Añadir ${localQuantity} al pedido` : 'Añadir al pedido'}
								icon='e1bc'
								iconType='solid'
								disabled={localQuantity === 0}
								onClick={handleAddToOrder}
							/>
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default ProductDetailModal;

type TProductDetailModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	item: TMenu | null;
	quantity?: number;
	increaseQuantity?: (product: TMenuCustom) => void;
	decreaseQuantity?: (product: TMenuCustom) => void;
	onAddToOrder?: () => void;
}

type TMenuCustom = TMenu & {quantity: number}

