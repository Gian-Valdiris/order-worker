import React from 'react';

import { useInView } from 'react-intersection-observer';
import { Button, Icon, useScreenType } from 'xtreme-ui';

import { TMenu } from '#utils/database/models/menu';
import { formatCOP } from '#utils/helper/formatHelper';

import './menuEditorItem.scss';

const vegIcon = {
	'veg': 'f4d8',
	'non-veg': 'f6d6',
	'contains-egg': 'f7fb',
} as const;

const MenuEditorItem = (props: TMenuEditorItemProps) => {
	const { item, onEdit, onHide, onDelete, hideSettingsLoading = false, deleteLoading = false } = props;
	const { isMobile } = useScreenType();
	const [itemRef, inView] = useInView({ threshold: 0 });
	const [imageError, setImageError] = React.useState(false);

	// Obtener la primera imagen válida del array
	const firstImage = React.useMemo(() => {
		// Verificar que image existe y es un array
		if (!item.image) return null;
		
		// Si es un string, convertirlo a array
		let imageArray: string[] = [];
		if (typeof item.image === 'string') {
			imageArray = [item.image];
		} else if (Array.isArray(item.image)) {
			imageArray = item.image;
		} else {
			return null;
		}

		// Si el array está vacío, retornar null
		if (imageArray.length === 0) return null;

		// Buscar la primera imagen que no esté vacía y sea válida
		const validImage = imageArray.find(img => {
			if (!img) return false;
			if (typeof img !== 'string') return false;
			const trimmed = img.trim();
			return trimmed.length > 0 && (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('data:'));
		});

		return validImage || null;
	}, [item.image]);

	// Resetear error cuando cambia la imagen
	React.useEffect(() => {
		setImageError(false);
	}, [firstImage]);

	return (
		<div className='menuEditorItem' ref={itemRef}>
			{
				inView
				&& <>
					<div className='menuItemPicture'>
						{firstImage && !imageError ? (
							<img 
								className='image' 
								src={firstImage} 
								alt={item.name}
								onError={() => {
									setImageError(true);
								}}
								onLoad={() => {
									setImageError(false);
								}}
							/>
						) : null}
						<div className='placeholder' style={{ display: firstImage && !imageError ? 'none' : 'flex' }}>
							<Icon code='e43b' />
						</div>
						{
							item.veg &&
							<div className={`vegIcon ${item.veg}`}>
								<Icon className='icon' type='duotone' size={16} code={vegIcon[item.veg]} />
								<span className='label'>{item.veg.replace(/-/g, ' ')}</span>
							</div>
						}
					</div>
					<div className='menuItemData'>
						<h5 className='menuItemTitle'>{item.name}</h5>
						<p className='menuItemDesc'>{item.description}</p>
						<p className='menuItemPrice rupee'>{formatCOP(item.price)}</p>
					</div>
					<div className='menuItemOptions'>
						<Button
							icon={item.hidden ? 'f070' : 'f06e'}
							iconType='solid'
							size='mini'
							type={item.hidden ? 'secondary' : 'primary'}
							label={isMobile ? undefined : item.hidden ? 'Hidden' : 'Visible'}
							loading={hideSettingsLoading}
							onClick={() => onHide(item._id.toString(), !item.hidden)}
						/>
						<Button
							icon='f1f8'
							iconType='solid'
							size='mini'
							type='secondary'
							label={isMobile ? undefined : 'Eliminar'}
							loading={deleteLoading}
							onClick={() => onDelete(item._id.toString())}
						/>
						<Button label='Editar' type='primary' onClick={() => onEdit(item)} />
					</div>
				</>
			}
		</div>
	);
};

export default MenuEditorItem;

type TMenuEditorItemProps = {
	item: TMenu,
	onEdit: (item: TMenu) => void,
	onHide: (id: string, hidden: boolean) => void,
	onDelete: (id: string) => void,
	hideSettingsLoading: boolean,
	deleteLoading: boolean,
}
