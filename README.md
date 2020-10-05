# tx-map

For coding practice, this is a transactional Map data structure in JavaScript.

A coding challenge covered in this blog:
https://triplebyte.com/blog/the-best-worst-and-most-interesting-moments-from-my-marathon-month-of-technical-interviews/ (subheading: "Solving the Trickiest System Design Question")

## Additional Requirements

This branch implements _Snapshot Isolation_ for each transaction (meaning transactions only see data committed before they began) and uses MVCC similar to [Postgres MVCC](https://wiki.postgresql.org/wiki/MVCC).

To review the original simple implementation, see [MVP Tag](https://github.com/vegetabill/tx-map/releases/tag/mvp).

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
> BEGIN
> SET Y 19
> GET Y
Y = 19
```

```
Client 1     | Client 2
> BEGIN      |
> SET X 3    | > BEGIN
> COMMIT     | > GET X
>            | > X = undefined
             | > ROLLBACK
             | > BEGIN
             | > GET X
             | > X = 3
```
