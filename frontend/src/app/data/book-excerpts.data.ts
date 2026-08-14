export interface BookExcerpt {
  book_id: string;
  pages: {
    page_number: number;
    title: string;
    hindi_title?: string;
    content: string[];
    hindi_content?: string[];
  }[];
}

export const BOOK_EXCERPTS: Record<string, BookExcerpt> = {
  'master-key-system': {
    book_id: 'master-key-system',
    pages: [
      {
        page_number: 1,
        title: 'Part One: The World Within',
        hindi_title: 'भाग एक: आंतरिक दुनिया',
        content: [
          'That much which has been gathered in the world outside is the result of the world within.',
          'The world within is governed by mind. When we discover this world we shall find the solution for every problem, the cause for every effect.',
          'The world within is the practical world in which the men of power generate courage, hope, enthusiasm, confidence, trust and faith, by which they are given the fine vision to see the vision and the practical skill to make the vision real.',
          'Life is an unfoldment, not an accretion. What comes to us in the world outside is what we already possess in the world within.'
        ],
        hindi_content: [
          'बाहरी दुनिया में जो कुछ भी इकट्ठा किया गया है, वह हमारी आंतरिक दुनिया का ही परिणाम है।',
          'आंतरिक दुनिया मन द्वारा संचालित होती है। जब हम इस दुनिया की खोज करते हैं, तो हम हर समस्या का समाधान और हर प्रभाव का कारण पाते हैं।',
          'आंतरिक दुनिया वह व्यावहारिक दुनिया है जिसमें शक्तिशाली लोग साहस, आशा, उत्साह, आत्मविश्वास और विश्वास उत्पन्न करते हैं।',
          'जीवन एक प्रकटन (unfoldment) है, संचय नहीं। बाहरी दुनिया में हमें वही मिलता है जो हमारे पास पहले से ही आंतरिक दुनिया में मौजूद है।'
        ]
      },
      {
        page_number: 2,
        title: 'The Harmony of Mind Power',
        hindi_title: 'मानसिक शक्ति का सामंजस्य',
        content: [
          'All possession is based on consciousness. All gain is the result of an accumulative consciousness. All loss is the result of a scattered consciousness.',
          'Mind is creative, and conditions, environment and all experiences in life are the result of our habitual or predominant mental attitude.',
          'The attitude of mind necessarily depends upon what we think. Therefore, the secret of all power, all achievement and all possession depends upon our method of thinking.',
          'This is true because we must "be" before we can "do," and we can "do" only to the extent which we "are," and what we "are" depends upon what we "think."'
        ],
        hindi_content: [
          'सभी संपत्तियां चेतना पर आधारित हैं। सभी लाभ संचित चेतना का परिणाम हैं। सभी नुकसान बिखरी हुई चेतना का परिणाम हैं।',
          'मन रचनात्मक है, और जीवन की सभी परिस्थितियां, पर्यावरण और अनुभव हमारी मानसिक अभिवृत्ति का परिणाम हैं।',
          'मन का दृष्टिकोण इस बात पर निर्भर करता है कि हम क्या सोचते हैं। इसलिए, सभी शक्ति, उपलब्धि और स्वामित्व का रहस्य हमारी सोच की पद्धति पर निर्भर करता है।',
          'यह सच है क्योंकि कुछ "करने" से पहले हमें कुछ "होना" होगा, और हम केवल उसी सीमा तक "कर" सकते हैं जितना हम "हैं"।'
        ]
      },
      {
        page_number: 3,
        title: 'Subconscious Priming & Master Key',
        hindi_title: 'अवचेतन प्राइमिंग और मास्टर की',
        content: [
          'We cannot express powers which we do not possess. The only way by which we may secure possession of power is to become conscious of power.',
          'There is a world within — a world of thought and feeling and power; of light and life and beauty, and though invisible, its forces are mighty.',
          'The world within is governed by mind. When we discover this world we shall find the solution for every problem, the cause for every effect.',
          'Harmony in the world within will be reflected in the world outside by harmonious conditions, agreeable surroundings, the best of everything.'
        ],
        hindi_content: [
          'हम उन शक्तियों को व्यक्त नहीं कर सकते जो हमारे पास नहीं हैं। शक्ति प्राप्त करने का एकमात्र तरीका शक्ति के प्रति जागरूक होना है।',
          'भीतर एक दुनिया है — विचारों, भावनाओं और शक्तियों की दुनिया; प्रकाश, जीवन और सुंदरता की दुनिया। यद्यपि यह अदृश्य है, इसकी ताकतें महान हैं।',
          'आंतरिक दुनिया सामंजस्य स्थापित करती है, जो बाहरी दुनिया में सकारात्मक परिस्थितियों और सुखद वातावरण के रूप में दिखाई देती है।',
          'जब आप अपने आंतरिक विचारों को बदलते हैं, तो बाहरी दुनिया स्वतः बदलने लगती है।'
        ]
      }
    ]
  },
  'think-and-grow-rich': {
    book_id: 'think-and-grow-rich',
    pages: [
      {
        page_number: 1,
        title: 'Chapter 1: Thoughts Are Things',
        hindi_title: 'अध्याय १: विचार ही वस्तुएं हैं',
        content: [
          'TRULY, "thoughts are things," and powerful things at that, when they are mixed with definiteness of purpose, persistence, and a BURNING DESIRE for their translation into riches, or other material objects.',
          'Some years ago Edwin C. Barnes discovered how true it is that men really THINK AND GROW RICH. His discovery did not come about at one sitting. It came by little by little, beginning with a BURNING DESIRE to become a business associate of the great Thomas A. Edison.',
          'One of the chief causes of failure is the habit of quitting when one is overtaken by temporary defeat.',
          'Before success comes in any man\'s life, he is sure to meet with much temporary defeat, and, perhaps, some failure.'
        ],
        hindi_content: [
          'वास्तव में, "विचार ही वस्तुएं हैं," और बहुत शक्तिशाली वस्तुएं हैं, जब उन्हें स्पष्ट उद्देश्य, दृढ़ता और ज्वलंत इच्छाशक्ति (Burning Desire) के साथ मिलाया जाता है।',
          'कुछ साल पहले एडविन सी. बार्न्स ने खोजा कि इंसान सचमुच "सोचकर अमीर" बन सकता है। उनकी यह खोज एक दिन में नहीं हुई, बल्कि महान थॉमस एडिसन का साझेदार बनने की तीव्र इच्छा से शुरू हुई।',
          'असफलता का एक प्रमुख कारण अस्थायी हार से घबराकर प्रयास छोड़ देना है।',
          'सफलता मिलने से पहले, हर व्यक्ति को कई अस्थायी हारों का सामना करना पड़ता है।'
        ]
      },
      {
        page_number: 2,
        title: 'The Burning Desire Principle',
        hindi_title: 'ज्वलंत इच्छाशक्ति का सिद्धांत',
        content: [
          'When Barnes entered the office of Edison, he looked like an ordinary tramp, but his THOUGHTS were those of a king!',
          'He knew that if he possessed a burning desire to partner with Edison, he would eventually achieve his goal.',
          'Opportunity has a sly habit of slipping in by the back door, and often it comes disguised in the form of misfortune, or temporary defeat.',
          'Whatever the mind of man can conceive and believe, it can achieve.'
        ],
        hindi_content: [
          'जब बार्न्स ने एडिसन के कार्यालय में प्रवेश किया, तो वह एक साधारण व्यक्ति दिख रहा था, लेकिन उसके विचार किसी राजा की तरह थे!',
          'वह जानता था कि यदि उसके पास एडिसन के साथ साझेदारी करने की तीव्र इच्छा है, तो वह अंततः अपने लक्ष्य को प्राप्त कर लेगा।',
          'अवसर अक्सर पिछले दरवाजे से चुपचाप आता है, और कई बार यह दुर्भाग्य या अस्थायी विफलता के रूप में छिपा होता है।',
          'मनुष्य का मस्तिष्क जिस बात की कल्पना कर सकता है और विश्वास कर सकता है, उसे वह प्राप्त भी कर सकता है।'
        ]
      }
    ]
  },
  'science-getting-rich': {
    book_id: 'science-getting-rich',
    pages: [
      {
        page_number: 1,
        title: 'Chapter 1: The Right to Be Rich',
        hindi_title: 'अध्याय १: अमीर बनने का अधिकार',
        content: [
          'Whatever may be said in praise of poverty, the fact remains that it is not possible to live a really complete or successful life unless one is rich.',
          'No man can rise to his greatest possible height in talent or soul development unless he has plenty of money; for to unfold the soul and to develop talent he must have many things to use, and he cannot have these things unless he has money to buy them with.',
          'Man develops in mind, soul, and body by making use of things, and society is so organized that man must have money in order to become the possessor of things.',
          'Therefore, the basis of all advancement for man must be the science of getting rich.'
        ],
        hindi_content: [
          'गरीबी की प्रशंसा में चाहे कुछ भी कहा जाए, तथ्य यह है कि जब तक व्यक्ति अमीर नहीं होता, तब तक वास्तव में पूर्ण या सफल जीवन जीना संभव नहीं है।',
          'कोई भी व्यक्ति तब तक अपनी प्रतिभा या आत्मा के उच्चतम शिखर तक नहीं पहुँच सकता जब तक कि उसके पास पर्याप्त धन न हो।',
          'मनुष्य वस्तुओं का उपयोग करके मन, आत्मा और शरीर में विकसित होता है, और समाज इस तरह से व्यवस्थित है कि वस्तुओं का स्वामी बनने के लिए धन होना आवश्यक है।',
          'इसलिए, मनुष्य की सभी प्रगति का आधार अमीर बनने का विज्ञान होना चाहिए।'
        ]
      }
    ]
  },
  'as-a-man-thinketh': {
    book_id: 'as-a-man-thinketh',
    pages: [
      {
        page_number: 1,
        title: 'Chapter 1: Thought and Character',
        hindi_title: 'अध्याय १: विचार और चरित्र',
        content: [
          'The aphorism, "As a man thinketh in his heart so is he," not only embraces the whole of a man\'s being, but is so comprehensive as to reach out to every condition and circumstance of his life.',
          'A man is literally what he thinks, his character being the complete sum of all his thoughts.',
          'As the plant springs from, and could not be without, the seed, so every act of a man springs from the hidden seeds of thought, and could not have appeared without them.',
          'Act is the blossom of thought, and joy and suffering are its fruits; thus does a man garner in the sweet and bitter fruitage of his own husbandry.'
        ],
        hindi_content: [
          'सूक्ति, "जैसा मनुष्य अपने हृदय में सोचता है, वैसा ही वह होता है," न केवल मनुष्य के अस्तित्व को समेटती है, बल्कि उसके जीवन की हर परिस्थिति तक पहुँचती है।',
          'मनुष्य वास्तव में वही है जो वह सोचता है; उसका चरित्र उसके सभी विचारों का कुल योग है।',
          'जैसे पौधा बीज के बिना नहीं उग सकता, वैसे ही मनुष्य का हर कार्य विचार के छिपे हुए बीजों से निकलता है।',
          'कार्य विचार का फूल है, और सुख-दुख इसके फल हैं।'
        ]
      }
    ]
  },
  'power-subconscious-mind': {
    book_id: 'power-subconscious-mind',
    pages: [
      {
        page_number: 1,
        title: 'Chapter 1: The Treasure House Within You',
        hindi_title: 'अध्याय १: आपके भीतर खजाने का घर',
        content: [
          'Infinite riches are all around you if you will open your mental eyes and behold the treasure house of infinity within you.',
          'There is a gold mine within you from which you can extract everything you need to live life gloriously, joyously, and abundantly.',
          'Many are sound asleep because they do not know of this gold mine of infinite intelligence and boundless love within themselves.',
          'Whatever you want, you can draw forth. A magnetized piece of steel will lift twelve times its own weight, but demagnetize it, and it will not lift even a feather.'
        ],
        hindi_content: [
          'यदि आप अपनी मानसिक आँखें खोलें और अपने भीतर के अनन्त खजाने को देखें, तो आपके चारों ओर असीम धन बिखरा पड़ा है।',
          'आपके भीतर सोने की एक खान है जिससे आप जीवन को भव्यता, खुशी और प्रचुरता के साथ जीने के लिए आवश्यक सब कुछ निकाल सकते हैं।',
          'कई लोग सो रहे हैं क्योंकि वे अपने भीतर की इस असीम बुद्धिमत्ता और अगाध प्रेम की सोने की खान को नहीं जानते।',
          'आप जो कुछ भी चाहते हैं, उसे आकर्षित कर सकते हैं।'
        ]
      }
    ]
  }
};
