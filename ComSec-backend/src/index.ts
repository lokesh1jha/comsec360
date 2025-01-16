import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;


// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
