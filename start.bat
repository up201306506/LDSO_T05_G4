@echo off
echo.

node -v > NUL 2>&1
IF %ERRORLEVEL% NEQ 0 GOTO message

:loopstart

echo Now running. Access node locally on http://localhost:3000
node bin/www
timeout 3
GOTO loopstart

:message
echo No version of Node was found installed in this system's PATH.
echo Node.js is this project's Network Application framework. AS such, this system must have Node installed to run this script.
echo Website: https://nodejs.org/en/
echo.
PAUSE

:end