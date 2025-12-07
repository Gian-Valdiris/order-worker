import { NextResponse } from 'next/server';

import connectDB from '#utils/database/connect';
import { Tables } from '#utils/database/models/table';
import { CatchNextResponse } from '#utils/helper/common';

export async function POST (req: Request) {
	try {
		await connectDB();

		const body = await req.json();
		const { count = 10, restaurantID } = body;

		if (!restaurantID) throw { status: 400, message: 'restaurantID is required' };

		// Delete existing tables
		await Tables.deleteMany({ restaurantID });

		// Create new tables
		const tables = [];
		for (let i = 1; i <= count; i++) {
			const table = new Tables({
				restaurantID,
				name: `Table ${i}`,
				username: i.toString(),
			});
			await table.save();
			tables.push(table);
		}

		return NextResponse.json({ 
			status: 200, 
			message: `${count} tables created successfully`, 
			tables 
		});
	} catch (err) {
		console.log(err);
		return CatchNextResponse(err);
	}
}

export const dynamic = 'force-dynamic';
