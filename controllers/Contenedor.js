import knexLib from 'knex'

export default class Contenedor {
    constructor(config) {
        this.knex = knexLib(config)
    }

    async createTable() {
        return this.knex.schema.dropTableIfExists('articulos')
        .finally(()=>{
            return this.knex.schema.createTable('articulos', table => {
                table.increments('id_articulo').primary();
                table.string('title', 50).notNullable();
                table.string('price', 20);
                table.string('thumbnail',30);
            })
        })
    }

    async getAll() {
        try {
            return this.knex('articulos').select('*');
        } catch (error) {
            return []
        }
    }
    async getById(id){
        try {
            return this.knex('articulos').select('*').where('id_articulo', id)
        } catch (error) {
            return(error)
            null
        }
    }
    async save(newArticulo) {
        try {
            return  await this.knex('articulos').insert(newArticulo)
        } catch (error) {
            return(error)
        }
    }

    async update(id, articulos) {
        try{
            return this.knex('articulos').where('id_articulo', id).update(articulos)
        } catch (error) {
            return(error)
        }
    }
    async deleteAll(){
        try {
            return this.knex('articulos').select('*').del();
        } catch (error) {
            return (error)
        }
    }
    async deleteById (id) {
        try {
            return this.knex('articulos').where('id_articulos', id).del();
        } catch (error) {
            return(error)
        }
    }
}