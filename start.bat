@echo off
echo Starting the Curio-Vault Local Server...
echo Make sure you have NodeJS installed.
echo Press Ctrl+C in this window at any time to stop the server.

:: Automatically run npx http-server without caching, on port 8081, with CORS enabled
npx http-server -p 8081 -c-1 --cors

pause
