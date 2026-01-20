import { db } from "@/db"
import { category, product, user } from "@/db/schema"
import "dotenv/config"
import { createAdmin } from "./create-admin"

const categories = [
  { name: "Электроника", linkName: "electronics" },
  { name: "Одежда", linkName: "clothing" },
  { name: "Обувь", linkName: "shoes" },
  { name: "Аксессуары", linkName: "accessories" },
  { name: "Спорт", linkName: "sports" },
]

const products = [
  // Электроника
  {
    name: "Смартфон Samsung Galaxy S24",
    linkName: "samsung-galaxy-s24",
    description: "Флагманский смартфон с мощным процессором и отличной камерой",
    specifications: [
      'Экран: 6.2" Dynamic AMOLED',
      "Процессор: Snapdragon 8 Gen 3",
      "Память: 8GB RAM + 256GB ROM",
      "Камера: 50MP основная",
      "Батарея: 4000 mAh",
    ],
    price: 89999,
    discountPrice: 79999,
    atStock: 15,
    categoryId: 1,
    colors: ["Черный", "Серый", "Фиолетовый"],
    hasColors: true,
    sizes: [],
    hasSizes: false,
    images: ["/placeholder-phone.jpg"],
  },
  {
    name: "Ноутбук Apple MacBook Air M3",
    linkName: "macbook-air-m3",
    description: "Ультратонкий ноутбук с чипом M3 для работы и творчества",
    specifications: [
      'Экран: 13.6" Liquid Retina',
      "Процессор: Apple M3",
      "Память: 8GB RAM + 512GB SSD",
      "Батарея: до 18 часов",
      "Вес: 1.24 кг",
    ],
    price: 129999,
    discountPrice: null,
    atStock: 8,
    categoryId: 1,
    colors: ["Серебристый", "Темная ночь", "Золотой"],
    hasColors: true,
    sizes: [],
    hasSizes: false,
    images: ["/placeholder-laptop.jpg"],
  },
  {
    name: "Беспроводные наушники Sony WH-1000XM5",
    linkName: "sony-wh-1000xm5",
    description: "Премиум наушники с активным шумоподавлением",
    specifications: [
      "Тип: накладные беспроводные",
      "Шумоподавление: активное ANC",
      "Время работы: до 30 часов",
      "Bluetooth 5.2",
      "Поддержка Hi-Res Audio",
    ],
    price: 32999,
    discountPrice: 29999,
    atStock: 25,
    categoryId: 1,
    colors: ["Черный", "Серебристый"],
    hasColors: true,
    sizes: [],
    hasSizes: false,
    images: ["/placeholder-headphones.jpg"],
  },

  // Одежда
  {
    name: "Мужская футболка Adidas",
    linkName: "adidas-tshirt-men",
    description: "Классическая спортивная футболка из дышащего материала",
    specifications: ["Материал: 100% хлопок", "Крой: классический", "Страна производства: Вьетнам"],
    price: 2499,
    discountPrice: 1999,
    atStock: 50,
    categoryId: 2,
    colors: ["Черный", "Белый", "Синий", "Красный"],
    hasColors: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    hasSizes: true,
    images: ["/placeholder-tshirt.jpg"],
  },
  {
    name: "Женское платье Zara",
    linkName: "zara-dress-women",
    description: "Элегантное вечернее платье с изысканным дизайном",
    specifications: ["Материал: полиэстер 95%, эластан 5%", "Длина: миди", "Уход: ручная стирка"],
    price: 5999,
    discountPrice: null,
    atStock: 20,
    categoryId: 2,
    colors: ["Черный", "Синий", "Красный"],
    hasColors: true,
    sizes: ["XS", "S", "M", "L"],
    hasSizes: true,
    images: ["/placeholder-dress.jpg"],
  },

  // Обувь
  {
    name: "Кроссовки Nike Air Max 270",
    linkName: "nike-air-max-270",
    description: "Удобные кроссовки для бега и повседневной носки",
    specifications: [
      "Верх: текстиль и синтетика",
      "Подошва: резина с технологией Air",
      "Амортизация: Max Air",
      "Вес: 350г (размер 42)",
    ],
    price: 12999,
    discountPrice: 10999,
    atStock: 30,
    categoryId: 3,
    colors: ["Черный", "Белый", "Синий"],
    hasColors: true,
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    hasSizes: true,
    images: ["/placeholder-sneakers.jpg"],
  },
  {
    name: "Ботинки Timberland Classic",
    linkName: "timberland-classic-boots",
    description: "Классические водонепроницаемые ботинки",
    specifications: [
      "Материал: натуральная кожа",
      "Водонепроницаемость: есть",
      "Утепление: есть",
      "Подошва: резина с протектором",
    ],
    price: 18999,
    discountPrice: null,
    atStock: 15,
    categoryId: 3,
    colors: ["Коричневый", "Черный"],
    hasColors: true,
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    hasSizes: true,
    images: ["/placeholder-boots.jpg"],
  },

  // Аксессуары
  {
    name: "Рюкзак Xiaomi City Backpack",
    linkName: "xiaomi-city-backpack",
    description: "Стильный городской рюкзак с защитой от воды",
    specifications: [
      "Объем: 20 литров",
      "Материал: полиэстер 300D",
      "Водоотталкивающее покрытие",
      'Отделение для ноутбука до 15.6"',
    ],
    price: 2999,
    discountPrice: 2499,
    atStock: 40,
    categoryId: 4,
    colors: ["Черный", "Серый", "Синий"],
    hasColors: true,
    sizes: [],
    hasSizes: false,
    images: ["/placeholder-backpack.jpg"],
  },
  {
    name: "Умные часы Apple Watch Series 9",
    linkName: "apple-watch-series-9",
    description: "Умные часы с множеством функций для здоровья и фитнеса",
    specifications: [
      'Экран: 1.9" Always-On Retina',
      "Процессор: S9",
      "Датчики: ЭКГ, пульсоксиметр",
      "Водонепроницаемость: WR50",
      "Батарея: до 18 часов",
    ],
    price: 42999,
    discountPrice: 39999,
    atStock: 12,
    categoryId: 4,
    colors: ["Черный", "Белый", "Розовый"],
    hasColors: true,
    sizes: ["41mm", "45mm"],
    hasSizes: true,
    images: ["/placeholder-watch.jpg"],
  },

  // Спорт
  {
    name: "Йога-мат Premium",
    linkName: "yoga-mat-premium",
    description: "Профессиональный коврик для йоги с антискользящим покрытием",
    specifications: [
      "Размер: 183x61 см",
      "Толщина: 6 мм",
      "Материал: TPE экологичный",
      "Вес: 1.2 кг",
      "Сумка в комплекте",
    ],
    price: 3499,
    discountPrice: null,
    atStock: 35,
    categoryId: 5,
    colors: ["Фиолетовый", "Синий", "Зеленый", "Розовый"],
    hasColors: true,
    sizes: [],
    hasSizes: false,
    images: ["/placeholder-yoga-mat.jpg"],
  },
  {
    name: "Гантели разборные 20 кг",
    linkName: "dumbbells-20kg",
    description: "Набор разборных гантелей для домашних тренировок",
    specifications: [
      "Вес: 2x20 кг (регулируемый)",
      "Материал: чугун с покрытием",
      "Гриф: хромированный",
      "В комплекте: диски, замки",
    ],
    price: 7999,
    discountPrice: 6999,
    atStock: 18,
    categoryId: 5,
    colors: ["Черный"],
    hasColors: true,
    sizes: ["10 кг", "15 кг", "20 кг"],
    hasSizes: true,
    images: ["/placeholder-dumbbells.jpg"],
  },
  {
    name: "Велосипед горный Stels Navigator",
    linkName: "stels-navigator-mtb",
    description: "Горный велосипед для активного отдыха и туризма",
    specifications: [
      "Колеса: 29 дюймов",
      "Рама: алюминиевая",
      "Скоростей: 21",
      "Вилка: амортизационная",
      "Тормоза: дисковые механические",
    ],
    price: 34999,
    discountPrice: 31999,
    atStock: 5,
    categoryId: 5,
    colors: ["Черный", "Синий", "Красный"],
    hasColors: true,
    sizes: ['17"', '19"', '21"'],
    hasSizes: true,
    images: ["/placeholder-bike.jpg"],
  },
]

async function seed() {
  try {
    console.log("🌱 Начинаем наполнение БД тестовыми данными...")

    // Очищаем таблицы (в правильном порядке из-за foreign keys)
    console.log("🗑️  Очищаем существующие данные...")
    await db.delete(product)
    await db.delete(category)
    await db.delete(user)

    // Добавляем категории
    console.log("📂 Добавляем категории...")
    await db.insert(category).values(categories)
    console.log(`✅ Добавлено категорий: ${categories.length}`)

    // Добавляем пользователей
    console.log("👥 Добавляем пользователей...")
    await createAdmin()

    // Добавляем товары
    console.log("🛍️  Добавляем товары...")
    await db.insert(product).values(products)
    console.log(`✅ Добавлено товаров: ${products.length}`)

    console.log("🎉 Наполнение БД завершено успешно!")
    console.log("\n📊 Итоговая статистика:")
    console.log(`   - Категорий: ${categories.length}`)
    console.log(`   - Товаров: ${products.length}`)
  } catch (error) {
    console.error("❌ Ошибка при наполнении БД:", error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

seed()
