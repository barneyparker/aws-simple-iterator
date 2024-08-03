/**
 * AWS Simple Iterator
 * @module aws-simple-iterator
 * @description Simple AWS Iterator functions
 * @example
 * import { getAll, paginate, items } from 'aws-simple-iterator'
 * import { DynamoDB } from '@aws-sdk/client-dynamodb'
 *
 * const tableName = 'myTable'
 * const ddb = new DynamoDB({ region: 'eu-west-1' })
 *
 * const iterable = {
 *   parameters: { TableName: tableName },
 *   func: ddb.scan.bind(ddb), // Note: `bind` the function to the client
 *   dataKey: 'Items',
 *   returnedNextToken: 'LastEvaluatedKey',
 *   paramNextToken: 'ExclusiveStartKey',
 * }
 *
 * // get all the records using the getAll function
 * const all = await getAll(iterable)
 *
 * // get all the records using the paginate function
 * const perPage = []
 * for await (const page of paginate(iterable)) {
 *   perPage.push(...page)
 * }
 *
 * // get all records using the 'items' function
 * const perItem = []
 * for await (const item of items(iterable)) {
 *   perItem.push(item)
 * }
 */

/**
 * @typedef {object} iterParams
 * @param {Object} params - The parameters to pass to the function
 * @param {Function} func - The function to call
 * @param {string} dataKey - The key in the response that contains the data
 * @param {string} returnedNextToken - The key in the response that contains the next token
 * @param {string} paramNextToken - The key in the parameters to set the next token
 */

/**
 * Paginate through results and yield each page
 *
 * @param {iterParams} args
 * @returns {AsyncGenerator}
 */
export async function* paginate (args) {
  const opts = {
    parameters: {},
    dataKey: 'Items',
    returnedNextToken: 'NextToken',
    paramNextToken: 'NextToken',
    ...args
  }
  do {
    const result = await opts.func(opts.parameters)
    // yield the whole result
    yield result[opts.dataKey]
    opts.parameters[opts.paramNextToken] = result[opts.returnedNextToken]
  } while (opts.parameters[opts.paramNextToken])
}

/**
 * Get all the results and return as an array
 * @param {iterParams} args
 * @returns {Promise<Array>}
 */
export const getAll = async (args) => {
  const results = []
  for await (const page of paginate(args)) {
    results.push(...page)
  }
  return results
}

/**
 * Iterate one record at a time and yield each one
 * @param {iterParams} args
 * @returns {AsyncGenerator}
 */
export async function* items (args) {
  for await (const page of paginate(args)) {
    for (const item of page) {
      yield item
    }
  }
}