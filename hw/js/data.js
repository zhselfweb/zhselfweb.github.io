// 科目数据
const subjects = [
    { id: 'c', name: '愉快的國文', icon: 'fa-book', color: 'bg-red-500/20 text-red-400', day: 'saturday' },
    { id: 'mp', name: '狼師(進度)', icon: 'fa-calculator', color: 'bg-blue-500/20 text-blue-400', day: 'tuesday' },
    { id: 'mr', name: '狼師(複習)', icon: 'fa-calculator', color: 'bg-indigo-500/20 text-indigo-400', day: 'saturday' },
    { id: 'b', name: '好吵的生物', icon: 'fa-bacteria', color: 'bg-green-500/20 text-green-400', day: 'sunday' }
];

// 作业数据
const homeworkData = [
    {
        id: 1,
        subject: 'c',
        title: '國文',
        description: '紅123~128,133,139~142；綠89,90,95,116,117；國寫:尊重',
        dueDate: '2025/9/27',
        isCompleted: false,
        details: '第11回，快哉庭，赤壁賦；國寫:尊重',
        additionalInfo: '難過的不熟局'
    },
    {
        id: 2,
        subject: 'b',
        title: '生物',
        description: '27,29,33',
        dueDate: '2025/10/5',
        isCompleted: false,
        details: '光合作用，呼吸作用，染色質體，細胞週期，細胞分裂',
        additionalInfo: '愉快的不用不熟局'
    },
    {
        id: 3,
        subject: 'mp',
        title: '數學(進度)',
        description: '8,9,28~32',
        dueDate: '2025/9/23',
        isCompleted: false,
        details: '極限與函數',
        additionalInfo: '無聊的高斯局'
    },
    {
        id: 4,
        subject: 'mr',
        title: '數學(複習)',
        description: '15級分上26~30回，下31~46回',
        dueDate: '2025/10/25',
        isCompleted: false,
        details: '啊啊啊啊啊啊啊啊啊啊啊',
        additionalInfo: '無聊的高斯局'
    },
    {
        id: 5,
        subject: 'mp',
        title: '數學(進度)',
        description: '指對數60~79',
        dueDate: '2025/9/23',
        isCompleted: false,
        details: '啊啊啊啊啊啊啊啊啊啊啊',
        additionalInfo: '無聊的高斯局'
    }

];
