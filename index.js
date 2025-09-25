const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// --- فحص صحي خادع ومثالي ---
// هذا الجزء يرد على الطلبات الفارغة بنفس رسالة البروكسي الرسمي
app.get('/', (req, res, next) => {
    if (!req.query.url) {
        // هذه هي الرسالة الدقيقة التي تتوقعها الإضافة
        res.status(200).send('Bandwidth-Hero Compressor'); 
        return;
    }
    next();
});


// --- البروكسي الرئيسي ---
app.use('/', createProxyMiddleware({
    target: 'https://images.weserv.nl',
    changeOrigin: true,
    pathRewrite: (path, req) => path,
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.removeHeader('x-forwarded-for');
        proxyReq.removeHeader('x-forwarded-host');
        proxyReq.removeHeader('x-forwarded-proto');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Perfect Deceiver Proxy is running on port ${port}`);
});
