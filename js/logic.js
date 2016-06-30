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






///////////// �ʧ@ Start /////////////////

// ����@�� ���ʰʧ@
function Move(mapObj, direction) {

    if (IsCanDoMove(mapObj, direction)) {
        DoMove(mapObj, direction);
        GetRandNewItem(mapObj);
    }
}

// �P�_��i Map �O�_�i�H�V�Y�Ӥ�V���ʩΥ[�`
function IsCanDoMove(mapObj, direction) {
    if (mapObj.Map.length !== MapSize)
        return false;

    for (var k = 0; k < mapObj.Map.length; k++) {
        if (mapObj.Map[k].length !== MapSize)
            return false;
    }
    if (direction === DIRECTION.ALL)  // all ���i�ϥΦb��
        return false;


    // ���w��V�O�_�i�X��
    if (IsCanDoMerge(mapObj, direction)) {
        return true;
    }

    // ���w��VItem �O�_���w�a�򦹤�V
    if (!IsComeCloseToBound(mapObj, direction)) {
        return true;
    }

    return false;
}

// �ھګ��w��V������
function DoMove(mapObj, direction) {
    // �B�J: a. �����@�� MoveArray �ھڤ�V���|�n
    //      b. �i�� Merge
    //      c. �A���@�� MoveArray �N Merge �᪬�A�A�����|�n 
    MoveArray(mapObj, direction);
    MergeArray(mapObj, direction);
    MoveArray(mapObj, direction);
}

//�q Map ����X�@��쬰 0 ����m�A�]�� 2 or 4 ����
function GetRandNewItem(mapObj) {
    // ���X map �� �� 0 ����m
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

///////////// �ʧ@ End /////////////////




///////////// ���� Start /////////////////

// �ھګ��w��V���ʾ�� Map
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


    // �]�w�ˬd�W�U��
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

    // �@�����@�� Item ���s��m
    // ���ǻݥH direction ��V���D
    var i, j;
    if (direction === DIRECTION.UP) {
        // x�b�ѤU���W
        // y�b���Ǥ���
        for ( j = ylower; j <= yupper; j++) {
            for (i = xupper; i >= xlower; i--) {
                if (GetItemValue(mapObj, i, j) !== 0)
                    MoveItem(mapObj, direction, i, j);
            }
        }
    }
    else if (direction === DIRECTION.DOWN) {
        // x�b�ѤW���U
        // y�b���Ǥ���
        for (j = ylower; j <= yupper; j++) {
            for (i = xlower; i <= xupper; i++) {
                if (GetItemValue(mapObj, i, j) !== 0)
                    MoveItem(mapObj, direction, i, j);
            }
        }
    }
    else if (direction === DIRECTION.LEFT) {
        // x�b���Ǥ���
        // y�b�ѥ����k
        for ( i = xlower; i <= xupper; i++) {
            for (j = ylower; j <= yupper; j++) {
                if (GetItemValue(mapObj, i, j) !== 0)
                    MoveItem(mapObj, direction, i, j);
            }
        }
    }
    else if (direction === DIRECTION.RIGHT) {
        // x�b���Ǥ���
        // y�b�ѥk����
        for ( i = xlower; i <= xupper; i++) {
            for (j = yupper; j >= ylower; j--) {
                if(GetItemValue(mapObj, i, j) !== 0)
                    MoveItem(mapObj, direction, i, j);
            }
        }
    }
}

// �����w Item ���ʨ�s��m 
function MoveItem(mapObj, direction, x, y) {
    var value = GetItemValue(mapObj, x, y);

    var nIndex = FindBlank(mapObj, direction, x, y);
    SetItemValue(mapObj, nIndex.X, nIndex.Y, value);
    SetItemValue(mapObj, x, y, 0);
}

// �q���w�� Item �����w��V��ťծ�A�æ^�Ǫťծ�y��
function FindBlank(mapObj, direction, x, y) {
    var oIndex = { X: x, Y: y };
    var nIndex = { X: x, Y: y };  // default
    var i, j;

    if (direction === DIRECTION.UP) {
        //Y�y�л���AX�y�ЩT�w
        for (j = oIndex.Y - 1; j >= 0; j--) {
            if (GetItemValue(mapObj, oIndex.X, j) !== 0) {
                nIndex = { X: oIndex.X, Y: j + 1 }; //�Y���Y�@��ȫD 0 �A�h�i���ʦ�m���e�@��
                break;
            }
        }
    }
    else if (direction === DIRECTION.DOWN) {
        //Y�y�л��W�AX�y�ЩT�w
        for (j = oIndex.Y + 1; j <= MapSize; j++) {
            if (GetItemValue(mapObj, oIndex.X, j) !== 0) {
                nIndex = { X: oIndex.X, Y: j - 1 }; //�Y���Y�@��ȫD 0 �A�h�i���ʦ�m���e�@��
                break;
            }
        }
    }
    else if (direction === DIRECTION.LEFT) {
        //Y�y�ЩT�w�AX�y�л���
        for (i = oIndex.X - 1; i >= 0; i--) {
            if (GetItemValue(mapObj, i, oIndex.Y) !== 0) {
                nIndex = { X: i + 1, Y: oIndex.Y }; //�Y���Y�@��ȫD 0 �A�h�i���ʦ�m���e�@��
                break;
            }
        }
    }
    else if (direction === DIRECTION.RIGHT) {
        //Y�y�ЩT�w�AX�y�л��W
        for (i = oIndex.X + 1; i <= MapSize; i++) {
            if (GetItemValue(mapObj, i, oIndex.Y) !== 0) {
                nIndex = { X: i - 1, Y: oIndex.Y }; //�Y���Y�@��ȫD 0 �A�h�i���ʦ�m���e�@��
                break;
            }
        }
    }

    return nIndex;
}

///////////// ���� End /////////////////



///////////// �[�` Start /////////////////

// �ھګ��w��V�[�`��� Map
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


    // �]�w�ˬd�W�U��
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

// �ھګ��w��V �w����w Item �i��[�` (�εL�i�[�`)
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

    // ���w��V���ۦP�ȡA�� Merge
    if (target.Value !== null &&
        compare.Value !== null &&
        compare.Value === target.Value) {

        // �⭿�ƭȷ|�[�J compare , target �h�ܬ� 0
        SetItemValue(mapObj, target.X, target.Y, 0);
        SetItemValue(mapObj, compare.X, compare.Y, compare.Value + target.Value);
    }
}

///////////// �[�` End /////////////////


///////////// �P�_�O�_�i���� Start /////////////////

// �P�_��i Map �O�_�w�����K��Y��V
function IsComeCloseToBound(mapObj, direction) {
    //�w�b�S�w��V bound �����ˬd
    //��L Item �ˬd�O�_�i�H�V���w��V���� (���w��V��value�O�_��0)

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


    // �]�w�ˬd�W�U��
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
            if (target !== 0) {  //���榳�Ʀr
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

                if (comp === 0) // �ݤ������V���U�@��Ʀr�� 0 (�Ů�)
                    return true;
            }
        }
    }

    return false;
}

// �P�_��i Map �O�_���i�[�`���Ʀr
function IsCanDoMerge(mapObj, direction) {
    for (var i = 0; i < MapSize; i++) {
        for (var j = 0; j < MapSize; j++) {
            if (IsItemCanMerge(mapObj, direction, i, j))
                return true;
        }
    }
    return false;
}

// �ھګ��w��V �P�_���w Item �O�_�i�[�`
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

    // �Y���]�t�A�N����w��V���ۦP��
    return Contains(compareArray, targetValue);
}

///////////// �P�_�O�_�i���� End /////////////////


///////////// ��¦�\�� Start /////////////////

// �P�_�}�C���O�_���]�t target value
function Contains(array, target) {
    if(array.length <= 0)
        return false;

    for (var i = 0; i < array.length; i++) {
        if(array[i] === target)
            return true;
    }

    return false;
}

// �ھ� array �� x,y ���o�}�C���S�w��m����
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

// �ھڳ]�w���̤j�̤p�Ȳ��Ͷü�
function Random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

///////////// ��¦�\�� End /////////////////



