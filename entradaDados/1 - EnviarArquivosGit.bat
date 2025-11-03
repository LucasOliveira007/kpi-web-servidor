@echo off
echo 🔄 Enviando pasta entradaDados para o GitHub...

cd /d "C:\Users\GMF\3D Objects\Kpi_Web_Atualizador"

git pull origin main --allow-unrelated-histories
git add entradaDados
git commit -m "Atualização da pasta entradaDados via .bat"
git push origin main

echo ✅ Pasta entradaDados enviada com sucesso!
pause
