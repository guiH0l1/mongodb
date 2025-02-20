/**
 * Processo principal 
 * Estudo do CRUD com mongodb
 */

// Importação do modulo de conexão (database.js)
const { conectar, desconectar } = require('./database.js')

//importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

//CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli
            }
        )
        //a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("cliente adicionado com sucesso")
    } catch (error) {
        console.log(error)
    }
}


// execução da aplicação
const app = async () => {
    await conectar()
    await criarCliente("Guilherme Holi", "99999-9999")
    await criarCliente("Calvo Thigas", "99999-9999")
    await criarCliente("Patrick Quagmire", "99999-9999")
    await desconectar()
}

console.clear()
app()
