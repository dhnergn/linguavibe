import { VibeExercise, GrammarExercise, StoryChapter, RoleplayPersona, LanguageCode } from '../types';

export const VIBE_EXERCISES: Record<LanguageCode, VibeExercise[]> = {
  es: [
    {
      id: 'es-vibe-1',
      type: 'read-the-room',
      title: 'Declining a Party Invite Politely',
      situation: 'Your friend Javier invites you to a late-night rooftop birthday party, but you have an early morning flight and cannot attend.',
      culturalContext: 'In Spain and Latin America, a flat "No puedo" sounds cold and dismissive. Natives soften refusal with enthusiasm for the event, a warm regret particle, and a promise to meet up soon.',
      audioPhrase: '¡Ay qué pena me da! Me muero de ganas pero salgo de viaje tempranísimo.',
      options: [
        {
          text: 'No, no puedo ir.',
          translation: 'No, I cannot go.',
          vibeRating: 'awkward',
          vibeFeedback: 'Way too abrupt and blunt! Javier might think you are upset or annoyed with him.',
          isBestChoice: false,
          xp: 5,
        },
        {
          text: '¡Me muero de ganas, pero me toca madrugar por un vuelo! Nos vemos la otra semana sin falta, ¿vale?',
          translation: 'I am dying to go, but I have to wake up super early for a flight! We must catch up next week for sure, deal?',
          vibeRating: 'spot-on',
          vibeFeedback: 'Perfect local warmth! Expresses genuine desire, gives the gentle reason, and locks in a future meetup.',
          isBestChoice: true,
          xp: 30,
        },
        {
          text: 'Agradezco su cordial invitación, sin embargo me veo en la imposibilidad de asistir por compromisos.',
          translation: 'I appreciate your cordial invitation, however I find myself unable to attend due to commitments.',
          vibeRating: 'too-formal',
          vibeFeedback: 'Sounds like a 19th-century royal proclamation to a casual friend! Way too stiff.',
          isBestChoice: false,
          xp: 10,
        },
        {
          text: 'Paso, qué pereza.',
          translation: 'I pass, what a drag.',
          vibeRating: 'overly-casual',
          vibeFeedback: 'Rude and disrespectful to a friend who organized an event.',
          isBestChoice: false,
          xp: 5,
        },
      ],
      nativeTip: 'Use "¡Qué pena!" or "¡Me muero de ganas!" when declining—emotional enthusiasm protects the friendship vibe.',
    },
    {
      id: 'es-vibe-2',
      type: 'tone-dial',
      title: 'Ordering Tapas at a Crowded Bar',
      situation: 'The bar in Madrid is bustling, plates are clattering, and the bartender makes eye contact for 2 seconds. What do you say?',
      culturalContext: 'In bustling Spanish bars, locals do not say "Yo quiero ordenar...". They use brisk, warm requests like "¿Me pones...?" or "¿Te encargo...?" with a friendly "¿vale?".',
      audioPhrase: '¿Nos pones dos cañas y una de bravas cuando puedas?',
      options: [
        {
          text: 'Estimado señor, ¿sería tan amable de traernos el menú de comidas?',
          translation: 'Dear sir, would you be so kind as to bring us the food menu?',
          vibeRating: 'too-formal',
          vibeFeedback: 'The bartender will think you are joking or lost; bars are fast-paced and egalitarian.',
          isBestChoice: false,
          xp: 10,
        },
        {
          text: '¡Oye! ¡Dame dos cervezas y patatas ya!',
          translation: 'Hey! Give me two beers and potatoes now!',
          vibeRating: 'awkward',
          vibeFeedback: 'Overly aggressive and demanding.',
          isBestChoice: false,
          xp: 5,
        },
        {
          text: 'Buenas, ¿nos pones dos cañas y una de bravas cuando puedas?',
          translation: 'Hey there, could you get us two draft beers and an order of bravas whenever you get a chance?',
          vibeRating: 'spot-on',
          vibeFeedback: 'Pure native energy! Fast, conversational, and polite with "cuando puedas".',
          isBestChoice: true,
          xp: 30,
        },
      ],
      nativeTip: 'Instead of "Yo quiero", use "¿Me pones...?" (Spain) or "¿Me regalas/prestas...?" (Colombia/Mexico).',
    },
    {
      id: 'es-vibe-3',
      type: 'text-slang',
      title: 'Decoding Group Chat Slang',
      situation: 'Your friend texts: "Oye, ¿te vienes a comer? Invito yo, que hoy me pagaron. Dale, no te hagas el remolón."',
      culturalContext: '"Hacerse el remolón" or "remolonear" means dragging your feet or pretending to be reluctant when everyone knows you want to come.',
      audioPhrase: 'Dale, no te hagas el remolón.',
      options: [
        {
          text: 'Don\'t play hard to get / don\'t drag your feet, come on!',
          translation: 'Accurate cultural meaning',
          vibeRating: 'spot-on',
          vibeFeedback: 'Spot on! It playfully calls you out for hesitation in a loving way.',
          isBestChoice: true,
          xp: 25,
        },
        {
          text: 'Don\'t be lazy about your morning workout.',
          translation: 'Literal misunderstanding',
          vibeRating: 'awkward',
          vibeFeedback: 'Not about exercise at all; it\'s about joining the meal!',
          isBestChoice: false,
          xp: 5,
        },
        {
          text: 'Don\'t order expensive dishes.',
          translation: 'Incorrect context',
          vibeRating: 'awkward',
          vibeFeedback: 'He literally said he is paying for you ("Invito yo")!',
          isBestChoice: false,
          xp: 5,
        },
      ],
      nativeTip: '"No te hagas el..." is used everywhere: "No te hagas el loco" (don\'t act dumb), "No te hagas el santo" (don\'t act like a saint).',
    },
  ],

  ja: [
    {
      id: 'ja-vibe-1',
      type: 'read-the-room',
      title: 'Reading the Room at an Izakaya',
      situation: 'Your Japanese coworkers are ordering drinks. You notice one colleague\'s glass is empty, and the server is looking over.',
      culturalContext: 'In Japan, pouring drinks for others and noticing empty glasses (気配り - kikubari) is key to the social harmony vibe.',
      audioPhrase: '次、何か飲む？',
      options: [
        {
          text: 'ビールを飲みなさい。',
          translation: 'Drink beer (imperative command).',
          vibeRating: 'awkward',
          vibeFeedback: 'Sounds like a strict boss barking orders to a toddler!',
          isBestChoice: false,
          xp: 5,
        },
        {
          text: '次、何か飲む？メニュー見る？',
          translation: 'Want something next? Want to check the menu?',
          vibeRating: 'spot-on',
          vibeFeedback: 'Attentive, casual, considerate, and perfectly smooth for an izakaya table.',
          isBestChoice: true,
          xp: 30,
        },
        {
          text: 'あなたのコップは空っぽですので、注文してください。',
          translation: 'Because your cup is empty, please order.',
          vibeRating: 'too-formal',
          vibeFeedback: 'Very robotic! Textbook Japanese with awkward literal statements.',
          isBestChoice: false,
          xp: 10,
        },
      ],
      nativeTip: 'Notice how locals say "次、何か飲む？" (casual) or "次、何か飲まれますか？" (polite) instead of stating the obvious.',
    },
    {
      id: 'ja-vibe-2',
      type: 'text-slang',
      title: 'Decoding Japanese Internet Slang (草 and やばい)',
      situation: 'A friend sends a photo of their cat knocking over a pyramid of matcha tins with the caption: "やばいwwwww 草生える"',
      culturalContext: '"w" comes from "warau" (to laugh). A string of w\'s looks like blades of grass, which led to "草" (kusa = grass/LOL) and "草生える" (literally "grass is growing" = that is hilarious).',
      audioPhrase: 'やばい、草生える！',
      options: [
        {
          text: 'The cat ruined the lawn garden.',
          translation: 'Literal botanical mistake',
          vibeRating: 'awkward',
          vibeFeedback: 'No lawn involved! "草" means LOL.',
          isBestChoice: false,
          xp: 5,
        },
        {
          text: 'Crazy situation! This is absolutely hilarious (LOL)',
          translation: 'Correct slang reading',
          vibeRating: 'spot-on',
          vibeFeedback: 'Boom! You decoded Japanese internet humor like a Tokyo netizen.',
          isBestChoice: true,
          xp: 25,
        },
        {
          text: 'Danger, danger, emergency!',
          translation: 'Too alarmist',
          vibeRating: 'awkward',
          vibeFeedback: 'While "やばい" can mean dangerous, paired with "草" it means crazy funny.',
          isBestChoice: false,
          xp: 5,
        },
      ],
      nativeTip: 'Use "草" in text chats when something is funny. In spoken slang, people say "ウケる" (ukeru) instead!',
    },
  ],

  fr: [
    {
      id: 'fr-vibe-1',
      type: 'read-the-room',
      title: 'Entering a Parisian Boutique',
      situation: 'You push open the door of a small design shop in the Marais in Paris. The shopkeeper looks up from the counter.',
      culturalContext: 'In France, omitting "Bonjour" upon entering any shop is considered an immense social breach. It acknowledges the other person as a human before doing business.',
      audioPhrase: 'Bonjour !',
      options: [
        {
          text: 'Silent nod and immediately start inspecting the leather jackets.',
          translation: 'No greeting',
          vibeRating: 'awkward',
          vibeFeedback: 'Major Parisian faux pas! You will receive icy service. Always say Bonjour.',
          isBestChoice: false,
          xp: 0,
        },
        {
          text: 'Bonjour ! (with a warm polite smile)',
          translation: 'Hello!',
          vibeRating: 'spot-on',
          vibeFeedback: 'The magic key to France. Instantly unlocks warm, attentive service.',
          isBestChoice: true,
          xp: 30,
        },
        {
          text: 'Combien coûte cette veste là-bas ?',
          translation: 'How much does that jacket cost over there?',
          vibeRating: 'awkward',
          vibeFeedback: 'Bypassing the greeting to talk money is considered rude.',
          isBestChoice: false,
          xp: 5,
        },
      ],
      nativeTip: 'Always pair "Bonjour" when entering and "Merci, bonne journée !" when exiting.',
    },
    {
      id: 'fr-vibe-2',
      type: 'tone-dial',
      title: 'Casual Parisian Negation Drop',
      situation: 'Your French friend asks if you know the singer playing on the café speakers.',
      culturalContext: 'In spoken casual French, virtually everyone drops the "ne" in negations. "Je ne sais pas" becomes "Je sais pas" or "Chais pas".',
      audioPhrase: 'Non, je connais pas du tout.',
      options: [
        {
          text: 'Non, je ne connais point cette œuvre musicale.',
          translation: 'No, I know not this musical work.',
          vibeRating: 'too-formal',
          vibeFeedback: 'Sounds like Molière from the 17th century! Friends will laugh.',
          isBestChoice: false,
          xp: 10,
        },
        {
          text: 'Non, je connais pas du tout, mais c\'est super sympa !',
          translation: 'No, I don\'t know it at all, but it\'s super nice!',
          vibeRating: 'spot-on',
          vibeFeedback: 'Dropping the "ne" and using "super sympa" is 100% contemporary French.',
          isBestChoice: true,
          xp: 30,
        },
      ],
      nativeTip: 'In texts or casual speech: "C\'est pas grave", "Je sais pas", "T\'as pas vu ?".',
    },
  ],

  it: [
    {
      id: 'it-vibe-1',
      type: 'read-the-room',
      title: 'Coffee Etiquette at a Milanese Bar',
      situation: 'It is 4:30 PM in Milan. You step up to the marble bar to order a coffee.',
      culturalContext: 'In Italy, milky coffees like cappuccino are breakfast drinks (usually before 11 AM). Ordering one in the late afternoon marks you as an outsider, whereas an espresso, macchiato, or caffe shakerato fits right in.',
      audioPhrase: 'Un caffè al banco, per favore.',
      options: [
        {
          text: 'Vorrei un cappuccino grande con cannella e panna.',
          translation: 'I would like a large cappuccino with cinnamon and whipped cream.',
          vibeRating: 'awkward',
          vibeFeedback: 'The barista might look at you with silent despair! Milk after 11am interferes with digestion in Italian lore.',
          isBestChoice: false,
          xp: 5,
        },
        {
          text: 'Un caffè al banco, per favore.',
          translation: 'An espresso at the bar, please.',
          vibeRating: 'spot-on',
          vibeFeedback: 'Pure Italian rhythm! Fast, authentic, and drinking standing at the counter ("al banco").',
          isBestChoice: true,
          xp: 30,
        },
      ],
      nativeTip: 'In Italy, "un caffè" automatically means a single shot of espresso. No need to say "un espresso"!',
    },
  ],

  de: [
    {
      id: 'de-vibe-1',
      type: 'tone-dial',
      title: 'The Omnipresent "Na?" in Berlin',
      situation: 'You bump into your neighbor in the hallway. He tilts his head with a slight smile and says: "Na?"',
      culturalContext: '"Na" is the quintessential German conversational Swiss-army knife. It can mean "How are you?", "What\'s up?", "Well then", or "Everything okay?". A classic response is "Na, alles gut?" or "Na, wie geht\'s?".',
      audioPhrase: 'Na, alles gut bei dir?',
      options: [
        {
          text: 'Guten Tag, Herr Nachbar. Zu Ihrer Information: Mir geht es heute den Umständen entsprechend passabel.',
          translation: 'Good day, Mr. Neighbor. For your information: I am doing tolerably given the circumstances.',
          vibeRating: 'too-formal',
          vibeFeedback: 'Overly clinical and formal for a quick hallway encounter!',
          isBestChoice: false,
          xp: 10,
        },
        {
          text: 'Na! Alles gut bei dir?',
          translation: 'Hey! Everything good with you?',
          vibeRating: 'spot-on',
          vibeFeedback: 'Mirroring the "Na" with a relaxed inquiry is the exact local vibe.',
          isBestChoice: true,
          xp: 30,
        },
      ],
      nativeTip: 'Master the tone of "Na?": slightly rising inflection invites a casual 2-minute chat.',
    },
  ],
};

export const GRAMMAR_EXERCISES: Record<LanguageCode, GrammarExercise[]> = {
  es: [
    {
      id: 'es-gram-1',
      type: 'sentence-architect',
      title: 'Indirect Pronoun Living Order',
      instruction: 'Arrange the tokens to say: "He gave it to me yesterday."',
      targetConcept: 'Double Object Pronouns (Indirect + Direct)',
      sentenceContext: 'Talking about a concert ticket a friend handed you.',
      englishMeaning: 'He gave it to me yesterday.',
      tokens: ['Él', 'lo', 'me', 'dio', 'ayer'],
      correctTokenOrder: ['Él', 'me', 'lo', 'dio', 'ayer'],
      explanation: 'In Spanish, Indirect pronouns (me/te/le/nos/les) ALWAYS precede Direct pronouns (lo/la/los/las). Remember: "People before Things"!',
      xp: 25,
    },
    {
      id: 'es-gram-2',
      type: 'context-conjugation',
      title: 'Subjunctive of Emotion & Desire',
      instruction: 'Select the right form to complete the feeling of hope:',
      targetConcept: 'Present Subjunctive with "Espero que"',
      sentenceContext: 'You are wishing your friend a great weekend.',
      englishMeaning: 'I hope you have a great weekend.',
      fillInBlank: {
        prefix: 'Espero que ',
        suffix: ' un buen fin de semana.',
        verbBase: 'tener',
        correctForm: 'tengas',
        options: ['tienes', 'tengas', 'tendrás', 'tuviste'],
      },
      explanation: 'Verbs of emotion or desire ("espero que", "quiero que") trigger the subjunctive mood in the second clause ("tengas", not the indicative "tienes").',
      xp: 25,
    },
    {
      id: 'es-gram-3',
      type: 'error-spotter',
      title: 'Por vs Para in Context',
      instruction: 'Tap the word in the sentence that is incorrect:',
      targetConcept: 'Por vs Para (Reason vs Purpose/Recipient)',
      sentenceContext: 'Giving a birthday gift to your sister.',
      englishMeaning: 'This gift is for you because it is your birthday.',
      sentenceWithSpotter: {
        words: ['Este', 'regalo', 'es', 'por', 'ti', 'porque', 'es', 'tu', 'cumpleaños.'],
        errorIndex: 3, // 'por'
        correction: 'para',
        explanation: 'When expressing recipient or destination of a gift, use "para ti" (intended for you), whereas "por" denotes cause, exchange, or duration.',
      },
      explanation: 'Recipient / Goal = "para". Cause / Motivator = "por".',
      xp: 25,
    },
  ],

  ja: [
    {
      id: 'ja-gram-1',
      type: 'sentence-architect',
      title: 'Topic vs Subject Particle Flow (は vs が)',
      instruction: 'Assemble the sentence meaning: "I like ramen (as for me, ramen is liked)."',
      targetConcept: 'Particles は and が with emotive adjectives (好き)',
      sentenceContext: 'Sharing your favorite food at dinner.',
      englishMeaning: 'I like ramen.',
      tokens: ['私', 'は', 'ラーメン', 'が', '好き', 'です'],
      correctTokenOrder: ['私', 'は', 'ラーメン', 'が', '好き', 'です'],
      explanation: 'In Japanese, the experiencer takes は (topic), and the object of liking/skill/desire takes が (ラーメンが好きです).',
      xp: 25,
    },
    {
      id: 'ja-gram-2',
      type: 'context-conjugation',
      title: 'Te-form Request for Friendly Situations',
      instruction: 'Complete the sentence with the natural request form:',
      targetConcept: '〜てください (Polite request)',
      sentenceContext: 'Asking the barista to wait a second while you find your wallet.',
      englishMeaning: 'Please wait a moment.',
      fillInBlank: {
        prefix: 'ちょっと ',
        suffix: 'ください。',
        verbBase: '待つ (matsu)',
        correctForm: '待って',
        options: ['待つ', '待って', '待った', '待ち'],
      },
      explanation: 'For verbs ending in つ, the te-form geminates into small っ + て: 待つ → 待って.',
      xp: 25,
    },
  ],

  fr: [
    {
      id: 'fr-gram-1',
      type: 'sentence-architect',
      title: 'Passé Composé with Auxiliary Être',
      instruction: 'Arrange the sentence: "She went to Paris yesterday."',
      targetConcept: 'Passé Composé movement verb agreement with être',
      sentenceContext: 'Explaining where your colleague traveled.',
      englishMeaning: 'She went to Paris yesterday.',
      tokens: ['Elle', 'est', 'allée', 'à', 'Paris', 'hier'],
      correctTokenOrder: ['Elle', 'est', 'allée', 'à', 'Paris', 'hier'],
      explanation: 'Movement verbs using "être" must agree in gender and number with the subject: "Elle est allée" (with feminine -e).',
      xp: 25,
    },
  ],

  it: [
    {
      id: 'it-gram-1',
      type: 'sentence-architect',
      title: 'Direct Object Clitic Pronoun Placement',
      instruction: 'Arrange the sentence: "I invite you to dinner tomorrow."',
      targetConcept: 'Direct Object Pronoun position before conjugated verb',
      sentenceContext: 'Extending a dinner invitation to a friend.',
      englishMeaning: 'I invite you to dinner tomorrow.',
      tokens: ['Ti', 'invito', 'a', 'cena', 'domani'],
      correctTokenOrder: ['Ti', 'invito', 'a', 'cena', 'domani'],
      explanation: 'In Italian, object clitics like "ti" attach right in front of the conjugated verb: "Ti invito" (I invite you).',
      xp: 25,
    },
  ],

  de: [
    {
      id: 'de-gram-1',
      type: 'sentence-architect',
      title: 'German Verb-Kicker in Subordinate Clauses',
      instruction: 'Arrange the sentence: "I know that you have time today."',
      targetConcept: 'Subordinate conjunction "dass" kicks conjugated verb to the end',
      sentenceContext: 'Checking if your study partner is free.',
      englishMeaning: 'I know that you have time today.',
      tokens: ['Ich', 'weiß,', 'dass', 'du', 'heute', 'Zeit', 'hast'],
      correctTokenOrder: ['Ich', 'weiß,', 'dass', 'du', 'heute', 'Zeit', 'hast'],
      explanation: 'Conjunctions like "dass", "weil", "ob" send the conjugated verb (hast) to the very end of the clause!',
      xp: 25,
    },
  ],
};

export const STORY_CHAPTERS: Record<LanguageCode, StoryChapter[]> = {
  es: [
    {
      id: 'es-story-1',
      language: 'es',
      level: 'A2',
      title: 'The Hidden Bodega of Seville',
      location: 'Barrio Santa Cruz, Seville',
      sceneBackdrop: 'Cobblestone alleyways bathed in amber streetlamps, faint sound of flamenco guitar.',
      atmosphericDescription: 'Rain begins to mist over the orange trees. You spot a low wooden door with no sign, only a chalk drawing of an olive branch.',
      dialogue: [
        {
          speaker: 'Don Rafael',
          speakerRole: 'Bodega Master',
          text: 'Pasa, pasa que afuera refresca. ¿Buscabas resguardo o buen vino?',
          translation: 'Come in, come in, it is getting chilly outside. Were you looking for shelter or good wine?',
          vocabularyHighlights: [
            { word: 'refresca', meaning: 'it gets cooler/chilly', vibeNote: 'Used conversationally when temperature drops.' },
            { word: 'resguardo', meaning: 'shelter / refuge' }
          ]
        },
        {
          speaker: 'You',
          speakerRole: 'Adventurous Traveler',
          text: 'Ambas cosas, si es posible. Me dijeron que aquí tienen el mejor queso curado del barrio.',
          translation: 'Both things, if possible. They told me you have the best cured cheese in the neighborhood.'
        },
        {
          speaker: 'Don Rafael',
          speakerRole: 'Bodega Master',
          text: '¡Ja! Quien te lo haya dicho sabía de lo que hablaba. Siéntate en la barrica del fondo.',
          translation: 'Ha! Whoever told you that knew what they were talking about. Have a seat by the barrel in the back.',
          vocabularyHighlights: [
            { word: 'barrica', meaning: 'wine barrel' }
          ]
        }
      ],
      choices: [
        {
          id: 'c1',
          text: 'Order the house vermouth and ask about the musicians in the corner',
          translation: 'Pide el vermut de la casa y pregunta por los músicos',
          vibeTag: 'Curious & Conversational (+20 Vibe)',
          consequenceText: 'Don Rafael smiles warmly and introduces you to Paco, who offers to show you a flamenco rhythm.',
          vibeScoreDelta: 20
        },
        {
          id: 'c2',
          text: 'Check if there is Wi-Fi and look at your phone',
          translation: 'Pregunta si hay Wi-Fi y revisa tu móvil',
          vibeTag: 'Tourist Bubble (-10 Vibe)',
          consequenceText: 'The room goes slightly quiet. Don Rafael taps an ancient radio: "Here we talk to each other, young friend!"',
          vibeScoreDelta: -10
        },
        {
          id: 'c3',
          text: 'Compliment the cured cheese in authentic Spanish ("¡Este queso es una maravilla!")',
          translation: 'Elogia el queso con entusiasmo genuino',
          vibeTag: 'Foodie Respect (+25 Vibe)',
          consequenceText: 'Don Rafael brings out a complimentary slice of jamón ibérico with a broad grin.',
          vibeScoreDelta: 25
        }
      ],
      comprehensionQuiz: {
        question: 'Why does Don Rafael invite you inside so quickly?',
        options: [
          'Because the police are arriving',
          'Because it is getting chilly outside ("afuera refresca")',
          'Because the shop is closing in 5 minutes',
          'Because you owe him money'
        ],
        correctIndex: 1,
        explanation: '"Afuera refresca" means it is cooling down or getting brisk outside.'
      }
    }
  ],

  ja: [
    {
      id: 'ja-story-1',
      language: 'ja',
      level: 'A2',
      title: 'The Midnight Record Crate in Shinjuku',
      location: 'Omoide Yokocho, Shinjuku, Tokyo',
      sceneBackdrop: 'Smoky izakaya lanterns glowing red, narrow wooden stairs leading to a second-floor vinyl bar.',
      atmosphericDescription: 'A retro turntable spins city-pop from 1982. Behind the counter, Kenji dusts off a vintage album sleeve.',
      dialogue: [
        {
          speaker: 'Kenji',
          speakerRole: 'Vinyl Bar Owner',
          text: 'いらっしゃい。雨、ひどくなってきたね。温かいお茶でも淹れようか？',
          translation: 'Welcome. The rain has gotten pretty bad, hasn\'t it? Shall I brew some warm tea?',
          vocabularyHighlights: [
            { word: 'ひどくなって', meaning: 'gotten severe/worse' },
            { word: '淹れようか', meaning: 'shall I brew / steep?' }
          ]
        },
        {
          speaker: 'You',
          speakerRole: 'Music Explorer',
          text: 'ありがとうございます。この流れている曲、すごく懐かしい感じがしますね。',
          translation: 'Thank you very much. This song playing feels so nostalgic.'
        },
        {
          speaker: 'Kenji',
          speakerRole: 'Vinyl Bar Owner',
          text: 'お、わかる？山下達郎だよ。日本の80年代ポップス、好きなの？',
          translation: 'Oh, you recognize it? It\'s Tatsuro Yamashita. Do you like Japanese 80s pop?',
          vocabularyHighlights: [
            { word: 'わかる？', meaning: 'You get it? / You know it?' }
          ]
        }
      ],
      choices: [
        {
          id: 'j-c1',
          text: 'Share that you love city-pop rhythms and ask for his personal favorite record',
          translation: 'シティポップが大好きで、一番好きなレコードを聞く',
          vibeTag: 'Authentic Passion (+25 Vibe)',
          consequenceText: 'Kenji beams with excitement, pulls down a rare record, and lets you slide it onto the turntable platter.',
          vibeScoreDelta: 25
        },
        {
          id: 'j-c2',
          text: 'Ask if he can play top 40 American pop songs instead',
          translation: '最近のアメリカのポップスを流してほしいと頼む',
          vibeTag: 'Vibe Mismatch (-15 Vibe)',
          consequenceText: 'Kenji gently chuckles and points to the wall of vintage Japanese records: "Sorry, vinyl city-pop only here!"',
          vibeScoreDelta: -15
        }
      ],
      comprehensionQuiz: {
        question: 'Who is the artist playing on the turntable according to Kenji?',
        options: ['Ryuichi Sakamoto', 'Tatsuro Yamashita', 'Haruomi Hosono', 'Hikaru Utada'],
        correctIndex: 1,
        explanation: 'Kenji identifies the artist as "山下達郎" (Tatsuro Yamashita), the icon of Japanese City Pop.'
      }
    }
  ],

  fr: [
    {
      id: 'fr-story-1',
      language: 'fr',
      level: 'A2',
      title: 'The Parisian Bakery Secret',
      location: 'Rue des Martyrs, Paris',
      sceneBackdrop: 'Flour dusting the glass counter, morning light filtering through steam.',
      atmosphericDescription: 'The buttery perfume of laminated pastry fills the air. Madame Dubois is arranging warm baguettes into wicker baskets.',
      dialogue: [
        {
          speaker: 'Mme Dubois',
          speakerRole: 'Master Boulangère',
          text: 'Bonjour ! Vous arrivez pile au bon moment, la fournée de tradition sort tout juste.',
          translation: 'Hello! You arrive right at the perfect moment, the batch of traditional baguettes just came out.',
          vocabularyHighlights: [
            { word: 'pile au bon moment', meaning: 'right on time / at the exact right moment' },
            { word: 'fournée', meaning: 'batch / baking run' }
          ]
        },
        {
          speaker: 'You',
          speakerRole: 'Visitor',
          text: 'Bonjour Madame ! Une baguette tradition bien cuite, s\'il vous plaît.',
          translation: 'Hello Madame! One traditional baguette, well-baked (crispy), please.'
        }
      ],
      choices: [
        {
          id: 'f-c1',
          text: 'Specify "bien cuite" (crisp and golden) just like Parisian foodies do',
          translation: 'Demander une baguette bien cuite comme les locaux',
          vibeTag: 'Local Insider (+20 Vibe)',
          consequenceText: 'Madame Dubois nods approvingly: "Ah, vous aimez quand ça croustille !" She selects the crunchiest one for you.',
          vibeScoreDelta: 20
        },
        {
          id: 'f-c2',
          text: 'Ask for white sandwich bread in a traditional boulangerie',
          translation: 'Demander du pain de mie industriel',
          vibeTag: 'Culinary Offense (-10 Vibe)',
          consequenceText: 'Madame Dubois raises an eyebrow with quiet French disbelief.',
          vibeScoreDelta: -10
        }
      ],
      comprehensionQuiz: {
        question: 'What is special about the baguettes when you enter?',
        options: [
          'They are half price',
          'A fresh batch just came out of the oven ("la fournée sort tout juste")',
          'They are made with gluten-free rye',
          'They are from yesterday'
        ],
        correctIndex: 1,
        explanation: '"La fournée de tradition sort tout juste" means the fresh batch just emerged from the oven.'
      }
    }
  ],

  it: [
    {
      id: 'it-story-1',
      language: 'it',
      level: 'A2',
      title: 'The Trastevere Sunset Aperitivo',
      location: 'Piazza Trilussa, Rome',
      sceneBackdrop: 'Vibrant cobblestone square, ivy-draped ochre walls, clinking glassware.',
      atmosphericDescription: 'The sun casts a golden glow over the Tiber river. Friends gather around wooden barrel tables.',
      dialogue: [
        {
          speaker: 'Gianluca',
          speakerRole: 'Roman Friend',
          text: 'Mamma mia, che giornata! Dai, prendiamo uno spritz e ci rilassiamo un po\'.',
          translation: 'Mamma mia, what a day! Come on, let\'s get a spritz and relax a bit.',
          vocabularyHighlights: [
            { word: 'Dai', meaning: 'Come on! / Let\'s do it!' },
            { word: 'ci rilassiamo', meaning: 'we relax' }
          ]
        }
      ],
      choices: [
        {
          id: 'i-c1',
          text: 'Order a classic Spritz with an olive and orange slice, and toast "Salute!"',
          translation: 'Brindare con "Salute!"',
          vibeTag: 'Pure Italian Sunset (+25 Vibe)',
          consequenceText: 'Gianluca clinks glasses with eye contact: "Ecco! Ora si ragiona!"',
          vibeScoreDelta: 25
        }
      ],
      comprehensionQuiz: {
        question: 'What word does Gianluca use to enthusiastically suggest getting drinks?',
        options: ['Arrivederci', 'Dai', 'Scusi', 'Basta'],
        correctIndex: 1,
        explanation: '"Dai!" is one of the most common Italian colloquialisms for "Come on!" or "Let\'s do it!".'
      }
    }
  ],

  de: [
    {
      id: 'de-story-1',
      language: 'de',
      level: 'A2',
      title: 'The Mauerpark Sunday Flea Market',
      location: 'Prenzlauer Berg, Berlin',
      sceneBackdrop: 'Colorful stalls with antique lamps, retro leather jackets, and street food.',
      atmosphericDescription: 'A street busker plays a cello with a lo-fi beat. A vendor at a vintage clothing rack nods as you inspect a wool trench coat.',
      dialogue: [
        {
          speaker: 'Stefan',
          speakerRole: 'Vintage Stall Owner',
          text: 'Moin! Suchst du was Bestimmtes oder guckst du nur rum?',
          translation: 'Hey! Are you looking for something specific or just browsing around?',
          vocabularyHighlights: [
            { word: 'Moin', meaning: 'Colloquial greeting' },
            { word: 'rumgucken', meaning: 'to look around / browse' }
          ]
        }
      ],
      choices: [
        {
          id: 'd-c1',
          text: 'Say "Ich gucke mich nur ein bisschen um, danke!" with a friendly smile',
          translation: 'Nur umgucken',
          vibeTag: 'Chill Browser (+20 Vibe)',
          consequenceText: 'Stefan nods relaxedly: "Klar, nimm dir Zeit!"',
          vibeScoreDelta: 20
        }
      ],
      comprehensionQuiz: {
        question: 'What is the colloquial verb Stefan uses for "browsing around"?',
        options: ['kaufen', 'guckst du nur rum', 'arbeiten', 'bezahlen'],
        correctIndex: 1,
        explanation: '"Rumgucken" is the relaxed everyday German way to say casually browsing or looking around.'
      }
    }
  ]
};

export const ROLEPLAY_PERSONAS: Record<LanguageCode, RoleplayPersona[]> = {
  es: [
    {
      id: 'mateo-madrid',
      language: 'es',
      name: 'Mateo',
      avatar: '☕',
      role: 'Specialty Barista & Music Lover',
      setting: 'Café de la Luz, Malasaña, Madrid',
      personality: 'Warm, quick-witted, loves talking about local indie bands and roasted beans.',
      starterMessage: '¡Buenas! Bienvenido a mi rincón. ¿Qué te pongo hoy para alegrarte el día?',
      starterTranslation: 'Hey there! Welcome to my corner. What can I get you today to brighten your day?',
      vibeGuide: 'Use warm casual phrases like "¿Me pones...?", "Por favor", or "¿Qué me recomiendas?".',
    },
    {
      id: 'camila-oaxaca',
      language: 'es',
      name: 'Camila',
      avatar: '🎨',
      role: 'Artisan & Textile Designer',
      setting: 'Taller de Colores, Oaxaca',
      personality: 'Gentle, expressive, passionate about traditional dyes and indigenous arts.',
      starterMessage: '¡Hola amigo! Pasa a ver los telares. ¿Te gusta el azul añil o prefieres tonos de grana cochinilla?',
      starterTranslation: 'Hello friend! Come see the looms. Do you like indigo blue or do you prefer cochineal red tones?',
      vibeGuide: 'Express appreciation for colors and craft. Feel free to use "¡Qué bonito!" or "¿Cómo se hace esto?".',
    },
  ],

  ja: [
    {
      id: 'yuki-shibuya',
      language: 'ja',
      name: 'Yuki',
      avatar: '🧢',
      role: 'Vintage Streetwear Curator',
      setting: 'Cat Street, Harajuku, Tokyo',
      personality: 'Trendy, chilled-out, passionate about 90s fashion and sneakers.',
      starterMessage: 'いらっしゃい！今日は掘り出し物がいろいろ入ってきたよ。何か探してるスタイルある？',
      starterTranslation: 'Welcome! We got lots of hidden gems in today. Any particular style you\'re looking for?',
      vibeGuide: 'Drop rigid textbook pronouns. Try "ジャケットを探しています" or "おすすめはありますか？".',
    },
  ],

  fr: [
    {
      id: 'luc-paris',
      language: 'fr',
      name: 'Luc',
      avatar: '🥐',
      role: 'Art History Student & Bookshop Clerk',
      setting: 'Shakespeare & Company vicinity, Paris',
      personality: 'Articulate, sarcastic in a fond way, loves cinema and philosopher debates over espresso.',
      starterMessage: 'Salut ! Tu as l\'air de chercher une lecture passionnante. Tu préfères les romans ou la poésie ?',
      starterTranslation: 'Hi! You look like you\'re looking for an exciting read. Do you prefer novels or poetry?',
      vibeGuide: 'Drop the "ne" in spoken negations and use "sympa", "plutôt", or "en fait".',
    },
  ],

  it: [
    {
      id: 'marco-napoli',
      language: 'it',
      name: 'Marco',
      avatar: '🛵',
      role: 'Vintage Vespa Restorer & Foodie',
      setting: 'Spaccanapoli, Naples',
      personality: 'High energy, gesticulates with passion, fiercely proud of authentic pizza.',
      starterMessage: 'Ué! Ciao! Ma hai visto che bella giornata oggi? Dimmi un po\', ti sei già mangiato una vera pizza a portafoglio?',
      starterTranslation: 'Hey! Ciao! Have you seen what a beautiful day it is today? Tell me, have you eaten a real folded street pizza yet?',
      vibeGuide: 'Use emotional adjectives and phrases like "Che meraviglia!", "Certo che sì!", or "Raccontami!".',
    },
  ],

  de: [
    {
      id: 'lea-berlin',
      language: 'de',
      name: 'Lea',
      avatar: '🎧',
      role: 'Indie Vinyl & Coffee Curator',
      setting: 'Kreuzberg, Berlin',
      personality: 'Direct, relaxed, into electronic music, sustainable design, and cycling.',
      starterMessage: 'Moin! Na, alles entspannt bei dir? Kaffeeduft oder Plattenstöbern zuerst?',
      starterTranslation: 'Hey! Everything relaxed with you? Coffee aroma or record browsing first?',
      vibeGuide: 'Keep it casual and concise: "Beides gerne!", "Na klar!", or "Einen Hafer-Cappuccino bitte!".',
    },
  ],
};
