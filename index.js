const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore();
const shoesCollection = db.collection('Shoes');

/**
 * Cloud Function to access the Shoes collection.
 * Handles CORS and supports fetching a single shoe by ID or all shoes.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */
exports.accessShoesCollection = async (req, res) => {
    // Handle CORS
    res.set('Access-Control-Allow-Origin', '*'); // Adjust this to restrict access to specific domains
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).send(''); // Preflight request response
    }

    res.set('Content-Type', 'application/json');

    try {
        if (req.query.id) {
            // Validate and trim ID
            const id = req.query.id.trim();
            if (!id) {
                return res.status(400).json({ error: 'Invalid ID provided' });
            }

            // Fetch specific shoe document
            const doc = await shoesCollection.doc(id).get();

            if (!doc.exists) {
                return res.status(404).json({ error: 'Shoe not found' });
            }

            return res.status(200).json({ id: doc.id, ...doc.data() });
        } 
        
        else {
            return res.status(200).send('SoleCheck Server');
        }
        
    } catch (error) {
        console.error('Error accessing shoes collection:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
