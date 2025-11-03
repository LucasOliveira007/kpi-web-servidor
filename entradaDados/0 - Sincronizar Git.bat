@echo off
echo 🔄 Sincronizando repositório local com o GitHub...

cd /d "C:\Users\GMF\3D Objects\Kpi_Web_Atualizador"

git pull origin main --allow-unrelated-histories

echo ✅ Repositório sincronizado com sucesso!
pause
