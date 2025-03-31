import inquirer from "inquirer";
import { limparTerminal } from "./utils/terminal";
import { adicionarCategoria, listarCategorias, buscarCategoria, atualizarCategoria, deletarCategoria} from "./services/categoriaService";
import { adicionarProduto, listarProdutos, buscarProduto, atualizarProduto, deletarProduto} from "./services/produtoService";

async function menu() {
  while (true) {
    const { opcao } = await inquirer.prompt({
      type: "list",
      name: "opcao",
      message: "Escolha uma opção:",
      choices: [
        "Adicionar Categoria",
        "Listar Categoria",
        "Buscar Categoria",
        "Atualizar Categoria",
        "Deletar Categoria",
        "Adicionar Produto",
        "Listar Produto",
        "Buscar Produto",
        "Atualizar Produto",
        "Deletar Produto",
        "Sair",
      ],
    });

    if (opcao === "Adicionar Categoria") await adicionarCategoria();
    else if (opcao === "Listar Categoria") listarCategorias();
    else if (opcao === "Buscar Categoria") await buscarCategoria();
    else if (opcao === "Atualizar Categoria")await atualizarCategoria();
    else if (opcao === "Deletar Categoria") await deletarCategoria();
    else if (opcao === "Adicionar Produto") await adicionarProduto();
    else if (opcao === "Listar Produto") listarProdutos();
    else if (opcao === "Buscar Produto")await buscarProduto();
    else if (opcao === "Atualizar Produto")await atualizarProduto();
    else if (opcao === "Deletar Produto") await deletarProduto();
    else if (opcao === "Sair") {
      limparTerminal();
      process.exit(0);
    }
  }
}

menu();
