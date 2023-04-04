const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload')
const path = require('path');
const morgan = require('morgan');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            category: '/api/category',
            products: '/api/products',
            search: '/api/search',
            users: '/api/users',
            reset: '/api/reset',
            uploads: '/api/uploads',
            cart: '/api/cart',
            checkout: '/api/checkout',
            contact: '/api/contact',
        }

        // Conectar a base de datos
        this.connectDb();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

    }

    async connectDb() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());
        this.app.use(morgan('dev'));

        // Lectura y parseo del body
        this.app.use(express.json())

        // Directorio Público
        this.app.use(express.static(path.join(__dirname, 'public')));

        // FileUpload o la carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
        }));

    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.category, require('../routes/category'))
        this.app.use(this.paths.products, require('../routes/products'))
        this.app.use(this.paths.search, require('../routes/search'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))
        this.app.use(this.paths.users, require('../routes/user'))
        this.app.use(this.paths.reset, require('../routes/reset'))
        this.app.use(this.paths.cart, require('../routes/cart'))
        this.app.use(this.paths.checkout, require('../routes/checkout'))
        this.app.use(this.paths.contact, require('../routes/contact'))
        // this.app.use(this.paths.changePassword, require('../routes/change-password'))
        this.app.use('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public/index.html'));
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port:', this.port)
        });
    }

}

module.exports = Server;