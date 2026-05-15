import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { signToken, verifyToken } from '../utils/jwt.js';
import { publishEvent } from '../utils/producer.js';
import { getCache, setCache } from '../utils/cache.js';

// Registration logic
// 1. Check if user exists
// 2. Hash password
// 3. Create user in DB
// 4. Emit USER_CREATED event to Kafka
// 5. Return token
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'fail', message: 'User already exists' });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in Neon PostgreSQL via Prisma
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // --- EVENT DRIVEN ARCHITECTURE ---
    // Emit 'USER_CREATED' event so other services (e.g., Profile, Welcome Email)
    // can react to this action asynchronously.
    await publishEvent('USER_CREATED', {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    });

    // Generate token
    const token = signToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: { id: newUser.id, email: newUser.email, name: newUser.name } }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Login logic
// 1. Check if user exists and password is correct
// 2. Return token
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // Verify credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get current user (with Caching Strategy)
// 1. Verify token
// 2. Check Redis for cached user profile
// 3. If found, return instantly (Cache Hit)
// 4. If not found, query Prisma/Neon (Cache Miss)
// 5. Store in Redis for future hits
export const getMe = async (req, res) => {
  try {
    // Extract token from Bearer header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'You are not logged in' });
    }

    // Verify token to get userId
    const decoded = verifyToken(token);
    const userId = decoded.id;

    // --- CACHING STRATEGY ---
    // First, try to fetch the profile from Redis
    const cacheKey = `user:${userId}:profile`;
    const cachedUser = await getCache(cacheKey);

    if (cachedUser) {
        console.log('✅ CACHE HIT: User profile fetched from Redis');
        return res.status(200).json({
            status: 'success',
            fromCache: true,
            data: { user: cachedUser }
        });
    }

    // --- CACHE MISS ---
    console.log('❌ CACHE MISS: Querying Neon PostgreSQL...');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });

    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Update Redis with a TTL of 1 hour (3600s)
    await setCache(cacheKey, user, 3600);

    res.status(200).json({
      status: 'success',
      fromCache: false,
      data: { user }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


