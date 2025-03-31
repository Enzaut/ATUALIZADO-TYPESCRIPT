import inquirer from "inquirer";
import Table from "cli-table3";
import { Produto } from "../models/Produto";
import { Categoria } from "../models/Categoria";
import { obterDataHoraAtual } from "../utils/formatters";
import { listarCategorias } from "./categoriaService";

const produtos: Produto[] = [];
import { categorias } from "./categoriaService";

export async function adicionarProduto() {
  listarCategorias();

  const resposta = await inquirer.prompt([
    { type: "input", name: "nome", message: "Nome do Produto" },
    { type: "input", name: "descricao", message: "Descrição do Produto" },
    { type: "number", name: "preco", message: "Preço do produto" },
    { type: "number", name: "quantidade", message: "Quantidade de Produtos" },
    {
      type: "number",
      name: "categoriaId",
      message: "ID da categoria do produto",
    },
  ]);

  const categoria = categorias.find((c) => c.id === resposta.categoriaId);
  if (!categoria) {
    console.log("❌ Categoria inválida!");
    return;
  }

  produtos.push({
    id: produtos.length + 1,
    ...resposta,
    dataCriacao: obterDataHoraAtual(),
    dataAtualizacao: "Não Alterado",
  });

  console.log(`Produto "${resposta.nome}" adicionado!`);
}

export function listarProdutos() {
  if (produtos.length === 0) {
    console.log("Nenhum produto cadastrado.");
    return;
  }

  const table = new Table({
    head: ["ID", "Nome", "Descrição", "Preço", "Qtd", "Categoria ID", "Criado em", "Atualizado em"],
    colWidths: [5, 20, 30, 10, 8, 12, 25, 25],
    wordWrap: true,
  });

  produtos.forEach((produto) => {
    table.push([
      produto.id,
      produto.nome,
      produto.descricao,
      `R$ ${produto.preco}`,
      produto.quantidade,
      produto.categoriaId,
      produto.dataCriacao,
      produto.dataAtualizacao,
    ]);
  });

  console.log(table.toString());
}

export async function buscarProduto() {
  if (produtos.length === 0) {
    console.log("Nenhum produto cadastrado para buscar.");
    return;
  }

  const { criterio } = await inquirer.prompt({
    type: "list",
    name: "criterio",
    message: "Deseja buscar por ID ou Nome?",
    choices: ["ID", "Nome"],
  });

  let produtoEncontrado: Produto | undefined;

  if (criterio === "ID") {
    const { id } = await inquirer.prompt({
      type: "number",
      name: "id",
      message: "Digite o ID do produto:",
    });

    produtoEncontrado = produtos.find((p) => p.id === id);
  } else {
    const { nome } = await inquirer.prompt({
      type: "input",
      name: "nome",
      message: "Digite o nome do produto:",
    });

    produtoEncontrado = produtos.find(
      (p) => p.nome.toLowerCase() === nome.toLowerCase()
    );
  }

  if (produtoEncontrado) {
    console.log(`✅ Produto encontrado: ${JSON.stringify(produtoEncontrado, null, 2)}`);
  } else {
    console.log("❌ Produto não encontrado!");
  }
}

export async function atualizarProduto() {
  if (produtos.length === 0) {
    console.log("Nenhum produto cadastrado para atualizar.");
    return;
  }

  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Digite o ID do produto que deseja atualizar:",
  });

  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    console.log("❌ Produto não encontrado!");
    return;
  }

  const resposta = await inquirer.prompt([
    { type: "input", name: "novoNome", message: "Novo nome do produto:", default: produto.nome },
    { type: "input", name: "novaDescricao", message: "Nova descrição do produto:", default: produto.descricao },
    { type: "number", name: "novoPreco", message: "Novo preço do produto:", default: produto.preco },
    { type: "number", name: "novaQuantidade", message: "Nova quantidade:", default: produto.quantidade },
    { type: "number", name: "novaCategoriaId", message: "Novo ID da categoria:", default: produto.categoriaId },
  ]);

  const categoria = categorias.find((c) => c.id === resposta.novaCategoriaId);
  if (!categoria) {
    console.log("❌ Categoria inválida!");
    return;
  }

  produto.nome = resposta.novoNome;
  produto.descricao = resposta.novaDescricao;
  produto.preco = resposta.novoPreco;
  produto.quantidade = resposta.novaQuantidade;
  produto.categoriaId = resposta.novaCategoriaId;
  produto.dataAtualizacao = obterDataHoraAtual();

  console.log(`✅ Produto "${produto.nome}" atualizado com sucesso!`);
}

export async function deletarProduto() {
  if (produtos.length === 0) {
    console.log("Nenhum produto cadastrado para deletar.");
    return;
  }

  // Exibir os produtos disponíveis para facilitar a escolha
  listarProdutos();

  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Digite o ID do produto que deseja deletar:",
  });

  const indice = produtos.findIndex((p) => p.id === id);

  if (indice === -1) {
    console.log("❌ Produto não encontrado!");
    return;
  }

  const produtoRemovido = produtos.splice(indice, 1)[0];

  console.log(`✅ Produto "${produtoRemovido.nome}" removido com sucesso!`);
}

