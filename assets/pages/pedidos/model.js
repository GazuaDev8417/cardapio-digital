let etapaAtual = 0;

function renderizarEtapa() {
  const etapa = produto.etapas[etapaAtual];
  if (!etapa) return;

  document.getElementById("subtitulo").textContent = etapa.subtitulo;
  document.getElementById("regras").textContent = `Mínimo: ${etapa.min}   Máximo: ${etapa.max}`;
  document.getElementById("valor-adicional").textContent = `Valor Adicional: R$ ${etapa.valorAdicional.toFixed(2)}`;

  const lista = document.getElementById("lista-itens");
  lista.innerHTML = "";

  etapa.itens.forEach(item => {
    const preco = item.preco ? `+ R$ ${item.preco.toFixed(2)}` : "";
    const descricao = item.descricao || "";

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <strong>${item.nome}</strong><br>
      ${descricao ? `<span>${descricao}</span><br>` : ""}
      ${preco ? `<small>${preco}</small><br>` : ""}
      <div class="quantidade">
        <button onclick="alterarQuantidade(this, -1)">–</button>
        <span>0</span>
        <button onclick="alterarQuantidade(this, 1)">+</button>
      </div>
      <hr>
    `;
    lista.appendChild(div);
  });
}

function alterarQuantidade(button, delta) {
  const span = button.parentElement.querySelector("span");
  let valor = parseInt(span.textContent);
  valor = Math.max(0, valor + delta);
  span.textContent = valor;
}

document.getElementById("continuar").addEventListener("click", () => {
  etapaAtual++;
  if (etapaAtual < produto.etapas.length) {
    renderizarEtapa();
  } else {
    alert("Pedido finalizado!");
  }
});

document.addEventListener("DOMContentLoaded", renderizarEtapa);
