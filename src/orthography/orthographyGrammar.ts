import { App } from 'obsidian';
import { OrthographySettings } from 'src/settings';

export class OrthographyGrammar {
  private app: App;
  private settings: OrthographySettings;

  constructor(app: App, settings: OrthographySettings) {
    this.app = app;
    this.settings = settings;
  }

  public init(): void {
    this.createBar();
  }

  public destroy(): void {
    const minicards = document.querySelectorAll('.orthography-grammar-item');
    minicards.forEach(mc => mc.removeEventListener('click', this.toggleCard));
  }

  private createBar() {
    const grammar = document.createElement('div');
    grammar.classList.add('orthography-grammar');
    const bar: any = data.map(el => {
      return `
        <div class="orthography-grammar-item ${el.impact}">
          <div class="orthography-grammar-minicard">
            <div>${el.highlightText || ''}</div>
            <div>${el.minicardTitle || ''}</div>
            <div class="orthography-grammar-arrows">
              <svg width="10" viewBox="0 0 10 10" class="_05a56408-icon-holder"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
              <svg width="10" viewBox="0 0 10 10" class="_05a56408-icon-holder"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
            </div>
          </div>
          <div class="orthography-grammar-card">
            <div>${el.cardLayout.group || ''}</div>
            <div>
              <span>${el.highlightText || ''}</span>
              <span>${el.replacements[0] || ''}</span>
            </div>
            <div>${el.explanation || ''}</div>
          </div>
        </div>
      `;
    }).join('');
    console.log(data);
    grammar.innerHTML = bar;
    document.body.appendChild(grammar);
    const minicards = document.querySelectorAll('.orthography-grammar-item');
    minicards.forEach(mc => mc.addEventListener('click', this.toggleCard));
  }

  private toggleCard(e: any): void {
    if (e.currentTarget.className.contains('orthography-grammar-item--opened')) {
      e.currentTarget.classList.remove('orthography-grammar-item--opened');
    } else {
      e.currentTarget.classList.add('orthography-grammar-item--opened');
    }
  }
}

const data = [
  {
  "point": "General",
  "transforms": [
    "<span class='gr_grammar_del'>Mispellings</span><span class='gr_grammar_ins'>Misspellings</span>"
  ],
  "title": "Misspelled word: <i>Mispellings</i>",
  "minicardTitle": "Correct your spelling",
  "result": "",
  "details": "",
  "explanation": "<p>The word <b>Mispellings</b> is not in our dictionary. If you’re sure this spelling is correct, you can add it to your personal dictionary to prevent future alerts.\n",
  "examples": "",
  "todo": "correct your spelling",
  "handbookLink": "",
  "sentence_no": 0,
  "free": true,
  "category": "Misspelled",
  "pid": 893584,
  "rid": 893584,
  "sid": 8030928,
  "begin": 0,
  "end": 11,
  "text": "Mispellings",
  "group": "Spelling",
  "pname": "Spelling/Misspelled/General/Names",
  "rev": 0,
  "highlightBegin": 0,
  "highlightEnd": 11,
  "highlightText": "Mispellings",
  "replacements": [
    "Misspellings"
  ],
  "transformJson": {
    "context": {
      "s": 0,
      "e": 11
    },
    "highlights": [{
      "s": 0,
      "e": 11
    }],
    "alternatives": [{
      "ops": [{
        "insert": "Misspellings",
        "attributes": {
          "type": "main"
        }
      },
      {
        "delete": 11,
        "attributes": {
          "type": "main"
        }
      }
      ]
    }]
  },
  "impact": "critical",
  "extra_properties": {
    "j": "0.9958273310403456",
    "bulk_acceptable": "true",
    "priority": "1",
    "add_to_dict": "true"
  },
  "cardLayout": {
    "category": "General",
    "group": "Spelling",
    "groupDescription": "Corrects misspellings, misused words, and capitalization",
    "rank": 10,
    "outcome": "Correctness",
    "outcomeDescription": "Corrects misspellings, grammatical errors, missing and misused punctuation. Checks for natural phrasing and good word choice.",
    "outcomeRank": 10,
    "bundle": "Fix spelling and grammar",
    "bundleRank": 10
  },
  "categoryHuman": "Misspelled words",
  "cost": 1,
  "view": "priority",
  "inline": "inline",
  "action": "alert",
  "id": 7
},
{
  "point": "CommaInCompObj",
  "transforms": [
    "commas<span class='gr_grammar_del'>,</span>"
  ],
  "title": "Incorrect use of comma",
  "minicardTitle": "Remove the comma",
  "result": "",
  "details": "<p>A compound object consists of two or more objects. Commas separate the objects when there are three or more. A compound object with only two items requires no punctuation to separate them.\n",
  "explanation": "<p>It appears that you have an unnecessary comma in a compound object. Consider removing it.\n",
  "examples": "<p><span class=\"red\">Incorrect: Sophie adopted a kitten, and a puppy.</span><br/><span class=\"green\">Correct: Sophie adopted a kitten and a puppy.</span><br/><p><span class=\"red\">Incorrect: The repairman fixed the dishwasher, and the garbage disposal.</span><br/><span class=\"green\">Correct: The repairman fixed the dishwasher and the garbage disposal.</span><br/>",
  "todo": "remove the comma",
  "handbookLink": "",
  "sentence_no": 0,
  "free": true,
  "category": "BasicPunct",
  "pid": 1176791,
  "rid": 1176791,
  "sid": 8030928,
  "begin": 96,
  "end": 97,
  "text": ",",
  "group": "Punctuation",
  "pname": "Punctuation/BasicPunct/CommaInCompObj/NPCCNP",
  "phash": "F8A842B8A25E0529CEE6AC05F5CF6AE9",
  "pversion": "1.0.11509",
  "rev": 0,
  "highlightBegin": 90,
  "highlightEnd": 97,
  "highlightText": "commas,",
  "replacements": [
    ""
  ],
  "transformJson": {
    "context": {
      "s": 78,
      "e": 107
    },
    "highlights": [{
      "s": 12,
      "e": 19
    }],
    "alternatives": [{
      "ops": [{
        "retain": 12
      },
      {
        "retain": 6,
        "attributes": {
          "type": "important"
        }
      },
      {
        "delete": 1,
        "attributes": {
          "type": "main"
        }
      }
      ]
    }]
  },
  "impact": "critical",
  "extra_properties": {
    "priority": "2",
    "j": "0.7200859920988991"
  },
  "cardLayout": {
    "category": "General",
    "group": "Punctuation",
    "groupDescription": "Corrects missing and misused punctuation",
    "rank": 30,
    "outcome": "Correctness",
    "outcomeDescription": "Corrects misspellings, grammatical errors, missing and misused punctuation. Checks for natural phrasing and good word choice.",
    "outcomeRank": 10,
    "bundle": "Fix spelling and grammar",
    "bundleRank": 10
  },
  "categoryHuman": "Comma misuse within clauses",
  "cost": 1,
  "view": "priority",
  "inline": "inline",
  "action": "alert",
  "id": 8
},
{
  "point": "RedundantSpaceBeforePunct",
  "transforms": [
    "punctuation<span class='gr_grammar_del'> </span>."
  ],
  "title": "Incorrect spacing with punctuation",
  "minicardTitle": "Remove a space",
  "result": "",
  "details": "<p>Commas, periods, colons, semicolons, exclamation points, and question marks directly follow the word before them — without a space. They are all followed by a single space before the next word. Parentheses and quotation marks come in pairs. The beginning mark has a space before it and no space between the mark and the following word. The end mark directly follows the word before it and has a space afterward.\n",
  "explanation": "<p>It appears that you have improperly spaced some punctuation. Consider removing a space.\n",
  "examples": "<p><span class=\"green\">Correct: “No,” said Joe, “I did not take out the trash.”</span><br/><span class=\"green\">Correct: I can’t believe she said that, can you?</span><br/><span class=\"green\">Correct: Wow! That was unexpected!</span><br/><span class=\"green\">Correct: She asked, “What time is it?”</span><br/><span class=\"green\">Correct: I like school; my favorite subject is math.</span><br/><span class=\"green\">Correct: Two of my friends (Matt and Eric) will be there.</span><br/>",
  "todo": "remove a space",
  "handbookLink": "",
  "sentence_no": 0,
  "free": true,
  "category": "Formatting",
  "pid": 1126125,
  "rid": 1126125,
  "sid": 8030928,
  "begin": 128,
  "end": 129,
  "text": " ",
  "group": "Style",
  "pname": "Style/Formatting/RedundantSpaceBeforePunct/BeforePunct",
  "phash": "3ABCAD217FFF83C81411E3E82A0098D6",
  "pversion": "1.0.11509",
  "rev": 0,
  "highlightBegin": 117,
  "highlightEnd": 130,
  "highlightText": "punctuation .",
  "replacements": [
    ""
  ],
  "transformJson": {
    "context": {
      "s": 108,
      "e": 130
    },
    "highlights": [{
      "s": 9,
      "e": 22
    }],
    "alternatives": [{
      "ops": [{
        "retain": 9
      },
      {
        "retain": 11,
        "attributes": {
          "type": "important"
        }
      },
      {
        "delete": 1,
        "attributes": {
          "type": "main"
        }
      },
      {
        "retain": 1,
        "attributes": {
          "type": "important"
        }
      }
      ]
    }]
  },
  "impact": "critical",
  "extra_properties": {
    "priority": "2"
  },
  "cardLayout": {
    "category": "General",
    "group": "Conventions",
    "groupDescription": "Checks spacing, capitalization, and dialect-specific spelling",
    "rank": 50,
    "outcome": "Correctness",
    "outcomeDescription": "Corrects misspellings, grammatical errors, missing and misused punctuation. Checks for natural phrasing and good word choice.",
    "outcomeRank": 10,
    "bundle": "Keep your style consistent",
    "bundleRank": 100
  },
  "categoryHuman": "Improper formatting",
  "cost": 1,
  "view": "priority",
  "inline": "inline",
  "action": "alert",
  "id": 9
},
{
  "point": "NotOnlyMissingButAlso",
  "transforms": [
    ", <span class='gr_grammar_ins'>but</span>"
  ],
  "title": "Missing <i>but also</i> with <i>not only</i>",
  "minicardTitle": "Add the word(s)",
  "result": "",
  "details": "<p>When you use <b>not only</b> to start a phrase or clause, a matching phrase or clause that starts with <b>but also</b> is needed. Both halves of this construction must have parallel structures. If <b>not only</b> is followed by a prepositional phrase, <b>but also</b> must start a prepositional phrase.\n",
  "explanation": "<p>The sentence is missing part of the <b>not only ... but also</b> construction. Consider adding the missing word(s).\n",
  "examples": "<p><span class=\"red\">Incorrect: He is <b>not only</b> a talented writer, also a skilled actor.</span><br/><span class=\"green\">Correct: He is <b>not only</b> a talented writer, <b>but also</b> a skilled actor.</span><br/><p><span class=\"red\">Incorrect: Alice <b>not only</b> loves to sing, does it regularly.</span><br/><span class=\"green\">Correct: Alice <b>not only</b> loves to sing, <b>but also</b> does it regularly.</span><br/><p><span class=\"red\">Incorrect: <b>Not only</b> does Will grow tomatoes, he sells them at the farmers’ market.</span><br/><span class=\"green\">Correct: <b>Not only</b> does Will grow tomatoes, <b>but he also</b> sells them at the farmers’ market.</span><br/>",
  "todo": "add the word(s)",
  "handbookLink": "",
  "sentence_no": 0,
  "free": true,
  "category": "Conjunctions",
  "pid": 1185749,
  "rid": 1185749,
  "sid": 8030928,
  "begin": 185,
  "end": 185,
  "text": "",
  "group": "Grammar",
  "pname": "Grammar/Conjunctions/NotOnlyMissingButAlso/Case1",
  "phash": "792164CC96C76C3B2937D53A133AE554",
  "pversion": "1.0.11509",
  "rev": 0,
  "highlightBegin": 184,
  "highlightEnd": 185,
  "highlightText": ",",
  "replacements": [
    " but"
  ],
  "transformJson": {
    "context": {
      "s": 178,
      "e": 193
    },
    "highlights": [{
      "s": 6,
      "e": 7
    }],
    "alternatives": [{
      "ops": [{
        "retain": 6
      },
      {
        "retain": 1,
        "attributes": {
          "type": "important"
        }
      },
      {
        "insert": " "
      },
      {
        "insert": "but",
        "attributes": {
          "type": "main"
        }
      }
      ]
    }]
  },
  "impact": "critical",
  "extra_properties": {
    "priority": "2",
    "j": "0.3240932863624943"
  },
  "cardLayout": {
    "category": "General",
    "group": "Grammar",
    "groupDescription": "Corrects grammatical errors",
    "rank": 20,
    "outcome": "Correctness",
    "outcomeDescription": "Corrects misspellings, grammatical errors, missing and misused punctuation. Checks for natural phrasing and good word choice.",
    "outcomeRank": 10,
    "bundle": "Fix spelling and grammar",
    "bundleRank": 10
  },
  "categoryHuman": "Conjunction use",
  "cost": 1,
  "view": "priority",
  "inline": "inline",
  "action": "alert",
  "id": 10
},
{
  "point": "WithNonInf",
  "transforms": [
    "<span class='gr_grammar_del'>showed</span>→<span class='gr_grammar_ins'>show</span>"
  ],
  "title": "Incorrect verb form after modal",
  "minicardTitle": "Change the verb form",
  "result": "",
  "details": "<p>Modal verbs (such as <i>can</i>, <i>may</i>, <i>should</i>, and <i>will</i>) are auxiliary verbs used to express possibility, probability, or necessity. In the simple active past, present, and future tenses, these verbs are followed by the root (bare infinitive) form of verb. The passive construction for the simple tense is: modal + form of be + past participle.\n",
  "explanation": "<p>The verb <b>showed</b> after the modal verb <b>will</b> does not appear to be in the correct form. Consider changing the verb form.\n",
  "examples": "<p><span class=\"red\">Incorrect: Peter <b>can sings</b> in the shower.</span><br/><span class=\"green\">Correct: Peter <b>can sing</b> in the shower.</span><br/><span class=\"green\">Correct: The song <b>can be sung</b> in the shower by Peter. (passive)</span><br/><p><span class=\"red\">Incorrect: <b>Could</b> I <b>borrowed</b> a cup of sugar?</span><br/><span class=\"green\">Correct: <b>Could</b> I <b>borrow</b> a cup of sugar?</span><br/>",
  "todo": "change the verb form",
  "handbookLink": "",
  "sentence_no": 0,
  "free": true,
  "category": "Modals",
  "pid": 840465,
  "rid": 840465,
  "sid": 8030928,
  "begin": 199,
  "end": 205,
  "text": "showed",
  "group": "Grammar",
  "pname": "Grammar/Modals/WithNonInf/ModalVerbPlusNotRootWord",
  "phash": "2CFF0574B813314B08AF3D542A71F4A9",
  "pversion": "1.0.11509",
  "rev": 0,
  "highlightBegin": 199,
  "highlightEnd": 205,
  "highlightText": "showed",
  "replacements": [
    "show"
  ],
  "transformJson": {
    "context": {
      "s": 189,
      "e": 213
    },
    "highlights": [{
      "s": 10,
      "e": 16
    }],
    "alternatives": [{
      "ops": [{
        "retain": 10
      },
      {
        "delete": 6,
        "attributes": {
          "type": "main"
        }
      },
      {
        "insert": "show",
        "attributes": {
          "type": "main"
        }
      }
      ]
    }]
  },
  "impact": "critical",
  "extra_properties": {
    "priority": "2",
    "j": "0.703052271632845"
  },
  "cardLayout": {
    "category": "General",
    "group": "Grammar",
    "groupDescription": "Corrects grammatical errors",
    "rank": 20,
    "outcome": "Correctness",
    "outcomeDescription": "Corrects misspellings, grammatical errors, missing and misused punctuation. Checks for natural phrasing and good word choice.",
    "outcomeRank": 10,
    "bundle": "Fix spelling and grammar",
    "bundleRank": 10
  },
  "categoryHuman": "Modal verbs",
  "cost": 1,
  "view": "priority",
  "inline": "inline",
  "action": "alert",
  "id": 11
},
{
  "hidden": true,
  "category": "Colloquial",
  "pid": 909130,
  "rid": 909130,
  "sid": 8030928,
  "begin": 214,
  "end": 245,
  "text": "to correctly write the sentence",
  "group": "Style",
  "pname": "Style/Colloquial/SplitInfinitive/SplitInf",
  "phash": "BA92B99F0B638812D6216E481F4A4076",
  "pversion": "1.0.11509",
  "rev": 0,
  "highlightBegin": 214,
  "highlightEnd": 245,
  "highlightText": "to correctly write the sentence",
  "replacements": '',
  "transformJson": {
    "context": {
      "s": 206,
      "e": 246
    },
    "highlights": [{
      "s": 8,
      "e": 39
    }]
  },
  "impact": "advanced",
  "extra_properties": {},
  "cardLayout": {
    "category": "General",
    "group": "Formality",
    "groupDescription": "Checks for appropriate formality level",
    "rank": 70,
    "outcome": "Tone",
    "outcomeDescription": "Offers polite, inclusive, and confident ways to rephrase language and checks for appropriate formality level.",
    "outcomeRank": 40,
    "bundle": "Check your tone",
    "bundleRank": 60,
    "userMuteCategory": "SplitInfinitive",
    "userMuteCategoryDescription": "Split infinitives"
  },
  "categoryHuman": "Inappropriate colloquialisms",
  "cost": 1,
  "view": "priority",
  "inline": "not_inline",
  "action": "alert",
  "id": 12
},
{
  "point": "General",
  "transforms": [
    "<span class='gr_grammar_del'>effect</span><span class='gr_grammar_ins'>affect</span>"
  ],
  "title": "Possibly confused word",
  "minicardTitle": "Correct your spelling",
  "result": "",
  "details": "",
  "explanation": "<p>The word <b>effect</b> doesn’t seem to fit this context. Consider replacing it with a different one.\n",
  "examples": "<p><span class=\"red\">Incorrect: Jordan doesn’t remember <b>were</b> he parked his car.</span><br/><span class=\"green\">Correct: Jordan doesn’t remember <b>where</b> he parked his car.</span><br/><p><span class=\"red\">Incorrect: Which sign is usually <b>paced</b> on street corners to warn you of cross traffic?</span><br/><span class=\"green\">Correct: Which sign is usually <b>placed</b> on street corners to warn you of cross traffic?</span><br/>",
  "todo": "correct your spelling",
  "handbookLink": "",
  "sentence_no": 0,
  "free": true,
  "category": "AccidentallyConfused",
  "pid": 643814,
  "rid": 643814,
  "sid": 8030928,
  "begin": 39,
  "end": 45,
  "text": "effect",
  "group": "Spelling",
  "pname": "Spelling/AccidentallyConfused/General",
  "rev": 0,
  "highlightBegin": 39,
  "highlightEnd": 45,
  "highlightText": "effect",
  "replacements": [
    "affect"
  ],
  "transformJson": {
    "context": {
      "s": 39,
      "e": 45
    },
    "highlights": [{
      "s": 0,
      "e": 6
    }],
    "alternatives": [{
      "ops": [{
        "insert": "affect",
        "attributes": {
          "type": "main"
        }
      },
      {
        "delete": 6,
        "attributes": {
          "type": "main"
        }
      }
      ]
    }]
  },
  "impact": "critical",
  "extra_properties": {
    "j": "0.9982322575068565",
    "bulk_acceptable": "true",
    "priority": "1"
  },
  "cardLayout": {
    "category": "General",
    "group": "Spelling",
    "groupDescription": "Corrects misspellings, misused words, and capitalization",
    "rank": 10,
    "outcome": "Correctness",
    "outcomeDescription": "Corrects misspellings, grammatical errors, missing and misused punctuation. Checks for natural phrasing and good word choice.",
    "outcomeRank": 10,
    "bundle": "Fix spelling and grammar",
    "bundleRank": 10
  },
  "categoryHuman": "Confused words",
  "cost": 1,
  "view": "priority",
  "inline": "inline",
  "action": "alert",
  "id": 6
}
];