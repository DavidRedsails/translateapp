// proxy-server.js
const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 3001;

// 启用CORS
app.use(cors());
app.use(express.json());

// 代理翻译API
app.post('/api/translate', async (req, res) => {
    try {
        const { apiKey, username, inputs } = req.body;
        
        // 使用原生fetch或者import动态导入
        const fetch = (await import('node-fetch')).default;
        
        const response = await fetch('https://ai-console-pre.spendia.jp/v1/workflows/run', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: inputs,
                response_mode: 'blocking',
                user: username
            }),
            // 添加超时和SSL配置
            timeout: 180000, // 180秒超时
            agent: new https.Agent({
                rejectUnauthorized: false // 仅用于测试环境
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('代理请求失败:', error);
        res.status(500).json({ 
            error: '代理请求失败', 
            message: error.message 
        });
    }
});

// 静态文件服务（可选）
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`代理服务器运行在 http://localhost:${PORT}`);
    console.log('请将翻译页面的API请求改为: http://localhost:3001/api/translate');
});

/* 
使用说明：
1. 安装依赖: npm install express cors node-fetch@2
2. 运行服务器: node proxy-server.js
3. 修改翻译页面中的useProxy为true

注意：
- 现在使用HTTPS协议连接API
- 添加了180秒超时
- 在测试环境中关闭了SSL验证
*/