import jwt from 'jsonwebtoken';

// This utility function signs a new JWT token
// We use the USER_ID as the payload and a secret key stored in .env
// In a microservices environment, the JWT_SECRET must be shared or accessible 
// by the API Gateway or other services to verify the token's authenticity.
export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// This function verifies the token integrity
// If the token is tampered with or expired, it throws an error.
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
