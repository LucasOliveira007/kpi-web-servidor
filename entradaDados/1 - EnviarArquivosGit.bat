@echo off
echo 🔄 Enviando pasta entradaDados para o GitHub...

cd /d "C:\Users\GMF\3D Objects\Kpi_Web_Atualizador"

git add entradaDados
git commit -m "Atualizado via .bat"
git push origin main

echo ✅ Pasta entradaDados enviada com sucesso!
pause
