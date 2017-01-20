@echo off
echo.

cd /D %HOMEDRIVE%%HOMEPATH%
mongod --version > NUL 2>&1
IF %ERRORLEVEL% NEQ 0 GOTO message

:loopstart

echo Now running.
mongod
timeout 3
GOTO loopstart

:message
echo No version of MongoDB was found installed in this system's PATH.
echo MongoDB is the database application service used for this project's data storage.
echo This script is not absolutely necessary, if an external DB is defined in config/dbURL.js
echo Website: https://www.mongodb.com/download-center
echo.
PAUSE

:end