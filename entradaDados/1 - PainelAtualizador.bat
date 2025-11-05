@echo off
title Painel Git - Compartilhado
color 0B

REM Detecta o usuário atual
set "user=%USERNAME%"

REM Define o caminho do repositório conforme o usuário
if "%user%"=="Lucas" (
    set "repoPath=C:\Users\GMF\Meu Drive\Kpi_Web_Atualizador"
) else if "%user%"=="Suelen" (
    set "repoPath=C:\Users\Suelen\Meu Drive\KpiWeb"
) else (
    echo ? Usuário não reconhecido: %user%
    echo Adicione o caminho correspondente no script.
    goto fim
)

REM Verifica se o caminho existe
if not exist "%repoPath%" (
    echo.
    echo ? Caminho "%repoPath%" não encontrado!
    echo Verifique se o Google Drive está sincronizado corretamente.
    goto fim
)

cd /d "%repoPath%"
git config --global --add safe.directory "%repoPath%"

REM Verifica se é um repositório Git
if not exist "%repoPath%\.git" (
    echo.
    echo ? Esta pasta não é um repositório Git.
    echo Execute 'git init' e conecte ao GitHub antes de usar este painel.
    goto fim
)

:menu
cls
echo Painel Git - %user%
echo.
echo 1 - Sincronizar repositório
echo 2 - Enviar entradaDados para o GitHub
echo.
set /p choice=Escolha uma opção (1 ou 2): 

if "%choice%"=="1" (
    echo.
    echo Sincronizando repositório com o GitHub...
    git pull origin main --allow-unrelated-histories
    echo.
    echo Repositório sincronizado com sucesso!
    goto fim
)

if "%choice%"=="2" (
    echo.
    echo Enviando pasta entradaDados para o GitHub...
    git pull origin main --allow-unrelated-histories
    git add entradaDados
    git commit -m "Atualização da pasta entradaDados via .bat (%user%)"
    git push origin main
    echo.
    echo Pasta entradaDados enviada com sucesso!
    goto fim
)

echo.
echo Opção inválida. Execute novamente e escolha 1 ou 2.

:fim
echo.
pause
