/*
  Быстрая настройка подарка:
  1. Имя героини и теплое обращение меняются в CONFIG ниже.
  2. Личное письмо вставляется в CONFIG.personalLetter.
  3. Портрет, фоны и ключ меняются в CONFIG.assets.
  4. Фоновая музыка подключается через CONFIG.assets.music.
  5. Все реплики и сцены лежат в объекте STORY.
*/

const CONFIG = {
  heroineName: "Наташа",
  warmName: "Натусик",
  springName: "Весна",
  personalLetter: "Здесь будет твое личное письмо. Замени этот текст в CONFIG.personalLetter внутри script.js, и оно автоматически появится в финале.",
  assets: {
    heroine: "assets/heroine-portrait.svg",
    introSpring: "assets/scene-intro-spring.png",
    introSpringWonder: "assets/scene-intro-spring-wonder.png",
    introSpringSpecialMoments: "assets/scene-intro-spring-special.png",
    gardenSpringIntro: "assets/scene-garden-spring-intro.png",
    introNatashaSurprised: "assets/scene-intro-natasha-surprised.png",
    introNatashaTrust: "assets/scene-intro-natasha-trust.png",
    gardenNatashaCalm: "assets/scene-garden-natasha-calm.png",
    keySigil: "assets/key-sigil.svg",
    music: "assets/music-spring.mp3",
    backgrounds: {
      start: "assets/bg-start.png",
      awakening: "assets/bg-awakening-custom.png",
      crossroads: "assets/bg-crossroads-custom.png",
      garden: "assets/bg-garden-custom.png",
      cottage: "assets/bg-cottage.svg",
      park: "assets/bg-park.svg",
      key: "assets/bg-key.svg",
      finale: "assets/bg-finale.svg"
    }
  },
  textSpeed: 16
};

const FRAGMENTS = {
  garden: {
    title: "Лепесток доверия",
    hint: "Нежность и тихая красота"
  },
  cottage: {
    title: "Искра покоя",
    hint: "Тепло, отдых и бережность к себе"
  },
  park: {
    title: "Шаг ветра",
    hint: "Движение, воздух и новые пути"
  }
};

const LOCATION_META = {
  garden: {
    title: "Цветочный сад",
    description: "Нежность, легкость и первые ростки надежды."
  },
  cottage: {
    title: "Уютный домик",
    description: "Тепло, выдох и безопасное пространство."
  },
  park: {
    title: "Весенний парк",
    description: "Свежий воздух, движение и тихое вдохновение."
  }
};

const state = {
  currentSceneId: null,
  currentSteps: [],
  stepIndex: 0,
  replyQueue: [],
  pendingSceneId: null,
  visitedLocations: [],
  fragments: [],
  memories: {},
  typingTimer: null,
  typingCompleteHandler: null,
  typingLocked: false,
  currentText: "",
  storyStarted: false,
  storyFinished: false,
  musicWanted: true,
  musicPlaying: false,
  activeBackgroundIndex: 0,
  noticeTimer: null,
  petalTimer: null
};

const ui = {
  appShell: document.getElementById("appShell"),
  bgLayers: [
    document.getElementById("bgLayerA"),
    document.getElementById("bgLayerB")
  ],
  petalLayer: document.getElementById("petalLayer"),
  progressLabel: document.getElementById("progressLabel"),
  locationLabel: document.getElementById("locationLabel"),
  sceneHint: document.getElementById("sceneHint"),
  characterPanel: document.querySelector(".character-panel"),
  portraitStage: document.getElementById("portraitStage"),
  portraitSlots: {
    left: document.getElementById("portraitSlotLeft"),
    
    right: document.getElementById("portraitSlotRight")
  },
  portraitImages: {
    left: document.getElementById("portraitImageLeft"),
    
    right: document.getElementById("portraitImageRight")
  },
  keySigil: document.getElementById("keySigil"),
  startScreen: document.getElementById("startScreen"),
  startButton: document.getElementById("startButton"),
  dialogPanel: document.getElementById("dialogPanel"),
  speakerName: document.getElementById("speakerName"),
  toneLabel: document.getElementById("toneLabel"),
  dialogText: document.getElementById("dialogText"),
  choiceContainer: document.getElementById("choiceContainer"),
  nextButton: document.getElementById("nextButton"),
  fragmentList: document.getElementById("fragmentList"),
  letterPanel: document.getElementById("letterPanel"),
  letterText: document.getElementById("letterText"),
  musicToggle: document.getElementById("musicToggle"),
  restartButton: document.getElementById("restartButton"),
  noticeBox: document.getElementById("noticeBox"),
  bgMusic: document.getElementById("bgMusic")
};

const STORY = {
  intro: {
    label: "Пробуждение",
    location: "Особенное утро",
    hint: "Первый свет, легкое золото в воздухе и тихий голос Весны.",
    background: "awakening",
    portraits: {
      right: {
        role: "spring",
        src: () => CONFIG.assets.introSpring,
        fallbackSrc: () => CONFIG.assets.introSpring,
        alt: "Весна в рассветной сцене"
      }
    },
    steps: [
      {
        speaker: "spring",
        tone: "рассвет",
        text: "Утро пришло так тихо, будто боялось спугнуть этот день. На стекле дрожит свет, и вместе с ним я подхожу ближе."
      },
      {
        speaker: "spring",
        tone: "первый вдох",
        text: () => `Здравствуй, ${CONFIG.heroineName}. Сегодня воздух особенно мягкий. Он знает, что тебе нужно немного больше тепла и света.`
      },
      {
        speaker: "heroine",
        tone: "осторожное удивление",
        portraits: {
          left: {
            role: "heroine",
            src: () => CONFIG.assets.introNatashaSurprised,
            alt: () => `${CONFIG.heroineName} в момент удивления`
          }
        },
        text: "Кто ты?.. Почему мне кажется, будто этот голос я уже где-то слышала?"
      },
      {
        speaker: "spring",
        tone: "живое чудо",
        portraits: {
          right: {
            role: "spring",
            src: () => CONFIG.assets.introSpringWonder,
            fallbackSrc: () => CONFIG.assets.introSpring,
            alt: "Весна в момент живого чуда"
          }
        },
        text: "Я Весна. Не просто дата в календаре, а то движение света, после которого хочется снова дышать глубже."
      },
      {
        speaker: "spring",
        tone: "без спешки",
        portraits: {
          right: {
            role: "spring",
            src: () => CONFIG.assets.introSpringWonder,
            fallbackSrc: () => CONFIG.assets.introSpring,
            alt: "Весна в мягком спокойном образе"
          }
        },
        text: "Я пришла не торопить тебя. Только пройти рядом, если ты позволишь."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "первое касание",
        text: "Что откликается тебе сейчас сильнее?",
        options: [
          {
            label: "Остаться и послушать",
            description: "Тихо принять этот особенный день.",
            reply: [
              {
                speaker: "heroine",
                tone: "доверие",
                portraits: {
                  left: {
                    role: "heroine",
                    src: () => CONFIG.assets.introNatashaTrust,
                    fallbackSrc: () => CONFIG.assets.introNatashaSurprised,
                    alt: () => `${CONFIG.heroineName} с теплым доверием`
                  }
                },
                text: "Если ты пришла с теплом, я хочу тебя послушать."
              },
              {
                speaker: "spring",
                tone: "бережный ответ",
                portraits: {
                  right: {
                    role: "spring",
                    src: () => CONFIG.assets.introSpringSpecialMoments,
                    fallbackSrc: () => CONFIG.assets.introSpring,
                    alt: "Spring portrait for special intro moments"
                  }
                },
                text: "Тогда я буду говорить очень мягко. Сегодня не нужен никакой нажим."
              }
            ],
            effect: {
              set: {
                introTrace: "умение слышать тихое"
              }
            }
          },
          {
            label: "Сделать шаг навстречу",
            description: "Открыться новому движению и свету.",
            reply: [
              {
                speaker: "heroine",
                tone: "тихая смелость",
                text: "Мне хочется сделать шаг навстречу. Пусть даже совсем маленький."
              },
              {
                speaker: "spring",
                tone: "одобрение",
                text: "И этого уже достаточно. Даже самый мягкий шаг умеет менять воздух вокруг."
              }
            ],
            effect: {
              set: {
                introTrace: "способность идти к свету"
              }
            }
          }
        ]
      },
      {
        speaker: "spring",
        tone: "три тропинки",
        portraits: {
          right: {
            role: "spring",
            src: () => CONFIG.assets.introSpringSpecialMoments,
            fallbackSrc: () => CONFIG.assets.introSpring,
            alt: "Spring portrait for special intro moments"
          }
        },
        text: "Сегодня я открою для тебя три дороги. В каждой спрятана одна часть того, что поможет тебе снова почувствовать внутренний свет."
      }
    ],
    nextScene: "crossroads"
  },

  crossroads: {
    label: "Три тропинки",
    location: "Выбор Весны",
    hint: (currentState) => {
      if (currentState.visitedLocations.length === 0) {
        return "Впереди сад, домик и парк. Можно идти туда, куда сейчас тянется сердце.";
      }

      if (currentState.visitedLocations.length < 3) {
        return "Ты уже несешь с собой часть ключа. Осталось выбрать следующую тропинку.";
      }

      return "Все фрагменты собраны. Весна готовит главный момент.";
    },
    background: "crossroads",
    steps: (currentState) => buildCrossroadsSteps(currentState),
    nextScene: "convergence"
  },

  garden: {
    label: "Цветочный сад",
    location: "Цветочный сад",
    hint: "Нежность, спокойствие и красота, которая раскрывается без спешки.",
    background: "garden",
     
    rewardFragment: "garden",
    locationId: "garden",
    returnTo: "crossroads",
    steps: [
      {
        speaker: "spring",
        tone: "лепестки и свет",
        portraits: {
          right: {
            role: "spring",
            src: () => CONFIG.assets.gardenSpringIntro,
            fallbackSrc: () => CONFIG.assets.introSpring,
            alt: "Весна в цветочном саду"
          }
        },
        text: "Здесь все цветет не громко. Бутоны будто учатся говорить шепотом, и от этого сад кажется еще красивее."
      },
      {
        speaker: "spring",
        tone: "тихая красота",
        portraits: {
          right: {
            role: "spring",
            src: () => CONFIG.assets.gardenSpringIntro,
            fallbackSrc: () => CONFIG.assets.introSpring,
            alt: "Весна в цветочном саду"
          }
        },
        text: () => `${CONFIG.heroineName}, посмотри, как сад тянется к свету. Не рывком, не с усилием, а очень бережно. Красота часто растет именно так.`
      },
      {
        speaker: "heroine",
        tone: "спокойствие",
        portraits: {
          left: {
            role: "heroine",
            src: () => CONFIG.assets.gardenNatashaCalm,
            fallbackSrc: () => CONFIG.assets.introNatashaTrust,
            alt: () => `${CONFIG.heroineName} в цветочном саду`
          }
        },
        text: "Здесь так легко дышать... будто никто ничего от меня не требует."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "первое прикосновение",
        text: "Что тебе хочется сделать среди этих цветов?",
        options: [
          {
            label: "Провести пальцами по лепесткам",
            description: "Почувствовать нежность буквально на кончиках пальцев.",
            reply: [
              {
                speaker: "spring",
                tone: "бережность",
                text: "Иногда нежность начинается с такого простого касания. Ты умеешь быть бережной даже молча."
              }
            ],
            effect: {
              set: {
                gardenEssence: "бережное прикосновение к красоте"
              }
            }
          },
          {
            label: "Закрыть глаза и вдохнуть аромат",
            description: "Поймать тонкое ощущение самого начала весны.",
            reply: [
              {
                speaker: "spring",
                tone: "чуткость",
                text: "Ты умеешь слышать тонкое. Это редкий дар, и он делает мир вокруг теплее."
              }
            ],
            effect: {
              set: {
                gardenEssence: "умение слышать тонкое"
              }
            }
          }
        ]
      },
      {
        speaker: "spring",
        tone: "мягкий комплимент",
        text: "Цветам не нужно доказывать, что они красивы. Они просто раскрываются в свое время. С людьми, которым дана настоящая мягкость, часто так же."
      },
      {
        speaker: "heroine",
        tone: "едва заметная улыбка",
        text: "Хочется помнить об этом чаще. И не спорить с собой каждый раз."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "ответ сердцу",
        text: "Какой отклик хочется оставить в этом саду?",
        options: [
          {
            label: "Позволить себе поверить",
            description: "Принять этот свет без спора.",
            reply: [
              {
                speaker: "spring",
                tone: "очень лично",
                text: () => `И правильно. В тебе так много мягкого света, ${CONFIG.heroineName}, что весне легко узнавать тебя среди тысячи лиц.`
              }
            ],
            effect: {
              set: {
                gardenBloom: "доверие к собственной красоте"
              }
            }
          },
          {
            label: "Просто улыбнуться этой мысли",
            description: "Не обещать многого, но оставить место для тепла.",
            reply: [
              {
                speaker: "spring",
                tone: "легкое золото",
                text: "Вот так. Эта улыбка уже похожа на первый теплый день, который никого не торопит."
              }
            ],
            effect: {
              set: {
                gardenBloom: "тихая улыбка, в которой уже есть свет"
              }
            }
          }
        ]
      },
      {
        speaker: "spring",
        tone: "дар сада",
        text: () => `Возьми этот Лепесток доверия. Пусть он напоминает тебе про ${state.memories.gardenEssence || "нежность"}, и про то, что красота может быть спокойной, настоящей и очень живой.`
      }
    ]
  },

  cottage: {
    label: "Уютный домик",
    location: "Уютный домик",
    hint: "Тепло окна, светлый воздух и право немного выдохнуть.",
    background: "cottage",
     
    rewardFragment: "cottage",
    locationId: "cottage",
    returnTo: "crossroads",
    steps: [
      {
        speaker: "spring",
        tone: "домашний свет",
        text: "Домик встречает тебя теплым светом на шторах, запахом чая и таким покоем, будто время здесь говорит шепотом."
      },
      {
        speaker: "spring",
        tone: "безопасное место",
        text: "Здесь можно не держаться идеально. Здесь можно выдохнуть и не объяснять, почему устала."
      },
      {
        speaker: "heroine",
        tone: "тихий выдох",
        text: "Как будто стены сами говорят: «отдохни, тебе можно». И от этого внутри становится мягче."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "маленький отдых",
        text: "Что хочется выбрать в этом тепле?",
        options: [
          {
            label: "Укутаться в плед",
            description: "Спрятаться в мягкости и тишине.",
            reply: [
              {
                speaker: "spring",
                tone: "бережность к себе",
                text: "Иногда лучший подвиг это разрешить себе остановиться. Тебе не нужно зарабатывать право на передышку."
              }
            ],
            effect: {
              set: {
                cottageEssence: "право на отдых без вины"
              }
            }
          },
          {
            label: "Сесть у окна с чаем",
            description: "Просто побыть рядом с теплом и светом.",
            reply: [
              {
                speaker: "spring",
                tone: "тихое лечение",
                text: "Покой тоже умеет лечить. Особенно тот, который не требует от тебя ни слов, ни усилий."
              }
            ],
            effect: {
              set: {
                cottageEssence: "умение принимать тихое тепло"
              }
            }
          }
        ]
      },
      {
        speaker: "spring",
        tone: "важная правда",
        text: () => `${CONFIG.heroineName}, тебе не обязательно быть сильной каждую минуту. Нежность не делает слабее. Она просто не кричит о себе.`
      },
      {
        speaker: "heroine",
        tone: "честность",
        text: "Иногда я правда забываю, что можно попросить у мира немного тишины и ничего не доказывать."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "доверие себе",
        text: "Какие слова тебе хочется оставить здесь?",
        options: [
          {
            label: "Я хочу беречь себя",
            description: "Выбрать мягкость и уважение к своему состоянию.",
            reply: [
              {
                speaker: "spring",
                tone: "зрелая нежность",
                text: "Это очень красивая просьба. В ней уже есть сила, просто спокойная и глубокая."
              }
            ],
            effect: {
              set: {
                cottageGlow: "бережность к себе"
              }
            }
          },
          {
            label: "Я хочу просто побыть в тепле",
            description: "Не анализировать больше, чем нужно.",
            reply: [
              {
                speaker: "spring",
                tone: "простое разрешение",
                text: "И этого достаточно. Тепло не требует сложных объяснений. Оно просто возвращает тебя к себе."
              }
            ],
            effect: {
              set: {
                cottageGlow: "разрешение не быть сильной каждую минуту"
              }
            }
          }
        ]
      },
      {
        speaker: "spring",
        tone: "дар домика",
        text: () => `Возьми Искру покоя. Пусть она хранит ${state.memories.cottageEssence || "это тепло"} и напоминает: отдыхать, восстанавливаться и дышать свободнее тебе можно без вины.`
      }
    ]
  },

  park: {
    label: "Весенний парк",
    location: "Весенний парк",
    hint: "Свежий воздух, живые дорожки и шаги, которым не нужно спешить.",
    background: "park",
     
    rewardFragment: "park",
    locationId: "park",
    returnTo: "crossroads",
    steps: [
      {
        speaker: "spring",
        tone: "движение воздуха",
        text: "В парке воздух живой: ветки едва качаются, дорожки блестят после света, а впереди все будто становится чуть шире."
      },
      {
        speaker: "spring",
        tone: "без давления",
        text: "Это место любит движение, но не спешку. Оно как будто знает, что новые пути лучше открываются без грубого нажима."
      },
      {
        speaker: "heroine",
        tone: "внутренний отклик",
        text: "Хочется идти вперед. Не быстро, просто идти и чувствовать, что жизнь никуда не исчезла."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "первый маршрут",
        text: "Какой шаг тянет тебя сейчас сильнее?",
        options: [
          {
            label: "Пойти по освещенной аллее",
            description: "Выбрать ясный путь и идти спокойно.",
            reply: [
              {
                speaker: "spring",
                tone: "уверенность без шума",
                text: "Тебе идут такие шаги: спокойные, но уверенные. В них нет суеты, зато есть настоящее движение."
              }
            ],
            effect: {
              set: {
                parkEssence: "спокойный шаг вперед"
              }
            }
          },
          {
            label: "Остановиться у воды",
            description: "Поймать отражение неба и почувствовать паузу.",
            reply: [
              {
                speaker: "spring",
                tone: "мягкая смелость",
                text: "Умение остановиться перед новым шагом тоже часть смелости. Ты не обязана бежать, чтобы идти дальше."
              }
            ],
            effect: {
              set: {
                parkEssence: "доверие паузе перед новым"
              }
            }
          }
        ]
      },
      {
        speaker: "spring",
        tone: "новые двери",
        text: "Впереди не обязательно готовые ответы. Иногда достаточно одной двери, которая откроется ровно тогда, когда ты до нее дойдешь."
      },
      {
        speaker: "heroine",
        tone: "прояснение",
        text: "Значит, мне не нужно знать все заранее, чтобы иметь право идти?"
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "живое разрешение",
        text: "Какой ответ ты возьмешь с собой?",
        options: [
          {
            label: "Сделать еще один шаг",
            description: "Ответить движением, а не сомнением.",
            reply: [
              {
                speaker: "spring",
                tone: "спокойная поддержка",
                text: "Нет. Достаточно твоего живого сердца и желания двигаться дальше в своем темпе."
              }
            ],
            effect: {
              set: {
                parkGlow: "готовность идти, даже если не все ясно"
              }
            }
          },
          {
            label: "Поднять лицо к ветру",
            description: "Доверить воздуху свой следующий вдох.",
            reply: [
              {
                speaker: "spring",
                tone: "доверие новому",
                text: "Нет. Иногда дорога начинается именно с такого доверия воздуху, когда ты еще не видишь весь путь целиком."
              }
            ],
            effect: {
              set: {
                parkGlow: "доверие новому без давления"
              }
            }
          }
        ]
      },
      {
        speaker: "spring",
        tone: "дар парка",
        text: () => `Возьми Шаг ветра. Он напоминает про ${state.memories.parkEssence || "движение вперед"} и про то, что впереди всегда может оказаться дверь, открывающаяся в свет.`
      }
    ]
  },

  convergence: {
    label: "Собранный свет",
    location: "Общая линия",
    hint: "Лепесток, искра и шаг складываются в одну тихую правду.",
    background: "key",
     
    steps: [
      {
        speaker: "spring",
        tone: "перед тишиной",
        text: "Теперь остановись на миг. Посмотри, что у тебя в руках: лепесток, искра и шаг. Они пришли из разных мест, но тянутся друг к другу."
      },
      {
        speaker: "spring",
        tone: "главное внутри",
        text: () => `Это не случайные дары. В тебе уже живут ${joinWithAnd([
          state.memories.gardenEssence || "нежность",
          state.memories.cottageEssence || "тихое тепло",
          state.memories.parkEssence || "спокойное движение вперед"
        ])}.`
      },
      {
        speaker: "spring",
        tone: "мягкие опоры",
        text: () => `И рядом с этим уже есть ${joinWithAnd([
          state.memories.gardenBloom || "доверие к своей красоте",
          state.memories.cottageGlow || "бережность к себе",
          state.memories.parkGlow || "готовность идти дальше"
        ])}.`
      },
      {
        speaker: "spring",
        tone: "без тяжелых слов",
        text: "Когда тяжело, очень легко подумать, будто в тебе стало меньше опоры. Но усталость сегодня не отменяет твою глубину завтра."
      },
      {
        speaker: "heroine",
        tone: "почти шепотом",
        text: "Значит, со мной не пусто? Даже если иногда кажется иначе?"
      },
      {
        speaker: "spring",
        tone: "лично и тепло",
        text: () => `Совсем нет, ${CONFIG.heroineName}. В тебе есть свет, который не бросается в глаза, но умеет вести вперед. И он уже рядом с твоими руками.`
      }
    ],
    nextScene: "keyScene"
  },

  keyScene: {
    label: "Символический ключ",
    location: "Ключ надежды",
    hint: "Из собранных смыслов рождается новая возможность идти дальше.",
    background: "key",
     
    steps: [
      {
        speaker: "spring",
        tone: "сборка света",
        text: "Лепесток доверия учит принимать нежное. Искра покоя напоминает о праве на отдых. Шаг ветра зовет к новым дверям без страха."
      },
      {
        speaker: "spring",
        tone: "самый важный миг",
        text: "Если соединить их вместе, получится не просто знак. Получится то, что умеет открывать путь дальше.",
        effect: "showKey"
      },
      {
        speaker: "spring",
        tone: "рождение символа",
        text: "Смотри. Из света, тишины и движения рождается ключ."
      },
      {
        speaker: "spring",
        tone: "не извне, а изнутри",
        text: () => `Это не чужое волшебство. Это форма твоей собственной надежды, внутреннего тепла и той ${state.memories.introTrace || "готовности слушать свет"}, с которой ты начала этот путь.`
      },
      {
        speaker: "heroine",
        tone: "тихое чудо",
        text: "Он такой теплый... будто всегда был рядом, просто я не замечала."
      },
      {
        speaker: "spring",
        tone: "самое личное",
        text: () => `Так и есть, ${CONFIG.warmName}. Я только помогла тебе увидеть его. Когда станет трудно, вспоминай: у тебя уже есть чем открыть следующую дверь.`
      }
    ],
    nextScene: "finale"
  },

  finale: {
    label: "Финал",
    location: "Светлый март",
    hint: "Поздравление, весенний воздух и место для личных слов.",
    background: "finale",
     
    steps: [
      {
        speaker: "spring",
        tone: "мягкое сияние",
        text: "Посмотри вокруг. День стал светлее, и ты вместе с ним. В воздухе снова много места для дыхания, надежды и тихой радости."
      },
      {
        speaker: "spring",
        tone: "бережное пожелание",
        text: "Пусть эта весна будет к тебе мягкой. Пусть в ней найдется место для спокойствия, новых сил, красивых совпадений и очень живого внутреннего света."
      },
      {
        speaker: "spring",
        tone: "8 марта",
        text: () => `С 8 Марта, ${CONFIG.heroineName}. Пусть рядом будет тепло, впереди свет, а внутри чувство, что жизнь умеет открываться красиво и вовремя.`
      },
      {
        speaker: "spring",
        tone: "от сердца к сердцу",
        text: "А теперь у меня для тебя есть еще кое-что. Самое личное.",
        effect: "showLetter"
      }
    ]
  }
};

function buildCrossroadsSteps(currentState) {
  const options = buildLocationOptions(currentState);

  if (currentState.visitedLocations.length === 0) {
    return [
      {
        speaker: "spring",
        tone: "первая развилка",
        hidePortraits: true,
        text: "Смотри: перед нами сад, домик и парк. В каждом месте спрятано что-то для твоего сердца."
      },
      {
        speaker: "spring",
        tone: "без правильного ответа",
        hidePortraits: true,
        text: "Не нужно выбирать идеально. Просто иди туда, куда тебя сейчас мягко тянет."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "куда идти дальше",
        hidePortraits: true,
        text: "Куда отправимся сначала?",
        layout: "locations",
        options
      }
    ];
  }

  if (currentState.visitedLocations.length < 3) {
    return [
      {
        speaker: "spring",
        tone: "возвращение",
        text: () => `Ты уже несешь с собой ${state.fragments.length === 1 ? "первый фрагмент ключа" : "еще одну часть ключа"}. Он стал теплее в твоих руках.`
      },
      {
        speaker: "spring",
        tone: "следующая тропинка",
        text: "Осталось совсем немного. Выбери следующую дорогу без спешки."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "следующий выбор",
        text: "Какая локация зовет тебя теперь?",
        layout: "locations",
        options
      }
    ];
  }

  return [
    {
      speaker: "spring",
      tone: "все рядом",
      text: "Теперь у тебя есть все три части. Они уже тянутся друг к другу, будто всегда были связаны."
    },
    {
      speaker: "spring",
      tone: "последний шаг перед чудом",
      text: "Пойдем. Есть кое-что важное, что я хочу показать тебе дальше."
    }
  ];
}

function buildLocationOptions(currentState) {
  return Object.entries(LOCATION_META)
    .filter(([locationId]) => !currentState.visitedLocations.includes(locationId))
    .map(([locationId, meta]) => ({
      label: meta.title,
      description: meta.description,
      scene: locationId
    }));
}

function joinWithAnd(items) {
  const filtered = items.filter(Boolean);

  if (filtered.length === 0) {
    return "";
  }

  if (filtered.length === 1) {
    return filtered[0];
  }

  if (filtered.length === 2) {
    return `${filtered[0]} и ${filtered[1]}`;
  }

  return `${filtered.slice(0, -1).join(", ")} и ${filtered[filtered.length - 1]}`;
}

function init() {
  applyPortraitLayout();
  ui.keySigil.querySelector("img").src = CONFIG.assets.keySigil;
  ui.letterText.textContent = CONFIG.personalLetter;

  setBackground(CONFIG.assets.backgrounds.start, true);
  renderFragments();
  updateMusicButton();

  if (CONFIG.assets.music) {
    ui.bgMusic.src = CONFIG.assets.music;
  }

  ui.startButton.addEventListener("click", beginStory);
  ui.nextButton.addEventListener("click", handleNext);
  ui.musicToggle.addEventListener("click", toggleMusic);
  ui.restartButton.addEventListener("click", restartStory);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      if (!ui.startScreen.classList.contains("hidden")) {
        event.preventDefault();
        beginStory();
        return;
      }

      if (!ui.nextButton.hidden && !ui.nextButton.disabled) {
        event.preventDefault();
        handleNext();
      }
    }
  });

  ui.bgMusic.addEventListener("error", () => {
    state.musicPlaying = false;
    updateMusicButton();
    showNotice("Музыка не найдена. Положите файл в assets и проверьте путь в CONFIG.assets.music.");
  });

  ui.bgMusic.addEventListener("pause", () => {
    state.musicPlaying = false;
    updateMusicButton();
  });

  ui.bgMusic.addEventListener("play", () => {
    state.musicPlaying = true;
    updateMusicButton();
  });

  Object.values(ui.portraitImages).forEach((image) => {
    image.addEventListener("error", handlePortraitImageError);
  });

  startPetals();
}

function beginStory() {
  if (state.storyStarted) {
    return;
  }

  resetStoryState();
  state.storyStarted = true;

  ui.startScreen.classList.add("hidden");
  ui.dialogPanel.classList.remove("hidden");

  if (state.musicWanted) {
    attemptMusicPlayback();
  }

  enterScene("intro");
}

function restartStory() {
  stopTyping(false, false);
  resetStoryState();
  setBackground(CONFIG.assets.backgrounds.start, false);
  applyPortraitLayout();
  ui.startScreen.classList.remove("hidden");
  ui.dialogPanel.classList.add("hidden");
  ui.dialogText.textContent = "";
  ui.choiceContainer.innerHTML = "";
  ui.locationLabel.textContent = "Особенное утро";
  ui.sceneHint.textContent = "Весна только-только подходит ближе.";
  ui.progressLabel.textContent = "Пробуждение";
  showNotice("История готова начаться заново.");
}

function resetStoryState() {
  state.currentSceneId = null;
  state.currentSteps = [];
  state.stepIndex = 0;
  state.replyQueue = [];
  state.pendingSceneId = null;
  state.visitedLocations = [];
  state.fragments = [];
  state.memories = {};
  state.storyFinished = false;
  state.storyStarted = false;
  state.typingLocked = false;
  state.currentText = "";
  state.typingCompleteHandler = null;

  ui.nextButton.hidden = false;
  ui.nextButton.disabled = false;
  ui.nextButton.textContent = "Далее";
  ui.choiceContainer.innerHTML = "";
  ui.choiceContainer.className = "choice-container";

  hideKey();
  hideLetter();
  renderFragments();
}

function enterScene(sceneId) {
  const scene = STORY[sceneId];

  if (!scene) {
    return;
  }

  state.currentSceneId = sceneId;
  state.currentSteps = typeof scene.steps === "function" ? scene.steps(state) : scene.steps;
  state.stepIndex = 0;
  state.replyQueue = [];
  state.pendingSceneId = null;
  state.storyFinished = false;

  const backgroundPath = resolveBackground(scene.background);
  setBackground(backgroundPath);
  updateSceneMeta(scene);
  renderCurrentNode();
}

function resolveBackground(backgroundKey) {
  return CONFIG.assets.backgrounds[backgroundKey] || backgroundKey;
}

function updateSceneMeta(scene) {
  const hint = typeof scene.hint === "function" ? scene.hint(state) : scene.hint;
  const progressPieces = [scene.label];

  if (state.fragments.length > 0) {
    progressPieces.push(`${state.fragments.length}/3`);
  }

  ui.progressLabel.textContent = progressPieces.join(" · ");
  ui.locationLabel.textContent = scene.location || scene.label;
  ui.sceneHint.textContent = hint || "";
}

function resolveCharacterValue(value) {
  return typeof value === "function" ? value(state) : value;
}

function clearPortraitStage() {
  ui.portraitStage.classList.remove(
    "dual-portraits",
    "left-portrait-visible",
    "right-portrait-visible"
  );

  ["left", "right"].forEach((slotName) => {
    const slotElement = ui.portraitSlots[slotName];
    const imageElement = ui.portraitImages[slotName];

    slotElement.classList.remove("visible", "focus-active", "focus-passive");
    imageElement.removeAttribute("src");
    imageElement.alt = "";
    imageElement.dataset.fallbackSrc = "";
    imageElement.dataset.fallbackAlt = "";
  });
}

function applyPortraitLayout(scene = null, node = null) {
  if (!state.storyStarted && !ui.startScreen.classList.contains("hidden")) {
    clearPortraitStage();
    return;
  }

  const activeScene = scene || STORY[state.currentSceneId] || null;
  const layout = buildPortraitLayout(activeScene, node);
  const visibleSlots = ["left", "right"].filter((slotName) => Boolean(layout[slotName]));
  const activeSlot = resolveActivePortraitSlot(layout, node);

  ui.portraitStage.classList.toggle("dual-portraits", visibleSlots.length >= 2);
  ui.portraitStage.classList.toggle("left-portrait-visible", Boolean(layout.left));
  ui.portraitStage.classList.toggle("right-portrait-visible", Boolean(layout.right));
  

  ["left", "right"].forEach((slotName) => {
    const slotElement = ui.portraitSlots[slotName];
    const imageElement = ui.portraitImages[slotName];
    const portrait = layout[slotName];

    slotElement.classList.remove("visible", "focus-active", "focus-passive");

    if (!portrait) {
      imageElement.removeAttribute("src");
      imageElement.alt = "";
      imageElement.dataset.fallbackSrc = "";
      imageElement.dataset.fallbackAlt = "";
      return;
    }

    const source = resolveCharacterValue(portrait.src) || getPortraitFallbackSource(portrait);
    const alt = resolveCharacterValue(portrait.alt) || getPortraitFallbackAlt(portrait);

    imageElement.src = source;
    imageElement.alt = alt;
    imageElement.dataset.fallbackSrc = getPortraitFallbackSource(portrait);
    imageElement.dataset.fallbackAlt = getPortraitFallbackAlt(portrait);
    slotElement.classList.add("visible");

    if (visibleSlots.length === 1 || !activeSlot) {
      slotElement.classList.add("focus-active");
      return;
    }

    slotElement.classList.add(activeSlot === slotName ? "focus-active" : "focus-passive");
  });
}

function buildPortraitLayout(scene, node) {
  const layout = {
    left: null,
    
    right: null
  };

 

  mergePortraits(layout, scene?.portraits);
  mergePortraits(layout, node?.portraits);
  const normalizedLayout = normalizePortraitSides(layout);

  const portraitsHidden = Boolean(scene?.hidePortraits || node?.hidePortraits);

  if (portraitsHidden) {
    return {
      left: null,

      right: null
    };
  }

  if (!normalizedLayout.left && !normalizedLayout.right) {
    normalizedLayout.left = {
      role: "heroine",
      src: () => CONFIG.assets.heroine
    };
  }

  return normalizedLayout;
}

function mergePortraits(target, source) {
  if (!source) {
    return;
  }

  ["left", "right"].forEach((slotName) => {
    if (Object.prototype.hasOwnProperty.call(source, slotName)) {
      target[slotName] = source[slotName];
    }
  });
}

function normalizePortraitSides(layout) {
  const normalized = {
    left: null,
    
    right: null
  };
  const assignedPortraits = new Set();

  const portraits = ["left", "right"]
    .map((slotName) => layout[slotName])
    .filter(Boolean);

  const heroinePortrait = portraits.find((portrait) => portrait.role === "heroine");
  const springPortrait = portraits.find((portrait) => portrait.role === "spring");

  if (heroinePortrait) {
    normalized.left = heroinePortrait;
    assignedPortraits.add(heroinePortrait);
  }

  if (springPortrait) {
    normalized.right = springPortrait;
    assignedPortraits.add(springPortrait);
  }

  ["left", "right"].forEach((slotName) => {
    const portrait = layout[slotName];

    if (!portrait || assignedPortraits.has(portrait)) {
      return;
    }

    

    if (!normalized.left) {
      normalized.left = portrait;
      assignedPortraits.add(portrait);
      return;
    }

    if (!normalized.right) {
      normalized.right = portrait;
      assignedPortraits.add(portrait);
    }
  });

  return normalized;
}

function resolveActivePortraitSlot(layout, node) {
  if (node?.activePortraitSlot) {
    return node.activePortraitSlot;
  }

  const speaker = node?.speaker;

  if (!speaker) {
    return null;
  }

  const roleToSlot = Object.entries(layout).find(([, portrait]) => portrait?.role === speaker);
  return roleToSlot ? roleToSlot[0] : null;
}

function getPortraitFallbackSource(portrait) {
  return resolveCharacterValue(portrait?.fallbackSrc)
    || (portrait?.role === "spring" ? CONFIG.assets.introSpring : CONFIG.assets.heroine);
}

function getPortraitFallbackAlt(portrait) {
  if (portrait?.role === "spring") {
    return "Весна в этой сцене";
  }

  return `Портрет героини ${CONFIG.heroineName}`;
}

function handlePortraitImageError(event) {
  const imageElement = event.currentTarget;
  const fallbackSource = imageElement.dataset.fallbackSrc || CONFIG.assets.heroine;
  const fallbackAlt = imageElement.dataset.fallbackAlt || `Портрет героини ${CONFIG.heroineName}`;
  const currentSource = imageElement.getAttribute("src");

  if (!fallbackSource || currentSource === fallbackSource) {
    return;
  }

  imageElement.src = fallbackSource;
  imageElement.alt = fallbackAlt;
  showNotice("Для одного из портретов не найден отдельный файл. Пока используется запасной вариант.");
}

function renderCurrentNode() {
  const scene = STORY[state.currentSceneId];
  const node = getActiveNode();

  if (!node) {
    completeScene(scene);
    return;
  }

  ui.choiceContainer.innerHTML = "";
  ui.choiceContainer.className = "choice-container";
  applyPortraitLayout(scene, node);
  runEffects(node.effect);

  if (node.type === "choice") {
    renderChoiceNode(node);
    return;
  }

  renderLineNode(node);
}

function getActiveNode() {
  if (state.replyQueue.length > 0) {
    return state.replyQueue[0];
  }

  return state.currentSteps[state.stepIndex];
}

function renderLineNode(node) {
  setSpeaker(node);
  ui.nextButton.hidden = false;
  ui.choiceContainer.innerHTML = "";
  typeText(resolveNodeText(node.text), () => {
    ui.nextButton.disabled = false;
    ui.nextButton.textContent = state.storyFinished ? "Пройти еще раз" : "Далее";
  });
}

function renderChoiceNode(node) {
  setSpeaker(node);
  ui.nextButton.hidden = true;
  typeText(resolveNodeText(node.text), () => {
    ui.choiceContainer.classList.toggle("locations", node.layout === "locations");

    node.options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";

      const title = document.createElement("strong");
      title.textContent = option.label;

      const description = document.createElement("span");
      description.textContent = option.description;

      button.append(title, description);
      button.addEventListener("click", () => handleChoice(option));
      ui.choiceContainer.appendChild(button);
    });
  });
}

function setSpeaker(node) {
  ui.speakerName.textContent = resolveSpeaker(node);
  ui.toneLabel.textContent = node.tone || "мягкий свет";
}

function resolveSpeaker(node) {
  if (node.speaker === "spring") {
    return CONFIG.springName;
  }

  if (node.speaker === "heroine") {
    return node.nameMode === "warm" ? CONFIG.warmName : CONFIG.heroineName;
  }

  return node.speaker || "";
}

function resolveNodeText(text) {
  return typeof text === "function" ? text(state) : text;
}

function typeText(fullText, onComplete) {
  stopTyping(false, false);
  state.currentText = fullText;
  state.typingLocked = true;
  state.typingCompleteHandler = onComplete || null;
  ui.nextButton.disabled = true;
  ui.dialogText.textContent = "";
  ui.dialogText.classList.add("typing");

  const speed = Math.max(8, CONFIG.textSpeed);
  let index = 0;

  state.typingTimer = window.setInterval(() => {
    index += 1;
    ui.dialogText.textContent = fullText.slice(0, index);

    if (index >= fullText.length) {
      stopTyping(true, true);
    }
  }, speed);
}

function stopTyping(fillText, triggerHandler) {
  if (state.typingTimer) {
    window.clearInterval(state.typingTimer);
    state.typingTimer = null;
  }

  ui.dialogText.classList.remove("typing");
  state.typingLocked = false;

  if (fillText) {
    ui.dialogText.textContent = state.currentText;
  }

  if (triggerHandler) {
    const handler = state.typingCompleteHandler;
    state.typingCompleteHandler = null;
    handler?.();
    return;
  }

  state.typingCompleteHandler = null;
}

function handleNext() {
  if (!state.storyStarted && !ui.startScreen.classList.contains("hidden")) {
    beginStory();
    return;
  }

  if (state.storyFinished) {
    restartStory();
    return;
  }

  if (state.typingLocked) {
    stopTyping(true, true);
    return;
  }

  if (state.replyQueue.length > 0) {
    state.replyQueue.shift();

    if (state.replyQueue.length === 0 && state.pendingSceneId) {
      const nextScene = state.pendingSceneId;
      state.pendingSceneId = null;
      enterScene(nextScene);
      return;
    }

    renderCurrentNode();
    return;
  }

  state.stepIndex += 1;
  renderCurrentNode();
}

function handleChoice(option) {
  applyChoiceEffect(option.effect);
  state.stepIndex += 1;
  state.replyQueue = option.reply ? [...option.reply] : [];
  state.pendingSceneId = option.scene || null;

  if (option.scene && state.replyQueue.length === 0) {
    enterScene(option.scene);
    return;
  }

  renderCurrentNode();
}

function applyChoiceEffect(effect) {
  if (!effect) {
    return;
  }

  if (effect.set) {
    Object.assign(state.memories, effect.set);
  }

  if (effect.toast) {
    showNotice(effect.toast);
  }
}

function completeScene(scene) {
  if (!scene) {
    return;
  }

  if (scene.locationId && !state.visitedLocations.includes(scene.locationId)) {
    state.visitedLocations.push(scene.locationId);
  }

  if (scene.rewardFragment && !state.fragments.includes(scene.rewardFragment)) {
    state.fragments.push(scene.rewardFragment);
    renderFragments();
    showNotice(`Получен фрагмент: ${FRAGMENTS[scene.rewardFragment].title}.`);
  }

  if (scene.returnTo) {
    enterScene(scene.returnTo);
    return;
  }

  if (scene.nextScene) {
    enterScene(scene.nextScene);
    return;
  }

  state.storyFinished = true;
  ui.nextButton.hidden = false;
  ui.nextButton.disabled = false;
  ui.nextButton.textContent = "Пройти еще раз";
  showNotice("Финал открыт. Можно перечитать историю заново.");
}

function renderFragments() {
  ui.fragmentList.innerHTML = "";

  Object.entries(FRAGMENTS).forEach(([fragmentId, fragment]) => {
    const item = document.createElement("li");
    item.className = "fragment-chip";

    if (state.fragments.includes(fragmentId)) {
      item.classList.add("collected");
    }

    const title = document.createElement("strong");
    title.textContent = fragment.title;

    const hint = document.createElement("span");
    hint.textContent = fragment.hint;

    item.append(title, hint);
    ui.fragmentList.appendChild(item);
  });
}

function setBackground(imagePath, immediate = false) {
  const nextIndex = state.activeBackgroundIndex === 0 ? 1 : 0;
  const currentLayer = ui.bgLayers[state.activeBackgroundIndex];
  const nextLayer = ui.bgLayers[nextIndex];

  nextLayer.style.backgroundImage = `url("${imagePath}")`;

  if (immediate) {
    currentLayer.classList.remove("active");
    nextLayer.classList.add("active");
    state.activeBackgroundIndex = nextIndex;
    return;
  }

  nextLayer.classList.add("active");
  currentLayer.classList.remove("active");
  state.activeBackgroundIndex = nextIndex;
}

function showKey() {
  ui.keySigil.classList.add("visible");
}

function hideKey() {
  ui.keySigil.classList.remove("visible");
}

function showLetter() {
  ui.letterText.textContent = CONFIG.personalLetter;
  ui.letterPanel.classList.add("visible");
  ui.letterPanel.classList.remove("hidden");
}

function hideLetter() {
  ui.letterPanel.classList.remove("visible");
  ui.letterPanel.classList.add("hidden");
}

function runEffects(effect) {
  if (!effect) {
    return;
  }

  const effects = Array.isArray(effect) ? effect : [effect];

  effects.forEach((entry) => {
    if (entry === "showKey") {
      showKey();
    }

    if (entry === "showLetter") {
      showLetter();
    }
  });
}

async function toggleMusic() {
  state.musicWanted = !state.musicWanted;

  if (!state.musicWanted) {
    ui.bgMusic.pause();
    state.musicPlaying = false;
    updateMusicButton();
    return;
  }

  await attemptMusicPlayback();
}

async function attemptMusicPlayback() {
  if (!CONFIG.assets.music) {
    state.musicWanted = false;
    updateMusicButton();
    showNotice("Укажите путь к музыке в CONFIG.assets.music, чтобы включить трек.");
    return;
  }

  try {
    await ui.bgMusic.play();
    state.musicPlaying = true;
    updateMusicButton();
  } catch (error) {
    state.musicPlaying = false;
    updateMusicButton();
    showNotice("Браузер пока не дал запустить музыку. Нажмите кнопку «Музыка», когда будете готовы.");
  }
}

function updateMusicButton() {
  if (!CONFIG.assets.music) {
    ui.musicToggle.textContent = "Музыка: файл не задан";
    return;
  }

  if (!state.musicWanted) {
    ui.musicToggle.textContent = "Музыка: выкл";
    return;
  }

  ui.musicToggle.textContent = state.musicPlaying ? "Музыка: вкл" : "Музыка: авто";
}

function showNotice(message) {
  ui.noticeBox.textContent = message;
  ui.noticeBox.classList.add("visible");

  if (state.noticeTimer) {
    window.clearTimeout(state.noticeTimer);
  }

  state.noticeTimer = window.setTimeout(() => {
    ui.noticeBox.classList.remove("visible");
  }, 2800);
}

function startPetals() {
  for (let index = 0; index < 12; index += 1) {
    createPetal(true);
  }

  state.petalTimer = window.setInterval(() => createPetal(false), 1300);
}

function createPetal(initial) {
  const petal = document.createElement("span");
  const duration = randomNumber(13, 22);
  const delay = initial ? randomNumber(-18, 0) : 0;
  const drift = `${randomNumber(-12, 12)}vw`;
  const spin = `${randomNumber(90, 320)}deg`;
  const left = `${randomNumber(2, 96)}%`;
  const size = randomNumber(12, 22);

  petal.className = "petal";
  petal.style.left = left;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.setProperty("--drift-x", drift);
  petal.style.setProperty("--spin", spin);
  petal.style.width = `${size}px`;
  petal.style.height = `${Math.round(size * 0.72)}px`;

  ui.petalLayer.appendChild(petal);

  window.setTimeout(() => {
    petal.remove();
  }, (duration + Math.max(delay, 0) + 1) * 1000);
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
init();