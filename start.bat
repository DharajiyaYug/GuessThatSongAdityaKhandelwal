@echo off
cd /d "%~dp0"
title Guess That Song - local server (close to stop)
python -c "import sys" >nul 2>&1
if %errorlevel%==0 ( python server.py & goto :eof )
py -3 server.py
