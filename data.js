const GameData = {
  config: {
    modulesRequiredForCore: 13,
    bypassCost: 30,
    startingXP: 0
  },

  // Trvale viditelné zdi (vnější ohrada + MATURITA komnata)
  permanentWalls: [
    "M 50 50 H 950 V 750 H 50 Z",           // Vnější ohrada
    "M 295 165 H 695 V 435 H 295 Z"          // Centrální komnata MATURITA
  ],

  // Moduly — gate = červený bod, revealWalls = zdi, které se odhalí po vyřešení
  regions: [
    {
      id: "ciselne_obory", moduleNum: 0, name: "00: Číselné obory",
      gate: {x: 55, y: 420},
      revealWalls: ["M 175 165 V 435"]
    },
    {
      id: "algebra", moduleNum: 1, name: "01: Algebra",
      gate: {x: 235, y: 340},
      revealWalls: ["M 175 435 H 295"]
    },
    {
      id: "rovnice", moduleNum: 2, name: "02: Rovnice",
      gate: {x: 235, y: 575},
      revealWalls: ["M 175 435 V 615", "M 175 615 H 295"]
    },
    {
      id: "planimetrie", moduleNum: 3, name: "03: Planimetrie",
      gate: {x: 370, y: 105},
      revealWalls: ["M 355 50 V 165"]
    },
    {
      id: "stereometrie", moduleNum: 4, name: "04: Stereometrie",
      gate: {x: 540, y: 135},
      revealWalls: ["M 600 165 V 230 H 695"]
    },
    {
      id: "funkce", moduleNum: 5, name: "05: Funkce",
      gate: {x: 760, y: 250},
      revealWalls: ["M 830 165 V 435", "M 695 435 H 830"]
    },
    {
      id: "analytika", moduleNum: 6, name: "06: Analytika",
      gate: {x: 930, y: 370},
      revealWalls: ["M 830 435 V 620"]
    },
    {
      id: "statistika", moduleNum: 7, name: "07: Statistika",
      gate: {x: 150, y: 670},
      revealWalls: ["M 115 625 V 715 H 175"]
    },
    {
      id: "pravdepodobnost", moduleNum: 8, name: "08: Pravděpodobnost",
      gate: {x: 395, y: 640},
      revealWalls: ["M 440 750 V 625 H 560 V 750"]
    },
    {
      id: "logaritmy", moduleNum: 9, name: "09: Logaritmy",
      gate: {x: 500, y: 715},
      revealWalls: ["M 695 620 V 750", "M 695 620 H 830"]
    },
    {
      id: "goniometrie", moduleNum: 10, name: "10: Goniometrie",
      gate: {x: 830, y: 680},
      revealWalls: ["M 770 625 V 720 H 830", "M 830 620 V 750"]
    },
    {
      id: "posloupnosti", moduleNum: 11, name: "11: Posloupnosti",
      gate: {x: 680, y: 715},
      revealWalls: []
    },
    {
      id: "slovni_ulohy", moduleNum: 12, name: "12: Slovní úlohy",
      gate: {x: 930, y: 560},
      revealWalls: []
    },
    {
      id: "maturita", name: "JÁDRO: CVIČNÁ MATURITA",
      gate: {x: 500, y: 300},
      revealWalls: []
    }
  ],

  questions: [

    // ==========================================
    // 01. ALGEBRA
    // ==========================================

    {
      id: "q_alg_01", regionId: "algebra", type: "closed", monsterName: `FW_01A: Zkrácení algebraického zlomku`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 3, trainingTasks: ["t_alg_01"],
      question: `Je dán algebraický výraz. Zjednodušte (pro příslušný definiční obor):`,
      formula: `$$\\frac{x^{2} - x - 12}{x^{2} - 16}$$`,
      instruction: `Vyberte správný zjednodušený tvar.`,
      choices: [
        {
          label: `\\(\\frac{x - 3}{x + 4}\\)`,
          value: "A",
          feedback: `Chyba syntaxe. Čitatel \\(x^2 - x - 12 = (x-4)(x+3)\\), ne \\((x-4)(x-3)\\). Zkontroluj znaménka při rozkladu.`
        },
        {
          label: `\\(\\frac{x + 3}{x + 4}\\)`,
          value: "B",
          feedback: `Přístup povolen. Čitatel \\((x-4)(x+3)\\), jmenovatel \\((x-4)(x+4)\\) — po zkrácení \\((x-4)\\) zůstane \\(\\frac{x+3}{x+4}\\).`
        },
        {
          label: `\\(\\frac{x + 3}{x - 4}\\)`,
          value: "C",
          feedback: `Kritická chyba. Jmenovatel \\(x^2 - 16 = (x-4)(x+4)\\) — výraz \\((x+4)\\) nelze zaměnit za \\((x-4)\\).`
        },
        {
          label: `\\(\\frac{(x - 4)(x + 3)}{x^{2} - 16}\\)`,
          value: "D",
          feedback: `Chyba. Rozklad čitatele je správný, ale \\((x-4)\\) lze zkrátit se stejným výrazem ve jmenovateli. Zkrácení jsi ještě neprovedl.`
        },
      ],
      hints: [
        `Čitatel je kvadratický trojčlen — rozlož ho na součin dvou závorek. Jmenovatel je rozdíl dvou čtverců, také ho rozlož na závorky.`,
        `Po rozkladu obou hledej to, co můžeš zkrátit.`,
      ],
      correctAnswer: "B", reward: { xp: 15 }
    },
    {
      id: "t_alg_01", regionId: "algebra", type: "closed", monsterName: `SIM_01A: Rozklad kvadratického trojčlenu`,
      isTraining: true, firewallId: "q_alg_01", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Rozložte kvadratický trojčlen na součin dvou binomů:`,
      formula: `$$x^{2} - x - 12$$`,
      instruction: `Vyberte správný rozklad.`,
      steps: [
        {
          trigger: `> Krok 1: Vzorec rozkladu`,
          content: `Hledáme čísla \\(a, b\\) taková, aby \\(x^2 - x - 12 = (x+a)(x+b)\\). Podmínky: \\(a + b = -1\\) (koeficient u x) a \\(a \\cdot b = -12\\) (absolutní člen).`
        },
        {
          trigger: `> Krok 2: Hledáme správný pár`,
          content: `Hledej dvojici celých čísel, jejichž součin je \\(-12\\) a součet je \\(-1\\). Zkus systematicky projít dělitele čísla 12.`
        },
        {
          trigger: `> Krok 3: Ověření`,
          content: `Ověř svůj výsledek roznásobením — musíš dostat původní trojčlen \\(x^2 - x - 12\\).`
        },
      ],
      choices: [
        {
          label: `\\((x + 4)(x - 3)\\)`,
          value: "A",
          feedback: `Chyba. \\((x+4)(x-3) = x^2 + x - 12\\) — součet \\(+4+(-3) = +1\\), ale potřebuješ \\(-1\\). Záměna znamének.`
        },
        {
          label: `\\((x + 4)(x + 3)\\)`,
          value: "B",
          feedback: `Kritická chyba. Součin \\((x+4)(x+3) = x^2 + 7x + 12\\) — ani součet ani součin čísel nesedí.`
        },
        {
          label: `\\((x - 4)(x + 3)\\)`,
          value: "C",
          feedback: `Logika potvrzena. \\((-4)+(+3) = -1\\) ✓, \\((-4)\\cdot(+3) = -12\\) ✓. Přístup povolen.`
        },
        {
          label: `\\((x - 4)(x - 3)\\)`,
          value: "D",
          feedback: `Chyba syntaxe. \\((x-4)(x-3) = x^2 - 7x + 12\\) — součin je \\(+12\\) (správně), ale součet \\(-4+(-3) = -7 \\neq -1\\).`
        },
      ],
      correctAnswer: "C", reward: { xp: 5 }
    },
    {
      id: "q_alg_02", regionId: "algebra", type: "closed", monsterName: `FW_01B: Nulové body algebraického zlomku`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 3, trainingTasks: ["t_alg_02"],
      question: `Je dán algebraický výraz:`,
      formula: `$$\\frac{a^{2} - 9}{3a^{2} + a - 2}$$`,
      instruction: `Nalezněte všechna \\(a \\in \\mathbb{R}\\), pro která je hodnota výrazu rovna nule.`,
      choices: [
        {
          label: `\\(\\{ - 3;\\, - 1;\\,\\frac{2}{3};\\, 3\\}\\)`,
          value: "A",
          feedback: `Kritická chyba. Nulové body výrazu jsou hodnoty, kde čitatel \\(= 0\\) (a jmenovatel \\(\\neq 0\\)) — ne kde jmenovatel \\(= 0\\). Hodnoty \\(-1\\) a \\(\\tfrac{2}{3}\\) výraz vůbec neobsahuje.`
        },
        {
          label: `\\(\\{ - 1;\\,\\frac{2}{3}\\}\\)`,
          value: "B",
          feedback: `Chyba. Nalezl jsi nuly jmenovatele (kde výraz nemá smysl), ne nuly čitatele.`
        },
        {
          label: `\\(\\{ 3\\}\\)`,
          value: "C",
          feedback: `Chyba syntaxe. Čitatel \\(a^2 - 9 = (a-3)(a+3)\\) má dvě nuly: \\(a = 3\\) i \\(a = -3\\). Obě je třeba ověřit vůči jmenovateli.`
        },
        {
          label: `\\(\\{ - 3;\\, 3\\}\\)`,
          value: "D",
          feedback: `Protokol ověřen. Čitatel \\(a^2 - 9 = 0\\) pro \\(a = \\pm 3\\). Jmenovatel \\(3a^2 + a - 2 = (3a-2)(a+1)\\) — ani \\(a=3\\) ani \\(a=-3\\) ho nevynuluje. Obě hodnoty platí.`
        },
      ],
      hints: [
        `Nulový bod zlomku nastane právě tehdy, když <b>čitatel = 0</b> a zároveň jmenovatel ≠ 0. Nuly jmenovatele jsou z výsledku vyloučeny.`,
        `Čitatel \\(a^2 - 9\\) je rozdíl čtverců. Rozlož ho na součin a najdi, kdy se každá závorka rovná nule.`,
      ],
      correctAnswer: "D", reward: { xp: 15 }
    },
    {
      id: "t_alg_02", regionId: "algebra", type: "closed", monsterName: `SIM_01B: Definiční obor racionálního výrazu`,
      isTraining: true, firewallId: "q_alg_02", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Určete definiční obor výrazu — tedy všechna \\(a \\in \\mathbb{R}\\), pro která má výraz smysl:`,
      formula: `$$\\frac{a^{2} - 9}{3a^{2} + a - 2}$$`,
      instruction: `Vyberte správný definiční obor.`,
      steps: [
        {
          trigger: `> Krok 1: Co výraz vylučuje?`,
          content: `Výraz nemá smysl, když jmenovatel = 0. Čitatel může být cokoli — i nula (pak je výraz nulový, ale definovaný).`
        },
        {
          trigger: `> Krok 2: Nuly jmenovatele`,
          content: `Rozlož jmenovatel \\(3a^2 + a - 2\\) na součin a najdi jeho nulové body. Hledej závorku ve tvaru \\((3a - c)(a - d)\\), nebo použij diskriminant a výsledek napiš ve tvaru \\(k(x - a_1)(x - a_2)\\).`
        },
        {
          trigger: `> Krok 3: Definiční obor`,
          content: `Definiční obor = \\(\\mathbb{R}\\) bez hodnot, kde jmenovatel = 0. Zapiš ho sám.`
        },
      ],
      choices: [
        {
          label: `\\(\\mathbb{R}\\backslash\\left\\{ - 1;\\,\\frac{2}{3} \\right\\}\\)`,
          value: "A",
          feedback: `Protokol ověřen. Jmenovatel \\((3a-2)(a+1) = 0\\) pro \\(a = \\tfrac{2}{3}\\) nebo \\(a = -1\\). Tyto hodnoty jsou vyloučeny.`
        },
        {
          label: `\\(\\mathbb{R}\\backslash\\{ - 3;\\, 3\\}\\)`,
          value: "B",
          feedback: `Chyba. Hodnoty \\(-3\\) a \\(3\\) jsou nuly čitatele — tam je výraz definovaný (roven nule). Vylučuješ nuly jmenovatele.`
        },
        {
          label: `\\(\\mathbb{R}\\)`,
          value: "C",
          feedback: `Kritická chyba. Jmenovatel \\(3a^2 + a - 2\\) má reálné kořeny — výraz nemá smysl pro \\(a = \\tfrac{2}{3}\\) a \\(a = -1\\).`
        },
        {
          label: `\\(\\mathbb{R}\\backslash\\{ - 3;\\, - 1;\\,\\frac{2}{3};\\, 3\\}\\)`,
          value: "D",
          feedback: `Přístup odepřen. Hodnoty \\(-3\\) a \\(3\\) jsou nuly čitatele, ne jmenovatele — nevylučují se.`
        },
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },
    {
      id: "q_alg_03", regionId: "algebra", type: "closed", monsterName: `FW_01C: Záporné hodnoty výrazu`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 3, trainingTasks: ["t_alg_03"],
      question: `Je dán výraz:`,
      formula: `$$\\frac{- 12}{3x - 6}$$`,
      instruction: `Určete všechna \\(x \\in \\mathbb{R}\\), pro která je daný výraz záporný.`,
      choices: [
        {
          label: `\\(x \\in (2;\\, + \\infty)\\)`,
          value: "A",
          feedback: `Logika potvrzena. Výraz \\(= \\frac{-4}{x-2}\\). Čitatel \\(-4 < 0\\), proto celý výraz \\(< 0\\) právě tehdy, když \\(x-2 > 0\\), tedy \\(x > 2\\).`
        },
        {
          label: `\\(x \\in ( - \\infty;\\, 2)\\)`,
          value: "B",
          feedback: `Chyba. Záporný čitatel \\(-4\\) obrací nerovnost: \\(\\frac{-4}{x-2} < 0 \\Leftrightarrow x-2 > 0 \\Leftrightarrow x > 2\\), ne \\(x < 2\\).`
        },
        {
          label: `\\(x \\in \\mathbb{R}\\backslash\\{ 2\\}\\)`,
          value: "C",
          feedback: `Chyba syntaxe. Výraz mění znaménko v závislosti na \\(x\\). Pro \\(x < 2\\) je jmenovatel záporný, výraz je kladný. Pro \\(x > 2\\) je záporný. Nejde tedy o celé \\(\\mathbb{R} \\setminus \\{2\\}\\).`
        },
        {
          label: `\\(x \\in ( - \\infty;\\, 2) \\cup (2;\\, + \\infty)\\)`,
          value: "D",
          feedback: `Záporné hodnoty výrazu platí jen pro \\(x > 2\\). Tato odpověď popisuje celý definiční obor, ne oblast zápornosti.`
        },
      ],
      hints: [
        `Čitatel je konstanta — jaké má znaménko? Znaménko celého výrazu závisí na jmenovateli.`,
        `Záporné děleno kladným je záporné. Urči, kdy je jmenovatel kladný a kdy záporný.`,
      ],
      correctAnswer: "A", reward: { xp: 15 }
    },
    {
      id: "t_alg_03", regionId: "algebra", type: "closed", monsterName: `SIM_01C: Znaménko racionálního výrazu`,
      isTraining: true, firewallId: "q_alg_03", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Je dán výraz. Pro která \\(x \\in \\mathbb{R}\\) je výraz záporný?`,
      formula: `$$\\frac{4}{x - 3}$$`,
      instruction: `Vyberte správnou množinu.`,
      steps: [
        {
          trigger: `> Krok 1: Znaménko čitatele`,
          content: `Čitatel je 4 — stále <b>kladný</b>. Znaménko výrazu tedy závisí pouze na jmenovateli.`
        },
        {
          trigger: `> Krok 2: Podmínka zápornosti`,
          content: `Kladné / záporné = záporné. Výraz \\(< 0\\) právě tehdy, když \\(x - 3 < 0\\). Vyřeš tuto nerovnici sám.`
        },
      ],
      choices: [
        {
          label: `\\(x \\in (3;\\, + \\infty)\\)`,
          value: "A",
          feedback: `Chyba. Pro \\(x > 3\\) je jmenovatel kladný, výraz \\(\\frac{4}{x-3}\\) je tedy kladný, ne záporný.`
        },
        {
          label: `\\(x \\in \\mathbb{R}\\backslash\\{ 3\\}\\)`,
          value: "B",
          feedback: `Chyba syntaxe. Toto je celý definiční obor, ne oblast zápornosti. Výraz mění znaménko v \\(x = 3\\).`
        },
        {
          label: `\\(\\varnothing\\)`,
          value: "C",
          feedback: `Přístup odepřen. Pro \\(x < 3\\) je jmenovatel záporný a čitatel kladný → výraz je záporný. Prázdná množina je chybná.`
        },
        {
          label: `\\(x \\in ( - \\infty;\\, 3)\\)`,
          value: "D",
          feedback: `Logika potvrzena. \\(4 > 0\\), jmenovatel \\(x-3 < 0\\) pro \\(x < 3\\). Součin/podíl kladného a záporného je záporný.`
        },
      ],
      correctAnswer: "D", reward: { xp: 5 }
    },
    {
      id: "q_alg_04", regionId: "algebra", type: "closed", monsterName: `FW_01D: Operace s algebraickými zlomky`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 4, trainingTasks: ["t_alg_04"],
      question: `Pro \\(a \\in \\mathbb{R} \\setminus \\{-2;\\, 2\\}\\) zjednodušte výraz:`,
      formula: `$$\\frac{4a}{a + 2} - \\frac{8a^{2}}{a^{2} - 4}$$`,
      instruction: `Vyberte správně zjednodušený výsledek.`,
      choices: [
        {
          label: `\\(\\frac{- 4a^{2} - 8a}{a^{2} - 4}\\)`,
          value: "A",
          feedback: `Chyba. Toto je mezivýsledek před zkrácením. Čitatel \\(-4a^2 - 8a = -4a(a+2)\\) a jmenovatel \\(a^2 - 4 = (a+2)(a-2)\\) — faktor \\((a+2)\\) lze zkrátit.`
        },
        {
          label: `\\(\\frac{4a}{a - 2}\\)`,
          value: "B",
          feedback: `Přístup odepřen. Záporné znaménko v čitateli zmizelo. Správný čitatel po rozkladu je \\(-4a(a+2)\\), výsledek po zkrácení musí být záporný.`
        },
        {
          label: `\\(\\frac{- 4a}{a - 2}\\)`,
          value: "C",
          feedback: `Protokol ověřen. Společný jmenovatel \\((a+2)(a-2)\\): čitatel \\(4a(a-2) - 8a^2 = 4a^2 - 8a - 8a^2 = -4a^2 - 8a = -4a(a+2)\\). Po zkrácení \\((a+2)\\): \\(\\frac{-4a}{a-2}\\).`
        },
        {
          label: `\\(\\frac{- 4a}{a + 2}\\)`,
          value: "D",
          feedback: `Chyba syntaxe. Po zkrácení faktoru \\((a+2)\\) ve jmenovateli zbyde \\((a-2)\\), ne \\((a+2)\\). Zkontroluj, který faktor krátíš.`
        },
      ],
      hints: [
        `Jmenovatel druhého zlomku je rozdíl čtverců — rozlož ho. To ti ukáže společného jmenovatele.`,
        `Po odečtení čitatelů vytknout z výsledku a zkrátit — výsledek je kratší, než by se zdálo.`,
      ],
      correctAnswer: "C", reward: { xp: 20 }
    },
    {
      id: "t_alg_04", regionId: "algebra", type: "closed", monsterName: `SIM_01D: Odčítání algebraických zlomků`,
      isTraining: true, firewallId: "q_alg_04", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Pro \\(x \\in \\mathbb{R} \\setminus \\{-2; 2\\}\\) zjednodušte výraz na jeden zlomek:`,
      formula: `$$\\frac{3}{x + 2} - \\frac{3x}{x^{2} - 4}$$`,
      instruction: `Vyberte správný výsledek.`,
      steps: [
        {
          trigger: `> Krok 1: Rozložíme jmenovatele`,
          content: `\\(x^2 - 4 = (x+2)(x-2)\\). Druhý zlomek má v jmenovateli oba faktory, první jen (x+2). Společný jmenovatel je \\((x+2)(x-2)\\).`
        },
        {
          trigger: `> Krok 2: Převedeme na společného jmenovatele`,
          content: `První zlomek násobíme (x−2): \\(\\frac{3(x-2)}{(x+2)(x-2)}\\). Druhý zlomek zůstane: \\(\\frac{3x}{(x+2)(x-2)}\\).`
        },
        {
          trigger: `> Krok 3: Odečteme čitatele`,
          content: `Teď už stačí jen odečíst oba zlomky, upravit čitatele a podívat se, jestli nejde něco zkrátit.`
        },
      ],
      choices: [
        {
          label: `\\(\\frac{6}{x^{2} - 4}\\)`,
          value: "A",
          feedback: `Chyba syntaxe. Záporné znaménko: \\(3(x-2) - 3x = -6\\), ne \\(+6\\). Zkontroluj odčítání.`
        },
        {
          label: `\\(\\frac{- 6}{x^{2} - 4}\\)`,
          value: "B",
          feedback: `Protokol ověřen. Společný jmenovatel \\((x^2-4)\\), čitatel: \\(3(x-2) - 3x = 3x - 6 - 3x = -6\\). Čistý výsledek.`
        },
        {
          label: `\\(\\frac{- 6x}{x^{2} - 4}\\)`,
          value: "C",
          feedback: `Přístup odepřen. Čitatel po odečtení vychází \\(-6\\) (konstanta), ne \\(-6x\\). Roznásob \\(3(x-2)\\) pečlivě.`
        },
        {
          label: `\\(\\frac{- 6}{x + 2}\\)`,
          value: "D",
          feedback: `Chyba. Jmenovatel \\((x+2)(x-2) = x^2 - 4\\), ne jen \\((x+2)\\). Nesmíš vynechat faktor \\((x-2)\\).`
        },
      ],
      correctAnswer: "B", reward: { xp: 5 }
    },
    {
      id: "q_alg_05", regionId: "algebra", type: "closed", monsterName: `FW_01E: Převod na mocninu jiného základu`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 2, trainingTasks: ["t_alg_05"],
      question: `Pro \\(n \\in \\mathbb{N}\\) upravte výraz na mocninu o základu 4:`,
      formula: `$$2^{2n + 4} =$$`,
      instruction: `Vyberte správný tvar mocniny o základu 4.`,
      choices: [
        {
          label: `\\(4^{2n + 4}\\)`,
          value: "A",
          feedback: `Kritická chyba. Základ \\(4 = 2^2\\) — při přechodu z 2 na 4 se exponent dělí dvěma, ne ponechává stejný.`
        },
        {
          label: `\\(4^{n + 2}\\)`,
          value: "B",
          feedback: `Přístup povolen. \\(2^{2n+4} = 2^{2(n+2)} = (2^2)^{n+2} = 4^{n+2}\\). Ověření \\(n=1\\): \\(2^6 = 64\\), \\(4^3 = 64\\) ✓`
        },
        {
          label: `\\(4^{2n}\\)`,
          value: "C",
          feedback: `Chyba syntaxe. \\(2^{2n+4} = 2^{2n} \\cdot 2^4\\), tedy exponent po přechodu na základ 4 je \\(n+2\\), ne \\(2n\\).`
        },
        {
          label: `\\(4^{n + 4}\\)`,
          value: "D",
          feedback: `Přístup odepřen. \\(2n+4 = 2(n+2)\\) — exponent se dělí dvěma celý. Výsledek je \\(n+2\\), ne \\(n+4\\).`
        },
      ],
      hints: [
        `Jaký je vztah mezi základy 2 a 4? Můžeš použít pravidlo: \\((a^m)^k = a^{m \\cdot k}\\).`,
        `Z exponentu se dá určitě něco vytknout.`,
      ],
      correctAnswer: "B", reward: { xp: 10 }
    },
    {
      id: "t_alg_05", regionId: "algebra", type: "closed", monsterName: `SIM_01E: Převod mocniny na jiný základ`,
      isTraining: true, firewallId: "q_alg_05", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Pro \\(n \\in \\mathbb{N}\\) napište výraz \\(4^{n+1}\\) jako mocninu o základu 2:`,
      formula: `$$4^{n + 1} =$$`,
      instruction: `Vyberte správný tvar mocniny o základu 2.`,
      steps: [
        {
          trigger: `> Krok 1: Základ 4 jako mocnina 2`,
          content: `\\(4 = 2^2\\). Proto \\(4^{n+1} = (2^2)^{n+1}\\).`
        },
        {
          trigger: `> Krok 2: Pravidlo mocnin`,
          content: `Pravidlo mocniny mocniny: \\((a^m)^k = a^{m \\cdot k}\\). Dosaď \\(m=2\\), \\(k=n+1\\) a urči výsledný exponent.`
        },
      ],
      choices: [
        {
          label: `\\(2^{n + 2}\\)`,
          value: "A",
          feedback: `Chyba. Exponent se násobí: \\(2 \\cdot (n+1) = 2n+2\\), ne \\(n+2\\).`
        },
        {
          label: `\\(2^{n + 1}\\)`,
          value: "B",
          feedback: `Kritická chyba. Přechod \\(4 \\to 2\\) znamená zdvojení exponentu. Výsledek musí být \\(2^{2n+2}\\).`
        },
        {
          label: `\\(2^{2n + 2}\\)`,
          value: "C",
          feedback: `Logika potvrzena. \\(4^{n+1} = (2^2)^{n+1} = 2^{2 \\cdot (n+1)} = 2^{2n+2}\\). Ověření \\(n=1\\): \\(4^2 = 16\\), \\(2^4 = 16\\) ✓`
        },
        {
          label: `\\(2^{4n + 4}\\)`,
          value: "D",
          feedback: `Přístup odepřen. Exponent \\(4 \\cdot (n+1)\\) by platil pro základ \\(4 \\to\\) základ \\(16\\) (\\(2^4\\)). Pro \\(4 = 2^2\\) se násobí dvěma.`
        },
      ],
      correctAnswer: "C", reward: { xp: 5 }
    },
    {
      id: "q_alg_06", regionId: "algebra", type: "closed", monsterName: `FW_01F: Definiční obor výrazu s odmocninami`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 3, trainingTasks: ["t_alg_06"],
      question: `Určete množinu všech \\(x \\in \\mathbb{R}\\), pro která má smysl výraz:`,
      formula: `$$\\frac{\\sqrt{8 - 2x}}{\\sqrt{x - 1}}$$`,
      instruction: `Vyberte správný definiční obor.`,
      choices: [
        {
          label: `\\(x \\in \\lbrack 1;\\, 4\\rbrack\\)`,
          value: "A",
          feedback: `Chyba. Výraz \\(\\sqrt{x-1}\\) je ve jmenovateli — nesmí být nulový. Proto \\(x-1 > 0\\) (ostré), tedy \\(x > 1\\), ne \\(x \\geq 1\\).`
        },
        {
          label: `\\(x \\in ( - \\infty;\\, 4\\rbrack\\)`,
          value: "B",
          feedback: `Chyba syntaxe. Zapomněl na podmínku z jmenovatele: \\(x-1 > 0\\), tedy \\(x > 1\\). Samotná podmínka čitatele nestačí.`
        },
        {
          label: `\\(x \\in (1;\\, 4)\\)`,
          value: "C",
          feedback: `Přístup odepřen. Pravá mez je chybná: \\(8 - 2x \\geq 0\\) dává \\(x \\leq 4\\) (uzavřené), tedy \\(x = 4\\) je přípustné.`
        },
        {
          label: `\\(x \\in (1;\\, 4\\rbrack\\)`,
          value: "D",
          feedback: `Protokol ověřen. Čitatel: \\(8 - 2x \\geq 0 \\Rightarrow x \\leq 4\\). Jmenovatel (\\(\\neq 0\\)): \\(x - 1 > 0 \\Rightarrow x > 1\\). Průnik: \\((1; 4]\\).`
        },
      ],
      hints: [
        `Výraz pod každou odmocninou musí být <b>nezáporný</b> (≥ 0). Odmocnina ve jmenovateli přidává ještě jednu podmínku — jakou?`,
        `Zapiš podmínku pro čitatel i jmenovatel jako nerovnice. Hledáš jejich průnik.`,
      ],
      correctAnswer: "D", reward: { xp: 15 }
    },
    {
      id: "t_alg_06", regionId: "algebra", type: "closed", monsterName: `SIM_01F: Podmínka existence odmocniny`,
      isTraining: true, firewallId: "q_alg_06", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Pro která x ∈ ℝ je výraz definovaný (má smysl)?`,
      formula: `$$\\sqrt{4 - x}$$`,
      instruction: `Vyberte správnou podmínku.`,
      steps: [
        {
          trigger: `> Krok 1: Podmínka odmocniny`,
          content: `Odmocnina je definovaná jen pro <b>nezáporná čísla</b>. Musí platit: výraz pod odmocninou ≥ 0.`
        },
        {
          trigger: `> Krok 2: Řešení nerovnice`,
          content: `Zapiš podmínku jako nerovnici: \\(4 - x \\geq 0\\). Vyřeš ji sám.`
        },
      ],
      choices: [
        {
          label: `\\(x \\leq 4\\)`,
          value: "A",
          feedback: `Protokol ověřen. \\(4 - x \\geq 0 \\Rightarrow x \\leq 4\\). Odmocnina z nuly (\\(x=4\\)) je definovaná — interval je zprava uzavřený.`
        },
        {
          label: `\\(x < 4\\)`,
          value: "B",
          feedback: `Chyba. Odmocnina je definovaná i pro nulu: \\(\\sqrt{0} = 0\\). Pro \\(x=4\\): \\(4 - 4 = 0\\), \\(\\sqrt{0} = 0\\) ✓ — interval je zprava uzavřený.`
        },
        {
          label: `\\(x \\geq 4\\)`,
          value: "C",
          feedback: `Kritická chyba. Pro \\(x > 4\\) je \\(4 - x\\) záporné — odmocnina z záporného čísla v \\(\\mathbb{R}\\) neexistuje.`
        },
        {
          label: `\\(x \\in \\mathbb{R}\\)`,
          value: "D",
          feedback: `Chyba syntaxe. Odmocnina má definiční podmínku. Pro \\(x = 5\\): \\(4 - 5 = -1 < 0\\) → \\(\\sqrt{-1}\\) není reálné číslo.`
        },
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },
    {
      id: "q_alg_07", regionId: "algebra", type: "closed", monsterName: `FW_01G: Nulové body součinového výrazu`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 3, trainingTasks: ["t_alg_07"],
      question: `Je dán algebraický výraz:`,
      formula: `$$\\frac{(y^{2} + 4)(3y - 6)}{y + 5}$$`,
      instruction: `Určete množinu všech nulových bodů tohoto výrazu.`,
      choices: [
        {
          label: `\\(\\{ 2\\}\\)`,
          value: "A",
          feedback: `Protokol ověřen. \\(y^2 + 4 > 0\\) pro všechna \\(y \\in \\mathbb{R}\\) (žádné reálné nulové body). Nula přichází jen z \\(3y - 6 = 0 \\Rightarrow y = 2\\). Ověření: \\(y+5 = 7 \\neq 0\\) ✓`
        },
        {
          label: `\\(\\{ - 5;\\, 2\\}\\)`,
          value: "B",
          feedback: `Chyba. \\(y = -5\\) je místo, kde výraz nemá smysl (jmenovatel \\(= 0\\)), ne nulový bod.`
        },
        {
          label: `\\(\\varnothing\\)`,
          value: "C",
          feedback: `Chyba syntaxe. Výraz \\(y^2 + 4\\) nemá reálné nulové body, to však nevylučuje nuly celého výrazu — ty pochází z faktoru \\(3y - 6 = 0 \\Rightarrow y = 2\\).`
        },
        {
          label: `\\(\\{ - 5\\}\\)`,
          value: "D",
          feedback: `Kritická chyba. \\(y = -5\\) vynuluje jmenovatel, nikoli čitatel. Nulový bod výrazu nastává, když čitatel \\(= 0\\) (a jmenovatel \\(\\neq 0\\)).`
        },
      ],
      hints: [
        `Nulový bod výrazu nastane, když <b>čitatel \\(= 0\\)</b> a jmenovatel \\(\\neq 0\\). Čitatel je součin dvou výrazů — součin je nulový, když alespoň jeden z faktorů je nulový.`,
        `Jeden z faktorů čitatele je "součet druhých mocnin". Může být někdy nulový?`,
      ],
      correctAnswer: "A", reward: { xp: 15 }
    },
    {
      id: "t_alg_07", regionId: "algebra", type: "closed", monsterName: `SIM_01G: Nulové body součinu`,
      isTraining: true, firewallId: "q_alg_07", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Nalezněte všechny nulové body výrazu:`,
      formula: `$$\\frac{(x - 5)(x + 2)}{x - 3}$$`,
      instruction: `Vyberte správnou množinu nulových bodů.`,
      steps: [
        {
          trigger: `> Krok 1: Kdy je zlomek nulový?`,
          content: `Zlomek = 0, když <b>čitatel = 0</b> (a jmenovatel ≠ 0). Jmenovatel nesmíme vynulovat — to by výraz neměl smysl.`
        },
        {
          trigger: `> Krok 2: Nuly čitatele`,
          content: `Čitatel je součin dvou binomů — kdy je každý z nich nulový?`
        },
        {
          trigger: `> Krok 3: Ověření podmínek`,
          content: `Pro každou nulu čitatele ověř, že jmenovatel není nulový — jinak by výraz neměl smysl.`
        },
      ],
      choices: [
        {
          label: `\\(\\{ 5\\}\\)`,
          value: "A",
          feedback: `Chyba syntaxe. Čitatel \\((x-5)(x+2) = 0\\) má dvě řešení: \\(x=5\\) i \\(x=-2\\). Obě jsou platné nulové body.`
        },
        {
          label: `\\(\\{ - 2;\\, 3;\\, 5\\}\\)`,
          value: "B",
          feedback: `Kritická chyba. \\(x = 3\\) je nulový bod jmenovatele — výraz tam nemá smysl. Nesmí být zahrnutý.`
        },
        {
          label: `\\(\\{ 3\\}\\)`,
          value: "C",
          feedback: `Chyba. \\(x = 3\\) vynuluje jmenovatel — výraz tam nemá smysl. Hledáš nuly čitatele.`
        },
        {
          label: `\\(\\{ - 2;\\, 5\\}\\)`,
          value: "D",
          feedback: `Logika potvrzena. \\((x-5)(x+2) = 0\\) pro \\(x = 5\\) a \\(x = -2\\). Jmenovatel v obou bodech nenulový ✓.`
        },
      ],
      correctAnswer: "D", reward: { xp: 5 }
    },
    {
      id: "q_alg_08", regionId: "algebra", type: "closed", monsterName: `FW_01H: Tvrzení o algebraickém výrazu`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 4, trainingTasks: ["t_alg_08"],
      question: `Je dán algebraický výraz. Které tvrzení je pravdivé?`,
      formula: `$$\\frac{(2a - 6)^{2}}{4a - 12}$$`,
      instruction: `Vyberte správné tvrzení.`,
      choices: [
        {
          label: `Výraz je definovaný pro všechna \\(a \\in \\mathbb{R}\\).`,
          value: "A",
          feedback: `Chyba. Pro \\(a = 3\\) je jmenovatel \\(4 \\cdot 3 - 12 = 0\\). Výraz v bodě \\(a = 3\\) nemá smysl.`
        },
        {
          label: `Pro \\(a = 0\\) je hodnota výrazu rovna \\(-9\\).`,
          value: "B",
          feedback: `Chyba. Výraz \\(= (a-3)\\) pro \\(a \\neq 3\\). Pro \\(a = 0\\): \\(0 - 3 = -3\\), ne \\(-9\\).`
        },
        {
          label: `Pro \\(a = 4\\) je hodnota výrazu rovna \\(1\\).`,
          value: "C",
          feedback: `Logika potvrzena. Výraz \\(= \\frac{(2a-6)^2}{4(a-3)} = \\frac{4(a-3)^2}{4(a-3)} = a-3\\). Pro \\(a = 4\\): \\(4 - 3 = 1\\) ✓`
        },
        {
          label: `Pro \\(a = 5\\) je hodnota výrazu rovna \\(4\\).`,
          value: "D",
          feedback: `Chyba. Výraz \\(= a - 3\\). Pro \\(a = 5\\): \\(5 - 3 = 2\\), ne \\(4\\).`
        },
      ],
      hints: [
        `Výraz jde výrazně zjednodušit — hledej společný faktor v čitateli a jmenovateli.`,
        `Po zjednodušení ověř každé tvrzení dosazením. Nezapomeň zkontrolovat, pro která \\(a\\) výraz vůbec nemá smysl.`,
      ],
      correctAnswer: "C", reward: { xp: 20 }
    },
    {
      id: "t_alg_08", regionId: "algebra", type: "closed", monsterName: `SIM_01H: Zjednodušení výrazu vytknout-zkrátit`,
      isTraining: true, firewallId: "q_alg_08", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Pro \\(a \\neq 2\\) zjednodušte výraz:`,
      formula: `$$\\frac{(a - 2)^{2}}{2a - 4}$$`,
      instruction: `Vyberte správně zjednodušený tvar.`,
      steps: [
        {
          trigger: `> Krok 1: Rozložíme jmenovatel`,
          content: `\\(2a - 4 = 2(a-2)\\). Jmenovatel obsahuje faktor (a−2).`
        },
        {
          trigger: `> Krok 2: Zkrátíme`,
          content: `Kolik faktorů \\((a-2)\\) je v čitateli a kolik ve jmenovateli? Zkrať společné a zapiš výsledek.`
        },
      ],
      choices: [
        {
          label: `\\(a - 2\\)`,
          value: "A",
          feedback: `Chyba. Zapomněl na konstantu 2 v jmenovateli: \\(2a - 4 = 2(a-2)\\), po zkrácení zůstane \\(\\frac{a-2}{2}\\).`
        },
        {
          label: `\\(\\frac{a - 2}{2}\\)`,
          value: "B",
          feedback: `Protokol ověřen. \\(\\frac{(a-2)^2}{2(a-2)} = \\frac{a-2}{2}\\). Ověření \\(a=4\\): \\(\\frac{(4-2)^2}{2 \\cdot 4 - 4} = \\frac{4}{4} = 1\\), a \\(\\frac{4-2}{2} = 1\\) ✓`
        },
        {
          label: `\\(\\frac{1}{2}\\)`,
          value: "C",
          feedback: `Přístup odepřen. Zkrátil dvakrát, ale v čitateli jsou dva faktory \\((a-2)\\) a ve jmenovateli jen jeden. Jeden \\((a-2)\\) zůstane.`
        },
        {
          label: `\\(2(a - 2)\\)`,
          value: "D",
          feedback: `Kritická chyba. Výsledek jde opačným směrem — jmenovatel nestoupá, ale klesá. Zkrácení se provádí, ne násobení.`
        },
      ],
      correctAnswer: "B", reward: { xp: 5 }
    },
    {
      id: "q_alg_09", regionId: "algebra", type: "closed", monsterName: `FW_01I: Složená operace se zlomky`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 5, trainingTasks: ["t_alg_09"],
      question: `Pro \\(a \\in \\mathbb{R} \\setminus \\{-2;\\, 2\\}\\) zjednodušte výraz:`,
      formula: `$$\\left( \\frac{a}{a - 2} - \\frac{a}{a + 2} \\right) \\cdot \\frac{a^{2} - 4}{a}$$`,
      instruction: `Vyberte správný výsledek.`,
      choices: [
        {
          label: `\\(\\frac{4a}{a^{2} - 4}\\)`,
          value: "A",
          feedback: `Chyba. Toto je výsledek jen vnitřní závorky — ještě jsi nenásobil výrazem \\(\\frac{a^2-4}{a}\\).`
        },
        {
          label: `\\(4\\)`,
          value: "B",
          feedback: `Protokol ověřen. Závorka: \\(\\frac{a(a+2) - a(a-2)}{a^2-4} = \\frac{4a}{a^2-4}\\). Po násobení \\(\\frac{a^2-4}{a}\\): \\(\\frac{4a}{a^2-4} \\cdot \\frac{a^2-4}{a} = 4\\).`
        },
        {
          label: `\\(4a^{2}\\)`,
          value: "C",
          feedback: `Kritická chyba. Závorka dává \\(\\frac{4a}{a^2-4}\\). Po vynásobení: \\(\\frac{4a}{a^2-4} \\cdot \\frac{a^2-4}{a} = \\frac{4 \\cdot a \\cdot (a^2-4)}{(a^2-4) \\cdot a} = 4\\). Faktor \\((a^2-4)\\) i faktor \\(a\\) se zkrátí — výsledek je číslo, ne výraz s proměnnou.`
        },
        {
          label: `\\(\\frac{4}{a}\\)`,
          value: "D",
          feedback: `Chyba syntaxe. Faktor \\(\\frac{a}{a} = 1\\) (ne \\(\\frac{1}{a}\\)). Pozorně sleduj, co je v čitateli a co ve jmenovateli při násobení.`
        },
      ],
      hints: [
        `Začni výrazem v závorce — převeď zlomky na společného jmenovatele a odečti čitatele.`,
        `Výraz za závorkou obsahuje \\(a^2 - 4\\) — rozlož a hledej, co se po vynásobení zkrátí.`,
      ],
      correctAnswer: "B", reward: { xp: 25 }
    },
    {
      id: "t_alg_09", regionId: "algebra", type: "closed", monsterName: `SIM_01I: Složená operace — závorka a násobení`,
      isTraining: true, firewallId: "q_alg_09", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Pro \\(x \\neq 0\\) a \\(x \\neq 1\\) zjednodušte výraz:`,
      formula: `$$\\left( 1 - \\frac{1}{x} \\right) \\cdot \\frac{x}{x - 1}$$`,
      instruction: `Vyberte správný výsledek.`,
      steps: [
        {
          trigger: `> Krok 1: Zjednodušíme závorku`,
          content: `Převeď výraz v závorce na jeden zlomek — společný jmenovatel je \\(x\\).`
        },
        {
          trigger: `> Krok 2: Vynásobíme`,
          content: `Zapiš součin obou zlomků jako jeden zlomek — co vidíš v čitateli a jmenovateli?`
        },
        {
          trigger: `> Krok 3: Zkrátíme`,
          content: `Hledej společné faktory v čitateli a jmenovateli a zkrať. Jaký je výsledek?`
        },
      ],
      choices: [
        {
          label: `\\(x - 1\\)`,
          value: "A",
          feedback: `Chyba. Faktor \\(x\\) ve jmenovateli závorky a faktor \\(x\\) v druhém zlomku se zkrátí. Pak se zkrátí i \\((x-1)\\). Výsledek je \\(1\\).`
        },
        {
          label: `\\(\\frac{x - 1}{x}\\)`,
          value: "B",
          feedback: `Chyba syntaxe. Toto je jen zjednodušená závorka — nezapočítal druhý faktor \\(\\frac{x}{x-1}\\).`
        },
        {
          label: `\\(1\\)`,
          value: "C",
          feedback: `Protokol ověřen. \\(\\frac{x-1}{x} \\cdot \\frac{x}{x-1} = \\frac{x(x-1)}{x(x-1)} = 1\\). Elegantní zkrácení.`
        },
        {
          label: `\\(\\frac{x}{x - 1}\\)`,
          value: "D",
          feedback: `Přístup odepřen. Závorka \\(\\left(1 - \\frac{1}{x}\\right)\\) se nezjednodušila správně, nebo jsi opomněl pronásobit. Výsledek je \\(1\\).`
        },
      ],
      correctAnswer: "C", reward: { xp: 5 }
    },
    {
      id: "q_alg_10", regionId: "algebra", type: "closed", monsterName: `FW_01J: Zjednodušení výrazu s odmocninami`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 4, trainingTasks: ["t_alg_10"],
      question: `Pro \\(a \\in (0;\\, +\\infty)\\) zjednodušte výraz:`,
      formula: `$$\\frac{\\sqrt{a^{3}} \\cdot \\sqrt[4]{a}}{a}$$`,
      instruction: `Vyberte správně zjednodušený tvar.`,
      choices: [
        {
          label: `\\(a^{\\frac{7}{4}}\\)`,
          value: "A",
          feedback: `Chyba syntaxe. Zapomněl odečíst exponent z dělení.`
        },
        {
          label: `\\(\\sqrt{a^{3}}\\)`,
          value: "B",
          feedback: `Chyba. Nezohlednil \\(\\sqrt[4]{a}\\) a dělení \\(a\\).`
        },
        {
          label: `\\(\\sqrt[3]{a^{4}}\\)`,
          value: "C",
          feedback: `Chyba syntaxe. Exponent výsledku je \\(\\frac{3}{4}\\). Jmenovatel odpovídá stupni odmocniny, čitatel stupni mocniny.`
        },
        {
          label: `\\(\\sqrt[4]{a^{3}}\\)`,
          value: "D",
          feedback: `Protokol ověřen. \\(\\sqrt{a^3} = a^{3/2}\\), \\(\\sqrt[4]{a} = a^{1/4}\\), děleno \\(a = a^1\\). Exponent: \\(\\frac{3}{2} + \\frac{1}{4} - 1 = \\frac{3}{4}\\). Tedy \\(\\sqrt[4]{a^3}\\).`
        },
      ],
      hints: [
        `Přepiš každou odmocninu jako mocninu s racionálním exponentem — to sjednotí tvar pro další úpravy.`,
        `Při násobení mocnin se stejným základem se exponenty <b>sčítají</b>, při dělení <b>odčítají</b>. Výsledný exponent si spočítej sám.`,
      ],
      correctAnswer: "D", reward: { xp: 20 }
    },
    {
      id: "t_alg_10", regionId: "algebra", type: "closed", monsterName: `SIM_01J: Sčítání exponentů odmocnin`,
      isTraining: true, firewallId: "q_alg_10", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Pro \\(a > 0\\) zapište výraz jako jednu mocninu základu \\(a\\):`,
      formula: `$$\\sqrt{a} \\cdot \\sqrt[4]{a}$$`,
      instruction: `Vyberte správný výsledek.`,
      steps: [
        {
          trigger: `> Krok 1: Odmocniny jako mocniny`,
          content: `\\(\\sqrt{a} = a^{1/2}\\), \\(\\sqrt[4]{a} = a^{1/4}\\). Součin mocnin se stejným základem: exponent se sčítá.`
        },
        {
          trigger: `> Krok 2: Sečteme exponenty`,
          content: `Sečti exponenty: \\(\\frac{1}{2} + \\frac{1}{4} = ?\\) Převeď na společného jmenovatele.`
        },
        {
          trigger: `> Krok 3: Zapíšeme odmocninou`,
          content: `Máš výsledný exponent ve tvaru zlomku. Jmenovatel zlomku udává stupeň odmocniny, čitatel mocninu základu. Zkus to zapsat sám.`
        },
      ],
      choices: [
        {
          label: `\\(\\sqrt[4]{a^{3}}\\)`,
          value: "A",
          feedback: `Protokol ověřen. \\(a^{1/2 + 1/4} = a^{3/4} = \\sqrt[4]{a^3}\\). Ověření \\(a=16\\): \\(\\sqrt{16} \\cdot \\sqrt[4]{16} = 4 \\cdot 2 = 8\\), \\(\\sqrt[4]{16^3} = \\sqrt[4]{4096} = 8\\) ✓`
        },
        {
          label: `\\(\\sqrt[8]{a^{3}}\\)`,
          value: "B",
          feedback: `Chyba. \\(a^{3/4} = \\sqrt[4]{a^3}\\), ne \\(\\sqrt[8]{a^3}\\). Jmenovatel exponentu \\(\\frac{3}{4}\\) je \\(4\\), ne \\(8\\).`
        },
        {
          label: `\\(\\sqrt[4]{a}\\)`,
          value: "C",
          feedback: `Chyba syntaxe. \\(\\sqrt[4]{a} = a^{1/4}\\), ale výsledek je \\(a^{3/4}\\). Součet exponentů se nepromítl do výsledku.`
        },
        {
          label: `\\(a^{\\frac{1}{8}}\\)`,
          value: "D",
          feedback: `Kritická chyba. Exponent se sčítá, ne násobí: \\(\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}\\), ne \\(\\frac{1}{2} \\cdot \\frac{1}{4} = \\frac{1}{8}\\).`
        },
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },
    {
      id: "q_alg_11", regionId: "algebra", type: "closed", monsterName: `FW_01K: Vlastnosti racionálního výrazu`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 3, trainingTasks: ["t_alg_11"],
      question: `Je dán výraz W s reálnou proměnnou x:`,
      formula: `$$W(x) = \\frac{x^{2} + x}{x^{2} - x} + \\frac{1}{x} - \\frac{2}{x - 1}$$`,
      instruction: `Které tvrzení o hodnotách výrazu W je pravdivé?`,
      choices: [
        {
          label: `W(1) = 2`,
          value: "A",
          feedback: `Kritická chyba. Pro x = 1 je výraz nedefinovaný — jmenovatele \\(x^2 - x\\) i \\(x - 1\\) jsou nulové.`
        },
        {
          label: `Hodnota výrazu W nemůže být rovna 1`,
          value: "B",
          feedback: `Přístup povolen. Po zjednodušení \\(W(x) = \\frac{x+1}{x} = 1 + \\frac{1}{x}\\). Rovnice \\(\\frac{1}{x} = 0\\) nemá řešení.`
        },
        {
          label: `Hodnota W je pro x = −1 záporná`,
          value: "C",
          feedback: `Chyba syntaxe. \\(W(-1) = \\frac{-1+1}{-1} = 0\\). Nulová, ne záporná.`
        },
        {
          label: `Hodnota W je kladná pro všechna x v definičním oboru`,
          value: "D",
          feedback: `Nekompletní. Zkus dosadit zápornou hodnotu blízkou nule — například \\(W\\!\\left(-\\tfrac{1}{2}\\right) = -1 < 0\\).`
        },
      ],
      hints: [
        `Tvrzení o hodnotě v konkrétním bodě (A, C) ověříš dosazením — ale nejdřív zkontroluj, zda bod patří do definičního oboru.`,
        `Tvrzení o hodnotě, které výraz nemůže nabývat (B), ověříš rovnicí W(x) = daná hodnota. Tvrzení o znaménku na celém oboru (D) vyvrátíš jediným protipříkladem.`,
      ],
      correctAnswer: "B", reward: { xp: 15 }
    },
    {
      id: "t_alg_11", regionId: "algebra", type: "closed", monsterName: `SIM_01K: Hodnota výrazu a definiční obor`,
      isTraining: true, firewallId: "q_alg_11", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Je dán výraz \\(V\\) pro \\(x \\neq 0\\):`,
      formula: `$$V(x) = 1 + \\frac{1}{x}$$`,
      instruction: `Může být \\(V(x) = 1\\) pro nějaké reálné \\(x\\)?`,
      steps: [
        {
          trigger: `> Krok 1: Co je hodnota výrazu?`,
          content: `Hodnota výrazu \\(V(x)\\) je číslo, které dostaneš po dosazení konkrétního \\(x\\). Jaká je \\(V(2)\\)? Dosad sám a zkontroluj.`
        },
        {
          trigger: `> Krok 2: Kdy výraz hodnotu nemá?`,
          content: `Výraz \\(\\frac{1}{x}\\) nemá hodnotu, když je jmenovatel nulový — tedy pro \\(x = 0\\). Pro všechna ostatní \\(x\\) je \\(\\frac{1}{x}\\) nenulové. Co to říká o možné hodnotě \\(V(x) = 1\\)?`
        },
      ],
      choices: [
        {
          label: `Ne, \\(V(x) = 1\\) nemá řešení`,
          value: "A",
          feedback: `Přístup povolen. \\(1 + \\frac{1}{x} = 1\\) by znamenalo \\(\\frac{1}{x} = 0\\) — to pro žádné reálné \\(x\\) neplatí.`
        },
        {
          label: `Ano, pro \\(x = 1\\)`,
          value: "B",
          feedback: `Chyba. \\(V(1) = 1 + \\frac{1}{1} = 2\\), ne 1. Dosaď přesně.`
        },
        {
          label: `Ano, pro velmi velká \\(x\\)`,
          value: "C",
          feedback: `Nekompletní. Pro velká \\(x\\) se \\(V(x)\\) blíží 1, ale nikdy se 1 nerovná — \\(\\frac{1}{x}\\) je malé, ale nenulové.`
        },
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },
    {
      id: "q_alg_13", regionId: "algebra", type: "closed", monsterName: `FW_01M: Mocniny a třetí odmocnina`,
      visual_color: "#7c5cfc", visual_symbol: `x²`, points: 3, trainingTasks: ["t_alg_13"],
      question: `Pro \\(b \\in (0;\\, {+}\\infty)\\) zjednodušte výraz:`,
      formula: `$$\\frac{(b^{2})^{60}}{b^{40} \\cdot \\sqrt[3]{b^{-60}}}$$`,
      instruction: `Vyberte správný výsledek.`,
      choices: [
        {
          label: `\\(b^{100}\\)`,
          value: "A",
          feedback: `Přístup povolen. \\((b^2)^{60} = b^{120}\\), \\(\\sqrt[3]{b^{-60}} = b^{-20}\\), jmenovatel \\(b^{40} \\cdot b^{-20} = b^{20}\\). Výsledek: \\(b^{120-20} = b^{100}\\).`
        },
        {
          label: `\\(b^{60}\\)`,
          value: "B",
          feedback: `Chyba syntaxe. Záporný exponent zůstává záporný i po odmocnění — \\(\\sqrt[3]{b^{-60}} = b^{-20}\\), ne \\(b^{+20}\\).`
        },
        {
          label: `\\(b^{140}\\)`,
          value: "C",
          feedback: `Kritická chyba. Třetí odmocnina dělí exponent třemi — nelze ji přeskočit. \\(\\sqrt[3]{b^{-60}} = b^{-20}\\), ne \\(b^{-60}\\).`
        },
        {
          label: `\\(b^{110}\\)`,
          value: "D",
          feedback: `Nekompletní. Pod odmocninou je třetí odmocnina (\\(\\sqrt[3]{\\cdot}\\)), ne druhá. Exponent se dělí 3, ne 2.`
        },
      ],
      hints: [
        `Pravidla pro mocniny: \\((b^m)^n = b^{m \\cdot n}\\), \\(\\; b^m \\cdot b^n = b^{m+n}\\), \\(\\; \\dfrac{b^m}{b^n} = b^{m-n}\\).`,
        `Třetí odmocnina jako mocnina: \\(\\sqrt[3]{b^k} = b^{k/3}\\). Záporný exponent pod odmocninou zůstává záporný.`,
      ],
      correctAnswer: "A", reward: { xp: 15 }
    },
    {
      id: "t_alg_13", regionId: "algebra", type: "closed", monsterName: `SIM_01M: Zjednodušení výrazu s třetí odmocninou`,
      isTraining: true, firewallId: "q_alg_13", visual_color: "#2ecc8a", visual_symbol: `x²`, points: 0,
      question: `Pro \\(x \\in (0;\\, {+}\\infty)\\) zjednodušte výraz:`,
      formula: `$$\\frac{(x^{3})^{4}}{x^{6} \\cdot \\sqrt[3]{x^{-9}}}$$`,
      instruction: `Vyberte správný výsledek.`,
      steps: [
        {
          trigger: `> Krok 1: Mocnina mocniny`,
          content: `Jaké pravidlo platí pro \\((a^m)^n\\)? Aplikuj ho na čitatele.`
        },
        {
          trigger: `> Krok 2: Odmocnina jako mocnina`,
          content: `Přepiš \\(\\sqrt[3]{x^{-9}}\\) jako \\(x\\) na racionální exponent. Čím se dělí exponent u třetí odmocniny?`
        },
        {
          trigger: `> Krok 3: Dělení mocnin`,
          content: `Sečti exponenty ve jmenovateli a odečti od exponentu v čitateli.`
        },
      ],
      choices: [
        {
          label: `\\(x^{9}\\)`,
          value: "A",
          feedback: `Logika potvrzena. \\(x^{12} / (x^{6} \\cdot x^{-3}) = x^{12} / x^{3} = x^{9}\\).`
        },
        {
          label: `\\(x^{3}\\)`,
          value: "B",
          feedback: `Chyba syntaxe. \\(\\sqrt[3]{x^{-9}} = x^{-3}\\), ne \\(x^{+3}\\). Znaménko exponentu se odmocněním nemění.`
        },
        {
          label: `\\(x^{15}\\)`,
          value: "C",
          feedback: `Kritická chyba. Třetí odmocnina dělí exponent třemi: \\(-9 / 3 = -3\\), ne \\(-9\\).`
        },
        {
          label: `\\(x^{6}\\)`,
          value: "D",
          feedback: `Nekompletní. Ve jmenovateli je ještě \\(\\sqrt[3]{x^{-9}}\\) — ten člen nelze ignorovat.`
        },
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },

    // ==========================================
    // 02. ROVNICE
    // ==========================================

    {
      id: "q_rov_01", regionId: "rovnice", type: "closed", monsterName: "FW_02A: Lomené rovnice",
      visual_color: "#f7b84f", visual_symbol: "x=", points: 7, trainingTasks: ["t_rov_01"],
      question: "V oboru \\(\\mathbb{R}\\) řešte:",
      formula: "$$ \\frac{x-2}{x+2} \\cdot \\frac{3}{x} + \\frac{16}{x^2+2x} = \\frac{x}{x+2} $$",
      instruction: "Zvolte správnou množinu řešení.",
      choices: [
        { label: "\\(x = 5\\)", value: "A", feedback: "Přístup povolen. Falešný kořen -2 byl úspěšně odfiltrován." },
        { label: "\\(x \\in \\{-2; 5\\}\\)", value: "B", feedback: "Chyba. Kořen \\(-2\\) vynuluje jmenovatele původní rovnice." },
        { label: "\\(x = -2\\)", value: "C", feedback: "Kritická chyba. Výsledek vede na dělení nulou." },
        { label: "Rovnice nemá řešení", value: "D", feedback: "Chyba výpočtu. Jeden z kořenů je platný." }
      ],
      hints: [
        `Lomený výraz nemá smysl, když je jmenovatel nulový. Pro která x to nastane?`,
        `Rozmysli, jestli se nedá některý jmenovatel upravit. Vynásob celou rovnici společným jmenovatelem. Nezapomeň pak ověřit podmínky.`,
      ],
      correctAnswer: "A", reward: { xp: 30 }
    },
    {
      id: "t_rov_01", regionId: "rovnice", type: "closed", monsterName: "SIM_02A: Podmínky",
      isTraining: true, firewallId: "q_rov_01", visual_color: "#2ecc8a", visual_symbol: "≠", points: 0,
      question: "Jaké jsou omezující podmínky pro tento algebraický výraz?",
      formula: "$$ \\frac{16}{x^2+2x} $$",
      instruction: "Vyberte správné podmínky řešitelnosti.",
      steps: [
        { trigger: "> Krok 1: Rozklad", content: "Rozlož jmenovatel na součin. Určitě se dá něco vytknout." },
        { trigger: "> Krok 2: Pravidlo nulového bodu", content: "Pro která \\(x\\) se hodnota jmenovatele rovná nule?" }
      ],
      choices: [
        { label: "\\(x \\neq 0 \\land x \\neq -2\\)", value: "A", feedback: "Logika potvrzena. U rovnice vždy zkontroluj tyto podmínky." },
        { label: "\\(x \\neq -2\\)", value: "B", feedback: "Nekompletní. Chybí kontrola samotného 'x'." },
        { label: "\\(x > 0\\)", value: "C", feedback: "Chyba. Jmenovatel nesmí být roven nule, ale může být záporný." }
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },
    {
      id: "q_rov_02", regionId: "rovnice", type: "closed", monsterName: `FW_02B: Lomená rovnice I`,
      visual_color: "#f7b84f", visual_symbol: `x=`, points: 6, trainingTasks: ["t_rov_02"],
      question: `V oboru reálných čísel řešte rovnici:`,
      formula: `$$\\frac{x + 3}{x - 1} + \\frac{4}{x + 1} = \\frac{8}{x^{2} - 1}$$`,
      instruction: `Zvolte správnou množinu řešení.`,
      choices: [
        {
          label: `\\(\\{ 1\\}\\)`,
          value: "A",
          feedback: `Kritická chyba. \\(x=1\\) je zakázaná hodnota — vynuluje jmenovatele \\((x-1)\\).`
        },
        {
          label: `\\(\\{ - 9\\}\\)`,
          value: "B",
          feedback: `Přístup povolen. Po vynásobení \\((x-1)(x+1)\\) vychází \\(x^2+8x-9=0\\), kořen \\(x=-9\\) prošel podmínkou.`
        },
        {
          label: `\\(\\{ - 9;\\, 1\\}\\)`,
          value: "C",
          feedback: `Chyba. Kořen \\(x=1\\) sice algebraicky vychází, ale nesplňuje definiční podmínku.`
        },
        {
          label: `Rovnice nemá řešení`,
          value: "D",
          feedback: `Chyba výpočtu. Po správném vynásobení jmenovatelem vznikne kvadratická rovnice — jeden kořen podmínku splňuje.`
        },
      ],
      hints: [
        `Jmenovatel třetího zlomku lze rozložit na součin. Co to prozradí o společném jmenovateli?`,
        `Kvadratická rovnice může mít dva kořeny. Oba je třeba ověřit vůči podmínkám.`,
      ],
      correctAnswer: "B", reward: { xp: 30 }
    },
    {
      id: "t_rov_02", regionId: "rovnice", type: "closed", monsterName: `SIM_02B: Podmínky lomeného výrazu`,
      isTraining: true, firewallId: "q_rov_02", visual_color: "#2ecc8a", visual_symbol: `x=`, points: 0,
      question: `V oboru reálných čísel řešte rovnici:`,
      formula: `$$\\frac{3}{x - 1} + \\frac{1}{x + 1} = 0$$`,
      instruction: `Vyberte správnou množinu řešení.`,
      steps: [
        {
          trigger: `> Krok 1: Podmínky`,
          content: `Jaké hodnoty \\(x\\) vynulují jmenovatele? Tyto hodnoty jsou zakázané.`
        },
        {
          trigger: `> Krok 2: Násobení společným jmenovatelem`,
          content: `Po vynásobení společným jmenovatelem obě strany zjednoduš. Vznikne jednoduchá lineární rovnice.`
        },
      ],
      choices: [
        {
          label: `\\(\\{ 1;\\, - 1\\}\\)`,
          value: "A",
          feedback: `Kritická chyba. Toto jsou zakázané hodnoty, ne řešení.`
        },
        {
          label: `Rovnice nemá řešení`,
          value: "B",
          feedback: `Chyba. Po vynásobení jmenovatelem dostaneme lineární rovnici s řešením.`
        },
        {
          label: `\\(\\left\\{ - \\frac{1}{2} \\right\\}\\)`,
          value: "C",
          feedback: `Přístup povolen. Splňuje podmínky \\(x\\neq\\pm1\\). Teď zkus rovnici se třemi zlomky.`
        },
        {
          label: `\\(\\left\\{ \\frac{1}{2} \\right\\}\\)`,
          value: "D",
          feedback: `Chyba znaménka. \\(4x+2=0\\) → \\(x=-1/2\\), ne \\(+1/2\\).`
        },
      ],
      correctAnswer: "C", reward: { xp: 5 }
    },
    {
      id: "q_rov_03", regionId: "rovnice", type: "closed", monsterName: `FW_02C: Lomená rovnice II`,
      visual_color: "#f7b84f", visual_symbol: `x=`, points: 5, trainingTasks: ["t_rov_03"],
      question: `V oboru reálných čísel řešte rovnici:`,
      formula: `$$\\frac{x + 6}{x - 2} + \\frac{x}{x + 2} = \\frac{20}{x^{2} - 4}$$`,
      instruction: `Zvolte správnou množinu řešení.`,
      choices: [
        {
          label: `\\(\\{ - 4\\}\\)`,
          value: "A",
          feedback: `Nekompletní. Toto je jen jeden z kořenů.`
        },
        {
          label: `\\(\\{ 2;\\, 4\\}\\)`,
          value: "B",
          feedback: `Kritická chyba. \\(x=2\\) vynuluje jmenovatele \\((x-2)\\). A \\(x=4\\) není kořen.`
        },
        {
          label: `\\(\\{ - 4;\\, 1\\}\\)`,
          value: "C",
          feedback: `Přístup povolen. Po vynásobení \\((x-2)(x+2)\\): \\(2x^2+6x-8=0\\) → \\((x+4)(x-1)=0\\). Obě řešení prošla podmínkou.`
        },
        {
          label: `\\(\\{ 1\\}\\)`,
          value: "D",
          feedback: `Nekompletní. Toto je jen jeden z kořenů.`
        },
      ],
      hints: [
        `Jmenovatel posledního zlomku se dá rozložit pomocí vzorce \\(a^2 - b^2\\). Jaké podmínky to přinese?`,
        `Po převedení na společného jmenovatele vznikne kvadratická rovnice. Oba kořeny ověř vůči podmínkám.`,
      ],
      correctAnswer: "C", reward: { xp: 25 }
    },
    {
      id: "t_rov_03", regionId: "rovnice", type: "closed", monsterName: `SIM_02C: Lomená rovnice se třemi zlomky`,
      isTraining: true, firewallId: "q_rov_03", visual_color: "#2ecc8a", visual_symbol: `x=`, points: 0,
      question: `V oboru reálných čísel řešte rovnici:`,
      formula: `$$\\frac{x + 2}{x - 1} - \\frac{x}{x + 1} = \\frac{2}{x^{2} - 1}$$`,
      instruction: `Vyberte správnou množinu řešení.`,
      steps: [
        {
          trigger: `> Krok 1: Rozklad a podmínky`,
          content: `Rozlož \\(x^2 - 1\\) na součin podle vzorce \\(a^2 - b^2 = (a-b)(a+b)\\). Jaké podmínky z toho vyplývají?`
        },
        {
          trigger: `> Krok 2: Násobení (x-1)(x+1)`,
          content: `Po vynásobení společným jmenovatelem rozevři závorky a zjednoduš. Co vyjde?`
        },
      ],
      choices: [
        {
          label: `\\(\\{ 0\\}\\)`,
          value: "A",
          feedback: `Přístup povolen. Zjednodušení čitatele dalo lineární rovnici. Teď zkus rovnici s dvěma různými řešeními.`
        },
        {
          label: `\\(\\{ 1;\\, - 1\\}\\)`,
          value: "B",
          feedback: `Kritická chyba. Toto jsou zakázané hodnoty — nikdy nejsou řešením.`
        },
        {
          label: `\\(\\{ - \\frac{1}{2}\\}\\)`,
          value: "C",
          feedback: `Chyba výpočtu. \\(4x+2=2\\) → \\(4x=0\\) → \\(x=0\\), ne \\(-1/2\\).`
        },
        {
          label: `Rovnice nemá řešení`,
          value: "D",
          feedback: `Chyba. \\(x=0\\) podmínky splňuje a rovnici řeší.`
        },
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },
    {
      id: "q_rov_04", regionId: "rovnice", type: "closed", monsterName: `FW_02D: Racionální nerovnice I`,
      visual_color: "#f7b84f", visual_symbol: `<`, points: 4, trainingTasks: ["t_rov_04"],
      question: `V oboru reálných čísel určete množinu řešení nerovnice:`,
      formula: `$$\\frac{4x}{x + 2} - 4 < 0$$`,
      instruction: `Vyberte správný interval řešení.`,
      choices: [
        {
          label: `\\(( - 2;\\, + \\infty)\\)`,
          value: "A",
          feedback: `Přístup povolen. Zjednodušením dostaneme \\(-8/(x+2)<0\\), což platí pro \\(x>-2\\).`
        },
        {
          label: `\\(( - \\infty;\\, - 2)\\)`,
          value: "B",
          feedback: `Obrácená orientace. \\(-8/(x+2)<0\\) platí, když \\((x+2)>0\\), tedy \\(x>-2\\).`
        },
        {
          label: `\\(( - \\infty;\\, + \\infty)\\)`,
          value: "C",
          feedback: `Chyba. Nerovnice není splněna pro \\(x<-2\\). Zkus dosadit \\(x=-3\\).`
        },
        {
          label: `\\(\\langle - 2;\\, + \\infty)\\)`,
          value: "D",
          feedback: `Závorka špatně — \\(x=-2\\) vynuluje jmenovatele, do řešení nepatří.`
        },
      ],
      hints: [
        `Převeď levou stranu na společný jmenovatel. V žádném případě nesmíš násobit (x+2). Nevíš, jestli násobíš kladným nebo záporným číslem.`,
        `Znaménko zlomku závisí na znaménku čitatele a jmenovatele. Rozhodni, kdy je celý zlomek záporný.`,
      ],
      correctAnswer: "A", reward: { xp: 20 }
    },
    {
      id: "t_rov_04", regionId: "rovnice", type: "closed", monsterName: `SIM_02D: Znaménko zlomku`,
      isTraining: true, firewallId: "q_rov_04", visual_color: "#2ecc8a", visual_symbol: `<`, points: 0,
      question: `Určete množinu řešení nerovnice v oboru reálných čísel:`,
      formula: `$$\\frac{2}{x - 1} > 0$$`,
      instruction: `Vyberte správný interval.`,
      steps: [
        {
          trigger: `> Krok 1: Čitatel je kladný`,
          content: `Jaké znaménko má čitatel? Je konstantní, nebo závisí na \\(x\\)?`
        },
        {
          trigger: `> Krok 2: Kdy je jmenovatel kladný?`,
          content: `\\(x - 1 > 0\\) → co z toho vyplývá? Jaký interval to představuje?`
        },
      ],
      choices: [
        {
          label: `\\(x > 0\\)`,
          value: "A",
          feedback: `Chyba. Podmínka závisí na jmenovateli \\((x-1)\\), ne jen na \\(x\\).`
        },
        {
          label: `\\(( - \\infty;\\, 1)\\)`,
          value: "B",
          feedback: `Obrácená orientace. Pro \\(x<1\\) je jmenovatel záporný → zlomek záporný.`
        },
        {
          label: `\\(x \\in \\mathbb{R}\\)`,
          value: "C",
          feedback: `Chyba. Pro \\(x < 1\\) je \\(2/(x-1) < 0\\). Nerovnice neplatí všude.`
        },
        {
          label: `\\((1;\\, + \\infty)\\)`,
          value: "D",
          feedback: `Logika potvrzena. Teď zkus složitější nerovnici, kde se čitatel také mění.`
        },
      ],
      correctAnswer: "D", reward: { xp: 5 }
    },
    {
      id: "q_rov_05", regionId: "rovnice", type: "closed", monsterName: `FW_02E: Racionální nerovnice II`,
      visual_color: "#f7b84f", visual_symbol: `≤0`, points: 6, trainingTasks: ["t_rov_05"],
      question: `V oboru reálných čísel určete množinu řešení nerovnice:`,
      formula: `$$\\frac{2x^{2} - 6x}{(x - 3)^{2}} \\leq 0$$`,
      instruction: `Vyberte správnou množinu řešení.`,
      choices: [
        {
          label: `\\(( - \\infty;\\, 0\\rangle\\)`,
          value: "A",
          feedback: `Chyba. Pro \\(x<0\\): \\(2x/(x-3)\\) je záporné/záporné = kladné > 0. Podmínka nesplněna.`
        },
        {
          label: `\\(\\langle 0;\\, 3\\rangle\\)`,
          value: "B",
          feedback: `Chyba. \\(x=3\\) vynuluje jmenovatele, do řešení nepatří.`
        },
        {
          label: `\\(( - \\infty;\\, 0\\rangle \\cup (3;\\, + \\infty)\\)`,
          value: "C",
          feedback: `Kritická chyba. Znaménkový rozbor máš obrácený.`
        },
        {
          label: `\\(\\langle 0;\\, 3)\\)`,
          value: "D",
          feedback: `Přístup povolen. Zlomek se zjednoduší na \\(2x/(x-3)\\). Záporný je jen pro \\(0 < x < 3\\), nula pro \\(x=0\\).`
        },
      ],
      hints: [
        `Rozlož čitatele i jmenovatele na součin. Dá se zlomek zkrátit?`,
        `Po zjednodušení proveď znaménkový rozbor. Bod, kde jmenovatel původně nulový, zůstává vyloučený.`,
      ],
      correctAnswer: "D", reward: { xp: 30 }
    },
    {
      id: "t_rov_05", regionId: "rovnice", type: "closed", monsterName: `SIM_02E: Zjednodušení racionální nerovnice`,
      isTraining: true, firewallId: "q_rov_05", visual_color: "#2ecc8a", visual_symbol: `≤0`, points: 0,
      question: `Určete množinu řešení nerovnice v oboru reálných čísel:`,
      formula: `$$\\frac{x(x - 4)}{(x - 4)^{2}} \\leq 0$$`,
      instruction: `Vyberte správnou množinu řešení.`,
      steps: [
        {
          trigger: `> Krok 1: Zkrácení zlomku`,
          content: `Čitatel i jmenovatel obsahují činitel \\((x-4)\\). Dá se zkrátit? Za jaké podmínky?`
        },
        {
          trigger: `> Krok 2: Znaménkový rozbor`,
          content: `\\(x/(x-4) \\leq 0\\): nulový bod \\(x=0\\). Pro která \\(x\\) je zlomek záporný nebo nula? Pamatuj: \\(x=4\\) je vyloučena.`
        },
      ],
      choices: [
        {
          label: `\\(( - \\infty;\\, 0\\rangle\\)`,
          value: "A",
          feedback: `Chyba. Pro \\(x<0\\): záporné/záporné = kladné > 0. Podmínka nesplněna.`
        },
        {
          label: `\\(\\langle 0;\\, 4)\\)`,
          value: "B",
          feedback: `Přístup povolen. Teď zkus firewall — stejná logika, jiné číslo.`
        },
        {
          label: `\\(\\langle 0;\\, 4\\rangle\\)`,
          value: "C",
          feedback: `Závorka špatně — \\(x=4\\) vynuluje jmenovatele.`
        },
        {
          label: `\\((0;\\, 4)\\)`,
          value: "D",
          feedback: `Závorka špatně u nuly — \\(x=0\\) dává hodnotu \\(0 \\leq 0\\) ✓, patří do řešení.`
        },
      ],
      correctAnswer: "B", reward: { xp: 5 }
    },
    {
      id: "q_rov_06", regionId: "rovnice", type: "closed", monsterName: `FW_02F: Soustava bez řešení`,
      visual_color: "#f7b84f", visual_symbol: `∅`, points: 3, trainingTasks: ["t_rov_06"],
      question: `Která z následujících soustav dvou rovnic nemá v oboru reálných čísel žádné řešení?`,
      instruction: `Vyberte správnou soustavu.`,
      choices: [
        {
          label: `\\(x - y = 1,\\quad 2x - 2y = 2\\)`,
          value: "A",
          feedback: `Chyba. Druhá rovnice je dvojnásobkem první — jde o tutéž přímku. Soustava má nekonečně mnoho řešení.`
        },
        {
          label: `\\(x + y = 3,\\quad 2x - y = 0\\)`,
          value: "B",
          feedback: `Chyba. Tato soustava má právě jedno řešení: \\(x=1\\), \\(y=2\\).`
        },
        {
          label: `\\(x + y = 3,\\quad 2x + 2y = 5\\)`,
          value: "C",
          feedback: `Přístup povolen. Z první rovnice plyne \\(2x+2y=6\\), ale druhá říká \\(2x+2y=5\\) — spor \\(6 = 5\\). Soustava nemá žádné řešení.`
        },
        {
          label: `\\(x + y = 2,\\quad x - y = 4\\)`,
          value: "D",
          feedback: `Chyba. Tato soustava má právě jedno řešení: \\(x=3\\), \\(y=-1\\).`
        },
      ],
      hints: [
        `Uprav rovnice tak, aby levé strany měly stejné koeficienty. Porovnej pravé strany.`,
        `Soustava nemá řešení, pokud po úpravě vznikne spor — dva různé výsledky pro stejný výraz.`,
      ],
      correctAnswer: "C", reward: { xp: 15 }
    },
    {
      id: "t_rov_06", regionId: "rovnice", type: "closed", monsterName: `SIM_02F: Spor v soustavě`,
      isTraining: true, firewallId: "q_rov_06", visual_color: "#2ecc8a", visual_symbol: `∅`, points: 0,
      question: `Má soustava rovnic v oboru reálných čísel řešení?`,
      formula: `$$\\left\\{ \\begin{matrix}
x + 2y = 4 \\\\
2x + 4y = 9 \\\\
\\end{matrix} \\right.\\ $$`,
      instruction: `Vyberte správnou odpověď.`,
      steps: [
        {
          trigger: `> Krok 1: Vynásobení první rovnice`,
          content: `Čím musíš vynásobit první rovnici, aby levé strany obou rovnic byly stejné?`
        },
        {
          trigger: `> Krok 2: Porovnání s druhou rovnicí`,
          content: `Druhá rovnice říká \\(2x + 4y = 9\\). Ale právě jsme odvodili \\(2x + 4y = 8\\). Co to znamená?`
        },
      ],
      choices: [
        {
          label: `Ano, má právě jedno řešení`,
          value: "A",
          feedback: `Chyba. Rovnice jsou rovnoběžné přímky — nikde se neprotínají.`
        },
        {
          label: `Ano, má nekonečně mnoho řešení`,
          value: "B",
          feedback: `Chyba. Nekonečně mnoho řešení by nastalo, kdyby druhá rovnice byla násobkem první — ale \\(8 \\neq 9\\).`
        },
        {
          label: `Ne, soustava nemá žádné řešení`,
          value: "C",
          feedback: `Přístup povolen. Teď zkus poznat soustavu bez řešení mezi čtyřmi možnostmi.`
        },
        {
          label: `Záleží na volbě \\(x\\) a \\(y\\)`,
          value: "D",
          feedback: `Kritická chyba. Řešení soustavy lineárních rovnic existuje, nebo neexistuje — nezáleží na volbě proměnných.`
        },
      ],
      correctAnswer: "C", reward: { xp: 5 }
    },
    {
      id: "q_rov_07", regionId: "rovnice", type: "closed", monsterName: `FW_02G: Rovnice s parametrem`,
      visual_color: "#f7b84f", visual_symbol: `k=?`, points: 4, trainingTasks: ["t_rov_07"],
      question: `V oboru reálných čísel určete, pro která \\(k \\in \\mathbb{R}\\) nemá rovnice žádné řešení:`,
      formula: `$$kx + k = 2x + 1$$`,
      instruction: `Vyberte správnou hodnotu parametru \\(k\\).`,
      choices: [
        {
          label: `\\(k = 1\\)`,
          value: "A",
          feedback: `Chyba. Pro \\(k=1\\): rovnice dá \\((1-2)x = 1-1\\) → \\(-x = 0\\) → \\(x=0\\). Jedno řešení existuje.`
        },
        {
          label: `\\(k = 2\\)`,
          value: "B",
          feedback: `Přístup povolen. Pro \\(k=2\\): \\((2-2)x = 1-2\\) → \\(0 = -1\\) — spor. Rovnice nemá žádné řešení.`
        },
        {
          label: `\\(k \\in \\mathbb{R} \\setminus \\{2\\}\\)`,
          value: "C",
          feedback: `Chyba. Pro \\(k \\neq 2\\) je koeficient u \\(x\\) nenulový → rovnice má právě jedno řešení \\(x = \\frac{1-k}{k-2}\\).`
        },
        {
          label: `Taková hodnota \\(k\\) neexistuje`,
          value: "D",
          feedback: `Kritická chyba. Existuje hodnota \\(k\\), pro kterou koeficient u \\(x\\) vyjde nulový — a přesto pravá strana nenulová. Uprav rovnici do tvaru \\((k-?)x = ?\\) a porovnej obě strany.`
        },
      ],
      hints: [
        `Přesuň členy s \\(x\\) na jednu stranu. Kdy bude koeficient u \\(x\\) nulový?`,
        `Rovnice tvaru \\(0 \\cdot x = c\\) — záleží na tom, jestli \\(c = 0\\) nebo \\(c \\neq 0\\).`,
      ],
      correctAnswer: "B", reward: { xp: 20 }
    },
    {
      id: "t_rov_07", regionId: "rovnice", type: "closed", monsterName: `SIM_02G: Parametr a spor`,
      isTraining: true, firewallId: "q_rov_07", visual_color: "#2ecc8a", visual_symbol: `k=?`, points: 0,
      question: `Pro která \\(k \\in \\mathbb{R}\\) nemá rovnice v oboru reálných čísel žádné řešení?`,
      formula: `$$kx = 6$$`,
      instruction: `Vyberte správnou hodnotu parametru \\(k\\).`,
      steps: [
        {
          trigger: `> Krok 1: Kdy lze rovnici vyřešit?`,
          content: `Rovnici \\(kx = 6\\) řešíš dělením — ale kdy to nejde? Jaká hodnota \\(k\\) znemožní dělení?`
        },
        {
          trigger: `> Krok 2: Dosaď tu problematickou hodnotu k`,
          content: `Dosaď tu problematickou hodnotu \\(k\\). Je výsledná rovnost pravdivá? Co to znamená pro existenci řešení?`
        },
      ],
      choices: [
        {
          label: `\\(k = 6\\)`,
          value: "A",
          feedback: `Chyba. Pro \\(k=6\\): \\(6x=6\\) → \\(x=1\\). Rovnice má jedno řešení.`
        },
        {
          label: `\\(k = 0\\)`,
          value: "B",
          feedback: `Přístup povolen. Pro \\(k=0\\) vychází \\(0=6\\) — spor. Rovnice nemá žádné řešení.`
        },
        {
          label: `\\(k = -6\\)`,
          value: "C",
          feedback: `Chyba. Pro \\(k=-6\\): \\(-6x=6\\) → \\(x=-1\\). Rovnice má jedno řešení.`
        },
        {
          label: `Taková hodnota neexistuje`,
          value: "D",
          feedback: `Kritická chyba. Pro \\(k=0\\) dostaneme \\(0=6\\) — spor, který znamená, že rovnice nemá žádné řešení.`
        },
      ],
      correctAnswer: "B", reward: { xp: 5 }
    },
    {
      id: "q_rov_08", regionId: "rovnice", type: "closed", monsterName: `FW_02H: Prázdná množina řešení`,
      visual_color: "#f7b84f", visual_symbol: `∅`, points: 2, trainingTasks: ["t_rov_08"],
      question: `Která z následujících nerovnic nemá v oboru reálných čísel žádné řešení?`,
      instruction: `Vyberte nerovnici s prázdnou množinou řešení.`,
      choices: [
        {
          label: `\\(x^{2} + 4 < 0\\)`,
          value: "A",
          feedback: `Přístup povolen. \\(x^2 \\geq 0\\), tedy \\(x^2+4 \\geq 4 > 0\\) vždy. Nerovnice nikdy neplatí.`
        },
        {
          label: `\\((x + 3)^{2} \\geq 0\\)`,
          value: "B",
          feedback: `Tato nerovnice platí pro všechna reálná \\(x\\) — čtverec je vždy nezáporný.`
        },
        {
          label: `\\((x - 2)(2 - x) \\geq 0\\)`,
          value: "C",
          feedback: `Chyba. \\((x-2)(2-x) = -(x-2)^2 \\geq 0\\) platí právě pro \\(x=2\\). Má jedno řešení.`
        },
        {
          label: `\\(3x - 1 > 3x - 5\\)`,
          value: "D",
          feedback: `Chyba. Zjednodušením: \\(-1 > -5\\), což je vždy pravda. Řešení je celé \\(\\mathbb{R}\\).`
        },
      ],
      hints: [
        `Druhá mocnina reálného čísla je vždy nezáporná: \\(A^2 \\geq 0\\). Co to říká o hodnotách výrazu \\(x^2 + 4\\)?`,
        `Nerovnice nemá řešení, pokud podmínka nemůže být nikdy splněna. Projdi každou volbu a rozmysli, jakých hodnot výraz nabývá.`,
      ],
      correctAnswer: "A", reward: { xp: 10 }
    },
    {
      id: "t_rov_08", regionId: "rovnice", type: "closed", monsterName: `SIM_02H: Nerovnice vždy splněná`,
      isTraining: true, firewallId: "q_rov_08", visual_color: "#2ecc8a", visual_symbol: `∅`, points: 0,
      question: `Pro která reálná čísla \\(x\\) platí nerovnice \\((x + 2)^{2} \\geq 0\\)?`,
      formula: `$$(x + 2)^{2} \\geq 0$$`,
      instruction: `Vyberte správnou množinu řešení.`,
      steps: [
        {
          trigger: `> Krok 1: Co víš o druhé mocnině`,
          content: `Co víš o znaménku druhé mocniny libovolného reálného čísla?`
        },
        {
          trigger: `> Krok 2: Závěr`,
          content: `Může existovat \\(x\\), pro které by \\((x+2)^2\\) bylo záporné?`
        },
      ],
      choices: [
        {
          label: `\\(x \\geq - 2\\)`,
          value: "A",
          feedback: `Chyba. Nerovnice platí i pro \\(x < -2\\), např. \\(x=-5\\): \\((-3)^2=9\\geq0\\) ✓.`
        },
        {
          label: `Celé \\(\\mathbb{R}\\)`,
          value: "B",
          feedback: `Přístup povolen. Teď zkus rozlišit, která nerovnice naopak nemá žádné řešení.`
        },
        {
          label: `\\(x = - 2\\)`,
          value: "C",
          feedback: `Toto je jen nulový bod — hodnota \\(0\\). Ale nerovnice \\(\\geq 0\\) platí pro všechna \\(x\\).`
        },
        {
          label: `Prázdná množina`,
          value: "D",
          feedback: `Kritická chyba. Čtverec je vždy \\(\\geq 0\\) — nerovnice nemůže nemít řešení.`
        },
      ],
      correctAnswer: "B", reward: { xp: 5 }
    },
    {
      id: "q_rov_09", regionId: "rovnice", type: "closed", monsterName: `FW_02I: Kvadratická nerovnice`,
      visual_color: "#f7b84f", visual_symbol: `<0`, points: 3, trainingTasks: ["t_rov_09"],
      question: `Která z následujících nerovnic má v oboru reálných čísel množinu řešení \\(( - 2;\\, 3)\\)?`,
      instruction: `Vyberte správnou nerovnici.`,
      choices: [
        {
          label: `\\((x + 2)(x - 3) > 0\\)`,
          value: "A",
          feedback: `Chyba. Tato nerovnice je kladná vně kořenů: \\(x < -2\\) nebo \\(x > 3\\).`
        },
        {
          label: `\\((x - 2)(x + 3) < 0\\)`,
          value: "B",
          feedback: `Chyba. Kořeny jsou \\(2\\) a \\(-3\\) — řešením je \\((-3;\\, 2)\\), ne \\((-2;\\, 3)\\).`
        },
        {
          label: `\\((x - 2)(x + 3) > 0\\)`,
          value: "C",
          feedback: `Chyba. Záporná část je \\((-3;\\, 2)\\), kladná vně. Záměna kořenů i orientace.`
        },
        {
          label: `\\((x + 2)(x - 3) < 0\\)`,
          value: "D",
          feedback: `Přístup povolen. Kořeny \\(-2\\) a \\(3\\), parabola ∪ — záporná mezi kořeny, tedy \\((-2;\\, 3)\\).`
        },
      ],
      hints: [
        `Interval \\((-2;\\, 3)\\) říká, že výraz je záporný mezi hodnotami \\(-2\\) a \\(3\\). Jaké kořeny musí mít závorky?`,
        `Parabola s kladným koeficientem (∪-tvar) leží pod osou \\(x\\) <b>mezi</b> kořeny. Výraz musí být záporný — jaká nerovnice to vyjadřuje?`,
      ],
      correctAnswer: "D", reward: { xp: 15 }
    },
    {
      id: "t_rov_09", regionId: "rovnice", type: "closed", monsterName: `SIM_02I: Kvadratická nerovnice — znaménkový rozbor`,
      isTraining: true, firewallId: "q_rov_09", visual_color: "#2ecc8a", visual_symbol: `<0`, points: 0,
      question: `Určete množinu řešení nerovnice v oboru reálných čísel:`,
      formula: `$$(x - 1)(x + 2) < 0$$`,
      instruction: `Vyberte správný interval.`,
      steps: [
        {
          trigger: `> Krok 1: Kořeny a tvar paraboly`,
          content: `Jaké jsou nulové body výrazu \\((x-1)(x+2)\\)? Jaký tvar má parabola s kladným vedoucím koeficientem?`
        },
        {
          trigger: `> Krok 2: Kde je výraz záporný?`,
          content: `Parabola ∪ leží pod osou x <b>mezi</b> kořeny. Jaký interval to představuje?`
        },
      ],
      choices: [
        {
          label: `\\(( - \\infty;\\, - 2) \\cup (1;\\, + \\infty)\\)`,
          value: "A",
          feedback: `Chyba orientace. Parabola ∪ je záporná mezi kořeny, ne vně.`
        },
        {
          label: `\\(\\langle - 2;\\, 1\\rangle\\)`,
          value: "B",
          feedback: `Závorky špatně — nerovnice je ostrá, kořeny do řešení nepatří.`
        },
        {
          label: `\\(( - 2;\\, 1)\\)`,
          value: "C",
          feedback: `Logika potvrzena. Teď zkus rozlišit, která ze čtyř nerovnic má jiný interval.`
        },
        {
          label: `\\(( - 1;\\, 2)\\)`,
          value: "D",
          feedback: `Chyba. Záměna kořenů — kořeny jsou \\(-2\\) a \\(1\\), ne \\(-1\\) a \\(2\\).`
        },
      ],
      correctAnswer: "C", reward: { xp: 5 }
    },
    {
      id: "q_rov_10", regionId: "rovnice", type: "closed", monsterName: `FW_02J: Pravdivost tvrzení`,
      visual_color: "#f7b84f", visual_symbol: `A/N`, points: 3, trainingTasks: ["t_rov_10"],
      question: `Která z následujících tvrzení o nerovnicích je pravdivá?`,
      instruction: `Vyberte správné tvrzení.`,
      choices: [
        {
          label: `Množina řešení nerovnice \\((x + 3)^{2} \\geq 0\\) v oboru \\(\\mathbb{R}\\) je celé \\(\\mathbb{R}\\).`,
          value: "A",
          feedback: `Přístup povolen. Čtverec libovolného reálného čísla je vždy nezáporný.`
        },
        {
          label: `Nerovnice \\((x - 1)(1 - x) \\geq 0\\) nemá v \\(\\mathbb{R}\\) žádné řešení.`,
          value: "B",
          feedback: `Chyba. \\((x-1)(1-x) = -(x-1)^2 \\geq 0\\) platí pro \\(x=1\\). Jedno řešení existuje.`
        },
        {
          label: `Nerovnice \\(x^{2} + 2x + 1 < 0\\) má v \\(\\mathbb{R}\\) nekonečně mnoho řešení.`,
          value: "C",
          feedback: `Chyba. \\(x^2+2x+1 = (x+1)^2 \\geq 0\\) vždy — nerovnice nemá žádné řešení.`
        },
        {
          label: `Nerovnice \\(\\frac{1}{x - 4} > 0\\) je splněna pro všechna \\(x \\in \\mathbb{R}\\).`,
          value: "D",
          feedback: `Chyba. Pro \\(x < 4\\) je zlomek záporný. Platí jen pro \\(x > 4\\).`
        },
      ],
      hints: [
        `U každého tvrzení rozmysli: jaký obor hodnot má daný výraz? Co to znamená pro nerovnost?`,
        `Výraz tvaru \\(-(A)^2\\) je vždy nekladný. Může být zároveň \\(\\geq 0\\)?`,
      ],
      correctAnswer: "A", reward: { xp: 15 }
    },
    {
      id: "t_rov_10", regionId: "rovnice", type: "closed", monsterName: `SIM_02J: Čtverec a jeho znaménko`,
      isTraining: true, firewallId: "q_rov_10", visual_color: "#2ecc8a", visual_symbol: `A/N`, points: 0,
      question: `Je nerovnice \\(x^{2} \\geq 0\\) splněna pro všechna reálná čísla?`,
      formula: `$$x^{2} \\geq 0$$`,
      instruction: `Vyberte správnou odpověď.`,
      steps: [
        {
          trigger: `> Krok 1: Co je x²?`,
          content: `Co víš o znaménku druhé mocniny libovolného reálného čísla?`
        },
        {
          trigger: `> Krok 2: Závěr`,
          content: `Existuje reálné číslo, jehož druhá mocnina by byla záporná?`
        },
      ],
      choices: [
        {
          label: `Ano, pro všechna \\(x \\in \\mathbb{R}\\)`,
          value: "A",
          feedback: `Přístup povolen. Teď zkus identifikovat universálně pravdivá tvrzení i pro složitější výrazy.`
        },
        {
          label: `Ne, jen pro \\(x \\geq 0\\)`,
          value: "B",
          feedback: `Chyba. Pro \\(x=-3\\): \\((-3)^2=9>0\\) ✓. Záporná čísla v druhé mocnině jsou kladná.`
        },
        {
          label: `Ne, jen pro \\(x = 0\\)`,
          value: "C",
          feedback: `Chyba. \\(x=0\\) je sice nulový bod, ale nerovnice \\(\\geq 0\\) platí pro všechna reálná \\(x\\).`
        },
        {
          label: `Záleží na hodnotě \\(x\\)`,
          value: "D",
          feedback: `Chyba. \\(x^2\\) je vždy nezáporné — nezáleží na znaménku \\(x\\).`
        },
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },
    {
      id: "q_rov_11", regionId: "rovnice", type: "closed", monsterName: `FW_02K: Nerovnice bez řešení`,
      visual_color: "#f7b84f", visual_symbol: `x=`, points: 5, trainingTasks: ["t_rov_11"],
      question: `Která z následujících nerovnic nemá v oboru \\(\\mathbb{R}\\) žádné řešení?`,
      formula: ``,
      instruction: `Vyberte správnou nerovnici.`,
      choices: [
        {
          label: `\\(x^2 - 6x + 9 \\leq 0\\)`,
          value: "A",
          feedback: `Chyba. \\((x-3)^2 = 0\\) pro \\(x = 3\\) — nerovnost \\(\\leq\\) zahrnuje rovnost, takže řešení existuje.`
        },
        {
          label: `\\(x^2 - 4 < 0\\)`,
          value: "B",
          feedback: `Nekompletní. Pro \\(|x| < 2\\) je \\(x^2 < 4\\), tedy \\(x^2 - 4 < 0\\). Interval \\((-2,\\, 2)\\) je neprázdný.`
        },
        {
          label: `\\(x^2 - 4x + 3 < 0\\)`,
          value: "C",
          feedback: `Nekompletní. Trojčlen \\((x-1)(x-3) < 0\\) pro \\(x \\in (1,\\, 3)\\). Kvadratik může být záporný mezi svými kořeny.`
        },
        {
          label: `\\(x^2 + 2x + 5 < 0\\)`,
          value: "D",
          feedback: `Logika potvrzena. Výraz \\((x+1)^2 + 4 \\geq 4\\) pro všechna \\(x\\), proto nemůže být záporný.`
        },
      ],
      hints: [
        `Rozlišuj ostrou nerovnost (\\(<\\)) od neostré (\\(\\leq\\)). Čtverec může být roven nule.`,
        `Zkus doplnit trojčlen na čtverec plus konstanta. Může být součet čtverce a kladného čísla záporný?`,
      ],
      correctAnswer: "D", reward: { xp: 25 }
    },
    {
      id: "t_rov_11", regionId: "rovnice", type: "closed", monsterName: `SIM_02K: Znaménko kvadratického výrazu`,
      isTraining: true, firewallId: "q_rov_11", visual_color: "#2ecc8a", visual_symbol: `x=`, points: 0,
      question: `Může být výraz \\(x^2 + 4x + 8\\) záporný pro nějaké \\(x \\in \\mathbb{R}\\)?`,
      formula: `$$x^2 + 4x + 8$$`,
      instruction: `Vyberte správnou odpověď.`,
      steps: [
        {
          trigger: `> Krok 1: Doplnění na čtverec`,
          content: `Zapiš \\(x^2 + 4x + 8\\) ve tvaru \\((x + a)^2 + b\\). Jaká čísla \\(a\\) a \\(b\\) vyjdou?`
        },
        {
          trigger: `> Krok 2: Nejmenší hodnota`,
          content: `Čtverec je vždy \\(\\geq 0\\). Jaká je tedy nejmenší možná hodnota celého výrazu?`
        },
      ],
      choices: [
        {
          label: `Ne, výraz je vždy kladný`,
          value: "A",
          feedback: `Přístup povolen. \\((x+2)^2 + 4 \\geq 4 > 0\\) pro všechna \\(x\\).`
        },
        {
          label: `Ano, pro \\(x = -2\\)`,
          value: "B",
          feedback: `Chyba. Dosaď: \\((-2)^2 + 4 \\cdot (-2) + 8 = 4\\). Kladné, ne záporné.`
        },
        {
          label: `Ano, pro \\(x = -4\\)`,
          value: "C",
          feedback: `Chyba. Dosaď: \\((-4)^2 + 4 \\cdot (-4) + 8 = 8\\). Kladné, ne záporné.`
        },
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },
    {
      id: "q_rov_12", regionId: "rovnice", type: "closed", monsterName: `FW_02L: Soustava lineárních nerovnic`,
      visual_color: "#f7b84f", visual_symbol: `x=`, points: 5, trainingTasks: ["t_rov_12"],
      question: `V oboru \\(\\mathbb{R}\\) řešte soustavu nerovnic. Výsledek zapište intervalem.`,
      formula: `$$\\frac{2x + 3}{5} > \\frac{x - 1}{2}$$\n$$4x - 3 \\geq x$$`,
      instruction: `Vyberte správný interval.`,
      choices: [
        {
          label: `\\((1;\\, 11)\\)`,
          value: "A",
          feedback: `Chyba syntaxe. Druhá nerovnice má \\(\\geq\\), takže hranice 1 do intervalu patří — závorka musí být uzavřená.`
        },
        {
          label: `\\(\\langle 1;\\, 11)\\)`,
          value: "B",
          feedback: `Logika potvrzena. Průnik: \\(x \\geq 1\\) a současně \\(x < 11\\).`
        },
        {
          label: `\\(\\langle 1;\\, 11\\rangle\\)`,
          value: "C",
          feedback: `Nekompletní. První nerovnice má \\(>\\), tedy \\(x < 11\\) ostře — hranice 11 do intervalu nepatří.`
        },
        {
          label: `\\((1;\\, 11\\rangle\\)`,
          value: "D",
          feedback: `Kritická chyba. Závorky jsou prohozené — zkontroluj, která nerovnice je ostrá a která ne.`
        },
      ],
      hints: [
        `Ostrá nerovnost (\\(>\\) nebo \\(<\\)) → otevřená závorka. Neostrá (\\(\\geq\\) nebo \\(\\leq\\)) → uzavřená závorka.`,
        `Řeš každou nerovnici zvlášť. Průnik znamená, že obě podmínky musí platit současně.`,
      ],
      correctAnswer: "B", reward: { xp: 25 }
    },
    {
      id: "t_rov_12", regionId: "rovnice", type: "closed", monsterName: `SIM_02L: Průnik dvou nerovností`,
      isTraining: true, firewallId: "q_rov_12", visual_color: "#2ecc8a", visual_symbol: `x=`, points: 0,
      question: `V oboru \\(\\mathbb{R}\\) řešte soustavu nerovnic. Výsledek zapište intervalem.`,
      formula: `$$2x + 1 > 5 \\qquad x \\leq 6$$`,
      instruction: `Vyberte správný interval.`,
      steps: [
        {
          trigger: `> Krok 1: Řešení každé nerovnice`,
          content: `Izoluj \\(x\\) v každé nerovnici zvlášť. Jaké nerovnosti vyjdou? Jsou ostré nebo neostré?`
        },
        {
          trigger: `> Krok 2: Průnik`,
          content: `Obě podmínky musí platit současně. Zakresli si obě řešení na číselnou osu — kde se překrývají?`
        },
      ],
      choices: [
        {
          label: `\\((2;\\, 6\\rangle\\)`,
          value: "A",
          feedback: `Přístup povolen. \\(x > 2\\) (otevřená) a \\(x \\leq 6\\) (uzavřená).`
        },
        {
          label: `\\(\\langle 2;\\, 6\\rangle\\)`,
          value: "B",
          feedback: `Chyba. Nerovnost \\(2x + 1 > 5\\) dává \\(x > 2\\) ostře — 2 do intervalu nepatří.`
        },
        {
          label: `\\((2;\\, 6)\\)`,
          value: "C",
          feedback: `Nekompletní. Nerovnost \\(x \\leq 6\\) zahrnuje rovnost — 6 do intervalu patří.`
        },
        {
          label: `\\(\\langle 2;\\, 6)\\)`,
          value: "D",
          feedback: `Kritická chyba. Závorky jsou prohozené — 2 nepatří (ostrá), 6 patří (neostrá).`
        },
      ],
      correctAnswer: "A", reward: { xp: 5 }
    },
  ]
};
