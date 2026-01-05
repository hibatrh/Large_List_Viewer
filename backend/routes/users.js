const express = require('express');
const router = express.Router();
const fileReader = require('../utils/fileReader');
const alphabetIndex = require('../utils/alphabetIndex');
const path = require('path');
const fs = require('fs');

const USERS_FILE = path.join(__dirname, '../data/users.txt');

// Cache for total count
let totalCountCache = null;

// GET /api/users/count
router.get('/count', async (req, res) => {
  try {
    if (totalCountCache === null) {
      totalCountCache = await fileReader.countLines(USERS_FILE);
    }
    res.json({ total: totalCountCache });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users?page=1&limit=500
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 500;
    const offset = (page - 1) * limit;

    const users = await fileReader.readLines(USERS_FILE, offset, limit);
    
    // Get total count
    if (totalCountCache === null) {
      totalCountCache = await fileReader.countLines(USERS_FILE);
    }
    
    res.json({
      data: users,
      page,
      limit,
      total: totalCountCache,
      hasMore: offset + users.length < totalCountCache
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/index
router.get('/index', async (req, res) => {
  try {
    const index = await alphabetIndex.getIndex(USERS_FILE);
    res.json(index);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/letter/:letter
router.get('/letter/:letter', async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const limit = parseInt(req.query.limit) || 500;
    
    const index = await alphabetIndex.getIndex(USERS_FILE);
    const position = index[letter];
    
    if (position === undefined) {
      return res.status(404).json({ error: 'Letter not found' });
    }
    
    const users = await fileReader.readLines(USERS_FILE, position, limit);
    
    res.json({
      data: users,
      letter,
      startPosition: position
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;