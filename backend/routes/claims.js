const express = require('express');
const router = express.Router();
const multer = require('multer');
const Claim = require('../models/Claim');
const auth = require('../middleware/auth');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });


router.post('/', auth, upload.single('document'), async (req, res) => {
  try {
   
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { name, email, claimAmount, description } = req.body;
    const document = req.file ? req.file.path : null;
    const claim = new Claim({ name, email, claimAmount, description, document });
    await claim.save();
    res.status(201).json(claim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', auth, async (req, res) => {
  try {
    // Insurers can see all claims; patients see only their own (filter by email)
    const filters = {};
    if (req.user.role === 'patient') {
      filters.email = req.user.email;
    } else if (req.user.role === 'insurer') {
      // Apply query parameters for filtering
      if (req.query.status) filters.status = req.query.status;
      if (req.query.claimAmount) filters.claimAmount = req.query.claimAmount;
      if (req.query.startDate || req.query.endDate) {
        filters.submissionDate = {};
        if (req.query.startDate) filters.submissionDate.$gte = new Date(req.query.startDate);
        if (req.query.endDate) filters.submissionDate.$lte = new Date(req.query.endDate);
      }
    }
    const claims = await Claim.find(filters).sort({ submissionDate: -1 });
    res.json(claims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    // Only insurers can update claims
    if (req.user.role !== 'insurer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { status, approvedAmount, insurerComments } = req.body;
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    claim.status = status || claim.status;
    claim.approvedAmount = approvedAmount || claim.approvedAmount;
    claim.insurerComments = insurerComments || claim.insurerComments;
    await claim.save();
    res.json(claim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    // If the user is a patient, ensure they can only view their own claim
    if (req.user.role === 'patient' && claim.email !== req.user.email) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(claim);
  } catch (err) {
    console.error("Error in GET /api/claims/:id", err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
