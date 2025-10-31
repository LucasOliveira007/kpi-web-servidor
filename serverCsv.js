const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const chokidar = require('chokidar');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Caminho da pasta onde os arquivos permanecem
const pastaEntrada = 'F:\\Meus Arquivos Para WEB\\Projeto Kpi GMF\\Kpi Web Servidor Fisico\\entradaDados';

// Caminhos dos arquivos diretamente na pasta de entrada
const filePathCsv = path.join(pastaEntrada, 'dados_kpi.csv');
const filePathXls = path.join(pastaEntrada, 'usuarios.xls');

// Apenas loga os arquivos detectados (sem mover ou copiar)
function atualizarArquivosLocais() {
  const arquivos = fs.readdirSync(pastaEntrada);
  for (const nome of arquivos) {
    if (nome.endsWith('.csv')) {
      console.log(`✅ CSV detectado: ${nome}`);
    } else if (nome.endsWith('.xls') || nome.endsWith('.xlsx')) {
      console.log(`✅ XLS detectado: ${nome}`);
    }
  }
}

// Monitorar a pasta de entrada para log de novos arquivos
chokidar.watch(pastaEntrada, { ignoreInitial: false })
  .on('add', (filePath) => {
    console.log(`📥 Novo arquivo detectado: ${filePath}`);
    atualizarArquivosLocais();
  });

// Rota de autenticação
app.post('/login', (req, res) => {
  const { codigo, senha } = req.body;

  try {
    const workbook = xlsx.readFile(filePathXls);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const usuario = data.find(
      (u) => u.CODIGO == codigo && u.SENHA == senha
    );

    if (usuario) {
      res.json({ sucesso: true, nome: usuario.NOME });
    } else {
      res.status(401).json({ sucesso: false, mensagem: 'Código ou senha inválidos' });
    }
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao ler o arquivo de usuários' });
  }
});

// Rota de dados
app.get('/dados', async (req, res) => {
  const { data, vendedor } = req.query;
  const resultados = [];

  try {
    fs.createReadStream(filePathCsv)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        if (row.DTBASE?.trim() === data.trim() && row.CODUSUR?.trim() === vendedor.trim()) {
          resultados.push(row);
        }
      })
      .on('end', () => {
        const dataArquivo = fs.statSync(filePathCsv).mtime.toISOString();
        res.json({ dados: resultados, dataArquivo });
      });
  } catch (err) {
    console.error('Erro na leitura do CSV:', err.message);
    res.status(500).json({ mensagem: 'Erro ao processar o arquivo CSV' });
  }
});

// Rota para obter as datas únicas disponíveis no CSV
app.get('/datas', (req, res) => {
  const { vendedor } = req.query;
  const datas = new Set();

  fs.createReadStream(filePathCsv)
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
      const dataAtual = row.DTBASE?.trim();
      const vendedorAtual = row.CODUSUR?.trim();

      if (dataAtual && vendedorAtual === vendedor.trim()) {
        datas.add(dataAtual);
      }
    })
    .on('end', () => {
      res.json(Array.from(datas));
    })
    .on('error', (err) => {
      console.error('Erro ao ler datas do CSV:', err.message);
      res.status(500).json({ mensagem: 'Erro ao ler datas do CSV' });
    });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});