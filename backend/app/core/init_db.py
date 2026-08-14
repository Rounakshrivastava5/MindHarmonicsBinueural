from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.genre import Genre
from app.models.binaural_preset import BinauralPreset
from app.core.database import engine, Base

DEFAULT_GENRES = [
    {
        "slug": "wealth-success",
        "title": "Wealth & Success",
        "hindi_title": "धन एवं समृद्धि",
        "description": "Reprogram your mind for financial abundance, prosperous opportunities, and unshakeable entrepreneurial confidence.",
        "hindi_description": "अपने अवचेतन मन को असीमित धन, प्रचुरता और व्यावसायिक सफलता के लिए रीप्रोग्राम करें।",
        "icon": "banknotes",
        "gradient": "linear-gradient(135deg, #059669, #10b981)",
        "default_affirmations": [
            "Money flows to me naturally and continuously from multiple sources.",
            "I am aligned with the energy of limitless abundance and prosperity.",
            "Every action I take creates massive value and attraction for wealth.",
            "I welcome financial freedom and make wise, lucrative decisions."
        ],
        "hindi_affirmations": [
            "धन मेरे जीवन में सहज और निरंतर रूप से बहता है।",
            "मैं असीमित समृद्धि और प्रचुरता की ऊर्जा से जुड़ा हुआ हूँ।",
            "मेरा हर विचार और कदम धन और सफलता को आकर्षित करता है।",
            "मैं वित्तीय स्वतंत्रता का तहे दिल से स्वागत करता हूँ।"
        ]
    },
    {
        "slug": "height-growth",
        "title": "Height Growth & Posture",
        "hindi_title": "लंबाई वृद्धि और शारीरिक संतुलन",
        "description": "Subliminal alignment for spine decompression, growth hormone stimulation, and upright physical stature.",
        "hindi_description": "रीढ़ की हड्डी के खिंचाव, विकास हार्मोन प्रोत्साहन और उत्तम शारीरिक मुद्रा के लिए उच्च आवृत्ति संदेश।",
        "icon": "arrow-up-right",
        "gradient": "linear-gradient(135deg, #2563eb, #3b82f6)",
        "default_affirmations": [
            "My spine is lengthening, decompressing, and standing perfectly tall.",
            "My body releases natural growth factors and maintains optimal posture.",
            "I radiate tall, confident, and powerful physical presence.",
            "Every cell in my spine and cartilage stretches into peak alignment."
        ],
        "hindi_affirmations": [
            "मेरी रीढ़ की हड्डी सीधी, मजबूत और प्राकृतिक रूप से लंबी हो रही है।",
            "मेरा शरीर आवश्यक विकास कारक और ग्रोथ हार्मोन जारी करता है।",
            "मुझसे आत्मविश्वास और आकर्षक व्यक्तित्व झलकती है।",
            "मेरी मांसपेशियाँ और उपास्थि सही संतुलन में विकसित हो रही हैं।"
        ]
    },
    {
        "slug": "deep-sleep",
        "title": "Deep Sleep & Rest",
        "hindi_title": "गहरी नींद और विश्राम",
        "description": "Soften your central nervous system for effortless delta wave rejuvenation and restful cellular healing.",
        "hindi_description": "डेल्टा तरंगों द्वारा शरीर को शांत करें और गहरी, आरामदायक नींद प्राप्त करें।",
        "icon": "moon",
        "gradient": "linear-gradient(135deg, #4f46e5, #6366f1)",
        "default_affirmations": [
            "My body relaxes completely as I release all thoughts of the day.",
            "I drift into deep, restorative, uninterrupted sleep.",
            "My mind is peaceful, calm, and wrapped in gentle serenity.",
            "I wake up refreshed, renewed, and overflowing with vital energy."
        ],
        "hindi_affirmations": [
            "मेरा शरीर और मन पूरी तरह से शांत और तनावमुक्त है।",
            "मैं गहरी, आरामदायक और शांतिपूर्ण नींद में जा रहा हूँ।",
            "मेरा मन शांत और विचारों से मुक्त है।",
            "सुबह उठकर मैं तरोताजा और अत्यधिक ऊर्जावान महसूस करूँगा।"
        ]
    },
    {
        "slug": "self-love",
        "title": "Self-Love & Radiance",
        "hindi_title": "आत्म-प्रेम और आंतरिक शांति",
        "description": "Cultivate unconditional self-worth, emotional resilience, magnetic charisma, and inner peace.",
        "hindi_description": "सच्चे आत्मविश्वास, भावनात्मक मजबूती, और सकारात्मक आकर्षण का निर्माण करें।",
        "icon": "heart",
        "gradient": "linear-gradient(135deg, #ec4899, #f43f5e)",
        "default_affirmations": [
            "I honor, respect, and love myself unconditionally every single day.",
            "I am completely worthy of love, happiness, and profound respect.",
            "My inner radiance and kindness illuminate every space I enter.",
            "I forgive myself completely and embrace my unique journey."
        ],
        "hindi_affirmations": [
            "मैं बिना किसी शर्त के खुद से प्यार और सम्मान करता हूँ।",
            "मैं जीवन में सभी खुशियों, सफलता और प्रेम का हकदार हूँ।",
            "मेरी आंतरिक सकारात्मक ऊर्जा हर माहौल को खुशनुमा बनाती है।",
            "मैं खुद को स्वीकार करता हूँ और अपने लक्ष्य की ओर अग्रसर हूँ।"
        ]
    },
    {
        "slug": "mindset-focus",
        "title": "Peak Focus & Mindset",
        "hindi_title": "तीव्र एकाग्रता और माइंडसेट",
        "description": "Achieve laser-sharp cognitive clarity, sustained flow state, and instant mental focus.",
        "hindi_description": "मस्तिष्क को एकाग्रता, त्वरित निर्णय क्षमता, और अध्ययन/कार्य में फ्लो स्टेट के लिए प्राइम करें।",
        "icon": "bolt",
        "gradient": "linear-gradient(135deg, #d97706, #f59e0b)",
        "default_affirmations": [
            "My attention is sharp, unwavering, and intensely focused.",
            "I absorb complex knowledge effortlessly and execute with precision.",
            "I enter flow state instantly whenever I lock into my work.",
            "Distractions dissolve as my mental discipline reaches peak performance."
        ],
        "hindi_affirmations": [
            "मेरा ध्यान तेज, एकाग्र और पूरी तरह से केंद्रित है।",
            "मैं कठिन से कठिन विषय को आसानी से समझकर निष्पादित करता हूँ।",
            "काम करते समय मेरा मन पूर्ण एकाग्रता में रहता है।",
            "सभी भटकाव दूर हो जाते हैं और मेरी कार्यक्षमता चरम पर होती है।"
        ]
    },
    {
        "slug": "health-vitality",
        "title": "Health & Cellular Healing",
        "hindi_title": "उत्तम स्वास्थ्य और पुनर्जीवन",
        "description": "Accelerate physical recovery, boost immune vitality, and sync your body to harmonic wellness.",
        "hindi_description": "शारीरिक रिकवरी को तेज करें, रोग प्रतिरोधक क्षमता बढ़ाएं और शरीर को संतुलित रखें।",
        "icon": "sparkles",
        "gradient": "linear-gradient(135deg, #0d9488, #14b8a6)",
        "default_affirmations": [
            "Every cell in my body vibrates with vibrant health and energy.",
            "My immune system is resilient, strong, and constantly regenerating.",
            "I nourish my body with love, clean energy, and positive thoughts.",
            "Healing energy flows through every nerve, muscle, and organ."
        ],
        "hindi_affirmations": [
            "मेरे शरीर की हर कोशिका स्वास्थ्य और जीवन शक्ति से भरपूर है।",
            "मेरी प्रतिरक्षा प्रणाली मजबूत और लगातार पुनर्जीवित हो रही है।",
            "मैं अपने शरीर का ध्यान रखता हूँ और सकारात्मक विचारों से पोषण देता हूँ।",
            "उपचारात्मक ऊर्जा मेरे पूरे शरीर में बह रही है।"
        ]
    }
]

DEFAULT_BINAURAL_PRESETS = [
    {
        "slug": "delta-sleep",
        "name": "Delta Restorative Sleep",
        "wave_type": "Delta",
        "beat_frequency": 2.5,
        "carrier_frequency": 108.0,
        "description": "0.5–4.0 Hz deep subconscious frequency for cellular repair, growth hormone release, and dreamless sleep.",
        "recommended_use": "Bedtime relaxation & night recovery"
    },
    {
        "slug": "theta-meditation",
        "name": "Theta Subconscious Reprogramming",
        "wave_type": "Theta",
        "beat_frequency": 6.0,
        "carrier_frequency": 216.0,
        "description": "4.0–8.0 Hz deep meditative frequency ideal for subliminal affirmations, intuition, and neuro-plasticity.",
        "recommended_use": "Morning & evening affirmation priming"
    },
    {
        "slug": "alpha-focus",
        "name": "Alpha Relaxed Focus & Abundance",
        "wave_type": "Alpha",
        "beat_frequency": 10.0,
        "carrier_frequency": 256.0,
        "description": "8.0–13.0 Hz flow state wave promoting calm awareness, stress reduction, and wealth visualization.",
        "recommended_use": "Daily work, study & creative manifestation"
    },
    {
        "slug": "beta-alertness",
        "name": "Beta High Cognitive Energy",
        "wave_type": "Beta",
        "beat_frequency": 18.0,
        "carrier_frequency": 300.0,
        "description": "13.0–30.0 Hz active brainwave for high analytical thinking, quick problem solving, and alertness.",
        "recommended_use": "Intense study sessions & strategic execution"
    },
    {
        "slug": "gamma-peak",
        "name": "Gamma Peak Transcendence",
        "wave_type": "Gamma",
        "beat_frequency": 40.0,
        "carrier_frequency": 432.0,
        "description": "30.0–50.0 Hz high-frequency synchronization associated with epiphany, rapid memory processing, and peak performance.",
        "recommended_use": "Pre-competition & peak mental clarity"
    }
]

async def init_db(session: AsyncSession):
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed or Update Genres
    result = await session.execute(select(Genre))
    existing_genres = {g.slug: g for g in result.scalars().all()}
    
    for g_data in DEFAULT_GENRES:
        slug = g_data["slug"]
        if slug in existing_genres:
            # Update existing with hindi fields
            g = existing_genres[slug]
            g.hindi_title = g_data["hindi_title"]
            g.hindi_description = g_data["hindi_description"]
            g.hindi_affirmations = g_data["hindi_affirmations"]
        else:
            genre = Genre(**g_data)
            session.add(genre)
    await session.commit()

    # Seed Binaural Presets if empty
    result = await session.execute(select(BinauralPreset))
    existing_presets = result.scalars().all()
    if not existing_presets:
        for p_data in DEFAULT_BINAURAL_PRESETS:
            preset = BinauralPreset(**p_data)
            session.add(preset)
        await session.commit()
