export async function sessionMiddleware(req, res, next) {
    const cookieHeader = req.headers.cookie;
    const isAjax = req.headers.accept === '*/*';

    // validate refresh and access tokens here with redis, or something similar

    if (isAjax) {
        res.status(statusCode).send(errorMsg);
    } else {
        res.send(buildEntryHTML(1)); // 1 in client means to show Login page
    }
}

function buildEntryHTML(data) {
    return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VanillaCore</title>
    <link rel="stylesheet" href="/public/css/style.css">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <style>
        /* CSS stays in head for instant paint */
        #vanilla-loader {
            position: fixed;
            inset: 0;
            background-color: #0f172a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(59, 130, 246, 0.2);
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        .text {
            margin-top: 20px;
            color: #94a3b8;
            font-size: 14px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>

<body>
    <div id="session">${data}</div>
    <div id="vanilla-loader">
        <div class="spinner"></div>
        <div class="text">Loading VanillaCore</div>
    </div>
    
    <script type="module" src="/public/js/vanilla-core/vanilla-events.js"></script>
</body>
`
}