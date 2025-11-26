import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import connectDB from '#utils/database/connect';
import { Menus, TMenu } from '#utils/database/models/menu';
import { authOptions } from '#utils/helper/authHelper';
import { CatchNextResponse } from '#utils/helper/common';

export async function POST (req: Request) {
	try {
		await connectDB();
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: 'Authentication Required' };

		const body = await req.json();
		const { name, description, category, price, taxPercent, foodType, veg, image } = body;

		if (!name || !price || !category) throw { status: 400, message: 'Name, Price and Category are required' };

		const newItem = new Menus({
			name,
			restaurantID: session.username,
			description,
			category,
			price: Number(price),
			taxPercent: Number(taxPercent || 0),
			foodType,
			veg,
			image,
			hidden: false,
		});

		await newItem.save();

		return NextResponse.json({ status: 200, message: 'Menu item created successfully', data: newItem });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export async function PUT (req: Request) {
	try {
		await connectDB();
		const session = await getServerSession(authOptions);
		if (!session) throw { status: 401, message: 'Authentication Required' };

		const body = await req.json();
		const { _id, name, description, category, price, taxPercent, foodType, veg, image } = body;

		if (!_id) throw { status: 400, message: 'Menu Item ID is required' };

		const menuItem = await Menus.findOne<TMenu>({ _id, restaurantID: session.username });
		if (!menuItem) throw { status: 404, message: 'Menu item not found' };

		if (name) menuItem.name = name;
		if (description !== undefined) menuItem.description = description;
		if (category) menuItem.category = category;
		if (price) menuItem.price = Number(price);
		if (taxPercent !== undefined) menuItem.taxPercent = Number(taxPercent);
		if (foodType) menuItem.foodType = foodType;
		if (veg) menuItem.veg = veg;
		if (image !== undefined) menuItem.image = image;

		await menuItem.save();

		return NextResponse.json({ status: 200, message: 'Menu item updated successfully', data: menuItem });
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = 'force-dynamic';
