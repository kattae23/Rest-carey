const Stripe = require('stripe');
const { Router, application, response } = require('express');
const { search } = require('../controllers/search');
const { validateFields, validateJWT, haveRole } = require('../middlewares');
const { createCheckout, getCheckouts, getCheckoutById, updateCheckout } = require('../controllers/checkout');
const { check } = require('express-validator');


const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


router.post('/', [
    validateJWT,
    haveRole('ADMIN_ROLE', 'SALES_ROLE', 'USER_ROLE'),
    validateFields
], async (req, res) => {

    // console.log(req.body)

    const { id, amount, description, email, billing_details, name, phone } = req.body


    const { address } = billing_details

    try {
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "USD",
            description: description,
            payment_method: id,
            confirm: true,
            receipt_email: email,
            payment_method_types: ['card'],
            statement_descriptor: description,
            shipping: {
                address: {
                    ...address
                },
                name: name,
                phone: phone
            }
        })

        res.status(200).json(payment)

    } catch (error) {
        console.log(error)
        res.json({ message: error.raw.message })
    }
})

router.get('/', [
    // haveRole('ADMIN_ROLE', 'SALES_ROLE', 'USER_ROLE'),
], getCheckouts);

router.get('/:id', [
    // check(':id', 'The OrderId is required').not().isEmpty(),
    // haveRole('ADMIN_ROLE', 'SALES_ROLE', 'USER_ROLE'),
    validateFields,
], getCheckoutById);

router.post('/order', [
    validateJWT,
    haveRole('ADMIN_ROLE', 'SALES_ROLE', 'USER_ROLE'),
    // check('orderId', 'The OrderId is required').not().isEmpty(),
    // check('category', 'Is not a valid mongo ID').isMongoId(),
    // check('category').custom(categoryExistById),
    validateFields
], createCheckout);

router.put('/order/:id', [
    validateJWT,
    haveRole('ADMIN_ROLE', 'SALES_ROLE', 'USER_ROLE'),
    // check('orderId', 'The OrderId is required').not().isEmpty(),
    // check('category', 'Is not a valid mongo ID').isMongoId(),
    // check('category').custom(categoryExistById),
    validateFields
], updateCheckout);






module.exports = router;