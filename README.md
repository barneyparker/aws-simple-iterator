# aws-simple-iterator

Simple AWS Iterator functions

## Install

```bash
npm install aws-simple-iterator
```

# API Reference

Simple AWS Iterator functions

**Example**

```js
import { getAll, paginate, items } from 'aws-simple-iterator'
import { DynamoDB } from '@aws-sdk/client-dynamodb'

const tableName = 'myTable'
const ddb = new DynamoDB({ region: 'eu-west-1' })

const iterable = {
  parameters: { TableName: tableName },
  func: ddb.scan.bind(ddb), // Note: `bind` the function to the client
  dataKey: 'Items',
  returnedNextToken: 'LastEvaluatedKey',
  paramNextToken: 'ExclusiveStartKey',
}

// get all the records using the getAll function
const all = await getAll(iterable)

// get all the records using the paginate function
const perPage = []
for await (const page of paginate(iterable)) {
  perPage.push(...page)
}

// get all records using the 'items' function
const perItem = []
for await (const item of items(iterable)) {
  perItem.push(item)
}
```

<a name="module_aws-simple-iterator.getAll"></a>

### aws-simple-iterator.getAll ⇒ <code>Promise.&lt;Array&gt;</code>

Get all the results and return as an array

**Kind**: static constant of [<code>aws-simple-iterator</code>](#module_aws-simple-iterator)

| Param | Type                    |
| ----- | ----------------------- |
| args  | <code>iterParams</code> |

<a name="module_aws-simple-iterator.paginate"></a>

### aws-simple-iterator.paginate(args) ⇒ <code>AsyncGenerator</code>

Paginate through results and yield each page

**Kind**: static method of [<code>aws-simple-iterator</code>](#module_aws-simple-iterator)

| Param | Type                    |
| ----- | ----------------------- |
| args  | <code>iterParams</code> |

<a name="module_aws-simple-iterator.items"></a>

### aws-simple-iterator.items(args) ⇒ <code>AsyncGenerator</code>

Iterate one record at a time and yield each one

**Kind**: static method of [<code>aws-simple-iterator</code>](#module_aws-simple-iterator)

| Param | Type                    |
| ----- | ----------------------- |
| args  | <code>iterParams</code> |

<a name="module_aws-simple-iterator..iterParams"></a>

### aws-simple-iterator~iterParams : <code>object</code>

**Kind**: inner typedef of [<code>aws-simple-iterator</code>](#module_aws-simple-iterator)

| Param             | Type                  | Description                                          |
| ----------------- | --------------------- | ---------------------------------------------------- |
| params            | <code>Object</code>   | The parameters to pass to the function               |
| func              | <code>function</code> | The function to call                                 |
| dataKey           | <code>string</code>   | The key in the response that contains the data       |
| returnedNextToken | <code>string</code>   | The key in the response that contains the next token |
| paramNextToken    | <code>string</code>   | The key in the parameters to set the next token      |

## License

[MIT ©](https://github.com/barneyparker/aws-simple-iterator/LICENSE)
