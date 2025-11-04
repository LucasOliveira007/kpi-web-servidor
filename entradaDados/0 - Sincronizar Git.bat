@echo off
echo 🔄 Sincronizando repositório local com o GitHub...

cd /d "K:\Kpi_Web_Atualizador"
git pull origin main --allow-unrelated-histories

echo ✅ Repositório sincronizado com sucesso!
pause

