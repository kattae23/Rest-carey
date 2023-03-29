const { response } = require("express");
const { Checkout, User, Product } = require("../models");

const getCheckouts = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, checkouts] = await Promise.all([
        Checkout.countDocuments(query),
        Checkout.find(query)
            .populate('user', ['firstName', 'lastName'])
            .skip(Number(from))
            .limit(Number(limit))
            .where(query)
    ]);

    res.json({
        total,
        checkouts
    });

}

const getCheckoutById = async (req, res = response) => {

    const { id } = req.params;
    const checkout = await Checkout.find({ orderId: id })
        .populate('user', ['firstName', 'lastName']);

    res.json(checkout);

}


const createCheckout = async (req, res = response) => {

    const { address, orderId, user, cart, totalPrice, seller } = req.body;


    const data = {
        address,
        orderId,
        user,
        cart,
        totalPrice,
        seller
    }

    cart.forEach(element => {
        userId = element.user._id
        productId = element._id
        let sells = async () => {
            await User.findByIdAndUpdate(user.uid, { $inc: { totalProductsPurchased: element.amount } }, { new: true })
            await User.findByIdAndUpdate(userId, { $inc: { sales: +1, totalProductsSold: element.amount, totalSold: totalPrice, }, productsSold: [orderId] }, { new: true })
            await Product.findByIdAndUpdate(productId, { $inc: { sold: element.amount, stock: -element.amount } }, { new: true })
        }
        sells()
    });

    
    await User.findByIdAndUpdate(user.uid, { $inc: { totalSpend: totalPrice, } }, { new: true })
    const checkout = new Checkout(data);

    // Guardar DB
    await checkout.save();

    res.status(201).json({
        checkout
    });

}

const updateCheckout = async (req, res = response) => {

    const { id } = req.params;

    const { orderId, shipped } = req.body;
    const query = { orderId: orderId }

    const [total, Checkouts] = await Promise.all([
        Checkout.countDocuments(query),
        Checkout.find(query)
    ])

    try {
        if (total < 1) {
            res.status(401).json({ msg: 'No checkouts found' })
        } else {
            const checkout = await Checkout.findByIdAndUpdate(id, { shipped }, { new: true });
            res.status(200).json(checkout)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Talk with the admin'})
    }

}


module.exports = {
    createCheckout,
    getCheckouts,
    getCheckoutById,
    updateCheckout
}