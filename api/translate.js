// api/translate.js (Vercel无服务器函数)
export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { apiKey, username, inputs } = req.body;

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
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return res.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            error: 'Translation failed', 
            message: error.message 
        });
    }
}

/*
部署步骤：
1. 在GitHub创建新仓库
2. 创建以下文件结构：
   ├── index.html (翻译页面)
   ├── api/
   │   └── translate.js (这个文件)
   └── vercel.json (配置文件)
3. 连接到 Vercel.com 并部署
4. 获得类似 https://your-app.vercel.app 的域名
*/
