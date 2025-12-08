const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

const bcrypt = require('bcryptjs');

app.use(express.json());


app.use(cors({
    origin: function (origin, callback) {
        
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'https://campus-food-frontend.onrender.com',
            'http://localhost:3000',
            'http://localhost:10000',
            'http://localhost:10000',  
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'http://127.0.0.1:5501',
            'http://127.0.0.1',        
            'http://localhost'         
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); 
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    console.log('Authorization:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('Body:', req.body);
    next();
});


let users = [];
let orders = [];
let menuItems = [
    { id: 1, name: "Jollof Rice", price: 50, category: "main" },
    { id: 2, name: "Fried Rice", price: 50, category: "main" },
    { id: 3, name: "Pounded Yam", price: 50, category: "main" },
    { id: 4, name: "Eba", price: 50, category: "main" },
    { id: 5, name: "White Rice", price: 50, category: "main" },
    { id: 6, name: "Fufu", price: 50, category: "main" },
    { id: 7, name: "Banku & Tilapia", price: 50, category: "main" },
    { id: 8, name: "Waakye", price: 50, category: "main" },
    { id: 9, name: "Chicken Shawarma", price: 50, category: "main" },
    { id: 10, name: "Beef Shawarma", price: 50, category: "main" },
    { id: 11, name: "Veg Shawarma", price: 50, category: "main" },
    { id: 12, name: "Don Simon", price: 25, category: "drink" },
    { id: 13, name: "Ceres", price: 25, category: "drink" },
    { id: 14, name: "Bigoo", price: 5, category: "drink" },
    { id: 15, name: "Bel-Aqua", price: 6, category: "drink" },
    { id: 16, name: "Plantain Chips", price: 20, category: "snack" },
    { id: 17, name: "Fanta", price: 20, category: "drink" },
    { id: 18, name: "Coke", price: 20, category: "drink" },
    { id: 19, name: "Sprite", price: 20, category: "drink" }
];


const JWT_SECRET = process.env.JWT_SECRET || 'campus_food_system_25';


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};



//////ROUTES///////
app.get('/', (req, res) => {
    res.json({
        message: 'Campus Food Ordering API',
        status: 'running',
        endpoints: [
            'POST /api/signup',
            'POST /api/login',
            'GET /api/menu',
            'POST /api/order',
            'GET /api/orders'
        ]
    });
});


app.post('/api/signup', (req, res) => {
    try {
            
    
        const { username, password, email } = req.body;
        
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }
        
        if (username.length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username must be at least 3 characters' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
            
        }
        
        
        const newUser = {
            id: users.length + 1,
            username,
            password, 
            email: email || `${username}@example.com`,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        
        
        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            message: 'Account created successfully!',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});


app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
        
        
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});


app.get('/api/menu', (req, res) => {
    res.json(menuItems);
});


app.post('/api/order', authenticateToken, (req, res) => {
    try {
        const { items, deliveryAddress } = req.body;
        const userId = req.user.userId;
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No items in order' 
            });
        }
        
        
        let totalAmount = 0;
        const orderItems = [];
        
        for (const item of items) {
            const menuItem = menuItems.find(m => m.id === item.id);
            if (!menuItem) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Item ${item.id} not found` 
                });
            }
            
            const quantity = item.quantity || 1;
            totalAmount += menuItem.price * quantity;
            orderItems.push({
                menuItemId: menuItem.id,
                name: menuItem.name,
                quantity: quantity,
                price: menuItem.price
            });
        }
        
        
        const newOrder = {
            id: orders.length + 1,
            userId: userId,
            items: orderItems,
            totalAmount: totalAmount,
            status: 'pending',
            deliveryAddress: deliveryAddress || 'Campus Address',
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        
        res.json({
            success: true,
            message: 'Order placed successfully!',
            order: {
                id: newOrder.id,
                totalAmount: newOrder.totalAmount,
                status: newOrder.status
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});


app.get('/api/orders', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const userOrders = orders.filter(order => order.userId === userId);
        res.json(userOrders);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});



app.get('/api/test', (req, res) => {
    res.json({
        status: 'OK',
        time: new Date().toISOString(),
        usersCount: users.length,
        ordersCount: orders.length
    });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});


app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Endpoint not found' 
    });
});



const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Endpoints available at http://localhost:${PORT}`);
});