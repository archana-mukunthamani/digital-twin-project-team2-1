@echo off
REM Digital Twin Setup - Quick Start Script
REM Windows PowerShell setup for vector database and RAG system

echo.
echo ================================================
echo Digital Twin - Vector Database Setup
echo ================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

REM Verify setup
echo.
echo Verifying setup...
python verify_setup.py

if errorlevel 1 (
    echo Setup verification failed. Check errors above.
    pause
    exit /b 1
)

REM Embed data
echo.
echo ================================================
echo Loading profile data into vector database...
echo ================================================
echo.
python embed_digitaltwin.py

if errorlevel 1 (
    echo Error: Failed to embed data
    pause
    exit /b 1
)

REM Success message
echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo Your Digital Twin is ready. You can now:
echo.
echo 1. Test RAG interactively:
echo    python digital_twin_rag.py
echo.
echo 2. Integrate with VS Code:
echo    Check digital-twin-project-team2/agents.md
echo.
echo 3. Deploy to production:
echo    See docs/ for deployment guide
echo.
pause
