@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title مركز السيارة - Live Development
set "REPO_URL=https://github.com/D7laoez/al3ab.git"
set "PROJECT_DIR=%USERPROFILE%\Desktop\markaz-al-sayara"
where git >nul 2>&1
if errorlevel 1 goto NO_GIT
where node >nul 2>&1
if errorlevel 1 goto NO_NODE
if not exist "%PROJECT_DIR%\.git" goto CLONE
:UPDATE
pushd "%PROJECT_DIR%"
git pull --rebase --autostash origin main
if errorlevel 1 echo [WARNING] تعذر التحديث من GitHub، سأشغل النسخة المحلية.
popd
goto START
:CLONE
echo [1/4] تنزيل المشروع من GitHub...
if exist "%PROJECT_DIR%" rmdir /s /q "%PROJECT_DIR%"
git clone "%REPO_URL%" "%PROJECT_DIR%"
if errorlevel 1 goto CLONE_FAIL
:START
pushd "%PROJECT_DIR%"
echo [2/4] فحص JavaScript...
node --check app.js
if errorlevel 1 goto JS_FAIL
if exist admin.js node --check admin.js
if errorlevel 1 goto JS_FAIL
echo [3/4] تشغيل الموقع على http://localhost:3000 ...
start "مركز السيارة - Local Server" cmd /k "cd /d "%PROJECT_DIR%" && npx --yes serve . -l 3000"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"
echo [4/4] تشغيل المزامنة التلقائية من GitHub...
echo كل Commit جديد على main سيتم سحبه تلقائياً كل 3 ثواني.
powershell -NoProfile -ExecutionPolicy Bypass -File "%PROJECT_DIR%\scripts\dev-watch.ps1"
popd
exit /b 0
:NO_GIT
echo [ERROR] Git for Windows غير مثبت.
echo نزله من https://git-scm.com/download/win ثم أعد التشغيل.
pause
exit /b 1
:NO_NODE
echo [ERROR] Node.js غير مثبت.
echo نزله من https://nodejs.org/ ثم أعد التشغيل.
pause
exit /b 1
:CLONE_FAIL
echo [ERROR] فشل تنزيل المشروع من GitHub.
pause
exit /b 1
:JS_FAIL
echo [ERROR] يوجد خطأ في JavaScript. راجع الرسالة أعلاه.
pause
popd
exit /b 1
