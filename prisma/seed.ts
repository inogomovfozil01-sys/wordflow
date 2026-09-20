import { PrismaClient, Role, CefrLevel, RelationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting WordFlow database seed...');

  // 1. Achievements
  console.log('Inserting achievements...');
  const achievements = [
    {
      code: 'FIRST_WORD',
      title: 'First Step',
      description: 'Learn your very first English word on WordFlow.',
      icon: '🌱',
      category: 'WORDS',
      xpReward: 50,
      conditionType: 'words_learned',
      threshold: 1,
    },
    {
      code: 'WORDS_10',
      title: 'Vocabulary Builder',
      description: 'Learn 10 English words.',
      icon: '📚',
      category: 'WORDS',
      xpReward: 100,
      conditionType: 'words_learned',
      threshold: 10,
    },
    {
      code: 'WORDS_50',
      title: 'Word Collector',
      description: 'Learn 50 English words.',
      icon: '🏅',
      category: 'WORDS',
      xpReward: 250,
      conditionType: 'words_learned',
      threshold: 50,
    },
    {
      code: 'WORDS_100',
      title: 'Lexicon Master',
      description: 'Learn 100 English words.',
      icon: '👑',
      category: 'WORDS',
      xpReward: 500,
      conditionType: 'words_learned',
      threshold: 100,
    },
    {
      code: 'STREAK_3',
      title: 'Habit Former',
      description: 'Maintain a 3-day learning streak.',
      icon: '🔥',
      category: 'STREAK',
      xpReward: 75,
      conditionType: 'streak_days',
      threshold: 3,
    },
    {
      code: 'STREAK_7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day learning streak.',
      icon: '⚡',
      category: 'STREAK',
      xpReward: 200,
      conditionType: 'streak_days',
      threshold: 7,
    },
    {
      code: 'STREAK_30',
      title: 'Unstoppable Momentum',
      description: 'Maintain a 30-day learning streak.',
      icon: '🌟',
      category: 'STREAK',
      xpReward: 1000,
      conditionType: 'streak_days',
      threshold: 30,
    },
    {
      code: 'PERFECT_LESSON',
      title: 'Perfectionist',
      description: 'Complete a full lesson with 100% accuracy.',
      icon: '🎯',
      category: 'MASTERY',
      xpReward: 100,
      conditionType: 'perfect_lessons',
      threshold: 1,
    },
    {
      code: 'REVIEW_MASTER',
      title: 'Memory Guard',
      description: 'Complete 25 spaced repetition reviews.',
      icon: '🧠',
      category: 'MASTERY',
      xpReward: 150,
      conditionType: 'reviews_completed',
      threshold: 25,
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: ach,
      create: ach,
    });
  }

  // 2. Topics
  console.log('Inserting topics...');
  const topicsData = [
    { name: 'Daily life', slug: 'daily-life', icon: '☀️', description: 'Everyday routines, home, habits, and activities.' },
    { name: 'Family', slug: 'family', icon: '👨‍👩‍👧', description: 'Relatives, relationships, and home life.' },
    { name: 'Food', slug: 'food', icon: '🍲', description: 'Meals, ingredients, restaurants, and cooking.' },
    { name: 'Travel', slug: 'travel', icon: '✈️', description: 'Airports, hotels, navigation, and vacations.' },
    { name: 'School', slug: 'school', icon: '🎓', description: 'Education, subjects, studying, and classrooms.' },
    { name: 'Technology', slug: 'technology', icon: '💻', description: 'Devices, digital tools, internet, and tech.' },
    { name: 'Programming', slug: 'programming', icon: '⌨️', description: 'Code, algorithms, software development, and Git.' },
    { name: 'Business', slug: 'business', icon: '💼', description: 'Workplace, meetings, negotiation, and commerce.' },
    { name: 'Sports', slug: 'sports', icon: '⚽', description: 'Athletics, games, fitness, and competitions.' },
    { name: 'Health', slug: 'health', icon: '🩺', description: 'Medicine, wellbeing, body, and symptoms.' },
    { name: 'Nature', slug: 'nature', icon: '🌲', description: 'Environment, flora, fauna, and weather.' },
    { name: 'Emotions', slug: 'emotions', icon: '❤️', description: 'Feelings, moods, reactions, and psychology.' },
    { name: 'Shopping', slug: 'shopping', icon: '🛍️', description: 'Stores, prices, clothes, and transactions.' },
    { name: 'Transport', slug: 'transport', icon: '🚗', description: 'Vehicles, roads, public transit, and commuting.' },
    { name: 'Communication', slug: 'communication', icon: '💬', description: 'Conversations, languages, calls, and emails.' },
  ];

  const topicMap = new Map<string, string>();
  for (const t of topicsData) {
    const created = await prisma.topic.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
    topicMap.set(t.slug, created.id);
  }

  // 3. Vocabulary Starter Library (Across A1-C2)
  console.log('Inserting vocabulary starter library...');
  const rawWords = [
    // A1
    {
      word: 'welcome',
      partOfSpeech: 'verb',
      cefrLevel: CefrLevel.A1,
      ipa: '/ˈwɛl.kəm/',
      definitionEn: 'To greet someone who has just arrived with pleasure and hospitality.',
      definitionSimple: 'Say hello kindly when someone comes.',
      translations: [
        { language: 'ru', translation: 'приветствовать', explanation: 'Радушно принимать кого-либо' },
        { language: 'uz', translation: 'kutib olmoq', explanation: 'Kimgadir xush kelibsiz demoq' },
      ],
      examples: [
        {
          sentenceEn: 'We welcome all new students to our English club.',
          sentenceRu: 'Мы приветствуем всех новых студентов в нашем английском клубе.',
          sentenceUz: 'Biz barcha yangi talabalarni ingliz tili klubimizda kutib olamiz.',
        },
      ],
      synonyms: ['greet', 'receive'],
      antonyms: ['reject', 'dismiss'],
      topics: ['communication', 'daily-life'],
    },
    {
      word: 'journey',
      partOfSpeech: 'noun',
      cefrLevel: CefrLevel.A2,
      ipa: '/ˈdʒɜː.ni/',
      definitionEn: 'An act of traveling from one place to another, especially over a long distance.',
      definitionSimple: 'A trip from one place to another.',
      translations: [
        { language: 'ru', translation: 'путешествие', explanation: 'Поездка на расстояние' },
        { language: 'uz', translation: 'sayohat', explanation: 'Bir joydan boshqa joyga borish' },
      ],
      examples: [
        {
          sentenceEn: 'The train journey across the mountains took four hours.',
          sentenceRu: 'Поездка на поезде через горы заняла четыре часа.',
          sentenceUz: 'Togʻlar osha poyezddagi sayohat toʻrt soat davom etdi.',
        },
      ],
      synonyms: ['trip', 'voyage', 'tour'],
      antonyms: ['stay'],
      topics: ['travel', 'transport'],
    },
    {
      word: 'explore',
      partOfSpeech: 'verb',
      cefrLevel: CefrLevel.A2,
      ipa: '/ɪkˈsplɔːr/',
      definitionEn: 'To travel through an unfamiliar area in order to learn about it.',
      definitionSimple: 'To look around and discover new things.',
      translations: [
        { language: 'ru', translation: 'исследовать', explanation: 'Изучать новое место или явление' },
        { language: 'uz', translation: 'tadqiq qilmoq', explanation: 'Yangi joylarni oʻrganish yoki kashf qilish' },
      ],
      examples: [
        {
          sentenceEn: 'They decided to explore the ancient city on foot.',
          sentenceRu: 'Они решили исследовать древний город пешком.',
          sentenceUz: 'Ular qadimiy shaharni piyoda aylanib oʻrganishga qaror qilishdi.',
        },
      ],
      synonyms: ['investigate', 'discover', 'scout'],
      antonyms: ['ignore', 'neglect'],
      topics: ['travel', 'nature'],
    },
    {
      word: 'routine',
      partOfSpeech: 'noun',
      cefrLevel: CefrLevel.A2,
      ipa: '/ruːˈtiːn/',
      definitionEn: 'A sequence of actions regularly followed; a fixed program.',
      definitionSimple: 'Things you do regularly every day.',
      translations: [
        { language: 'ru', translation: 'распорядок', explanation: 'Привычный порядок действий' },
        { language: 'uz', translation: 'kun tartibi', explanation: 'Har kuni odat boʻyicha qilinadigan ishlar' },
      ],
      examples: [
        {
          sentenceEn: 'My morning routine includes coffee and twenty minutes of reading.',
          sentenceRu: 'Мой утренний распорядок включает кофе и двадцать минут чтения.',
          sentenceUz: 'Mening ertalabki kun tartibimga kofe va yigirma daqiqa kitob oʻqish kiradi.',
        },
      ],
      synonyms: ['habit', 'schedule', 'regimen'],
      antonyms: ['chaos', 'irregularity'],
      topics: ['daily-life', 'health'],
    },

    // B1
    {
      word: 'collaborate',
      partOfSpeech: 'verb',
      cefrLevel: CefrLevel.B1,
      ipa: '/kəˈlæb.ə.reɪt/',
      definitionEn: 'To work jointly with others on an activity or project.',
      definitionSimple: 'To work together as a team to create something.',
      translations: [
        { language: 'ru', translation: 'сотрудничать', explanation: 'Работать вместе над одной задачей' },
        { language: 'uz', translation: 'hamkorlik qilmoq', explanation: 'Boshqalar bilan birgalikda ishlash' },
      ],
      examples: [
        {
          sentenceEn: 'Software developers collaborate on GitHub to build open-source tools.',
          sentenceRu: 'Разработчики программного обеспечения сотрудничают на GitHub для создания открытых инструментов.',
          sentenceUz: 'Dasturchilar ochiq kodli vositalarni yaratish uchun GitHubda hamkorlik qiladilar.',
        },
      ],
      synonyms: ['cooperate', 'team up', 'join forces'],
      antonyms: ['compete', 'disagree'],
      topics: ['programming', 'business', 'communication'],
    },
    {
      word: 'resilient',
      partOfSpeech: 'adjective',
      cefrLevel: CefrLevel.B2,
      ipa: '/rɪˈzɪl.jənt/',
      definitionEn: 'Able to withstand or recover quickly from difficult conditions.',
      definitionSimple: 'Strong enough to bounce back after tough times.',
      translations: [
        { language: 'ru', translation: 'стойкий', explanation: 'Способный быстро восстанавливаться после неудач' },
        { language: 'uz', translation: 'bardoshli', explanation: 'Qiyinchiliklardan tezda oʻziga keladigan' },
      ],
      examples: [
        {
          sentenceEn: 'The community remained resilient even after the severe storm.',
          sentenceRu: 'Сообщество оставалось стойким даже после сильного шторма.',
          sentenceUz: 'Jamiyat kuchli boʻrondan keyin ham bardoshli boʻlib qoldi.',
        },
      ],
      synonyms: ['tough', 'adaptable', 'tenacious'],
      antonyms: ['fragile', 'vulnerable'],
      topics: ['emotions', 'health'],
    },
    {
      word: 'algorithm',
      partOfSpeech: 'noun',
      cefrLevel: CefrLevel.B1,
      ipa: '/ˈæl.ɡə.rɪ.ðəm/',
      definitionEn: 'A process or set of rules to be followed in calculations or problem-solving operations.',
      definitionSimple: 'Step-by-step instructions that a computer follows to solve a task.',
      translations: [
        { language: 'ru', translation: 'алгоритм', explanation: 'Последовательность шагов для решения задачи' },
        { language: 'uz', translation: 'algoritm', explanation: 'Muammoni hal qilish uchun qadam-baqadam koʻrsatma' },
      ],
      examples: [
        {
          sentenceEn: 'The spaced repetition algorithm schedules word reviews at optimal intervals.',
          sentenceRu: 'Алгоритм интервального повторения планирует повторение слов с оптимальными интервалами.',
          sentenceUz: 'Intervalli takrorlash algoritmi soʻzlarni takrorlashni optimal vaqt oraligʻida rejalashtiradi.',
        },
      ],
      synonyms: ['procedure', 'formula', 'routine'],
      antonyms: [],
      topics: ['programming', 'technology', 'school'],
    },
    {
      word: 'sustainable',
      partOfSpeech: 'adjective',
      cefrLevel: CefrLevel.B2,
      ipa: '/səˈsteɪ.nə.bəl/',
      definitionEn: 'Able to be maintained at a certain rate or level without depleting natural resources.',
      definitionSimple: 'Good for the future because it does not harm the planet or run out.',
      translations: [
        { language: 'ru', translation: 'устойчивый', explanation: 'Экологичный и долговечный' },
        { language: 'uz', translation: 'barqaror', explanation: 'Atrof-muhitga zarar yetkazmaydigan, uzoq muddatli' },
      ],
      examples: [
        {
          sentenceEn: 'Solar power is a clean and sustainable source of energy.',
          sentenceRu: 'Солнечная энергия — это чистый и устойчивый источник энергии.',
          sentenceUz: 'Quyosh energiyasi toza va barqaror energiya manbaidir.',
        },
      ],
      synonyms: ['renewable', 'viable', 'eco-friendly'],
      antonyms: ['unsustainable', 'wasteful'],
      topics: ['nature', 'business', 'technology'],
    },

    // C1 & C2
    {
      word: 'eloquent',
      partOfSpeech: 'adjective',
      cefrLevel: CefrLevel.C1,
      ipa: '/ˈɛl.ə.kwənt/',
      definitionEn: 'Fluent or persuasive in speaking or writing.',
      definitionSimple: 'Expressing ideas clearly and beautifully.',
      translations: [
        { language: 'ru', translation: 'красноречивый', explanation: 'Умеющий говорить красиво и убедительно' },
        { language: 'uz', translation: 'notiq', explanation: 'Fikrlarini chiroyli va taʼsirli ifodalay oladigan' },
      ],
      examples: [
        {
          sentenceEn: 'Her eloquent presentation inspired everyone in the auditorium.',
          sentenceRu: 'Её красноречивая презентация вдохновила всех в аудитории.',
          sentenceUz: 'Uning taʼsirli va chiroyli nutqi zaldagi barchani ruhlantirdi.',
        },
      ],
      synonyms: ['articulate', 'expressive', 'persuasive'],
      antonyms: ['inarticulate', 'awkward'],
      topics: ['communication', 'school', 'business'],
    },
    {
      word: 'ubiquitous',
      partOfSpeech: 'adjective',
      cefrLevel: CefrLevel.C2,
      ipa: '/juːˈbɪk.wɪ.təs/',
      definitionEn: 'Present, appearing, or found everywhere.',
      definitionSimple: 'Existing or seen everywhere at once.',
      translations: [
        { language: 'ru', translation: 'вездесущий', explanation: 'Встречающийся повсеместно' },
        { language: 'uz', translation: 'hamma yerda mavjud', explanation: 'Har joyda uchraydigan' },
      ],
      examples: [
        {
          sentenceEn: 'Smartphones have become ubiquitous in modern urban life.',
          sentenceRu: 'Смартфоны стали вездесущими в современной городской жизни.',
          sentenceUz: 'Smartfonlar zamonaviy shahar hayotida hamma yerda uchraydigan boʻlib qoldi.',
        },
      ],
      synonyms: ['omnipresent', 'pervasive', 'universal'],
      antonyms: ['rare', 'scarce'],
      topics: ['technology', 'daily-life'],
    },
    {
      word: 'pragmatic',
      partOfSpeech: 'adjective',
      cefrLevel: CefrLevel.B2,
      ipa: '/præɡˈmæt.ɪk/',
      definitionEn: 'Dealing with things sensibly and realistically based on practical rather than theoretical considerations.',
      definitionSimple: 'Thinking about what actually works in real life.',
      translations: [
        { language: 'ru', translation: 'прагматичный', explanation: 'Практичный и ориентированный на пользу' },
        { language: 'uz', translation: 'amaliy', explanation: 'Nazariyadan koʻra haqiqiy natijaga asoslangan' },
      ],
      examples: [
        {
          sentenceEn: 'We need a pragmatic strategy that delivers measurable progress this quarter.',
          sentenceRu: 'Нам нужна прагматичная стратегия, которая обеспечит ощутимый прогресс в этом квартале.',
          sentenceUz: 'Bizga shu chorakda aniq natija beradigan amaliy strategiya kerak.',
        },
      ],
      synonyms: ['practical', 'realistic', 'sensible'],
      antonyms: ['idealistic', 'impractical'],
      topics: ['business', 'programming'],
    },
    {
      word: 'empathy',
      partOfSpeech: 'noun',
      cefrLevel: CefrLevel.B1,
      ipa: '/ˈɛm.pə.θi/',
      definitionEn: 'The ability to understand and share the feelings of another person.',
      definitionSimple: 'Understanding how someone else feels.',
      translations: [
        { language: 'ru', translation: 'эмпатия', explanation: 'Способность сопереживать чувствам других' },
        { language: 'uz', translation: 'hamdardlik', explanation: 'Boshqa insonning his-tuygʻularini tushunish qobiliyati' },
      ],
      examples: [
        {
          sentenceEn: 'Great teachers listen with genuine empathy to their students.',
          sentenceRu: 'Замечательные учителя слушают своих учеников с искренней эмпатией.',
          sentenceUz: 'Ajoyib oʻqituvchilar oʻz oʻquvchilarini samimiy hamdardlik bilan tinglashadi.',
        },
      ],
      synonyms: ['compassion', 'understanding', 'sensitivity'],
      antonyms: ['apathy', 'callousness'],
      topics: ['emotions', 'family', 'communication'],
    },
    {
      word: 'paradigm',
      partOfSpeech: 'noun',
      cefrLevel: CefrLevel.C1,
      ipa: '/ˈpær.ə.daɪm/',
      definitionEn: 'A typical example or pattern of something; a model or framework.',
      definitionSimple: 'A broad model or way of thinking about something.',
      translations: [
        { language: 'ru', translation: 'парадигма', explanation: 'Система взглядов, образец или модель' },
        { language: 'uz', translation: 'paradigma', explanation: 'Qarashlar tizimi, asosiy namuna' },
      ],
      examples: [
        {
          sentenceEn: 'Functional programming introduces an entirely different mental paradigm.',
          sentenceRu: 'Функциональное программирование предлагает совершенно иную мыслительную парадигму.',
          sentenceUz: 'Funksional dasturlash butunlay boshqacha fikrlash paradigmasini taqdim etadi.',
        },
      ],
      synonyms: ['framework', 'model', 'prototype'],
      antonyms: [],
      topics: ['programming', 'technology', 'school'],
    },
    {
      word: 'meticulous',
      partOfSpeech: 'adjective',
      cefrLevel: CefrLevel.C1,
      ipa: '/məˈtɪk.jə.ləs/',
      definitionEn: 'Showing great attention to detail; very careful and precise.',
      definitionSimple: 'Very careful about every small detail.',
      translations: [
        { language: 'ru', translation: 'тщательный', explanation: 'Внимательный к мельчайшим деталям' },
        { language: 'uz', translation: 'sinchkov', explanation: 'Har bir mayda tafsilotga juda eʼtiborli' },
      ],
      examples: [
        {
          sentenceEn: 'The scientist kept meticulous notes during the entire laboratory trial.',
          sentenceRu: 'Ученый вел тщательные записи на протяжении всего лабораторного испытания.',
          sentenceUz: 'Olim barcha laboratoriya sinovlari davomida sinchkovlik bilan qaydlar yuritdi.',
        },
      ],
      synonyms: ['thorough', 'diligent', 'scrupulous'],
      antonyms: ['careless', 'sloppy'],
      topics: ['school', 'programming', 'business'],
    },
    {
      word: 'serendipity',
      partOfSpeech: 'noun',
      cefrLevel: CefrLevel.C2,
      ipa: '/ˌsɛr.ənˈdɪp.ɪ.ti/',
      definitionEn: 'The occurrence and development of events by chance in a happy or beneficial way.',
      definitionSimple: 'Finding something wonderful without looking for it.',
      translations: [
        { language: 'ru', translation: 'счастливая случайность', explanation: 'Неожиданная приятная находка или удача' },
        { language: 'uz', translation: 'baxtli tasodif', explanation: 'Kutilmagan yaxshi va foydali hodisa' },
      ],
      examples: [
        {
          sentenceEn: 'Meeting her mentor in a small bookstore was pure serendipity.',
          sentenceRu: 'Встреча с наставником в маленьком книжном магазине была чистой счастливой случайностью.',
          sentenceUz: 'Kichik kitob doʻkonida oʻz ustozini uchratishi sof baxtli tasodif edi.',
        },
      ],
      synonyms: ['good fortune', 'providence', 'fluke'],
      antonyms: ['misfortune', 'bad luck'],
      topics: ['emotions', 'daily-life'],
    },
  ];

  const wordMap = new Map<string, string>();

  for (const item of rawWords) {
    const normalized = item.word.toLowerCase().trim();
    const createdWord = await prisma.word.upsert({
      where: { normalizedWord: normalized },
      update: {
        word: item.word,
        partOfSpeech: item.partOfSpeech,
        cefrLevel: item.cefrLevel,
        ipa: item.ipa,
        definitionEn: item.definitionEn,
        definitionSimple: item.definitionSimple,
      },
      create: {
        word: item.word,
        normalizedWord: normalized,
        partOfSpeech: item.partOfSpeech,
        cefrLevel: item.cefrLevel,
        ipa: item.ipa,
        definitionEn: item.definitionEn,
        definitionSimple: item.definitionSimple,
      },
    });

    wordMap.set(normalized, createdWord.id);

    // Translations
    for (const tr of item.translations) {
      await prisma.wordTranslation.upsert({
        where: {
          wordId_language: {
            wordId: createdWord.id,
            language: tr.language,
          },
        },
        update: {
          translation: tr.translation,
          explanation: tr.explanation,
        },
        create: {
          wordId: createdWord.id,
          language: tr.language,
          translation: tr.translation,
          explanation: tr.explanation,
        },
      });
    }

    // Examples
    for (const ex of item.examples) {
      const existingExample = await prisma.wordExample.findFirst({
        where: { wordId: createdWord.id, sentenceEn: ex.sentenceEn },
      });
      if (!existingExample) {
        await prisma.wordExample.create({
          data: {
            wordId: createdWord.id,
            sentenceEn: ex.sentenceEn,
            sentenceRu: ex.sentenceRu,
            sentenceUz: ex.sentenceUz,
          },
        });
      }
    }

    // Synonyms
    for (const syn of item.synonyms) {
      const existing = await prisma.wordRelation.findFirst({
        where: { wordId: createdWord.id, type: RelationType.SYNONYM, relatedWord: syn },
      });
      if (!existing) {
        await prisma.wordRelation.create({
          data: {
            wordId: createdWord.id,
            type: RelationType.SYNONYM,
            relatedWord: syn,
          },
        });
      }
    }

    // Antonyms
    for (const ant of item.antonyms) {
      const existing = await prisma.wordRelation.findFirst({
        where: { wordId: createdWord.id, type: RelationType.ANTONYM, relatedWord: ant },
      });
      if (!existing) {
        await prisma.wordRelation.create({
          data: {
            wordId: createdWord.id,
            type: RelationType.ANTONYM,
            relatedWord: ant,
          },
        });
      }
    }

    // Topics
    for (const slug of item.topics) {
      const topicId = topicMap.get(slug);
      if (topicId) {
        await prisma.wordTopic.upsert({
          where: {
            wordId_topicId: {
              wordId: createdWord.id,
              topicId,
            },
          },
          update: {},
          create: {
            wordId: createdWord.id,
            topicId,
          },
        });
      }
    }
  }

  // 4. Official Curated Collections
  console.log('Inserting official collections...');
  const collectionsData = [
    {
      name: '100 Essential English Words',
      slug: '100-essential-english-words',
      description: 'The absolute foundation for everyday conversations and rapid vocabulary growth.',
      icon: '🔥',
      words: ['welcome', 'journey', 'explore', 'routine', 'empathy'],
    },
    {
      name: 'English for Programmers',
      slug: 'english-for-programmers',
      description: 'Crucial terminology for writing code, discussing architecture, and pull requests.',
      icon: '💻',
      words: ['algorithm', 'collaborate', 'paradigm', 'pragmatic', 'meticulous'],
    },
    {
      name: 'Advanced Academic & C1/C2 Mastery',
      slug: 'advanced-c1-c2-mastery',
      description: 'High-register vocabulary for academic essays, IELTS, TOEFL, and speeches.',
      icon: '🎓',
      words: ['eloquent', 'ubiquitous', 'serendipity', 'meticulous', 'paradigm'],
    },
  ];

  for (const col of collectionsData) {
    const createdCol = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {
        name: col.name,
        description: col.description,
        isOfficial: true,
        icon: col.icon,
      },
      create: {
        name: col.name,
        slug: col.slug,
        description: col.description,
        isOfficial: true,
        icon: col.icon,
      },
    });

    let order = 0;
    for (const w of col.words) {
      const wordId = wordMap.get(w.toLowerCase());
      if (wordId) {
        await prisma.collectionWord.upsert({
          where: {
            collectionId_wordId: {
              collectionId: createdCol.id,
              wordId,
            },
          },
          update: { order },
          create: {
            collectionId: createdCol.id,
            wordId,
            order,
          },
        });
        order++;
      }
    }
  }

  // 5. Default Admin & Student Accounts
  console.log('Seeding default admin & user accounts...');
  const adminPasswordHash = await bcrypt.hash('Admin@WordFlow2026!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wordflow.app' },
    update: { role: Role.ADMIN },
    create: {
      name: 'System Admin',
      username: 'admin',
      email: 'admin@wordflow.app',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      profile: {
        create: {
          bio: 'WordFlow platform administrator and curriculum manager.',
          avatar: '👑',
          isPublic: true,
        },
      },
      settings: {
        create: {
          cefrLevel: CefrLevel.C2,
          learningGoal: 'Platform Management',
          dailyTargetWords: 30,
          interfaceLang: 'en',
        },
      },
    },
  });

  const demoPasswordHash = await bcrypt.hash('Demo@WordFlow2026!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@wordflow.app' },
    update: {},
    create: {
      name: 'Alex Rivera',
      username: 'alex_learner',
      email: 'demo@wordflow.app',
      passwordHash: demoPasswordHash,
      role: Role.USER,
      profile: {
        create: {
          bio: 'Passionate English learner preparing for technical interviews and travel.',
          avatar: '🚀',
          isPublic: true,
          showStreak: true,
          showWordsLearned: true,
          showOnLeaderboard: true,
        },
      },
      settings: {
        create: {
          cefrLevel: CefrLevel.B1,
          learningGoal: 'Programming & Work',
          dailyTargetWords: 10,
          interfaceLang: 'en',
          soundEnabled: true,
          autoPronounce: true,
        },
      },
    },
  });

  // Seed demo UserWords and activity for demoUser
  const demoWords = ['welcome', 'journey', 'explore', 'algorithm', 'collaborate'];
  for (const w of demoWords) {
    const wordId = wordMap.get(w);
    if (wordId) {
      await prisma.userWord.upsert({
        where: {
          userId_wordId: {
            userId: demoUser.id,
            wordId,
          },
        },
        update: {},
        create: {
          userId: demoUser.id,
          wordId,
          status: 'LEARNING',
          interval: 1,
          repetition: 1,
          easeFactor: 2.5,
          nextReview: new Date(), // Due now for testing reviews!
          correctCount: 2,
          incorrectCount: 0,
        },
      });
    }
  }

  // Daily activity for demo user
  const today = new Date().toISOString().slice(0, 10);
  await prisma.dailyActivity.upsert({
    where: {
      userId_date: {
        userId: demoUser.id,
        date: today,
      },
    },
    update: {
      wordsStudied: 5,
      wordsReviewed: 3,
      timeSpentSeconds: 420,
      xpEarned: 85,
    },
    create: {
      userId: demoUser.id,
      date: today,
      wordsStudied: 5,
      wordsReviewed: 3,
      timeSpentSeconds: 420,
      xpEarned: 85,
    },
  });

  // Award first word achievement to demoUser
  const firstWordAch = await prisma.achievement.findUnique({ where: { code: 'FIRST_WORD' } });
  if (firstWordAch) {
    await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId: demoUser.id,
          achievementId: firstWordAch.id,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        achievementId: firstWordAch.id,
      },
    });
  }

  console.log('✅ WordFlow database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
