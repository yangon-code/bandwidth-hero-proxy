const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// هذا هو البروكسي الذكي
app.use('/', createProxyMiddleware({
    target: 'https://images.weserv.nl',  // الهدف الصحيح
    changeOrigin: true,
    pathRewrite: (path, req) => {
        // هذا الجزء يأخذ الرابط الأصلي من بعد علامة الاستفهام ويعيد بناءه لـ weserv.nl
        // مثال: /?url=google.com/logo.png&q=70  ->  /?url=google.com/logo.png&q=70
        return path;
    },
    onProxyReq: (proxyReq, req, res) => {
        // نزيل بعض الهيدرز التي قد تسبب مشاكل
        proxyReq.removeHeader('x-forwarded-for');
        proxyReq.removeHeader('x-forwarded-host');
        proxyReq.removeHeader('x-forwarded-proto');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Smart Proxy is running on port ${port}`);
});
