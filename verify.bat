@echo off
echo Verifying Prayer Time Website Setup...

REM Define project directories and files
set PROJECT_DIR=%cd%
set KOTA_JSON=%PROJECT_DIR%\kota.json
set ADZAN_DIR=%PROJECT_DIR%\adzan
set DEFAULT_CITY=pontianak
set YEAR=2024
set MONTH=12
set PRAYER_JSON=%ADZAN_DIR%\%DEFAULT_CITY%\%YEAR%\%MONTH%.json

REM Check kota.json
if exist "%KOTA_JSON%" (
    echo [OK] Found kota.json
) else (
    echo [ERROR] kota.json is missing in %PROJECT_DIR%
)

REM Check adzan directory
if exist "%ADZAN_DIR%" (
    echo [OK] Found adzan directory
) else (
    echo [ERROR] adzan directory is missing in %PROJECT_DIR%
)

REM Check default city directory
if exist "%ADZAN_DIR%\%DEFAULT_CITY%" (
    echo [OK] Found directory for city: %DEFAULT_CITY%
) else (
    echo [ERROR] Directory for city '%DEFAULT_CITY%' is missing in adzan
)

REM Check year directory
if exist "%ADZAN_DIR%\%DEFAULT_CITY%\%YEAR%" (
    echo [OK] Found year directory: %YEAR%
) else (
    echo [ERROR] Year directory '%YEAR%' is missing in %DEFAULT_CITY%
)

REM Check prayer time JSON
if exist "%PRAYER_JSON%" (
    echo [OK] Found prayer times file: %MONTH%.json
) else (
    echo [ERROR] Prayer times file '%MONTH%.json' is missing in %DEFAULT_CITY%\%YEAR%
)

REM Check other essential files
set INDEX_HTML=%PROJECT_DIR%\index.html
set STYLE_CSS=%PROJECT_DIR%\style.css
set SCRIPT_JS=%PROJECT_DIR%\script.js

if exist "%INDEX_HTML%" (
    echo [OK] Found index.html
) else (
    echo [ERROR] index.html is missing in %PROJECT_DIR%
)

if exist "%STYLE_CSS%" (
    echo [OK] Found style.css
) else (
    echo [ERROR] style.css is missing in %PROJECT_DIR%
)

if exist "%SCRIPT_JS%" (
    echo [OK] Found script.js
) else (
    echo [ERROR] script.js is missing in %PROJECT_DIR%
)

echo Verification Complete.
pause