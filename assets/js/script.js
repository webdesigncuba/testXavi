
document.addEventListener('DOMContentLoaded', function () {
  let medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  let editandoIndex = null;

  function saveForm() {
    const nome = document.getElementById('medName').value.trim();
    const descricao = document.getElementById('medDescription').value.trim();
    const apresentacao = document.getElementById('medPresentation').value.trim();
    const via = document.getElementById('medRoute').value.trim();
    const controlado = document.getElementById('medControlled').value.trim();
    const similares = document.getElementById('nomeSim').value.trim();

    if (!nome || !descricao || !apresentacao || !via || !controlado) {
      const alerta = document.createElement('div');
      alerta.className = 'alert alert-danger alert-dismissible fade show';
      alerta.role = 'alert';
      alerta.innerHTML = `Por favor, preencha todos os campos obrigatórios.
        <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>`;
      document.querySelector('#addMedicationModal .modal-body').prepend(alerta);
      setTimeout(() => {
        alerta.classList.remove('show');
        alerta.classList.add('hide');
      }, 3000);
      return;
    }

    const componentes = [];
    const linhas = document.querySelectorAll('#activeComponentsGrid .row');
    linhas.forEach(linha => {
      const ativo = linha.children[0].querySelector('input').value.trim();
      const concentracao = linha.children[1].querySelector('input').value.trim();
      const unidade = linha.children[2].querySelector('input').value.trim();
      if (ativo) {
        componentes.push({ ativo, concentracao, unidade });
      }
    });

    const novoMedicamento = {
      nome,
      descricao,
      apresentacao,
      via,
      controlado,
      similares,
      componentes
    };

    if (editandoIndex !== null) {
      medicamentos[editandoIndex] = novoMedicamento;
      editandoIndex = null;
    } else {
      medicamentos.push(novoMedicamento);
    }

    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

    document.getElementById('addMedicationModal').querySelectorAll('input').forEach(input => input.value = '');
    document.getElementById('activeComponentsGrid').innerHTML = '';
    addActiveComponentRow();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addMedicationModal'));
    modal.hide();

    console.log('Medicamento salvo:', novoMedicamento);
    exibirMedicamentos();

    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success alert-dismissible fade show';
    alerta.role = 'alert';
    alerta.innerHTML = `Medicamento salvo com sucesso!
      <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>`;
    document.body.appendChild(alerta);
    setTimeout(() => {
      alerta.classList.remove('show');
      alerta.classList.add('hide');
    }, 3000);
  }

  function exibirMedicamentos() {
    const filtro = document.getElementById('searchInput').value.toLowerCase();
    const tabela = document.getElementById('medicamentosTableBody');
    tabela.innerHTML = '';
    medicamentos.forEach((med, index) => {
      if (med.nome.toLowerCase().includes(filtro)) {
        const linha = document.createElement('tr');
        linha.innerHTML = `
          <th scope="row">${index + 1}</th>
          <td>${med.nome}</td>
          <td>${med.descricao}</td>
          <td>${med.apresentacao}</td>
          <td>${med.via}</td>
          <td>
            <button class="btn btn-sm btn-info me-2" onclick="mostrarMedicamento(${index})"><i class="bi bi-eye"></i></button>
            <button class="btn btn-sm btn-primary me-2" onclick="editarMedicamento(${index})"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger" onclick="excluirMedicamento(${index})"><i class="bi bi-trash"></i></button>
          </td>
        `;
        tabela.appendChild(linha);
      }
    });
  }

  function excluirMedicamento(index) {
    medicamentos.splice(index, 1);
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    exibirMedicamentos();
  }

  function editarMedicamento(index) {
    const med = medicamentos[index];
    document.getElementById('medName').value = med.nome;
    document.getElementById('medDescription').value = med.descricao;
    document.getElementById('medPresentation').value = med.apresentacao;
    document.getElementById('medRoute').value = med.via;
    document.getElementById('medControlled').value = med.controlado;
    document.getElementById('nomeSim').value = med.similares;

    const grid = document.getElementById('activeComponentsGrid');
    grid.innerHTML = '';
    med.componentes.forEach(comp => {
      const row = document.createElement('div');
      row.className = 'row g-2 mb-2';
      row.innerHTML = `
        <div class="col-6">
          <input type="text" class="form-control" value="${comp.ativo}" placeholder="Componente ativo">
        </div>
        <div class="col-3">
          <input type="text" class="form-control" value="${comp.concentracao}" placeholder="Concentração">
        </div>
        <div class="col-3">
          <input type="text" class="form-control" value="${comp.unidade}" placeholder="Unidade">
        </div>
      `;
      grid.appendChild(row);
    });

    editandoIndex = index;

    const modal = new bootstrap.Modal(document.getElementById('addMedicationModal'));
    modal.show();
  }

  function mostrarMedicamento(index) {
    const med = medicamentos[index];
    const modalBody = document.getElementById('showMedicationBody');
    modalBody.innerHTML = `
      <p><strong>Nome:</strong> ${med.nome}</p>
      <p><strong>Descrição:</strong> ${med.descricao}</p>
      <p><strong>Apresentação:</strong> ${med.apresentacao}</p>
      <p><strong>Via de Administração:</strong> ${med.via}</p>
      <p><strong>Controlado:</strong> ${med.controlado}</p>
      <p><strong>Similares:</strong> ${med.similares}</p>
      <p><strong>Componentes Ativos:</strong></p>
      <ul>
        ${med.componentes.map(comp => `<li>${comp.ativo} - ${comp.concentracao} ${comp.unidade}</li>`).join('')}
      </ul>
    `;
    const modal = new bootstrap.Modal(document.getElementById('showMedicationModal'));
    modal.show();
  }

  function abrirModalNovoMedicamento() {
    editandoIndex = null;
    document.getElementById('medName').value = '';
    document.getElementById('medDescription').value = '';
    document.getElementById('medPresentation').value = '';
    document.getElementById('medRoute').value = '';
    document.getElementById('medControlled').value = '';
    document.getElementById('nomeSim').value = '';
    const grid = document.getElementById('activeComponentsGrid');
    grid.innerHTML = '';
    addActiveComponentRow();
    const modal = new bootstrap.Modal(document.getElementById('addMedicationModal'));
    modal.show();
  }

  window.saveForm = saveForm;
  window.editarMedicamento = editarMedicamento;
  window.excluirMedicamento = excluirMedicamento;
  window.mostrarMedicamento = mostrarMedicamento;
  window.exibirMedicamentos = exibirMedicamentos;
  window.abrirModalNovoMedicamento = abrirModalNovoMedicamento;

  document.getElementById('searchInput').addEventListener('input', exibirMedicamentos);
  exibirMedicamentos();
});