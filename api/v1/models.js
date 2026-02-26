export default async function handler(req, res) {
    try {
        const response = await fetch('https://dr7.ai/api/v1/models', {
            headers: {
                'Authorization': req.headers.authorization || 'Bearer sk-dr7-your-api-key',
                'Content-Type': 'application/json'
            }
        });

        const contentType = response.headers.get('content-type') || '';

        if (response.ok && contentType.includes('application/json')) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            res.status(response.status).json({
                error: 'Failed to fetch models from Dr7.ai',
                status: response.status
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Proxy request to Dr7.ai failed',
            message: error.message
        });
    }
}
