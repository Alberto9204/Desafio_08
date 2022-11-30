import knexLib from 'knex'

export default class Chats {
    constructor(options) {
        this.knex = knexLib(options)
    }

    async createTable() {
        return this.knex.schema.dropTableIfExists('chats')
        .finally(()=>{
            return this.knex.schema.createTable('chats', table => {
                table.increments('id_chat').primary();
                table.string('email');
                table.string('textoMensaje');
                table.string('date')
            })
        })
    }

    async getAllChats() {
        try {
            return this.knex('chats').select('*');
        } catch (error) {
            return []
        }
    }

    async save(newMessage) {
        try {
            await this.knex('chats').insert(newMessage)
            return await this.knex('chats').select('*')
        } catch (error) {
            return(error)
        }
    }
}