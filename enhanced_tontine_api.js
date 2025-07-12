const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced database configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'Diaw',
    password: '0504',
    database: 'e_tontine_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
});

// Database connection test
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connecté à la base de données MySQL');
        connection.release();
    } catch (err) {
        console.error('❌ Erreur de connexion à MySQL:', err);
        process.exit(1);
    }
}

// Initialize database connection
testConnection();

// Middleware for request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        res.json({ 
            status: 'healthy', 
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(503).json({ 
            status: 'unhealthy', 
            database: 'disconnected',
            timestamp: new Date().toISOString()
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'API e-Tontine opérationnelle',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            tontines: '/tontines'
        }
    });
});

// TONTINES ROUTES
// Get all tontines
app.get('/tontines', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tontines ORDER BY created_at DESC');
        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des tontines:', err);
        res.status(500).json({ 
            success: false,
            error: 'Erreur lors de la récupération des tontines' 
        });
    }
});

// Get tontine by ID
app.get('/tontines/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM tontines WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Tontine non trouvée' 
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (err) {
        console.error('Erreur lors de la récupération de la tontine:', err);
        res.status(500).json({ 
            success: false,
            error: 'Erreur lors de la récupération de la tontine' 
        });
    }
});

// Create new tontine
app.post('/tontines', async (req, res) => {
    try {
        const { name, description, amount, participants_limit, frequency } = req.body;
        
        // Validation
        if (!name || !amount || !participants_limit || !frequency) {
            return res.status(400).json({ 
                success: false,
                error: 'Champs requis: name, amount, participants_limit, frequency' 
            });
        }
        
        const [result] = await pool.query(
            'INSERT INTO tontines (name, description, amount, participants_limit, frequency, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [name, description, amount, participants_limit, frequency]
        );
        
        res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                name,
                description,
                amount,
                participants_limit,
                frequency
            }
        });
    } catch (err) {
        console.error('Erreur lors de la création de la tontine:', err);
        res.status(500).json({ 
            success: false,
            error: 'Erreur lors de la création de la tontine' 
        });
    }
});

// Update tontine
app.put('/tontines/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, amount, participants_limit, frequency } = req.body;
        
        const [result] = await pool.query(
            'UPDATE tontines SET name = ?, description = ?, amount = ?, participants_limit = ?, frequency = ?, updated_at = NOW() WHERE id = ?',
            [name, description, amount, participants_limit, frequency, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Tontine non trouvée' 
            });
        }
        
        res.json({
            success: true,
            message: 'Tontine mise à jour avec succès'
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la tontine:', err);
        res.status(500).json({ 
            success: false,
            error: 'Erreur lors de la mise à jour de la tontine' 
        });
    }
});

// Delete tontine
app.delete('/tontines/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM tontines WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Tontine non trouvée' 
            });
        }
        
        res.json({
            success: true,
            message: 'Tontine supprimée avec succès'
        });
    } catch (err) {
        console.error('Erreur lors de la suppression de la tontine:', err);
        res.status(500).json({ 
            success: false,
            error: 'Erreur lors de la suppression de la tontine' 
        });
    }
});

// PARTICIPANTS ROUTES (example for future expansion)
// Get participants for a tontine
app.get('/tontines/:id/participants', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            'SELECT p.*, u.name as user_name, u.email FROM participants p JOIN users u ON p.user_id = u.id WHERE p.tontine_id = ?',
            [id]
        );
        
        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des participants:', err);
        res.status(500).json({ 
            success: false,
            error: 'Erreur lors de la récupération des participants' 
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Endpoint non trouvé',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Erreur globale:', err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Erreur interne du serveur',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Arrêt gracieux du serveur...');
    try {
        await pool.end();
        console.log('Connexions base de données fermées');
        process.exit(0);
    } catch (err) {
        console.error('Erreur lors de l\'arrêt:', err);
        process.exit(1);
    }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(` Serveur backend démarré sur http://localhost:${PORT}`);
    console.log(` Environnement: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
