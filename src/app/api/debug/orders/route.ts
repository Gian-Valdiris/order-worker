import { NextResponse } from 'next/server';

import connectDB from '#utils/database/connect';
import { Orders } from '#utils/database/models/order';
import { CatchNextResponse } from '#utils/helper/common';

export async function GET (req: Request) {
	try {
		await connectDB();
		const url = new URL(req.url);
		const restaurantID = url.searchParams.get('restaurantID');

		if (!restaurantID) {
			throw { status: 400, message: 'restaurantID is required' };
		}

		const orders = await Orders.find({ restaurantID })
			.populate('customer')
			.populate('products.product')
			.sort({ createdAt: -1 });

		return NextResponse.json({ 
			status: 200, 
			count: orders.length,
			orders 
		});
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = 'force-dynamic';
