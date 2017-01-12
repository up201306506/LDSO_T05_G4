@echo off
echo.

CALL npm -v > NUL 2>&1
IF %ERRORLEVEL% NEQ 0 GOTO error_message_npm

CALL npm install
GOTO success

:error_message_npm
echo No version of npm was found installed in this system's PATH.
echo npm stands for Node Package Manager and is responsible for fetching and updating a node project's dependency libraries.
echo npm should come bundled with Node on https://nodejs.org/en/
echo Please resolve this issue and try again, or alternatively call the procedure 'npm install' manually
PAUSE
GOTO end

:success
echo The project's dependencies were succesfully retrieved.
PAUSE

:end