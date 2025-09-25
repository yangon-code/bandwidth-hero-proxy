const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// --- فحص صحي ذكي ---
// هذا الجزء يرد على الطلبات الفارغة برسالة "أنا حي"
app.get('/', (req, res, next) => {
    // إذا كان الطلب لا يحتوي على رابط صورة، أرسل رسالة نجاح
    if (!req.query.url) {
        res.status(200).send('Bandwidth Hero Proxy is alive and running!');
        return; // توقف هنا ولا تكمل إلى البروكسي
    }
    // إذا كان هناك رابط صورة، اسمح للطلب بالمرور إلى البروكسي
    next();
});


// --- البروكسي الرئيسي ---
// هذا الجزء لن يعمل إلا إذا كان هناك رابط صورة في الطلب
app.use('/', createProxyMiddleware({
    target: 'https://images.weserv.nl',
    changeOrigin: true,
    pathRewrite: (path, req) => {
        return path;
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.removeHeader('x-forwarded-for');
        proxyReq.removeHeader('x-forwarded-host');
        proxyReq.removeHeader('x-forwarded-proto');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Smart Proxy with Health Check is running on port ${port}`);
});
