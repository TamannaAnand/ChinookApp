//function for insert statement 
export function generateInsertStatement(tableName, payload) {

    //dynamically build portions of our INSERT statement 

    const columns = [];
    const values = [];

    for (const property in payload) {
        columns.push(property)
        values.push(payload[property])
    }

    //another option
    const placeHolders = columns.map((column) => {
        return '?'
    }).join(', ')


    //join gives us a string that we could inject into the statement 
    console.log(columns.join(', '))
    console.log(placeHolders)
    console.log(values)

    //dynamically insert the values coming from payload into sql statement 
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeHolders});`
    return {
        sql,
        values
    }
}

//function for update statement 
export function generateUpdateStatement(tableName, payload, primaryKeyColumn, primaryKeyValue) {

    const columns = [];
    const values = [];

    for (const property in payload) {
        columns.push(`${property}=?`)
        values.push(payload[property])
    }

    // const columnsModified = columns.map(column => {
    //     return `${column} =?`
    // })


    const sql = `UPDATE ${tableName} SET ${columns.join(', ')} WHERE ${primaryKeyColumn} = ${primaryKeyValue}`

    return {
        sql,
        values
    }


}