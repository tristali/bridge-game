const Db = require("./db.js");
const CONST = require("./constant.js");

exports.init = () => {
    Db.getAllDataOnce("tables", snapshot => {
        let hasAnyTables = snapshot.val();
        if (!hasAnyTables) {
            module.exports.create();
        }
    });
};

exports.getAll = (newTable, tableIdList) => {
    console.log("tables", tableIdList);
    let list = Object.assign({}, tableIdList);
    let tableId = newTable.id;
    list[tableId] = {
        id: tableId,
        timer: null,
        timeStamp: newTable.timeStamp
    };
    return list;
};

exports.update = (oldTableList, newTableList) => {
    if (!newTableList) {
        return -1;
    }
    return Object.keys(oldTableList).filter(
        tableId => newTableList[tableId] !== true
    )[0];
};

exports.create = () => {
    let tableKey = Db.getNewChildKey("tables");
    console.log("tableKey", tableKey);
    let tableRef = new Date().getTime();
    let newTable = {
        timeStamp: tableRef,
        gameState: "join",
        id: tableKey,
        linkId: tableRef,
        game: CONST.DEFAULT_GAME,
        players: CONST.PLAYERS,
        ready: [false, false, false, false]
    };
    Db.setTableDataById(newTable);
    Db.setTableListData(newTable.linkId, {
        id: newTable.id
    });
};
exports.close = table => {
    console.log("should print this, in Tables.close");
    let updateTable = Object.assign(
        {},
        table,
        {gameState: "close"},
        {timeStamp: new Date().getTime()}
    );
    Db.setTableDataById(updateTable);
    Db.setTableListData(updateTable.linkId, null);
};
