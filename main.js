/**
 * Processo principal 
 * Estudo do CRUD com mongodb
 */

// Importação do modulo de conexão (database.js)
const { conectar, desconectar } = require('./database.js')

//importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

//importação do pacote string-similarity para aprimorar a busca por nomes
const stringSimilarity = require('string-similarity')


//CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
        )
        //a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("cliente adicionado com sucesso")
    } catch (error) {
        // tratamento de exceções específicas
        if (error.code = 11000) {
            console.log(`Erro o cpf: ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}


// CRUD Read - função para buscar um cliente específico
const buscarCliente = async (nome) => {
    try {
        // find() -> buscar 
        // nomeCliente: new RegExp(nome) filtro pelo nome (partes que contenham (expressão regular))
        // 'i' insentive (ignorar letras maiusculas e minusculas)
        const cliente = await clienteModel.find({ nomeCliente: new RegExp(nome, 'i') }
        )
        //calcular a similaridade entre os nomes retornados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)

        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado")
        } else {
            const match = stringSimilarity.findBestMatch(nome,
                nomesClientes)
            //cliente com melhor similaridade
            const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)
            //formatação da data
            const clienteFormatado = {
                nomeCliente: melhorCliente.nomeCliente,
                foneCliente: melhorCliente.foneCliente,
                cpf: melhorCliente.cpf,
                dataCadastro: melhorCliente.dataCadastro.toLocaleDateString('pt-BR')
            }
            console.log(clienteFormatado)
            //console.log(melhorCliente)
        }



    } catch (error) {
        console.log(error)
    }
}

//-------------------------------------------------------------------------------------------------------------------------------

// CRUD  Read - função para listar todos os clientes cadastrados
const listarCliente = async () => {
    try {
        // a linha abaixo lista todos os clientes cadastrados em ordem alfabética
        const cliente = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
        )
        console.log(cliente)
    } catch (error) {
        console.log(error)
    }
}


// execução da aplicação
const app = async () => {
    await conectar()
    //await criarCliente("Thiago Henrique", "98989-9479", "111.222.147-16")

    // CRUD  - read (exemplo 1 - listar todos clientes)
    //await listarCliente()

    // CRUD  - read (exemplo 2 - buscar cliente)
    await buscarCliente("leticia")
    await desconectar()
}

console.clear()
app()
