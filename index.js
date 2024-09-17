const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const payOS = require('./utils/payos');

const app = express();
const PORT = process.env.PORT || 3030;
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static('public'));
app.use('/payment', require('./controllers/payment-controller'));
app.use('/order', require('./controllers/order-controller'));

app.post('/create-payment-link', async (req, res) => {
    const YOUR_DOMAIN = 'http://localhost:3030';
    // const body = {
    //     orderCode: Number(String(Date.now()).slice(-6)),
    //     amount: 5000,
    //     description: 'Thanh toan don hang',
    //     returnUrl: `http://localhost:3000/about-us`,
    //     cancelUrl: `${YOUR_DOMAIN}/cancel.html`
    // };
    try {
        const paymentLinkResponse = await payOS.createPaymentLink(req.body);
        res.redirect(paymentLinkResponse.checkoutUrl);  
    } catch (error) {
        res.send(error);
    }
});

app.listen(PORT, function () {
    console.log(`Server is listening on port ${PORT}`);
});