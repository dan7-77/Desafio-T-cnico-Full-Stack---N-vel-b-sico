const responsaveis = ["Ana Silva", "Bruno Costa", "Carla Dias"];

let chamados = [
  {
    id: 1,
    titulo: "Erro no Login",
    descricao: "Falha ao autenticar via provedor externo",
    prioridade: "Alta",
    status: "Aberto",
    responsavel: "Ana Silva",
    dataCriacao: new Date().toLocaleString(),
  },
  {
    id: 2,
    titulo: "Atualizar Imagem do Banner",
    descricao: "Substituir artes promocionais da home",
    prioridade: "Baixa",
    status: "Em Andamento",
    responsavel: "Bruno Costa",
    dataCriacao: new Date().toLocaleString(),
  },
];

function carregarSelectResponsaveis() {
  const select = document.getElementById("inputResponsavel");
  select.innerHTML =
    '<option value="AUTO">✨ Distribuição Automática (Menos Atarefado)</option>';
  responsaveis.forEach((resp) => {
    select.innerHTML += `<option value="${resp}">${resp}</option>`;
  });
}

function obterResponsavelAutomatico() {
  const cargaPorResponsavel = {};
  responsaveis.forEach((r) => (cargaPorResponsavel[r] = 0));

  chamados.forEach((c) => {
    if (c.status === "Aberto" || c.status === "Em Andamento") {
      if (cargaPorResponsavel[c.responsavel] !== undefined) {
        cargaPorResponsavel[c.responsavel]++;
      }
    }
  });

  let menosAtarefado = responsaveis[0];
  let menorCarga = cargaPorResponsavel[menosAtarefado];

  for (const resp of responsaveis) {
    if (cargaPorResponsavel[resp] < menorCarga) {
      menorCarga = cargaPorResponsavel[resp];
      menosAtarefado = resp;
    }
  }

  return menosAtarefado;
}

function renderizarTabela() {
  const tbody = document.getElementById("tabelaCorpo");
  const busca = document.getElementById("filtroBusca").value.toLowerCase();
  const statusFiltro = document.getElementById("filtroStatus").value;
  const prioridadeFiltro = document.getElementById("filtroPrioridade").value;

  tbody.innerHTML = "";

  const filtrados = chamados.filter((c) => {
    const bateTexto =
      c.titulo.toLowerCase().includes(busca) ||
      c.descricao.toLowerCase().includes(busca);
    const bateStatus = !statusFiltro || c.status === statusFiltro;
    const batePrioridade =
      !prioridadeFiltro || c.prioridade === prioridadeFiltro;
    return bateTexto && bateStatus && batePrioridade;
  });

  if (filtrados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--cor-subtexto); padding: 32px;">Nenhum chamado encontrado.</td></tr>`;
    return;
  }

  filtrados.forEach((c) => {
    const classePrioridade = {
      Baixa: "prioridade-baixa",
      Média: "prioridade-media",
      Alta: "prioridade-alta",
    }[c.prioridade];

    const classeStatus = {
      Aberto: "status-aberto",
      "Em Andamento": "status-andamento",
      Resolvido: "status-resolvido",
      Fechado: "status-fechado",
    }[c.status];

    tbody.innerHTML += `
          <tr>
            <td>
              <div class="texto-titulo">${c.titulo}</div>
              <div class="texto-descricao">${c.descricao}</div>
            </td>
            <td><span class="badge ${classePrioridade}">${c.prioridade}</span></td>
            <td><span class="badge ${classeStatus}">${c.status}</span></td>
            <td style="font-weight: 500;">${c.responsavel}</td>
            <td style="color: var(--cor-subtexto); font-size: 13px;">${c.dataCriacao}</td>
            <td style="text-align: right;">
              <button onclick="editarChamado(${c.id})" class="btn-link">Editar</button>
            </td>
          </tr>
        `;
  });
}

function abrirModal() {
  document.getElementById("formChamado").reset();
  document.getElementById("chamadoId").value = "";
  document.getElementById("modalTitulo").innerText = "Criar Novo Chamado";
  document.getElementById("modalChamado").classList.remove("oculto");
}

function fecharModal() {
  document.getElementById("modalChamado").classList.add("oculto");
}

function editarChamado(id) {
  const chamado = chamados.find((c) => c.id === id);
  if (!chamado) return;

  document.getElementById("chamadoId").value = chamado.id;
  document.getElementById("inputTitulo").value = chamado.titulo;
  document.getElementById("inputDescricao").value = chamado.descricao;
  document.getElementById("inputPrioridade").value = chamado.prioridade;
  document.getElementById("inputStatus").value = chamado.status;
  document.getElementById("inputResponsavel").value = chamado.responsavel;

  document.getElementById("modalTitulo").innerText = "Editar Chamado";
  document.getElementById("modalChamado").classList.remove("oculto");
}

function salvarChamado(event) {
  event.preventDefault();

  const id = document.getElementById("chamadoId").value;
  const titulo = document.getElementById("inputTitulo").value;
  const descricao = document.getElementById("inputDescricao").value;
  const prioridade = document.getElementById("inputPrioridade").value;
  const status = document.getElementById("inputStatus").value;
  let responsavel = document.getElementById("inputResponsavel").value;

  if (responsavel === "AUTO") {
    responsavel = obterResponsavelAutomatico();
  }

  if (id) {
    const index = chamados.findIndex((c) => c.id == id);
    chamados[index] = {
      ...chamados[index],
      titulo,
      descricao,
      prioridade,
      status,
      responsavel,
    };
  } else {
    const novoChamado = {
      id: Date.now(),
      titulo,
      descricao,
      prioridade,
      status,
      responsavel,
      dataCriacao: new Date().toLocaleString(),
    };
    chamados.unshift(novoChamado);
  }

  fecharModal();
  renderizarTabela();
}

carregarSelectResponsaveis();
renderizarTabela();
