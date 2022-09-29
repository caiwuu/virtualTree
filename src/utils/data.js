export const data = {
    list: [
        {id:1, pid:0, level:0, position:1, checkType:0, name: "父节点1", collapsed: false, isLeaf: false, data: {}},
        {id:11, pid:1,level:1, position:1-11, checkType:0, name: "子节点11", collapsed: false, isLeaf: false, data: {}},
        {id:111, pid:11,level:2, position:1-11-111, checkType:0, name: "子节点111", collapsed: false, isLeaf: true, data: {}},
        {id:1111, pid:11,level:2, position:1-11-1111, checkType:0, name: "子节点1111", collapsed: false, isLeaf: true, data: {}},
        {id:12, pid:1,level:1, position:1-12, checkType:0, name: "子节点12", collapsed: true,isLeaf: true, data: {}},
    ]
}
