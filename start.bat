@echo off
echo Starting the Curio-Vault Local Server...
echo Make sure you have NodeJS installed.
echo Press Ctrl+C in this window at any time to stop the server.

:: Generate config.js from .env for the browser
echo // Auto-generated from .env > config.js
echo window.ENV = {}; >> config.js
if exist .env (
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        if not "%%A"=="" if not "%%A"==" " if not "%%B"=="" (
            echo window.ENV["%%A"] = "%%B"; >> config.js
        )
    )
)

:: Automatically run npx http-server without caching, on port 8081, with CORS enabled
npx http-server -p 8081 -c-1 --cors

pause
