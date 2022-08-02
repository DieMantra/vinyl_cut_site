require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
	[1, { priceInCents: 690, name: '200x31mm Vinyl Lettering' }],
	[2, { priceInCents: 915, name: '300x38mm Vinyl Lettering' }],
	[3, { priceInCents: 2750, name: '450x56mm Vinyl Lettering' }],
	[4, { priceInCents: 6500, name: '800x100mm Vinyl Lettering' }],
]);

app.post('/create-checkout-session', async (req, res) => {
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: req.body.items.map((item) => {
				const storeItem = storeItems.get(item.id);
				return {
					price_data: {
						currency: 'aud',
						product_data: {
							name: storeItem.name,
						},
						unit_amount: storeItem.priceInCents,
					},
					quantity: item.quantity,
				};
			}),
			success_url: `${process.env.SERVER_URL}/payment-success.html`,
			cancel_url: `${process.env.SERVER_URL}`,
		});
		res.json({ url: session.url });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.listen(3000);
