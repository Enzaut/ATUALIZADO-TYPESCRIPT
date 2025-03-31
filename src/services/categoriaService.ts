import inquirer from "inquirer";
import Table from "cli-table3";
import { Categoria } from "../models/Categoria";
import { obterDataHoraAtual } from "../utils/formatters";

export const categorias: Categoria[] = [];

export async function adicionarCategoria() {
  const { nome, descricao } = await inquirer.prompt([
    { type: "input", name: "nome", message: "Nome da categoria" },
    { type: "input", name: "descricao", message: "Descrição da categoria" },
  ]);

  categorias.push({
    id: categorias.length + 1,
    nome,
    descricao,
    dataCriacao: obterDataHoraAtual(),
    dataAtualizacao: "Não Alterado",
  });

  console.log(`Categoria "${nome}" adicionada!`);
}

export function listarCategorias() {
  if (categorias.length === 0) {
    console.log("Nenhuma categoria cadastrada.");
    return;
  }

  const table = new Table({
    head: ["ID", "Nome", "Descrição", "Criada em", "Alterada em"],
    colWidths: [5, 20, 30, 25, 25],
    wordWrap: true,
  });

  categorias.forEach((categoria) => {
    table.push([
      categoria.id,
      categoria.nome,
      categoria.descricao,
      categoria.dataCriacao,
      categoria.dataAtualizacao,
    ]);
  });

  console.log(table.toString());
}

export async function buscarCategoria() {
  const { criterio } = await inquirer.prompt({
    type: "list",
    name: "criterio",
    message: "Deseja buscar por ID ou Nome?",
    choices: ["ID", "Nome"],
  });

  let categoriaEncontrada: Categoria | undefined;

  if (criterio === "ID") {
    const { id } = await inquirer.prompt({
      type: "number",
      name: "id",
      message: "Digite o ID da categoria:",
    });

    categoriaEncontrada = categorias.find((c) => c.id === id);
  } else {
    const { nome } = await inquirer.prompt({
      type: "input",
      name: "nome",
      message: "Digite o nome da categoria:",
    });

    categoriaEncontrada = categorias.find(
      (c) => c.nome.toLowerCase() === nome.toLowerCase()
    );
  }

  if (categoriaEncontrada) {
    console.log(`Categoria encontrada: ${JSON.stringify(categoriaEncontrada)}`);
  } else {
    console.log("❌ Categoria não encontrada!");
  }
}

//TESTEEEEEEEEEEEEEEEEEEE


export async function atualizarCategoria() {
  if (categorias.length === 0) {
    console.log("Nenhuma categoria cadastrada para atualizar.");
    return;
  }

  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Digite o ID da categoria que deseja atualizar:",
  });

  const categoria = categorias.find((c) => c.id === id);

  if (!categoria) {
    console.log("❌ Categoria não encontrada!");
    return;
  }

  const { novoNome, novaDescricao } = await inquirer.prompt([
    { type: "input", name: "novoNome", message: "Novo nome da categoria:", default: categoria.nome },
    { type: "input", name: "novaDescricao", message: "Nova descrição da categoria:", default: categoria.descricao },
  ]);

  categoria.nome = novoNome;
  categoria.descricao = novaDescricao;
  categoria.dataAtualizacao = obterDataHoraAtual();

  console.log(`✅ Categoria "${categoria.nome}" atualizada com sucesso!`);
}

export async function deletarCategoria() {
  if (categorias.length === 0) {
    console.log("Nenhuma categoria cadastrada para deletar.");
    return;
  }

  const { id } = await inquirer.prompt({
    type: "number",
    name: "id",
    message: "Digite o ID da categoria que deseja deletar:",
  });

  const indice = categorias.findIndex((c) => c.id === id);

  if (indice === -1) {
    console.log("❌ Categoria não encontrada!");
    return;
  }

  const categoriaRemovida = categorias.splice(indice, 1)[0];

  console.log(`✅ Categoria "${categoriaRemovida.nome}" removida com sucesso!`);
}
