// 科目
const subjects = [
    { id: 'c', name: '愉快的國文', icon: 'fa-book', color: 'bg-red-500/20 text-red-400', day: 'saturday' },
    { id: 'mp', name: '狼師(進度)', icon: 'fa-calculator', color: 'bg-blue-500/20 text-blue-400', day: 'tuesday' },
    { id: 'mr', name: '狼師(複習)', icon: 'fa-calculator', color: 'bg-indigo-500/20 text-indigo-400', day: 'saturday' },
    { id: 'b', name: '好吵的生物', icon: 'fa-bacteria', color: 'bg-green-500/20 text-green-400', day: 'sunday' }
];

// 作業
const homeworkData = [
    {
        id: 1,
        subject: 'c',
        title: '國文',
        description: '紅123~128,133,139~142；綠89,90,96,166,167；國寫:尊重',
        dueDate: '2025/9/27',
        isCompleted: false,
        details: '第11回，快哉庭，赤壁賦；國寫:尊重',
        additionalInfo: '怎麼有人出國啦(°ー° )'
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
        subject: 'mr',
        title: '數學(複習)',
        description: '指對數60~79',
        dueDate: '2025/9/27',
        isCompleted: false,
        details: '啊啊啊啊啊啊啊啊啊啊啊',
        additionalInfo: '無聊的高斯局'
    },
    {
        id: 6,
        subject: 'mp',
        title: '數學(進度)',
        description: '51~54(例題8不寫),56,57 + 考卷3題',
        dueDate: '2025/9/30',
        isCompleted: false,
        details: '極限與函數',
        additionalInfo: '無聊的高斯局'
    },
    {
        id: 7,
        subject: 'mr',
        title: '數學(複習)',
        description: '指數、對數函數上課講義 p77~93',
        dueDate: '2025/10/4',
        isCompleted: false,
        details: '',
        additionalInfo: '難過的不熟局'
    },
    {
    id: 8,
    subject: 'mp',
    title: '數學(進度)',
    description: '65 66 74 88',
    dueDate: '2025/10/7',
    isCompleted: false,
    details: '極限',
    additionalInfo: '考試超絕犯蠢'
},
{
    id: 9,
    subject: 'c',
    title: '國文',
    description: '紅 148~152, 156, 159, 168~172；綠(一) 87, 88, 92~95, 168, 169；國寫：沒有上進心有錯嗎',
    dueDate: '2025/10/4',
    isCompleted: false,
    details: '太多了吧',
    additionalInfo: '又有人消失了'
},
{
    id: 10,
    subject: 'c',
    title: '國文',
    description: '紅(三) 1~4, 11~12, 18~20, 25, 26；綠(一) 170, 171；綠(二) 15~17 ；國寫：緊張的時刻',
    dueDate: '2025/10/11',
    isCompleted: false,
    details: '紅(三) 1~4, 11~12, 18~20, 25, 26\n綠(一) 170, 171\n綠(二) 15~17 \n國寫：緊張的時刻',
    additionalInfo: '又一堆作業🥲'
}

];


