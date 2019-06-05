const bosses = [
    {
        names: ['Морх']
    },
    {
        names: ['Зоноз', "Зон'оз"]
    },
    {
        names: ['Йорик', "Йор'садж", 'Йорсадж', 'Йорсардж']
    },
    {
        names: ['Хагара']
    },
    {
        names: ['Ультра', 'Ультраксион']
    },
    {
        names: ['Воевода']
    },
    {
        names: ['Спина', 'Хребет']
    },
    {
        names: ['Безумие', 'Меднес']
    },
    {
        names: ['Рагна', 'Рагнарос']
    }
]


let classes = [
    {
        classNames: ['рыцарь смерти', 'дк'], 
        specs: [
            {designation: 'adk', specNames: ['адк', 'анхоли', 'нечестивость']}, 
            {designation: 'fdk', specNames: ['фдк', 'фрост','лед','лёд']}
        ]
    }, 
    {
        classNames: ['воин', 'вар'], 
        specs: [
            {designation: 'awar', specNames: ['авар', 'армс', 'оружие']}, 
            {designation: 'fwar', specNames: ['фвар', 'фури', 'неистовство']}
        ]
    }, 
    {
        classNames: ['паладин', 'пал'], 
        specs: [
            {designation: 'rpal', specNames: ['рпал', 'ретри','воздаяние']}, 
            {designation: 'miss', specNames: []}
        ]
    }, 
    {
        classNames: ['шаман', 'шам'], 
        specs: [
            {designation: 'elem', specNames: ['элем', 'стихии']}, 
            {designation: 'enh', specNames: ['энх', 'совершенствование']}
        ]
    },
    {
        classNames: ['охотник', 'хант'], 
        specs: [
            {designation: 'surf', specNames: ['схант', 'сурв', 'выживание']}, 
            {designation: 'mm', specNames: ['мхант','мм', 'стрельба']}
        ]
    }, 
    {
        classNames: ['разбойник', 'рога'], 
        specs: [
            {designation: 'combat', specNames: ['крога', 'комбат', 'бой']}, 
            {designation: 'likvid', specNames: ['лрога','ликвидация', 'мути']}, 
            {designation: 'skrit', specNames: ['срога','скрытность', 'шд', 'саб']}
        ]
    },   
    {
        classNames: ['друид', 'дру'], 
        specs: [
            {designation: 'bear', specNames: ['мишка', 'медведь']}, 
            {designation: 'balance', specNames: ['сова','баланс', 'мунк']}, 
            {designation: 'cat', specNames: ['кот']}
        ]
    },  
    {
        classNames: ['маг', 'волшебник'], 
        specs: [
            {designation: 'amage', specNames: ['аркан', 'тайная магия']}, 
            {designation: 'fmage', specNames: ['фаер','огонь']}
        ]
    },  
    {
        classNames: ['чернокнижник', 'лок', 'варлок'], 
        specs: [
            {designation: 'destro', specNames: ['дестрик', 'разрушение']}, 
            {designation: 'demon', specNames: ['демон','демонология']}, 
            {designation: 'aflic', specNames: ['афлик', 'колдовство']}
        ]
    },  
    {
        classNames: ['прист', 'жрец'], 
        specs: [
            {designation: 'shp', specNames: ['шп', 'тьма', 'шэдоу']}
        ]
    }
]

module.exports = {bosses, classes};