// JavaScript source code
var MapSize = 4;




function Test() {
    var mapObj = {
        Map: [[0, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0]]
    };

    var moveList = [];
    // YOU CAN EDIT MOVE DIRECTION HERE USE [push] COMMAND
    moveList.push(DIRECTION.LEFT);
    moveList.push(DIRECTION.RIGHT);
    moveList.push(DIRECTION.UP);
    moveList.push(DIRECTION.DOWN);
    moveList.push(DIRECTION.LEFT);


    moveList.forEach(function(moveDirection) {
        Move(mapObj, moveDirection);
    });
}






///////////// 動作 Start /////////////////

// 執行一次 移動動作
function Move(mapObj, direction) {

    if (IsCanDoMove(mapObj, direction)) {
        DoMove(mapObj, direction);
        GetRandNewItem(mapObj);
    }
}

// 判斷整張 Map 是否可以向某個方向移動或加總
function IsCanDoMove(mapObj, direction) {
    if (mapObj.Map.length !== MapSize)
        return false;

    for (var k = 0; k < mapObj.Map.length; k++) {
        if (mapObj.Map[k].length !== MapSize)
            return false;
    }
    if (direction === DIRECTION.ALL)  // all 不可使用在此
        return false;


    // 指定方向是否可合成
    if (IsCanDoMerge(mapObj, direction)) {
        return true;
    }

    // 指定方向Item 是否都已靠緊此方向
    if (!IsComeCloseToBound(mapObj, direction)) {
        return true;
    }

    return false;
}

// 根據指定方向做移動
function DoMove(mapObj, direction) {
    // 步驟: a. 先做一次 MoveArray 根據方向堆疊好
    //      b. 進行 Merge
    //      c. 再做一次 MoveArray 將 Merge 後狀態再次堆疊好 
    MoveArray(mapObj, direction);
    MergeArray(mapObj, direction);
    MoveArray(mapObj, direction);
}

//從 Map 中選出一格原為 0 的位置，設為 2 or 4 的值
function GetRandNewItem(mapObj) {
    // 取出 map 中 為 0 的位置
    var zeroArray = [];

    for (var i = 0; i < MapSize; i++) {
        for (var j = 0; j < MapSize; j++) {
            if (GetItemValue(mapObj, i, j) === 0) {
                zeroArray.push({ X: i, Y: j }); // add
            }
        }
    }

    if (zeroArray.length > 0) {
        var count = zeroArray.length - 1;
        var index = Random(0, count);
        var value = Random(1, 2) * 2;
        if (index >= 0 && zeroArray.length > index) {
            var item = zeroArray[index];
            SetItemValue(mapObj, item.X, item.Y, value);
        }
    }
}

///////////// 動作 End /////////////////




///////////// 移動 Start /////////////////

// 根據指定方向移動整個 Map
function MoveArray(mapObj, direction) {
    if (direction === DIRECTION.ALL)
        return;

    if (mapObj.Map.length <= 0)
        return;
    if (mapObj.Map[0].length <= 0)
        return;

    var xlower = 0;
    var xupper = mapObj.Map.length - 1;
    var ylower = 0;
    var yupper = mapObj.Map[0].length - 1;


    // 設定檢查上下界
    if (direction === DIRECTION.UP)
        ylower += 1;
    else if (direction === DIRECTION.DOWN)
        yupper -= 1;
    else if (direction === DIRECTION.LEFT)
        xlower += 1;
    else if (direction === DIRECTION.RIGHT)
        xupper -= 1;

    if (xlower > xupper || ylower > yupper)
        return;

    // 一次幫一個 Item 找到新位置
    // 順序需以 direction 方向為主
    var i, j;
    if (direction === DIRECTION.UP) {
        // x軸由下往上
        // y軸順序不限
        for ( j = ylower; j <= yupper; j++) {
            for (i = xupper; i >= xlower; i--) {
                if (GetItemValue(mapObj, i, j) !== 0)
                    MoveItem(mapObj, direction, i, j);
            }
        }
    }
    else if (direction === DIRECTION.DOWN) {
        // x軸由上往下
        // y軸順序不限
        for (j = ylower; j <= yupper; j++) {
            for (i = xlower; i <= xupper; i++) {
                if (GetItemValue(mapObj, i, j) !== 0)
                    MoveItem(mapObj, direction, i, j);
            }
        }
    }
    else if (direction === DIRECTION.LEFT) {
        // x軸順序不限
        // y軸由左往右
        for ( i = xlower; i <= xupper; i++) {
            for (j = ylower; j <= yupper; j++) {
                if (GetItemValue(mapObj, i, j) !== 0)
                    MoveItem(mapObj, direction, i, j);
            }
        }
    }
    else if (direction === DIRECTION.RIGHT) {
        // x軸順序不限
        // y軸由右往左
        for ( i = xlower; i <= xupper; i++) {
            for (j = yupper; j >= ylower; j--) {
                if(GetItemValue(mapObj, i, j) !== 0)
                    MoveItem(mapObj, direction, i, j);
            }
        }
    }
}

// 幫指定 Item 移動到新位置 
function MoveItem(mapObj, direction, x, y) {
    var value = GetItemValue(mapObj, x, y);

    var nIndex = FindBlank(mapObj, direction, x, y);
    SetItemValue(mapObj, nIndex.X, nIndex.Y, value);
    SetItemValue(mapObj, x, y, 0);
}

// 從指定的 Item 往指定方向找空白格，並回傳空白格座標
function FindBlank(mapObj, direction, x, y) {
    var oIndex = { X: x, Y: y };
    var nIndex = { X: x, Y: y };  // default
    var i, j;

    if (direction === DIRECTION.UP) {
        //Y座標遞減，X座標固定
        for (j = oIndex.Y - 1; j >= 0; j--) {
            if (GetItemValue(mapObj, oIndex.X, j) !== 0) {
                nIndex = { X: oIndex.X, Y: j + 1 }; //若找到某一格值非 0 ，則可移動位置為前一格
                break;
            }
        }
    }
    else if (direction === DIRECTION.DOWN) {
        //Y座標遞增，X座標固定
        for (j = oIndex.Y + 1; j <= MapSize; j++) {
            if (GetItemValue(mapObj, oIndex.X, j) !== 0) {
                nIndex = { X: oIndex.X, Y: j - 1 }; //若找到某一格值非 0 ，則可移動位置為前一格
                break;
            }
        }
    }
    else if (direction === DIRECTION.LEFT) {
        //Y座標固定，X座標遞減
        for (i = oIndex.X - 1; i >= 0; i--) {
            if (GetItemValue(mapObj, i, oIndex.Y) !== 0) {
                nIndex = { X: i + 1, Y: oIndex.Y }; //若找到某一格值非 0 ，則可移動位置為前一格
                break;
            }
        }
    }
    else if (direction === DIRECTION.RIGHT) {
        //Y座標固定，X座標遞增
        for (i = oIndex.X + 1; i <= MapSize; i++) {
            if (GetItemValue(mapObj, i, oIndex.Y) !== 0) {
                nIndex = { X: i - 1, Y: oIndex.Y }; //若找到某一格值非 0 ，則可移動位置為前一格
                break;
            }
        }
    }

    return nIndex;
}

///////////// 移動 End /////////////////



///////////// 加總 Start /////////////////

// 根據指定方向加總整個 Map
function MergeArray(mapObj, direction) {
    if (direction === DIRECTION.ALL)
        return ;

    if (mapObj.Map.length <= 0)
        return ;
    if (mapObj.Map[0].length <= 0)
        return ;

    var xlower = 0;
    var xupper = mapObj.Map.length - 1;
    var ylower = 0;
    var yupper = mapObj.Map[0].length - 1;


    // 設定檢查上下界
    if (direction === DIRECTION.UP)
        ylower += 1;
    else if (direction === DIRECTION.DOWN)
        yupper -= 1;
    else if (direction === DIRECTION.LEFT)
        xlower += 1;
    else if (direction === DIRECTION.RIGHT)
        xupper -= 1;

    if (xlower > xupper || ylower > yupper)
        return ;

    for (var i = xlower; i <= xupper; i++) {
        for (var j = ylower; j <= yupper; j++) {
            MergeItem(mapObj, direction, i, j);
        }
    }
}

// 根據指定方向 針對指定 Item 進行加總 (或無可加總)
function MergeItem(mapObj, direction, x, y) {
    var target = {
        X : x,
        Y : y,
        Value :GetItemValue(mapObj, x, y)
    };

    var compare = {
        X,
        Y,
        Value
    };

    if (direction === DIRECTION.ALL)
        return;

    if (direction === DIRECTION.UP) {
        compare = {
            X: x,
            Y: y - 1,
            Value: GetItemValue(mapObj, x, y -1)
        };
    }
    else if (direction === DIRECTION.DOWN) {
        compare = {
            X: x,
            Y: y + 1,
            Value: GetItemValue(mapObj, x, y + 1)
        };
    }
    else if (direction === DIRECTION.LEFT) {
        compare = {
            X: x - 1,
            Y: y ,
            Value: GetItemValue(mapObj, x - 1, y)
        };
    }
    else if (direction === DIRECTION.RIGHT) {
        compare = {
            X: x + 1,
            Y: y,
            Value: GetItemValue(mapObj, x + 1, y)
        };
    }

    // 指定方向有相同值，做 Merge
    if (target.Value !== null &&
        compare.Value !== null &&
        compare.Value === target.Value) {

        // 兩倍數值會加入 compare , target 則變為 0
        SetItemValue(mapObj, target.X, target.Y, 0);
        SetItemValue(mapObj, compare.X, compare.Y, compare.Value + target.Value);
    }
}

///////////// 加總 End /////////////////


///////////// 判斷是否可移動 Start /////////////////

// 判斷整張 Map 是否已全部貼緊某方向
function IsComeCloseToBound(mapObj, direction) {
    //已在特定方向 bound 的不檢查
    //其他 Item 檢查是否可以向指定方向移動 (指定方向之value是否為0)

    if (direction === DIRECTION.ALL) 
        return false;
    
    if (mapObj.Map.length <= 0)
        return false;
    if (mapObj.Map[0].length <= 0)
        return false;

    var xlower = 0;
    var xupper = mapObj.Map.length - 1;
    var ylower = 0;
    var yupper = mapObj.Map[0].length - 1;


    // 設定檢查上下界
    if (direction === DIRECTION.UP) 
        ylower += 1;
    else if (direction === DIRECTION.DOWN) 
        yupper -= 1;
    else if (direction === DIRECTION.LEFT) 
        xlower += 1;
    else if (direction === DIRECTION.RIGHT) 
        xupper -= 1;

    if(xlower > xupper || ylower > yupper)
        return false;

    for (var i = xlower; i <= xupper; i++) {
        for (var j = ylower; j <= yupper; j++) {
            var comp = null;
            if (target !== 0) {  //此格有數字
                if (direction === DIRECTION.UP) 
                    comp = GetUpValue(mapObj, x, y);
                else if (direction === DIRECTION.DOWN)
                    comp = GetDownValue(mapObj, x, y);
                else if (direction === DIRECTION.LEFT)
                    comp = GetLeftValue(mapObj, x, y);
                else if (direction === DIRECTION.RIGHT)
                    comp = GetRightValue(mapObj, x, y);

                if (comp === null)
                    continue;

                if (comp === 0) // 待比較的方向的下一格數字為 0 (空格)
                    return true;
            }
        }
    }

    return false;
}

// 判斷整張 Map 是否有可加總的數字
function IsCanDoMerge(mapObj, direction) {
    for (var i = 0; i < MapSize; i++) {
        for (var j = 0; j < MapSize; j++) {
            if (IsItemCanMerge(mapObj, direction, i, j))
                return true;
        }
    }
    return false;
}

// 根據指定方向 判斷指定 Item 是否可加總
function IsItemCanMerge(mapObj, direction, x, y) {
    var targetValue = GetItemValue(mapObj, x, y);
    var compareArray = [];

    if (direction === DIRECTION.ALL) {
        compareArray = [
            GetUpValue(mapObj, x, y), GetLeftValue(mapObj, x, y),
            GetRightValue(mapObj, x, y), GetDownValue(mapObj, x, y)
        ];
    }
    else if (direction === DIRECTION.UP) {
        compareArray = [
            GetUpValue(mapObj, x, y)
        ];
    }
    else if (direction === DIRECTION.DOWN) {
        compareArray = [
            GetDownValue(mapObj, x, y)
        ];
    }
    else if (direction === DIRECTION.LEFT) {
        compareArray = [
            GetLeftValue(mapObj, x, y)
        ];
    }
    else if (direction === DIRECTION.RIGHT) {
        compareArray = [
            GetRightValue(mapObj, x, y)
        ];
    }

    // 若有包含，代表指定方向有相同值
    return Contains(compareArray, targetValue);
}

///////////// 判斷是否可移動 End /////////////////


///////////// 基礎功能 Start /////////////////

// 判斷陣列中是否有包含 target value
function Contains(array, target) {
    if(array.length <= 0)
        return false;

    for (var i = 0; i < array.length; i++) {
        if(array[i] === target)
            return true;
    }

    return false;
}

// 根據 array 及 x,y 取得陣列中特定位置的值
function GetItemValue(mapObj, x, y) {
    if(x < 0)
        return null;

    if(y < 0)
        return null;

    if (mapObj.Map.length <= x)
        return null;

    if (mapObj.Map[x].length <= y)
        return null;

    return mapObj.Map[x][y];
}

function GetLeftValue(mapObj, x, y) {
    GetItemValue(mapObj, x - 1, y);
}

function GetRightValue(mapObj, x, y) {
    GetItemValue(mapObj, x + 1, y);
}

function GetUpValue(mapObj, x, y) {
    GetItemValue(mapObj, x, y - 1);
}

function GetDownValue(mapObj, x, y) {
    GetItemValue(mapObj, x, y + 1);
}


function SetItemValue(mapObj, x, y, value) {
    if(x < 0)
        return false;

    if(y < 0)
        return false;

    if (mapObj.Map.length <= x)
        return false;

    if (mapObj.Map[x].length <= y)
        return false;

    mapObj.Map[x][y] = value;
    return true;
}

function SetLeftValue(mapObj, x, y, value) {
    return SetItemValue(mapObj, x - 1, y, value);
}

function SetRightValue(mapObj, x, y, value) {
    return SetItemValue(mapObj, x + 1, y, value);
}

function SetUpValue(mapObj, x, y, value) {
    return SetItemValue(mapObj, x, y - 1, value);
}

function SetDownValue(mapObj, x, y, value) {
    return SetItemValue(mapObj, x, y + 1, value);
}

// 根據設定的最大最小值產生亂數
function Random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

///////////// 基礎功能 End /////////////////



