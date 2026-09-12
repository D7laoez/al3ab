@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Markaz Al Sayara - Local Dev
color 0A

echo.
echo ==============================================
echo   مركز السيارة - تشغيل محلي
 echo ==============================================
echo.

where git >nul 2>&1
if errorlevel 1 goto NO_GIT
where node >nul 2>&1
if errorlevel 1 goto NO_NODE

if not exist .git (
  echo تنزيل المشروع من GitHub...
  git clone https://github.com/D7laoez/al3ab.git .
  if errorlevel 1 goto CLONE_FAIL
)

echo تحديث المشروع...
git pull --ff-only origin main
if errorlevel 1 echo تحذير: تعذر التحديث، سيتم تشغيل النسخة الحالية.

echo.
echo فحص JavaScript...
node --check app.js
if errorlevel 1 goto APP_FAIL
if exist admin.js node --check admin.js
if errorlevel 1 goto ADMIN_FAIL

echo.
echo تشغيل الموقع على http://localhost:3000 ...
start "Markaz Al Sayara Server" cmd /k "cd /d "%~dp0" && npx --yes serve . -l 3000"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"

echo.
echo ==============================================
echo الموقع يعمل الآن.
echo أي تعديل جديد على GitHub: شغّل UPDATE.bat
 echo ==============================================
echo.
pause
exit /b 0

:NO_GIT
echo [ERROR] Git غير مثبت.
echo ثبّت Git for Windows ثم شغل START.bat مرة ثانية.
goto END
:NO_NODE
echo [ERROR] Node.js غير مثبت.
echo ثبّت Node.js 20+ ثم شغل START.bat مرة ثانية.
goto END
:CLONE_FAIL
echo [ERROR] فشل تنزيل المشروع من GitHub.
goto END
:APP_FAIL
echo [ERROR] app.js يحتوي خطأ JavaScript.
goto END
:ADMIN_FAIL
echo [ERROR] admin.js يحتوي خطأ JavaScript.
goto END
:END
echo.
pause
endlocal
