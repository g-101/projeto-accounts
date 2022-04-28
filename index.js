// modulos externos
const inquirer = require("inquirer")
const chalk = require("chalk")
// modulos internos
const fs = require("fs")


console.log("Iniciamos o Accounts\n")

// criando a conta
function createAccount() {
    console.log(chalk.bgGreen.black("Parabéns por escolher nosso Banco!"))
    console.log(chalk.green("Defina suas opções de conta a seguir:"))
}

// operacoes disponiveis para o cliente
function operation() {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
            "Criar Conta",
            "Consultar Saldo",
            "Depositar",
            "Sacar",
            "Sair",
        ],
    }])
    .then((answer) => {
        const action = answer["action"] // vai pegar a escolha do usuario
        // console.log(action)
        if(action === "Criar Conta") {
            createAccount()
        }
    })
    .catch((err) => console.log(err))
}

operation()