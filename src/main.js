import './style.scss';

const categoryColors = {
    'Marketing': '#03CEA4', 
    'Management': '#5A87FC',
    'Development': '#7772F1',
    'Design': '#F52F6E',    
    'HR & Recruiting': '#F89828'
};
const coursesData = [
    {
        id: 1,
        category: 'Marketing',
        title: 'The Ultimate Google Ads Training Course',
        price: 100,
        author: 'Jerome Bell',
        image: '/images/Jerome_Bell.jpg'
    },
    {
        id: 2,
        title: 'Prduct Management Fundamentals',
        category: 'Management',
        price: 480,
        author: 'Marvin McKinney',
        image: '/images/Marvin_McKinney.jpg'
    },
    {
        id: 3,
        title: 'HR  Management and Analytics',
        category: 'HR & Recruiting',
        price: 200,
        author: 'Leslie Alexander Li',
        image: '/images/Leslie_Alexander_Li.jpg'
    },
    {
        id: 4,
        title: 'Brand Management & PR Communications',
        category: 'Marketing',
        price: 530,
        author: 'Kristin Watson',
        image: '/images/Kristin_Watson.jpg'
    },
    {
        id: 5,
        title: 'Graphic Design Basic',
        category: 'Design',
        price: 500,
        author: 'Guy Hawkins',
        image: '/images/Guy_Hawkins.jpg'
    },
    {
        id: 6,
        title: 'Business Development Management',
        category: 'Management',
        price: 400,
        author: 'Dianne hRussell',
        image: '/images/Dianne_Russell.jpg'
    },
    {
        id: 7,
        title: 'Highload Software Architecture',
        category: 'Development',
        price: 600,
        author: 'Brooklyn Simmons',
        image: '/images/Brooklyn_Simmons.jpg'
    },
    {
        id: 8,
        title: 'Human Resources – Selection and Recruitment',
        category: 'HR & Recruiting',
        price: 150,
        author: 'by Kathryn Murphy',
        image: '/images/Kathryn_Murphy.jpg'
    },
    {
        id: 9,
        title: 'User Experience. Human-centered Design',
        category: 'Design',
        price: 240,
        author: 'Cody Fisher',
        image: '/images/Cody_Fisher.jpg'
    },
];

// Класс для управления карточками
class CoursesManager {
    constructor() {
        this.container = document.getElementById('courses-grid');
        this.activeFilter = 'all';
        this.searchQuery = '';
        this.filterCounts = this.calculateFilterCounts();
        this.init();
    }

    init() {
        this.renderCourses();
        this.bindEvents();
        this.updateFilterCounts();
    }

    // Подсчет количества курсов по категориям
    calculateFilterCounts() {
        const counts = {
            all: coursesData.length,
            marketing: 0,
            management: 0,
            hr: 0,
            design: 0,
            development: 0
        };

        coursesData.forEach(course => {
            const category = course.category.toLowerCase();
            if (category.includes('marketing')) counts.marketing++;
            if (category.includes('management')) counts.management++;
            if (category.includes('hr') || course.category.includes('Recruiting')) counts.hr++;
            if (category.includes('design')) counts.design++;
            if (category.includes('development')) counts.development++;
        });

        return counts;
    }

    // Обновление счетчиков в фильтрах
    updateFilterCounts() {
        // Маппинг названий фильтров из HTML
        const filterMap = {
            'all': 'All',
            'marketing': 'Marketing',
            'management': 'Management',
            'hr': 'HR & Recruiting',
            'design': 'Design',
            'development': 'Development'
        };

        Object.keys(this.filterCounts).forEach(filterKey => {
            const filterName = filterMap[filterKey];
            // Ищем кнопку по тексту (без счетчика)
            const buttons = document.querySelectorAll('.filter');
            buttons.forEach(button => {
                const buttonText = button.textContent.replace(/[\d]+/, '').trim();
                if (buttonText === filterName) {
                    const countSpan = button.querySelector('.filter__count');
                    if (countSpan) {
                        countSpan.textContent = this.filterCounts[filterKey];
                    }
                }
            });
        });
    }

    // Создание HTML для карточки
    createCourseCard(course) {
       const categoryColor = categoryColors[course.category] || '#FF3F3A';

     return `
            <article class="course-card">
                <div class="course-card__image">
                    <img src="${course.image}" alt="${course.title}">
                </div>
                <div class="course-card__content">
                    <div class="course-card__category" style="background-color: ${categoryColor};">
                        ${course.category}
                    </div>
                    <h3 class="course-card__title">${course.title}</h3>
                    <div class="course-card__info">
                        <span class="course-card__price">$${course.price}</span>
                        <span class="course-card__separator">|</span>
                        <span class="course-card__author">by ${course.author}</span>
                    </div>
                </div>
            </article>
        `;
    
}

    // Рендер всех курсов
    renderCourses() {
        if (!this.container) return;
        
        this.container.innerHTML = '';

        // Фильтрация
        let filteredCourses = this.filterCourses(coursesData);
        
        // Поиск
        if (this.searchQuery) {
            filteredCourses = this.searchCourses(filteredCourses);
        }

        // Рендер
        if (filteredCourses.length === 0) {
            this.container.innerHTML = '<div class="no-results">No courses found</div>';
            return;
        }

        filteredCourses.forEach(course => {
            this.container.innerHTML += this.createCourseCard(course);
        });
    }

    // Фильтрация по категории
    filterCourses(courses) {
        if (this.activeFilter === 'all') return courses;

        return courses.filter(course => {
            const courseCategory = course.category.toLowerCase();
            const activeFilter = this.activeFilter;

            // Специальная логика для HR & Recruiting
            if (activeFilter === 'hr') {
                return courseCategory.includes('hr') || courseCategory.includes('recruiting');
            }

            return courseCategory.includes(activeFilter);
        });
    }

    // Поиск по курсам
    searchCourses(courses) {
        if (!this.searchQuery) return courses;

        const query = this.searchQuery.toLowerCase();
        return courses.filter(course => 
            (course.title || '').toLowerCase().includes(query) ||
            (course.author || '').toLowerCase().includes(query) ||
            (course.category || '').toLowerCase().includes(query)
        );
    }

    // Получение ключа фильтра по тексту кнопки
    getFilterKey(buttonText) {
        const filterMap = {
            'All': 'all',
            'Marketing': 'marketing',
            'Management': 'management',
            'HR & Recruiting': 'hr',
            'Design': 'design',
            'Development': 'development'
        };
        
        return filterMap[buttonText] || 'all';
    }

    // Обработка клика на фильтр
    handleFilterClick(button) {
        // Получаем текст кнопки без счетчика
        const buttonText = button.textContent.replace(/[\d]+/, '').trim();
        const filter = this.getFilterKey(buttonText);
        
        console.log('Filter clicked:', buttonText, '->', filter);

        // Обновляем активный фильтр
        document.querySelectorAll('.filter').forEach(btn => {
            btn.classList.remove('filter--active');
        });
        button.classList.add('filter--active');
        
        this.activeFilter = filter;
        this.searchQuery = '';
        
        // Очищаем поиск
        const searchInput = document.querySelector('.search__input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Перерисовываем курсы
        this.renderCourses();
    }

    // Обработка поиска
    handleSearch(query) {
        this.searchQuery = query.toLowerCase().trim();
        
        // Сбрасываем фильтр при поиске (активируем "All")
        if (this.searchQuery) {
            document.querySelectorAll('.filter').forEach(btn => {
                btn.classList.remove('filter--active');
            });
            
            // Активируем кнопку "All"
            const buttons = document.querySelectorAll('.filter');
            buttons.forEach(button => {
                const buttonText = button.textContent.replace(/[\d]+/, '').trim();
                if (buttonText === 'All') {
                    button.classList.add('filter--active');
                }
            });
            
            this.activeFilter = 'all';
        }
        
        this.renderCourses();
    }

    // Настройка событий
    bindEvents() {
        // Фильтры
        const filterButtons = document.querySelectorAll('.filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleFilterClick(button);
            });
        });

        const searchInput = document.querySelector('.search__input');
        if (searchInput) {
            let timeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const coursesManager = new CoursesManager();
    
    // Для отладки: выводим данные в консоль
    console.log('CoursesManager initialized with', coursesData.length, 'courses');
});