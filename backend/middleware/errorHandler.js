/**
 * This middleware cathches errors passed down the middleware chain
 * and sends a formatted JSON response to the client.
 */

export function errorHandler(err, req, res, next) {
    console.error(err);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({ error: message });
}