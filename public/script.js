document.addEventListener('DOMContentLoaded', async () => {
    const dataFiltro = document.getElementById('dataFiltro');
    const gerarRelatorioButton = document.getElementById('gerarRelatorio');
    const tabelaResultados = document.getElementById('tabelaResultados');
    const tabelaResultados2 = document.getElementById('tabelaResultados2');
    const tabelaResultados3 = document.getElementById('tabelaResultados3');
    const infoUsuario = document.getElementById('infoUsuarioLogado');
    const dataArquivoSpan = document.getElementById('dataArquivo');

    const nome = localStorage.getItem('usuarioLogadoNome');
    const codigo = localStorage.getItem('usuarioLogadoCodigo');

    if (!codigo || !nome) {
        alert("Usuário não autenticado. Faça login novamente.");
        window.location.replace('login.html');
        return;
    }

    if (infoUsuario) {
        infoUsuario.textContent = `VENDEDOR(a): ${codigo} - ${nome}`;
    }

    try {
        const response = await fetch(`https://kpi-web-servidor.onrender.com/datas?vendedor=${codigo}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar as datas.");
        }
        const datas = await response.json();
        datas.forEach(data => {
            if (data) {
                const option = document.createElement('option');
                option.value = data;
                option.textContent = data;
                dataFiltro.appendChild(option);
            }
        });
    } catch (error) {
        console.error("Erro ao carregar as datas:", error);
        alert("Não foi possível carregar as datas.");
    }

    function formatarMoeda(valor) {
        if (!valor) return '-';
        const valorNumerico = parseFloat(valor.replace(',', '.'));
        return isNaN(valorNumerico)
            ? '-'
            : valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    gerarRelatorioButton.addEventListener('click', async () => {
        const dataSelecionada = dataFiltro.value;
        if (!dataSelecionada) {
            alert("Por favor, selecione uma data!");
            return;
        }

        try {
            const resposta = await fetch(`https://kpi-web-servidor.onrender.com/dados?data=${dataSelecionada}&vendedor=${codigo}`);
            if (!resposta.ok) {
                throw new Error("Erro na resposta da API.");
            }

            const resultado = await resposta.json();
            const dadosTabela1 = resultado.dados || [];
            const dataArquivo = resultado.dataArquivo;

            // Formatar a data de modificação do arquivo
            const dataMod = new Date(dataArquivo);
            const dataArquivoFormatada = dataMod.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            dataArquivoSpan.textContent = `Dados atualizados em: ${dataArquivoFormatada}`;

            // Limpar as tabelas antes de preencher
            tabelaResultados.innerHTML = "";
            tabelaResultados2.innerHTML = "";
            tabelaResultados3.innerHTML = "";

            if (!Array.isArray(dadosTabela1) || dadosTabela1.length === 0) {
                alert("Nenhum registro encontrado para essa data ou vendedor (tabela 1).");
            } else {
                // Ordena por maior VLVENDLIQ
                dadosTabela1.sort((a, b) => {
                    const valorA = parseFloat(a.VLVENDLIQ?.replace(',', '.') || 0);
                    const valorB = parseFloat(b.VLVENDLIQ?.replace(',', '.') || 0);
                    return valorB - valorA;
                });

                // Monta a tabela já ordenada
                dadosTabela1.forEach(dado => {
                    const row = document.createElement('tr');

                    // Formatação condicional de percentuais
                    const percClipos = parseFloat(dado.PERCCLIPOS.replace(',', '.')).toFixed(2);
                    const percCliposColor = percClipos >= 100 ? 'blue' : 'red';

                    const percVena = parseFloat(dado.PERCVENA.replace(',', '.')).toFixed(2);
                    const percVenaColor = percVena >= 100 ? 'blue' : 'red';

                    const percQtdVenda = parseFloat(dado.PERCQTDVENDA.replace(',', '.')).toFixed(2);
                    const percQtdVendaColor = percQtdVenda >= 100 ? 'blue' : 'red';



           row.innerHTML = `
            <td>${dado.CODMARCA}</td>
            <td>${dado.MARCA}</td>
            <td style="text-align: center; vertical-align: middle;">${dado.QTCLIMETA}</td>
            <td style="text-align: center; vertical-align: middle;">${dado.QTCLIPOS}</td>
            <td style="color:${percCliposColor}">${percClipos}%</td>
            <td>${formatarMoeda(dado.VLMETA)}</td>
            <td>${formatarMoeda(dado.VLVENDLIQ)}</td>
            <td style="color:${percVenaColor}">${percVena}%</td>
            <td style="text-align: center; vertical-align: middle;">${dado.QTDVENDAMETA}</td>
            <td style="text-align: center; vertical-align: middle;">${dado.QTDVENDA}</td>
            <td style="color:${percQtdVendaColor}">${percQtdVenda}%</td>
            <td>${formatarMoeda(dado.VLPREMIO_CLIPOS)}</td>
            <td>${formatarMoeda(dado.VLPREMIO_VENDA)}</td>
           <td>${formatarMoeda(dado.VLPREMIO_QTDVENDA)}</td>
            `;
                    tabelaResultados.appendChild(row);
                });

                // Totais da Tabela 1 (MARCAS)
                let totalQTCLIMETA = 0;
                let totalQTCLIPOS = 0;
                let totalVLMETA = 0;
                let totalVLVENDLIQ = 0;
                let totalQTDVENDAMETA = 0;
                let totalQTDVENDA = 0;
                let totalVLPREMIO_CLIPOS = 0;
                let totalVLPREMIO_VENDA = 0;
                let totalVLPREMIO_QTDVENDA = 0;

                dadosTabela1.forEach(dado => {
                    totalQTCLIMETA = ('---');
                    totalQTCLIPOS = ('---');
                    totalVLMETA += parseFloat((dado.VLMETA || '0').replace(',', '.'));
                    totalVLVENDLIQ += parseFloat((dado.VLVENDLIQ || '0').replace(',', '.'));
                    totalQTDVENDAMETA += parseFloat(dado.QTDVENDAMETA || 0);
                    totalQTDVENDA += parseFloat(dado.QTDVENDA || 0);
                    totalVLPREMIO_CLIPOS += parseFloat((dado.VLPREMIO_CLIPOS || '0').replace(',', '.'));
                    totalVLPREMIO_VENDA += parseFloat((dado.VLPREMIO_VENDA || '0').replace(',', '.'));
                    totalVLPREMIO_QTDVENDA += parseFloat((dado.VLPREMIO_QTDVENDA || '0').replace(',', '.'));
                });

                const totalRow = document.createElement('tr');
                totalRow.style.fontWeight = 'bold';
                totalRow.innerHTML = `
                    <td colspan="2">Totais: ${dadosTabela1.length} METAS </td>
                    <td>${totalQTCLIMETA}</td>
                    <td>${totalQTCLIPOS}</td>
                    <td>---</td>
                    <td>${formatarMoeda(totalVLMETA.toFixed(2))}</td>
                    <td>${formatarMoeda(totalVLVENDLIQ.toFixed(2))}</td>
                    <td>---</td>
                    <td>${totalQTDVENDAMETA}</td>
                    <td>${totalQTDVENDA}</td>
                    <td>---</td>
                    <td>${formatarMoeda(totalVLPREMIO_CLIPOS.toFixed(2))}</td>
                    <td>${formatarMoeda(totalVLPREMIO_VENDA.toFixed(2))}</td>
                    <td>${formatarMoeda(totalVLPREMIO_QTDVENDA.toFixed(2))}</td>
                    `;
                tabelaResultados.appendChild(totalRow);
            }

            // Tabela 2 (RESUMO DOS GANHOS)
            if (!Array.isArray(dadosTabela1) || dadosTabela1.length === 0) {
                alert("Nenhum registro encontrado para essa data ou vendedor (tabela 2).");
            } else {
                const d = dadosTabela1[0];

                const row1 = document.createElement('tr');
                row1.innerHTML = `
                    <td>${(d?.CABFATOR_VENDA || '0')}</td>
                    <td>Valor Venda Mês</td>
                    <td>${formatarMoeda(d?.CAB_VLMETA || '0')}</td>
                    <td>${formatarMoeda(d?.CAB_VLVENDA || '0')}</td>
                    <td>${formatarMoeda(d?.CAB_VLVENDAFAT || '0')}</td>
                    <td>${formatarMoeda(d?.CAB_VLDEV || '0')}</td>
                    <td>${formatarMoeda(d?.CAB_VLFATLIQ || '0')}</td>
                    <td>${parseFloat(d?.CAB_PERCVENDA?.replace(',', '.') || '0').toFixed(2)}%</td>
                    <td>${d?.BASE || ''}</td>
                    <td style="text-align: center; vertical-align: middle;">${formatarMoeda(d?.CAB_VLPREMIOESCALA || '0')}</td>
                    <td style="text-align: center; vertical-align: middle;">${formatarMoeda(d?.CAB_VLPREMIO || '0')}</td>
                `;
                tabelaResultados2.appendChild(row1);

                const row2 = document.createElement('tr');
                row2.innerHTML = `
                    <td>${d?.CABFATOR_CLIPOS || '0'}</td>
                    <td>Positivação</td>
                    <td style="text-align: center; vertical-align: middle;">${d?.CAB_QTCLIMETA || '-'}</td>
                    <td style="text-align: center; vertical-align: middle;">${d?.CAB_QTCLIPOS || '-'}</td>
                    <td style="text-align: center; vertical-align: middle;">${d?.CAB_QTCLIPOSFAT || '-'}</td>
                    <td>     </td>
                    <td>     </td>
                    <td style="text-align: center; vertical-align: middle;">${parseFloat(d?.CAB_PERCPOSITV?.replace(',', '.') || '0').toFixed(2)}%</td>
                    <td style="text-align: center; vertical-align: middle;">${formatarMoeda(d?.CAB_VLPREMIOCLIPOS || '0')}</td>
                    <td>     </td>
                    <td style="text-align: center; vertical-align: middle;">${formatarMoeda(d?.CAB_VLPREMIOCLIPOS || '0')}</td>
                `;
                tabelaResultados2.appendChild(row2);

                const row3 = document.createElement('tr');
                row3.innerHTML = `
                    <td>${d?.CABFATOR_QTDVENDA || '0'}</td>
                    <td>Qtd.Venda</td>
                    <td style="text-align: center; vertical-align: middle;">${d?.CAB_QTVENDAMETA || '-'}</td>
                    <td>     </td>
                    <td style="text-align: center; vertical-align: middle;">${d?.CAB_QTDVENDA || '-'}</td>
                    <td style="text-align: center; vertical-align: middle;">${d?.CAB_QTVENDADEV || '0'}</td>
                    <td style="text-align: center; vertical-align: middle;">${d?.CAB_QTVENDAFAT || '0'}</td>
                    <td style="text-align: center; vertical-align: middle;">${d?.CAB_QTVENDAFAT && d?.CAB_QTVENDAMETA ? ((parseFloat(d.CAB_QTVENDAFAT.replace(',', '.')) / parseFloat(d.CAB_QTVENDAMETA.replace(',', '.'))) * 100).toFixed(2) + '%' : '0%'}</td>
                    <td>     </td>
                    <td style="text-align: center; vertical-align: middle;">${formatarMoeda(d?.CAB_QTDVENDAESCALA || '0')}</td>
                    <td style="text-align: center; vertical-align: middle;">${formatarMoeda(d?.CAB_QTDVENDAPREMIO || '0')}</td>
                `;
                tabelaResultados2.appendChild(row3);
            }


            // Tabela 3 (TOTAL GANHOS)
            if (!Array.isArray(dadosTabela1) || dadosTabela1.length === 0) {
                alert("Nenhum registro encontrado para essa data ou vendedor (tabela 2).");
            } else {
                const d = dadosTabela1[0];

                const row4 = document.createElement('tr');
                row4.innerHTML = `
                   <tr> </tr>
                   <td>Total Prêmio Variável</td>
                    <td>${formatarMoeda(d?.VLPREMIOINDICADORES || '0')}</td>
                    
                `;
                tabelaResultados3.appendChild(row4);

                const row5 = document.createElement('tr');
                row5.innerHTML = `
                   <tr> </tr>
                   <td>Total Estimado de Ganho</td>
                    <td>${formatarMoeda(d?.VLPREMIOTOTAL || '0')}</td>
                    
                `;
                tabelaResultados3.appendChild(row5);

              }

        }


        catch (error) {
            console.error("Erro ao gerar o relatório:", error);
            alert("Erro ao obter os dados. Veja o console para mais detalhes.");
        }
    });

    document.getElementById('btnBaixarPDF').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ format: "a4", unit: "px" });

        const relatorio = document.body;
        if (!relatorio) {
            alert("Conteúdo não encontrado para exportar.");
            return;
        }

        const dataArquivo = dataArquivoSpan.textContent || '';
        const dataSelecionada = dataFiltro.value;

        let dataFormatada = '';
        if (dataSelecionada && dataSelecionada.includes('/')) {
            const partes = dataSelecionada.split('/');
            if (partes.length === 3) {
                const mes = partes[1];
                const ano = partes[2];
                dataFormatada = `${mes}/${ano}`;
            }
        }
        
        pdf.setFontSize(10); // Define o tamanho da fonte para 10
        pdf.text(`Vendedor: ${codigo} - ${nome}`, 10, 20);
        if (dataArquivo) pdf.text(dataArquivo, 10, 40);
        if (dataFormatada) pdf.text(`Mês e Ano referente: ${dataFormatada}`, 10, 60);

        pdf.html(relatorio, {
            callback: function (doc) {
                doc.save(`Relatorio_KPI_${codigo}.pdf`);
            },
            x: 10,
            y: 80,
            html2canvas: { scale: 0.29 }
        });
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogadoNome');
        localStorage.removeItem('usuarioLogadoCodigo');
        alert("Você foi deslogado com sucesso!");
        window.location.replace('login.html');
    });
});


