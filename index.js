// modulos externos
const inquirer = require("inquirer")
const chalk = require("chalk")
// modulos internos
const fs = require("fs")


function withdrawBalance(accName, amount) {
    // pega as infos da conta
    const accData = getAcc(accName)
    // se o usuario digitar nada
    if(!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente\n"))
        return withdraw()
    }
    if(accData.balance < amount || accData.balance === 0) {
        console.log(chalk.bgRed.black("Você não possui saldo suficiente para esse valor\n"))
        return withdraw()
    }
    accData.balance = parseFloat(accData.balance) - parseFloat(amount)
    // vai salvar os novos dados no banco apos o saque
    fs.writeFileSync(`accounts/${accName}.json`, JSON.stringify(accData), (err) => console.log(err))
    console.log(chalk.green(`Foi sacado R$${amount.toFixed(2)} da sua conta\n`))
    
}


// sacar saldo
function withdraw() {
    inquirer.prompt([
        {
            name: "accName",
            message: "Digite o nome da sua conta:",
        }
    ])
    .then((answer) => {
        const accName = answer["accName"]
        if(!checkAcc(accName)) {
            console.log(chalk.bgRed.black("Esta conta não existe!\n"))
            return withdraw()
        }
        inquirer.prompt([
            { 
                name: "amount",
                message: "Valor do Saque R$:",
            },
        ])
        .then((answer) => {
            const amount = answer["amount"] 
            
            //verificar se tem saldo para sacar

            //se  tiver
            withdrawBalance(accName, amount)
            operation()
            
            
        })
        .catch((err) => console.log)
    })
    .catch((err) => console.log)
}

// consultar saldo
function getAccBalance() {
    inquirer.prompt([
        { 
            name: "accName",
            message: "Digite o nome da sua conta:",
        },
        
    ]).then((answer) => {
        const accName = answer["accName"] // nome da conta
        // verifica se a conta existe
        if(!checkAcc(accName)) {
            console.log(chalk.bgRed.black("Esta conta não existe!"))
            return getAccBalance()
        }
        const accData = getAcc(accName) //pega a info do saldo em json
        console.log(chalk.bgBlue.black(`Seu saldo atual: R$ ${accData.balance.toFixed(2)}\n`))
        operation()
    }).catch((err) => console.log)
}

//mostra o saldo em json
function getAcc(accName){
    const accJSON = fs.readFileSync(`accounts/${accName}.json`, { encoding: "utf-8", flag: "r"})
    return JSON.parse(accJSON) // retorna transformado de texto para json
}

// checa se a conta existe ou não
function checkAcc(accName) { return fs.existsSync(`accounts/${accName}.json`) }


function addAmount(accName, amount) {
    // chama a função que le arquivos
    const accData = getAcc(accName)
    
    // se o usuario digitar nada
    if(!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente\n"))
        return deposit()
    }
    accData.balance = parseFloat(amount) + parseFloat(accData.balance)
    // vai salvar os novos dados no banco
    fs.writeFileSync(`accounts/${accName}.json`, JSON.stringify(accData), (err) => console.log(err))
    console.log(chalk.green(`Foi depositado R$ ${amount.toFixed(2)} na sua conta\n`))
    
}

function getAcc(accName){
    const accJSON = fs.readFileSync(`accounts/${accName}.json`, { 
        encoding: "utf-8", 
        flag: "r"
    })
    return JSON.parse(accJSON) // retorna transformado de texto para json
}

// deposito do cliente
function deposit() {
    // primeiro saber qual a conta que fara o deposito
    inquirer.prompt([
        { 
            name: "accName",
            message: "Digite o nome da sua conta:",
        },    
    ])
    .then((answer) => {
        //verificar se a conta existe
        const accName = answer["accName"]
        //verifica se a conta existe para fazer o deposito
        if(!checkAcc(accName)) {
            // se não existir chama o menu do deposito
            console.log(chalk.bgRed.black("Esta conta não existe!"))
            return deposit()
        }
        inquirer.prompt([
            { 
                name: "amount",
                message: "Valor do déposito:",
            },    
        ])
        .then((answer) => {
            const amount = answer["amount"] // salva o valor do deposito
            
            addAmount(accName, amount)
            operation() // chama o menu principal do banco
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))

}

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
            // se não existir ele cria o diretorio do banco de dados
            fs.mkdirSync("accounts")
        }

        // validar o nome da conta, para saber se ja existe
        // as contas são salvas em json
        if(fs.existsSync(`accounts/${accName}.json`)) {
            console.log(chalk.bgRed.black("Esta conta ja existe"))
            buildAcc() // chama a criação de conta novamente
            return // caso haja um erro
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
        switch(action) {
            case "Criar Conta":
                showCreateAcc()
                break
            case "Consultar Saldo":
                getAccBalance()
                break
            case "Depositar":
                deposit()
                break 
            case "Sacar":
                withdraw()
                break         
            case "Sair":
                console.log(chalk.bgBlue.black("Obrigado por usar o Accounts"))
                process.exit() 
        }

        
    })
    .catch((err) => console.log(err))
}

operation()