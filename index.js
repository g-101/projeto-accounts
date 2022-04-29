// modulos externos
const inquirer = require("inquirer")
const chalk = require("chalk")
// modulos internos
const fs = require("fs")


// criando a conta
function buildAcc() {
    inquirer.prompt([
        {
            name: "accName",
            message: "Digite um nome para a sua conta:",
        },
    ])
    .then((answer) => {
        const accName = answer["accName"]
        console.info(`\n\rNome escolhido: ${accName}`) // mostra o nome da conta
        
        // verifica se o banco de dados accounts existe
        if(!fs.existsSync("accounts")) {
            // se não existir ele cria o diretorio
            fs.mkdirSync("accounts")
        }

        // validar o nome da conta, para saber se ja existe
        // as contas são salvas em json
        if(fs.existsSync(`accounts/${accName}.json`)) {
            console.log(chalk.bgRed.black("Esta conta ja existe"))
            buildAcc() // chama a criação de conta novamente
            return
        }
        // conta criada com sucesso
        fs.writeFileSync(
            `accounts/${accName}.json`, 
            '{"balance": 0}', 
            function(err) {
                console.log(err)
            },
        )     
        console.log(chalk.green("Conta criada com sucesso\n\r"))
        //chama para o menu principal
        operation()
    })
    .catch((err) => console.log(err))
}

// prompt de criação de conta
function showCreateAcc() {
    console.log(chalk.bgGreen.black("Parabéns por escolher nosso Banco!"))
    console.log(chalk.green("Defina suas opções de conta a seguir:"))
    buildAcc()
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
            showCreateAcc()
        }
        
    })
    .catch((err) => console.log(err))
}

operation()