import express from 'express';
import { applyApi } from './engine';
import { userApi } from './examples/users';

const app = express();
app.use(express.json());

// Apply our API definitions
applyApi(app, userApi);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 