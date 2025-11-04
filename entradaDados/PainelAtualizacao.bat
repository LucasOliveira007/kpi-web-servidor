@echo off
title Painel Git - Suelen
color 0B

set "repoPath=C:\Users\GMF\Meu Drive\Kpi_Web_Atualizador"

REM Verifica se o caminho existe
if not exist "%repoPath%" (
    echo.
    echo ❌ Caminho "%repoPath%" não encontrado!
    echo Verifique se o Google Drive está sincronizado corretamente.
    goto fim
)

cd /d "%repoPath%"
git config --global --add safe.directory "%repoPath%"

:menu
cls
echo 📊 Painel Git - Suelen
echo.
echo 1 - 🔄 Sincronizar repositório
echo 2 - 🚀 Enviar entradaDados para o GitHub
echo.
set /p choice=Escolha uma opção (1 ou 2): 

if "%choice%"=="1" (
    echo.
    echo 🔄 Sincronizando repositório com o GitHub...
    git pull origin main --allow-unrelated-histories
    echo.
    echo ✅ Repositório sincronizado com sucesso!
    goto fim
)

if "%choice%"=="2" (
    echo.
    echo 🚀 Enviando pasta entradaDados para o GitHub...
    git pull origin main --allow-unrelated-histories
    git add entradaDados
    git commit -m "Atualização da pasta entradaDados via .bat"
    git push origin main
    echo.
    echo ✅ Pasta entradaDados enviada com sucesso!
    goto fim
)

echo.
echo ❌ Opção inválida. Execute novamente e escolha 1 ou 2.
goto fim

:fim
echo.
pause
