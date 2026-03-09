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
    
    introSpring: "assets/scene-intro-spring.png",
    introSpringWonder: "assets/scene-intro-spring-wonder.png",
    introSpringSpecialMoments: "assets/scene-intro-spring-special.png",
    gardenSpringChoice: "assets/scene-garden-spring-choice.png",
    gardenSpringTender: "assets/scene-garden-spring-tender.png",
    gardenSpringPersonalGift: "assets/scene-garden-spring-personal-gift.png",
    gardenSpringIntro: "assets/scene-garden-spring-intro.png",
    introNatashaSurprised: "assets/scene-intro-natasha-surprised.png",
    introNatashaTrust: "assets/scene-intro-natasha-trust.png",
    gardenNatashaSmile: "assets/scene-garden-natasha-smile.png",
    gardenNatashaCalm: "assets/scene-garden-natasha-calm.png",
    keySigil: "assets/key-sigil.svg",
    music: "assets/music-spring.mp3",
    backgrounds: {
      start: "assets/bg-start.png",
      awakening: "assets/bg-awakening-custom.png",
      crossroads: "assets/bg-crossroads-custom.png",
      garden: "assets/bg-garden-custom.png",
      cottage: "assets/bg-cottage-custom.png",
      park: "assets/bg-park-custom.png",
      collectedLight: "assets/bg-collected-light.png",
      key: "assets/bg-key.svg",
      finale: "assets/bg-convergence-custom.png"
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
  quickNav: document.getElementById("quickNav"),
  jumpSceneSelect: document.getElementById("jumpSceneSelect"),
  jumpStepSelect: document.getElementById("jumpStepSelect"),
  jumpToNodeButton: document.getElementById("jumpToNodeButton"),
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
        text: "Утро пришло тихо, почти украдкой. Оно не ворвалось, не потребовало к себе внимания — только коснулось стекла светом и застыло рядом, будто ожидая, когда его заметят."
      },
      {
        speaker: "spring",
        tone: "первый вдох",
        text: () => `Здравствуй, ${CONFIG.heroineName}. Сегодняшний день мягче, чем вчерашний. В нём словно растворено что-то такое, что может согреть, не обжигая.`
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
        text: "Кто ты?..Отчего твой голос кажется мне таким знакомым?"
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
        text: "Я — Весна. Но не та, что существует в названиях месяцев. Я — то едва различимое изменение, которое начинается с воздуха, со света, с внутреннего движения души, когда после долгой неподвижности в человеке снова просыпается жизнь."
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
        text: "Я здесь не затем, чтобы торопить тебя. Я знаю: к свету нельзя принуждать. К нему можно только подойти, когда внутри появятся силы."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "первое касание",
        text: "Скажи, что отзывается в тебе сильнее: остаться и вслушаться — или рискнуть и сделать шаг вперёд?",
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
                text: "Я хочу остаться. Если ты говоришь так, будто умеешь беречь, я готова слушать."
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
                text: "Тогда слушай спокойно. Я не стану говорить громко. Всё, что действительно важно, почти всегда приходит тихим голосом."
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
                text: "Мне хочется шагнуть тебе навстречу. Пусть не смело, пусть не сразу — но не остаться на месте."
              },
              {
                speaker: "spring",
                tone: "одобрение",
                text: "И этого достаточно. Для начала большего и не нужно. Порой самый маленький шаг оказывается честнее и важнее любой решимости, сказанной вслух."
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
        text: "Теперь я открою тебе три пути. В каждом из них скрыто нечто важное: память о тепле, возможность услышать себя и та искра, из которой постепенно возвращается внутренний свет."
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
        text: "Здесь всё цветёт тихо, словно боясь нарушить собственную тишину. Бутоны раскрываются не сразу, почти шёпотом, и от этого сад кажется ещё прекраснее."
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
        text: () => `${CONFIG.heroineName}, "посмотри, как всё здесь тянется к свету. Без усилия, без спешки, без борьбы. Просто потому, что свету свойственно быть желанным. Красота нередко растёт именно так — бережно и почти незаметно.`
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
        text: "Здесь так легко дышится... Словно от меня ничего не ждут и ничего не требуют."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "первое прикосновение",
        portraits: {
          right: {
            role: "spring",
            src: () => CONFIG.assets.gardenSpringChoice,
            fallbackSrc: () => CONFIG.assets.gardenSpringIntro,
            alt: "Весна в цветочном саду"
          }
        },
        text: "Что тебе хочется сделать здесь, среди цветов?",
        options: [
          {
            label: "Провести пальцами по лепесткам",
            description: "Почувствовать нежность буквально на кончиках пальцев.",
            reply: [
              {
                speaker: "spring",
                tone: "бережность",
                portraits: {
                  right: {
                    role: "spring",
                    src: () => CONFIG.assets.gardenSpringTender,
                    fallbackSrc: () => CONFIG.assets.gardenSpringChoice,
                    alt: "Весна в цветочном саду"
                  }
                },
                text: "Иногда нежность начинается именно так — с едва заметного прикосновения. Ты умеешь быть бережной, даже когда молчишь."
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
                text: "Ты умеешь чувствовать тонкое. Это редкое качество. Оно не бросается в глаза, но именно из него часто рождается настоящее тепло."
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
        portraits: {
          right: {
            role: "spring",
            src: () => CONFIG.assets.gardenSpringTender,
            fallbackSrc: () => CONFIG.assets.gardenSpringChoice,
            alt: "Весна в цветочном саду"
          }
        },
        text: "Цветам не нужно убеждать мир в своей красоте. Они просто раскрываются, когда приходит их время. С людьми, в которых живёт подлинная мягкость, бывает так же."
      },
      {
        speaker: "heroine",
        tone: "едва заметная улыбка",
        portraits: {
          left: {
            role: "heroine",
            src: () => CONFIG.assets.gardenNatashaSmile,
            fallbackSrc: () => CONFIG.assets.gardenNatashaCalm,
            alt: () => `${CONFIG.heroineName} с едва заметной улыбкой`
          }
        },
        text: "Мне бы хотелось помнить об этом чаще. И не спорить с собой всякий раз."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "ответ сердцу",
        text: "Какой отклик тебе хочется оставить в этом саду?",
        options: [
          {
            label: "Позволить себе поверить",
            description: "Принять этот свет без спора.",
            reply: [
              {
                speaker: "spring",
                tone: "очень лично",
                portraits: {
                  right: {
                    role: "spring",
                    src: () => CONFIG.assets.gardenSpringPersonalGift,
                    fallbackSrc: () => CONFIG.assets.gardenSpringTender,
                    alt: "Весна в цветочном саду"
                  }
                },
                text: `Это верное движение. В тебе так много тихого света, ${CONFIG.heroineName}, что весна узнала бы тебя среди множества других лиц.`
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
                text: "Вот так. Иногда одной такой улыбки достаточно, чтобы день стал теплее. В ней уже есть что-то от настоящей весны — мягкой, неторопливой, живой."
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
        portraits: {
          right: {
            role: "spring",
            src: () => CONFIG.assets.gardenSpringPersonalGift,
            fallbackSrc: () => CONFIG.assets.gardenSpringTender,
            alt: "Весна в цветочном саду"
          }
        },
        text: () => `Возьми этот Лепесток доверия. Пусть он напоминает тебе о ${state.memories.gardenEssence || "нежности"} и о том, что красота не обязана быть громкой, чтобы быть настоящей.`
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
        text: "Домик встречает тебя тёплым светом на шторах, едва уловимым запахом чая и таким покоем, что кажется: здесь даже время течёт тише, чем везде."
      },
      {
        speaker: "spring",
        tone: "безопасное место",
        text: "Здесь не нужно держаться безупречно. Здесь можно просто выдохнуть и не искать слов, чтобы объяснить свою усталость."
      },
      {
        speaker: "heroine",
        tone: "тихий выдох",
        text: "Такое чувство, будто сами стены говорят: “отдохни, тебе можно”. И от этого внутри становится спокойнее."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "маленький отдых",
        text: "Что тебе хочется выбрать в этом тепле?",
        options: [
          {
            label: "Укутаться в плед",
            description: "Спрятаться в мягкости и тишине.",
            reply: [
              {
                speaker: "spring",
                tone: "бережность к себе",
                text: "Иногда самый трудный и самый нужный шаг — позволить себе остановиться. Тебе не нужно заслуживать право на отдых."
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
                text: "Покой тоже умеет исцелять. Особенно тот, который ничего от тебя не требует — ни слов, ни усилия, ни попытки казаться сильнее, чем ты есть."
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
        text: "Наташа, тебе не обязательно быть сильной каждую минуту. Нежность не делает человека слабым. Она просто живёт иначе — тише, глубже, без потребности что-либо доказывать."
      },
      {
        speaker: "heroine",
        tone: "честность",
        text: "Иногда я и правда забываю, что можно попросить у мира немного тишины — и не чувствовать за это вины."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "доверие себе",
        text: "Какие слова тебе хочется оставить здесь, в этом доме?",
        options: [
          {
            label: "Я хочу беречь себя",
            description: "Выбрать мягкость и уважение к своему состоянию.",
            reply: [
              {
                speaker: "spring",
                tone: "зрелая нежность",
                text: "Это очень важные слова. В них уже есть сила — не резкая, не показная, а спокойная и настоящая."
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
                text: "И этого достаточно. Тепло не требует объяснений. Оно просто понемногу возвращает человека к самому себе."
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
        text: () => `Возьми Искру покоя. Пусть она хранит ${state.memories.cottageEssence || "выбранную память"} и напоминает тебе: отдых, тишина и возможность восстановиться не нужно заслуживать.`
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
        text: "В парке воздух кажется особенно живым: ветви едва колышутся, дорожки светлеют под солнцем, и всё впереди словно становится просторнее."
      },
      {
        speaker: "spring",
        tone: "без давления",
        text: "Это место любит движение, но не терпит суеты. Оно будто знает: новые дороги открываются не под нажимом, а тогда, когда человек готов сделать шаг без страха."
      },
      {
        speaker: "heroine",
        tone: "внутренний отклик",
        text: "Мне хочется идти вперёд. Не быстро — просто идти и чувствовать, что жизнь по-прежнему движется во мне."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "первый маршрут",
        text: "Какой шаг отзывается тебе сейчас сильнее всего?",
        options: [
          {
            label: "Пойти по освещённой аллее",
            description: "Выбрать ясный путь и идти спокойно.",
            reply: [
              {
                speaker: "spring",
                tone: "уверенность без шума",
                text: "Тебе идут такие шаги — спокойные, ясные, без лишнего шума. В них нет поспешности, но есть главное: настоящее движение."
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
                text: "Умение остановиться перед следующим шагом — тоже форма смелости. Чтобы двигаться дальше, не всегда нужно спешить."
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
        text: "Впереди не обязательно должны ждать готовые ответы. Порой человеку достаточно одной двери, которая откроется именно в тот миг, когда он до неё дойдёт."
      },
      {
        speaker: "heroine",
        tone: "прояснение",
        text: "Значит, мне не нужно знать всё заранее, чтобы иметь право идти дальше?"
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "живое разрешение",
        text: "Что ты хочешь унести с собой из этого мгновения?",
        options: [
          {
            label: "Сделать ещё один шаг",
            description: "Ответить движением, а не сомнением.",
            reply: [
              {
                speaker: "spring",
                tone: "спокойная поддержка",
                text: "Нет, не нужно. Твоего живого сердца и готовности идти своим темпом уже достаточно."
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
                text: "Нет, не нужно. Иногда путь начинается именно так — с доверия к тому, чего ещё нельзя увидеть целиком, но уже можно почувствовать."
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
        text: () => `Возьми Шаг ветра. Пусть он хранит ${state.memories.parkEssence || "выбранную память"} и напоминает тебе: впереди всегда может ждать свет, даже если дорога к нему открывается не сразу.`
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
        text: "Теперь остановись ненадолго. Просто посмотри, что осталось у тебя в руках: лепесток, искра и шаг. Они пришли к тебе из разных мест, но с самого начала тянулись друг к другу."
      },
      {
        speaker: "spring",
        tone: "главное внутри",
        text: () => `Это не случайные дары. Всё, что они в себе хранят, уже есть в тебе самой: ${joinWithAnd([
          state.memories.gardenEssence || "нежность",
          state.memories.cottageEssence || "тихое тепло",
          state.memories.parkEssence || "спокойное движение вперед"
        ])}.`
      },
      {
        speaker: "spring",
        tone: "мягкие опоры",
        text: () => `И рядом с этим в тебе живёт то, на что можно опереться: ${joinWithAnd([
          state.memories.gardenBloom || "доверие к своей красоте",
          state.memories.cottageGlow || "бережность к себе",
          state.memories.parkGlow || "готовность идти дальше"
        ])}.`
      },
      {
        speaker: "spring",
        tone: "без тяжелых слов",
        text: "Когда становится тяжело, человеку легко поверить, будто внутри у него стало меньше силы и тише свет. Но усталость — это не утрата. Она не отменяет ни твоей глубины, ни того, что по-настоящему в тебе есть."
      },
      {
        speaker: "heroine",
        tone: "почти шепотом",
        text: "Значит, во мне и правда не пусто? Даже в те минуты, когда мне кажется обратное?"
      },
      {
        speaker: "spring",
        tone: "лично и тепло",
        text: "Совсем не пусто, Наташа. В тебе есть свет — тихий, негромкий, не тот, что ослепляет, а тот, что умеет вести дальше. И сейчас он уже так близко, что ты можешь держать его в собственных руках."
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
        text: "Лепесток доверия учит принимать нежность без страха. Искра покоя напоминает о том, что отдых — не слабость, а право. Шаг ветра зовёт вперёд, к тому, что ещё не открыто, но уже ждёт тебя."
      },
      {
        speaker: "spring",
        tone: "самый важный миг",
        text: "Соединённые вместе, они становятся чем-то большим, чем просто знаки. В них складывается то, что способно открыть тебе дальнейший путь.",
        effect: "showKey"
      },
      {
        speaker: "spring",
        tone: "рождение символа",
        text: "Посмотри: из света, тишины и движения рождается ключ."
      },
      {
        speaker: "spring",
        tone: "не извне, а изнутри",
        text: () => `В нём нет чужого волшебства. Только твоя собственная надежда, твоё внутреннее тепло и та ${state.memories.introTrace || "начальная внутренняя установка"}, с которой ты когда-то вступила на эту дорогу.`
      },
      {
        speaker: "heroine",
        tone: "тихое чудо",
        text: "Он такой тёплый... Как будто всё это время был рядом со мной, а я просто не умела его заметить."
      },
      {
        speaker: "spring",
        tone: "самое личное",
        text: "Так и было, Наташа. Я лишь помогла тебе увидеть то, что уже жило в тебе. И когда тебе снова станет трудно, вспомни: у тебя уже есть ключ, которым можно открыть следующую дверь."
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
        text: "Посмотри вокруг. День стал светлее — и ты вместе с ним. В воздухе снова появилось место для дыхания, для надежды, для той тихой радости, которая приходит не сразу, но остаётся надолго."
      },
      {
        speaker: "spring",
        tone: "бережное пожелание",
        text: "Пусть эта весна будет к тебе бережна. Пусть в ней найдётся место для покоя, для новых сил, для счастливых совпадений и для света, который рождается не снаружи, а внутри."
      },
      {
        speaker: "spring",
        tone: "8 марта",
        text: "С (прошедшим тебя) Восьмым марта, Наташа. Пусть рядом с тобой будет тепло, впереди — свет, а в душе живёт ясное чувство, что жизнь умеет раскрываться красиво, своевременно и именно тогда, когда человек снова готов ей довериться."
      },
      {
        speaker: "spring",
        tone: "от сердца к сердцу",
        text: "И это ещё не всё. У меня есть для тебя кое-что ещё. Нечто совсем личное.",
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
        text: "Посмотри: перед нами сад, маленький дом и парк. У каждого из этих мест — своё молчание, своё тепло, и в каждом найдётся что-то, что может отозваться в твоём сердце."
      },
      {
        speaker: "spring",
        tone: "без правильного ответа",
        hidePortraits: true,
        text: "Не старайся выбрать безошибочно. В такие минуты это не нужно. Достаточно просто прислушаться к себе и пойти туда, куда тебя тянет тише всего, но вернее."
      },
      {
        type: "choice",
        speaker: "spring",
        tone: "куда идти дальше",
        hidePortraits: true,
        text: "Куда ты хочешь отправиться сначала?",
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
  ui.jumpSceneSelect.addEventListener("change", syncJumpStepOptions);
  ui.jumpToNodeButton.addEventListener("click", jumpToSelectedNode);
  populateJumpSceneOptions();

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

function getSceneStepLabel(step, index) {
  const speaker = step?.speaker === "spring"
    ? CONFIG.springName
    : (step?.speaker === "heroine" ? CONFIG.heroineName : "Сцена");
  const tone = step?.tone || (step?.type === "choice" ? "выбор" : "шаг");
  return `${index + 1}. ${speaker} · ${tone}`;
}

function resolveSceneStepsForJump(sceneId) {
  const scene = STORY[sceneId];

  if (!scene) {
    return [];
  }

  if (typeof scene.steps === "function") {
    return scene.steps(state);
  }

  return scene.steps || [];
}

function populateJumpSceneOptions() {
  const currentSceneId = state.currentSceneId || "intro";
  ui.jumpSceneSelect.innerHTML = "";

  Object.entries(STORY).forEach(([sceneId, scene]) => {
    const option = document.createElement("option");
    option.value = sceneId;
    option.textContent = scene.label || sceneId;
    if (sceneId === currentSceneId) {
      option.selected = true;
    }
    ui.jumpSceneSelect.appendChild(option);
  });

  syncJumpStepOptions();
}

function syncJumpStepOptions() {
  const sceneId = ui.jumpSceneSelect.value || "intro";
  const steps = resolveSceneStepsForJump(sceneId);
  const activeIndex = sceneId === state.currentSceneId ? state.stepIndex : 0;

  ui.jumpStepSelect.innerHTML = "";

  steps.forEach((step, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = getSceneStepLabel(step, index);
    if (index === activeIndex) {
      option.selected = true;
    }
    ui.jumpStepSelect.appendChild(option);
  });
}

function jumpToSelectedNode() {
  stopTyping(false, false);

  const sceneId = ui.jumpSceneSelect.value || "intro";
  const stepIndex = Math.max(0, Number.parseInt(ui.jumpStepSelect.value || "0", 10) || 0);

  if (!state.storyStarted) {
    resetStoryState();
    state.storyStarted = true;
    ui.startScreen.classList.add("hidden");
    ui.dialogPanel.classList.remove("hidden");

    if (state.musicWanted) {
      attemptMusicPlayback();
    }
  }

  enterScene(sceneId);
  const maxIndex = Math.max(0, state.currentSteps.length - 1);
  state.stepIndex = Math.min(stepIndex, maxIndex);
  renderCurrentNode();

  if (ui.quickNav.open) {
    ui.quickNav.open = false;
  }

  syncJumpStepOptions();
  showNotice(`Переход: ${STORY[sceneId].label}, шаг ${state.stepIndex + 1}.`);
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
    || (portrait?.role === "spring" ? CONFIG.assets.introSpring : CONFIG.assets.introNatashaSurprised);
}

function getPortraitFallbackAlt(portrait) {
  if (portrait?.role === "spring") {
    return "Весна в этой сцене";
  }

  return `Портрет героини ${CONFIG.heroineName}`;
}

function handlePortraitImageError(event) {
  const imageElement = event.currentTarget;
  const fallbackSource = imageElement.dataset.fallbackSrc || CONFIG.assets.introNatashaSurprised;
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