# tx-map

For coding practice, this is a transactional Map data structure in JavaScript.

A coding challenge covered in this blog:
https://triplebyte.com/blog/the-best-worst-and-most-interesting-moments-from-my-marathon-month-of-technical-interviews/ (subheading: "Solving the Trickiest System Design Question")

## Requirements

An interactive shell that understands the commands below.

To start the shell, run `npm start`.

## Commands

- `SET [key] [value]`: Sets the given key to the specified value. If the key is already present, overwrite the old value.
- `GET [key]`: Prints out the current value of the specified key. If the key has not been set, it prints a default message.
- `DELETE [key]`: Deletes the given key. If the key has not been set, ignore.
- `COUNT [value]`: Returns the number of keys that have been set to the specified value. If no keys have been set to that value, prints 0.
- `BEGIN`: Starts a transaction. These transactions allow you to modify the state of the system and commit or rollback your changes.
- `COMMIT`: Commits the changes made within the context of the active transaction and ends the active transaction.
- `ROLLBACK`: Throws away changes made within the context of the active transaction and ends the active transaction. If no transaction is active, prints NO TRANSACTION

### Examples

```
> BEGIN //Creates a new transaction
> SET X 5
> SET Y 19
> GET Y
Y = 19
```

```
> BEGIN //Creates a new transaction which is currently active
> SET X 5
> SET Y 19
> GET Y
Y = 19
> ROLLBACK //Throws away the changes made
> GET Y
Y not set // Changes made by SET Y 19 have been discarded
```

```
> BEGIN //Creates a new transaction which is currently active
> SET X 5
> SET Y 19
> BEGIN //Spawns a new transaction in the context of the previous transaction and now this is currently active
> GET Y
Y = 19 //The new transaction has access to the context of its parent transaction**
> SET Y 23
> COMMIT //Y's new value has been persisted to the key-value store**
> GET Y
Y = 23 // Changes made by SET Y 19 have been discarded**
```
