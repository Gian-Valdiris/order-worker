import React, { useState, useRef, UIEvent, useEffect } from 'react';

import { toast } from 'react-toastify';
import { Button, Icon, Spinner, Textfield } from 'xtreme-ui';

import { useAdmin } from '#components/context/useContext';
import Modal from '#components/layout/Modal';
import { TMenu } from '#utils/database/models/menu';

import MenuEditorItem from './MenuEditorItem';
import './menuEditor.scss';

const MenuEditor = () => {
	const { profile, menus, profileLoading, profileMutate } = useAdmin();
	const [modalState, setModalState] = useState('');
	const [editItem, setEditItem] = useState<TMenu>();
	const [hideSettingsLoading, setHideSettingsLoading] = useState<string[]>([]);
	const [deleteLoading, setDeleteLoading] = useState<string[]>([]);
	const [category, setCategory] = useState(0);

	const [formData, setFormData] = useState<Partial<TMenu>>({});
	const [saving, setSaving] = useState(false);
	const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

	const categories = useRef<HTMLDivElement>(null);

	const [leftCategoryScroll, setLeftCategoryScroll] = useState(false);
	const [rightCategoryScroll, setRightCategoryScroll] = useState(true);

	useEffect(() => {
		// Auto-create default categories if none exist
		if (profile && profile.categories?.length === 0) {
			const defaultCategories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides'];
			fetch('/api/admin/categories', {
				method: 'POST',
				body: JSON.stringify({ categories: defaultCategories }),
			})
				.then(res => res.json())
				.then(data => {
					if (data.status === 200) {
						profileMutate();
					}
				})
				.catch(err => console.error('Failed to create default categories:', err));
		}

		if (modalState === 'newState') {
			setFormData({
				name: '',
				description: '',
				price: 0,
				category: profile?.categories?.[0] || '',
				foodType: 'spicy',
				veg: 'veg',
				image: [],
			});
			setImageErrors({});
		} else if (modalState === 'menuItemEditState' && editItem) {
			setFormData({ 
				...editItem,
				image: editItem.image && Array.isArray(editItem.image) ? [...editItem.image] : []
			});
			setImageErrors({});
		}
	}, [modalState, editItem, profile, profileMutate]);

	const onCategoryScroll = (event: UIEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement;
		if (target.scrollLeft > 50) setLeftCategoryScroll(true);
		else setLeftCategoryScroll(false);

		if (Math.round(target.scrollWidth - target.scrollLeft) - 50 > target.clientWidth) setRightCategoryScroll(true);
		else setRightCategoryScroll(false);
	};
	const categoryScrollLeft = () => {
		if (categories?.current)
			categories.current.scrollLeft -= 400;
	};
	const categoryScrollRight = () => {
		if (categories?.current)
			categories.current.scrollLeft += 400;
	};
	const onHide = async (itemId: string, hidden: boolean) => {
		setHideSettingsLoading((v) => ([...v, itemId]));
		const req = await fetch('/api/admin/menu/hidden', {
			method: 'POST',
			body: JSON.stringify({ itemId, hidden }),
		});
		const res = await req.json();

		if (res?.status !== 200) toast.error(res?.message);

		await profileMutate();
		setHideSettingsLoading((v) => v.filter((item) => item !== itemId));
	};
	const onEdit = (item: TMenu) => {
		setEditItem(item);
		setModalState('menuItemEditState');
	};

	const onDelete = async (itemId: string) => {
		if (!confirm('¿Estás seguro de que deseas eliminar este item del menú? Esta acción no se puede deshacer.')) {
			return;
		}

		setDeleteLoading((v) => ([...v, itemId]));
		try {
			const req = await fetch('/api/admin/menu', {
				method: 'DELETE',
				body: JSON.stringify({ _id: itemId }),
			});
			const res = await req.json();

			if (res?.status === 200) {
				toast.success(res.message || 'Item eliminado correctamente');
				await profileMutate();
			} else {
				toast.error(res?.message || 'Error al eliminar el item');
			}
		} catch (error) {
			console.error(error);
			toast.error('Error al eliminar el item');
		} finally {
			setDeleteLoading((v) => v.filter((item) => item !== itemId));
		}
	};

	const saveItem = async () => {
		if (!formData.name || !formData.price || !formData.category) {
			return toast.warn('Name, Price and Category are required');
		}

		setSaving(true);
		const method = modalState === 'newState' ? 'POST' : 'PUT';
		
		try {
			const req = await fetch('/api/admin/menu', {
				method,
				body: JSON.stringify(formData),
			});
			const res = await req.json();

			if (res.status === 200) {
				toast.success(res.message);
				setModalState('');
				setImageErrors({});
				profileMutate();
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong');
		} finally {
			setSaving(false);
		}
	};

	if (profileLoading) return <Spinner fullpage label='Loading Menu...' />;

	return (
		<div className='menuEditor'>
			<div className='menuCategoryEditor'>
				<div className='menuCategoryHeader'>
					<h1 className='menuCategoryHeading'>Menu Categories</h1>
					<div className='menuCategoryOptions' />
				</div>
				<div className='menuCategoryContainer' ref={categories} onScroll={onCategoryScroll}>
					{
						profile?.categories?.map((item, i) => (
							<div
								key={i}
								className={`menuCategory ${category === i ? 'active' : ''}`}
								onClick={() => setCategory(i)}
							>
								<span className='title'>{item}</span>
							</div>
						))
					}
					<div className='space' />
				</div>
				<div className={`scrollLeft ${leftCategoryScroll ? 'show' : ''}`} onClick={categoryScrollLeft}>
					<Icon code='f053' type='solid' />
				</div>
				<div className={`scrollRight ${rightCategoryScroll ? 'show' : ''}`} onClick={categoryScrollRight}>
					<Icon code='f054' type='solid' />
				</div>
			</div>
			<div className='menuItemEditor'>
				<div className='menuItemHeader'>
					<h1 className='menuItemHeading'>Menu Items</h1>
					<div className='menuItemOptions' />
				</div>
				<div className='menuItemContainer'>
					{menus.length === 0 ? (
						<div className='emptyState'>
							<Icon code='e43b' type='solid' size={48} />
							<h3>No menu items yet</h3>
							<p>Click the blue '+' button below to add your first menu item</p>
						</div>
					) : (
						menus.map((item, id) => (
							<MenuEditorItem
								key={id}
								item={item}
								onEdit={onEdit}
								onHide={onHide}
								onDelete={onDelete}
								hideSettingsLoading={hideSettingsLoading.includes(item._id.toString())}
								deleteLoading={deleteLoading.includes(item._id.toString())}
							/>
						))
					)}
				</div>
			</div>
			<div
				className={`menuEditorAdd ${modalState ? 'active' : ''}`}
				onClick={() => setModalState('newState')}
			>
				<span>+</span>
			</div>

			<Modal open={!!modalState} setOpen={() => setModalState('')} closeIcon=''>
				<div className='menuEditorModal'>
					<div className='modalHeader'>
						<div className='headerContent'>
							<Icon code='e43b' type='solid' size={24} />
							<h2>{modalState === 'newState' ? 'Add New Menu Item' : 'Edit Menu Item'}</h2>
						</div>
						<button className='closeBtn' onClick={() => setModalState('')} title='Cerrar'>
							<i className='fa-solid fa-x'></i>
						</button>
					</div>
					<div className='form'>
						<div className='formSection imageSection'>
							<h3>
								<Icon code='f03e' type='solid' size={18} />
								<span>Images</span>
							</h3>
							<div className='imagesContainer'>
								{formData.image && formData.image.length > 0 && formData.image.map((url, index) => (
									<div key={index} className='imageItem'>
										<div className='imagePreviewWrapper'>
											{url && url.trim() ? (
												<>
													<img 
														src={url} 
														alt={`Preview ${index + 1}`} 
														onError={() => setImageErrors({ ...imageErrors, [index]: true })}
														onLoad={() => setImageErrors({ ...imageErrors, [index]: false })}
														style={{ display: imageErrors[index] ? 'none' : 'block' }}
													/>
													{imageErrors[index] && (
														<div className='imageError'>
															<Icon code='f06a' type='solid' size={24} />
															<span>Invalid URL</span>
														</div>
													)}
												</>
											) : (
												<div className='imageError'>
													<Icon code='f03e' type='solid' size={24} />
													<span>Enter image URL</span>
												</div>
											)}
											<button
												className='removeImageBtn'
												onClick={() => {
													const newImages = formData.image?.filter((_, i) => i !== index) || [];
													const newErrors = { ...imageErrors };
													delete newErrors[index];
													// Reindex errors
													const reindexedErrors: Record<number, boolean> = {};
													Object.keys(newErrors).forEach(key => {
														const oldIndex = Number(key);
														if (oldIndex > index) {
															reindexedErrors[oldIndex - 1] = newErrors[oldIndex];
														} else {
															reindexedErrors[oldIndex] = newErrors[oldIndex];
														}
													});
													setImageErrors(reindexedErrors);
													setFormData({ ...formData, image: newImages });
												}}
												title='Remove image'
											>
												<Icon code='f00d' type='solid' size={14} />
											</button>
										</div>
										<Textfield
											value={url}
											onChange={(e) => {
												const newImages = [...(formData.image || [])];
												newImages[index] = e.target.value;
												setFormData({ ...formData, image: newImages });
												// Reset error when URL changes
												if (imageErrors[index]) {
													setImageErrors({ ...imageErrors, [index]: false });
												}
											}}
											placeholder={`Image ${index + 1} URL`}
										/>
									</div>
								))}
								{(!formData.image || formData.image.length === 0) && (
									<div className='emptyImagesState'>
										<Icon code='f03e' type='solid' size={48} />
										<p>No images added yet</p>
										<p className='hint'>Add image URLs to showcase your menu item</p>
									</div>
								)}
								<Button
									label='+ Add Image'
									onClick={() => {
										const newImages = [...(formData.image || []), ''];
										setFormData({ ...formData, image: newImages });
									}}
									type='secondary'
									size='mini'
									icon='f067'
									iconType='solid'
								/>
							</div>
						</div>

						<div className='formSection'>
							<h3>Basic Information</h3>
							<div className='inputGroup'>
								<label>
									<span>Item Name *</span>
								</label>
								<input
									value={formData.name || ''}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder='e.g. Margherita Pizza'
								/>
							</div>
							<div className='inputGroup'>
								<label>
									<span>Description</span>
								</label>
								<textarea
									value={formData.description || ''}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									placeholder='Brief description of the dish'
									rows={3}
								/>
							</div>
						</div>

						<div className='formSection'>
							<h3>Pricing & Category</h3>
							<div className='row'>
								<div className='inputGroup'>
									<label>
										<Icon code='e227' type='solid' size={14} />
										<span>Price *</span>
									</label>
									<div className='priceInput'>
										<span className='currency'>$</span>
										<input
											type='number'
											value={String(formData.price || '')}
											onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
											placeholder='0.00'
										/>
									</div>
															<div className='inputGroup'>
									<label>
										<Icon code='f07b' type='solid' size={14} />
										<span>Category *</span>
									</label>
									<div className='customSelect'>
										<select
											value={formData.category || ''}
											onChange={(e) => {
												if (e.target.value === '__add_new__') {
													const newCat = prompt('Enter new category name:');
													if (newCat) {
														const trimmedCat = newCat.trim();
														if (trimmedCat && !profile?.categories?.includes(trimmedCat.toLowerCase())) {
															fetch('/api/admin/categories', {
																method: 'POST',
																body: JSON.stringify({ 
																	categories: [...(profile?.categories || []), trimmedCat] 
																}),
															})
																.then(res => res.json())
																.then(data => {
																	if (data.status === 200) {
																		toast.success('Category added!');
																		setFormData({ ...formData, category: trimmedCat.toLowerCase() });
																		profileMutate();
																	} else {
																		toast.error(data.message);
																	}
																})
																.catch(() => toast.error('Failed to add category'));
														}
													}
												} else {
													setFormData({ ...formData, category: e.target.value });
												}
											}}
										>
											<option value=''>Select Category</option>
											{profile?.categories?.map((cat, i) => (
												<option key={i} value={cat}>{cat}</option>
											))}
											<option value='__add_new__' style={{ borderTop: '1px solid var(--colorBorder)', fontWeight: 'bold' }}>
												➕ Add New Category
											</option>
										</select>
										<Icon code='f078' type='solid' size={12} />
									</div>
								</div>
								</div>
							</div>
						</div>

						<div className='formSection' style={{ display: 'none' }}>
							<h3>Properties</h3>
							<div className='row'>
								<div className='inputGroup'>
									<label>
										<Icon code='f4d8' type='solid' size={14} />
										<span>Diet Type</span>
									</label>
									<div className='customSelect'>
										<select
											value={formData.veg || 'veg'}
											onChange={(e) => setFormData({ ...formData, veg: e.target.value as any })}
										>
											<option value='veg'>🥗 Vegetarian</option>
											<option value='non-veg'>🍗 Non-Vegetarian</option>
											<option value='contains-egg'>🥚 Contains Egg</option>
										</select>
										<Icon code='f078' type='solid' size={12} />
									</div>
								</div>
								<div className='inputGroup'>
									<label>
										<Icon code='f06d' type='solid' size={14} />
										<span>Spice Level</span>
									</label>
									<div className='customSelect'>
										<select
											value={formData.foodType || 'spicy'}
											onChange={(e) => setFormData({ ...formData, foodType: e.target.value as any })}
										>
											<option value='sweet'>🍰 Sweet</option>
											<option value='spicy'>🌶️ Spicy</option>
											<option value='extra-spicy'>🔥 Extra Spicy</option>
										</select>
										<Icon code='f078' type='solid' size={12} />
									</div>
								</div>
							</div>
						</div>

						<div className='formActions'>
							<Button
								label='Cancel'
								onClick={() => setModalState('')}
								type='secondary'
								disabled={saving}
							/>
							<Button
								label={saving ? 'Saving...' : 'Save Item'}
								onClick={saveItem}
								loading={saving}
								type='primary'
								icon='f00c'
								iconType='solid'
							/>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default MenuEditor;
