"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAI = void 0;
// Intelligent Agriculture, Website Help & Customer Support Knowledge Base
const KNOWLEDGE_RESPONSES = {
    farmer: {
        pest: {
            en: "For natural and eco-friendly pest control on vegetables, consider spraying a diluted Neem oil solution (5ml per liter with a few drops of liquid soap) every 7-10 days. For aphids, introducing ladybugs or using yellow sticky traps works wonders without toxic chemicals.",
            hi: "सब्जियों पर प्राकृतिक और जैविक कीट नियंत्रण के लिए 5 मिलीलीटर नीम का तेल प्रति लीटर पानी में मिलाकर हर 7-10 दिनों में छिड़काव करें। एफिड्स (माहू) के लिए पीले चिपचिपे ट्रैप का उपयोग बेहद प्रभावी और विष-मुक्त तरीका है।",
            pa: "ਸਬਜ਼ੀਆਂ 'ਤੇ ਕੁਦਰਤੀ ਕੀਟ ਕੰਟਰੋਲ ਲਈ ਨਿੰਮ ਦੇ ਤੇਲ (5 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਲੀਟਰ) ਦਾ ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਵਾਰ ਛਿੜਕਾਅ ਕਰੋ। ਇਹ ਫ਼ਸਲ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾਏ ਬਿਨਾਂ ਕੀੜਿਆਂ ਤੋਂ ਬਚਾਉਂਦਾ ਹੈ।",
        },
        storage: {
            en: "To preserve fresh potatoes and onions post-harvest, store them in a cool, dark, well-ventilated space (10-15°C) with 85% humidity. Never store onions and potatoes directly touching each other, as potatoes release moisture and ethylene gas that hastens onion sprouting.",
            hi: "कटाई के बाद आलू और प्याज को ठंडी, अंधेरी और हवादार जगह (10-15°C) पर रखें। आलू और प्याज को कभी एक साथ न रखें, क्योंकि आलू से निकलने वाली नमी और एथिलीन गैस प्याज को जल्दी सड़ा सकती है।",
            pa: "ਆਲੂ ਅਤੇ ਪਿਆਜ਼ ਨੂੰ ਹਮੇਸ਼ਾ ਠੰਢੀ ਅਤੇ ਹਵਾਦਾਰ ਥਾਂ 'ਤੇ ਰੱਖੋ। ਆਲੂਆਂ ਅਤੇ ਪਿਆਜ਼ਾਂ ਨੂੰ ਇਕੱਠੇ ਨਾ ਰੱਖੋ ਤਾਂ ਜੋ ਫ਼ਸਲ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਤਾਜ਼ੀ ਰਹੇ।",
        },
        pricing: {
            en: "Based on current Mandi benchmark rates, pricing your produce directly on FarmerInventory allows you to capture 25-40% higher realization by cutting out commission agents, while still offering 15-20% savings to consumers. Check our Mandi Price Calculator for exact figures!",
            hi: "वर्तमान मंडी भाव के अनुसार, FarmerInventory पर सीधे बिक्री करके आप बिचौलियों के कमीशन से बचकर 25-40% अधिक मुनाफा कमा सकते हैं, जबकि ग्राहकों को भी खुदरा बाजार से 15-20% सस्ती ताज़ा उपज मिलती है। सटीक दर के लिए हमारे मंडी कैलकुलेटर का उपयोग करें!",
            pa: "ਮੰਡੀ ਦਰਾਂ ਦੇ ਮੁਕਾਬਲੇ FarmerInventory ਰਾਹੀਂ ਸਿੱਧੀ ਵਿਕਰੀ ਕਰਕੇ ਤੁਸੀਂ 25-40% ਵੱਧ ਮੁਨਾਫਾ ਕਮਾ ਸਕਦੇ ਹੋ। ਵਿਚੋਲਿਆਂ ਦਾ ਖਰਚਾ ਬਚਦਾ ਹੈ ਅਤੇ ਗਾਹਕਾਂ ਨੂੰ ਵੀ ਤਾਜ਼ਾ ਸਮਾਨ ਮਿਲਦਾ ਹੈ।",
        },
        website_guide: {
            en: "Here is how to use FarmerInventory as a Farmer:\n1. 📦 **Manage Inventory**: View your crops, update stock quantities, and add new harvest listings.\n2. ⚖️ **Mandi Calculator**: Check live government APMC wholesale rates and MSP before setting your prices.\n3. 📋 **Incoming Orders**: Review customer orders in your Kanban board and click 'Accept' or 'Reject'.\n4. 🚚 **Order Tracking**: Progress accepted orders through 'Packed', 'Out for Delivery', and 'Delivered'.\n5. 💬 **Direct Chat**: Message your buyers directly to build long-term relationships.\n6. 🎙️ **Voice Actions**: You can tell me 'Add 50 kg potatoes at 25 rupees' to add produce using voice!",
            hi: "किसान के रूप में FarmerInventory का उपयोग कैसे करें:\n1. 📦 **इन्वेंटरी**: अपनी फसलें देखें, नया स्टॉक जोड़ें और मात्रा अपडेट करें।\n2. ⚖️ **मंडी कैलकुलेटर**: सही कीमत तय करने के लिए सरकारी APMC मंडी भाव और MSP दरें देखें।\n3. 📋 **ग्राहक ऑर्डर**: अपने कानबान बोर्ड में आने वाले ऑर्डर देखें और 'स्वीकार' या 'अस्वीकार' करें।\n4. 🚚 **ट्रैकिंग**: ऑर्डर को 'पैक', 'डिलीवरी के लिए रवाना' और 'डिलीवर' में आगे बढ़ाएं।\n5. 💬 **सीधा चैट**: अपने ग्राहकों से सीधे चैट करें।\n6. 🎙️ **वॉइस कमांड**: आप मुझे बोल सकते हैं जैसे '50 किलो आलू 25 रुपये में जोड़ो' और मैं तुरंत जोड़ दूंगा!",
            pa: "FarmerInventory ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ:\n1. 📦 **ਸਟਾਕ**: ਆਪਣੀ ਫ਼ਸਲ ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ ਰੇਟ ਅਪਡੇਟ ਕਰੋ।\n2. ⚖️ **ਮੰਡੀ ਰੇਟ**: ਸਰਕਾਰੀ ਮੰਡੀ ਭਾਅ ਅਤੇ MSP ਚੈੱਕ ਕਰੋ।\n3. 📋 **ਆਰਡਰ**: ਆਰਡਰ ਸਵੀਕਾਰ ਜਾਂ ਰੱਦ ਕਰੋ।\n4. 🎙️ **ਆਵਾਜ਼ ਨਾਲ**: ਤੁਸੀਂ ਬੋਲ ਕੇ ਵੀ ਨਵਾਂ ਉਤਪਾਦ ਜੋੜ ਸਕਦੇ ਹੋ!",
        },
        default: {
            en: "Hello Kisan brother/sister! I am Kisan Mitra AI. I can guide you on crop management, pest protection, organic certification, optimum harvest timing, and pricing strategies to maximize your farm profit. You can also ask me how to use this website, or speak an action like 'Add 50 kg Potatoes at 25 rupees'!",
            hi: "नमस्ते किसान भाई/बहन! मैं हूँ किसान मित्र AI। मैं आपको फसल सुरक्षा, जैविक खाद, भंडारण, सरकारी MSP योजनाओं और सीधे ग्राहक बिक्री से अधिक मुनाफा कमाने में मदद कर सकता हूँ। आप मुझसे वेबसाइट चलाने के तरीके पूछ सकते हैं या बोलकर '50 किलो आलू 25 रुपये में जोड़ें' कह सकते हैं!",
            pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਕਿਸਾਨ ਮਿੱਤਰ AI ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਖੇਤੀਬਾੜੀ, ਕੀਟ ਨਿਯੰਤਰਣ ਅਤੇ ਵਧੀਆ ਕੀਮਤਾਂ ਬਾਰੇ ਪੂਰੀ ਜਾਣਕਾਰੀ ਦੇ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਬੋਲ ਕੇ ਵੀ ਸਮਾਨ ਜੋੜ ਸਕਦੇ ਹੋ!",
        },
    },
    customer: {
        delivery: {
            en: "FarmerInventory offers direct farm-to-door delivery. Orders within your local farm zone (<25km) are delivered within 24 hours of harvest. Orders above ₹500 qualify for 100% Free Delivery!",
            hi: "FarmerInventory सीधे खेत से आपके घर तक ताज़ा डिलीवरी करता है। स्थानीय फार्म ज़ोन (<25 किमी) के ऑर्डर फसल कटाई के 24 घंटे के भीतर डिलीवर होते हैं। ₹500 से अधिक के ऑर्डर पर डिलीवरी बिल्कुल मुफ़्त है!",
            pa: "ਸਾਡੇ ਖੇਤ ਤੋਂ ਤੁਹਾਡੇ ਘਰ ਤੱਕ ਸਿੱਧੀ ਡਿਲੀਵਰੀ ਹੁੰਦੀ ਹੈ। ₹500 ਤੋਂ ਵੱਧ ਦੇ ਆਰਡਰਾਂ 'ਤੇ ਡਿਲੀਵਰੀ ਬਿਲਕੁਲ ਮੁਫ਼ਤ ਹੈ!",
        },
        payment: {
            en: "We support both seamless Online Payment (UPI / Google Pay / PhonePe / Paytm / Credit-Debit Cards) and Cash on Delivery (COD). You can select your preferred method during checkout.",
            hi: "हम ऑनलाइन पेमेंट (UPI / गूगल पे / फोनपे / पेटीएम / कार्ड्स) और कैश ऑन डिलीवरी (COD) दोनों का समर्थन करते हैं। आप चेकआउट के दौरान अपना पसंदीदा विकल्प चुन सकते हैं।",
            pa: "ਅਸੀਂ ਔਨਲਾਈਨ ਭੁਗਤਾਨ (UPI/ਕਾਰਡ) ਅਤੇ ਕੈਸ਼ ਆਨ ਡਿਲਿਵਰੀ (COD) ਦੋਵਾਂ ਦੀ ਸੁਵਿਧਾ ਦਿੰਦੇ ਹਾਂ।",
        },
        freshness: {
            en: "Unlike supermarket produce that sits in distribution warehouses for 5-10 days, products on FarmerInventory are harvested only after your order is confirmed. Each product displays an AI Freshness Meter ranging from Emerald Green (Peak Crispness) to Red (Aging).",
            hi: "सुपरमार्केट की बासी सब्जियों के विपरीत, FarmerInventory पर उत्पाद ऑर्डर की पुष्टि के बाद ही खेत से तोड़े जाते हैं। हर उत्पाद पर AI फ्रेशनेस मीटर दिखता है जो हरे (सर्वोत्तम ताजगी) से लाल तक होता है।",
            pa: "FarmerInventory 'ਤੇ ਹਰ ਸਬਜ਼ੀ ਅਤੇ ਫਲ ਬਿਲਕੁਲ ਤਾਜ਼ਾ ਹੁੰਦਾ ਹੈ ਜੋ ਖੇਤਾਂ ਤੋਂ ਸਿੱਧਾ ਤੁਹਾਡੇ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ।",
        },
        website_guide: {
            en: "Here is how to use FarmerInventory as a Customer:\n1. 🛒 **Marketplace**: Browse seasonal fruits, vegetables, grains, and honey direct from verified farmers.\n2. 🌿 **AI Freshness Score**: Check the dynamic color-coded meter to know exactly when the crop was harvested.\n3. 📍 **State Filter**: Filter produce from Punjab, Haryana, Himachal Pradesh, UP, Maharashtra, or Gujarat.\n4. 🚚 **Pincode Delivery**: Enter your delivery pincode to get instant shipping fees and ETA (Free delivery on orders ₹500+).\n5. 💬 **Chat with Farmer**: Message the grower directly on any product page.\n6. 🛡️ **Dispute Protection**: File a complaint with photo evidence if any item is not fresh.",
            hi: "ग्राहक के रूप में FarmerInventory का उपयोग कैसे करें:\n1. 🛒 **मार्केटप्लेस**: सत्यापित किसानों से ताज़े फल, सब्जियां, अनाज और शहद सीधे खरीदें।\n2. 🌿 **AI ताजगी स्कोर**: रंगीन फ्रेशनेस मीटर देखकर जानें कि फसल कब काटी गई थी।\n3. 📍 **राज्य फ़िल्टर**: पंजाब, हरियाणा, हिमाचल, यूपी, महाराष्ट्र या गुजरात से उपज चुनें।\n4. 🚚 **पिनकोड डिलीवरी**: तुरंत डिलीवरी शुल्क और समय जानने के लिए अपना पिनकोड दर्ज करें (₹500+ पर मुफ़्त डिलीवरी)।\n5. 💬 **किसान से चैट**: सीधे उत्पादक से बात करें।\n6. 🛡️ **सुरक्षित खरीदारी**: यदि उत्पाद ताज़ा न मिले तो फोटो सहित शिकायत दर्ज करें।",
            pa: "ਗਾਹਕ ਵਜੋਂ FarmerInventory ਦੀ ਵਰਤੋਂ:\n1. 🛒 ਤਾਜ਼ੀਆਂ ਸਬਜ਼ੀਆਂ ਅਤੇ ਫ਼ਲ ਸਿੱਧੇ ਕਿਸਾਨਾਂ ਤੋਂ ਖਰੀਦੋ।\n2. 🌿 AI ਫਰੈੱਸ਼ ਨੈੱਸ ਸਕੋਰ ਦੇਖੋ।\n3. 🚚 ₹500 ਤੋਂ ਵੱਧ ਦੇ ਆਰਡਰਾਂ 'ਤੇ ਮੁਫ਼ਤ ਡਿਲੀਵਰੀ!",
        },
        default: {
            en: "Welcome to FarmerInventory! I am your AI Assistant. I can help you find fresh seasonal produce, check order status, understand organic farming practices, or navigate this website. How can I assist you?",
            hi: "FarmerInventory में आपका स्वागत है! मैं आपका AI सहायक हूँ। मैं आपको ताज़ी मौसमी उपज खोजने, ऑर्डर ट्रैक करने, ऑनलाइन/COD पेमेंट और किसान से सीधे संपर्क में सहायता कर सकता हूँ। मैं आपकी क्या मदद करूँ?",
            pa: "FarmerInventory ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਤਾਜ਼ੀਆਂ ਸਬਜ਼ੀਆਂ, ਆਰਡਰ ਟ੍ਰੈਕਿੰਗ ਜਾਂ ਭੁਗਤਾਨ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
        },
    },
};
// Crop taxonomy for automatic category and unit detection
const CROP_DICTIONARY = {
    potato: { standardName: 'Fresh Potatoes (आलू)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 25 },
    potatoes: { standardName: 'Fresh Potatoes (आलू)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 25 },
    आलू: { standardName: 'Organic Potatoes (आलू)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 25 },
    alu: { standardName: 'Fresh Potatoes (आलू)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 25 },
    tomato: { standardName: 'Fresh Tomatoes (टमाटर)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 30 },
    tomatoes: { standardName: 'Fresh Tomatoes (टमाटर)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 30 },
    टमाटर: { standardName: 'Fresh Farm Tomatoes (टमाटर)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 30 },
    tamatar: { standardName: 'Fresh Farm Tomatoes (टमाटर)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 30 },
    onion: { standardName: 'Red Onions (प्याज)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 28 },
    onions: { standardName: 'Red Onions (प्याज)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 28 },
    प्याज: { standardName: 'Nashik Red Onions (प्याज)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 28 },
    pyaz: { standardName: 'Nashik Red Onions (प्याज)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 28 },
    wheat: { standardName: 'Sharbati Wheat (गेहूं)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 28.5 },
    गेहूं: { standardName: 'Sharbati Wheat (शरबती गेहूं)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 28.5 },
    gehu: { standardName: 'Sharbati Wheat (गेहूं)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 28.5 },
    rice: { standardName: 'Basmati Rice (1121 चावल)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 60 },
    चावल: { standardName: 'Pure Basmati Rice (चावल)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 60 },
    chawal: { standardName: 'Pure Basmati Rice (चावल)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 60 },
    basmati: { standardName: 'Royal Basmati Rice (1121)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 65 },
    apple: { standardName: 'Himachal Royal Apples (सेब)', category: 'Fruits', defaultUnit: 'kg', defaultPrice: 120 },
    apples: { standardName: 'Himachal Royal Apples (सेब)', category: 'Fruits', defaultUnit: 'kg', defaultPrice: 120 },
    सेब: { standardName: 'Himachal Royal Apples (पहाड़ी सेब)', category: 'Fruits', defaultUnit: 'kg', defaultPrice: 120 },
    seb: { standardName: 'Himachal Royal Apples (सेब)', category: 'Fruits', defaultUnit: 'kg', defaultPrice: 120 },
    mustard: { standardName: 'Yellow Mustard Seeds (सरसों)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 65 },
    सरसों: { standardName: 'Yellow Mustard Seeds (पीली सरसों)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 65 },
    sarson: { standardName: 'Yellow Mustard Seeds (सरसों)', category: 'Grains', defaultUnit: 'kg', defaultPrice: 65 },
    garlic: { standardName: 'Mountain Garlic (पहाड़ी लहसुन)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 140 },
    लहसुन: { standardName: 'Mountain Garlic (पहाड़ी लहसुन)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 140 },
    lahsun: { standardName: 'Mountain Garlic (लहसुन)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 140 },
    honey: { standardName: 'Pure Himalayan Forest Honey', category: 'Honey & Sweeteners', defaultUnit: 'kg', defaultPrice: 350 },
    शहद: { standardName: 'Pure Himalayan Honey (प्राकृतिक शहद)', category: 'Honey & Sweeteners', defaultUnit: 'kg', defaultPrice: 350 },
    shahad: { standardName: 'Pure Forest Honey (शहद)', category: 'Honey & Sweeteners', defaultUnit: 'kg', defaultPrice: 350 },
    milk: { standardName: 'Pure Desi Cow Milk (A2)', category: 'Dairy', defaultUnit: 'liter', defaultPrice: 65 },
    दूध: { standardName: 'Pure Desi Cow Milk (A2)', category: 'Dairy', defaultUnit: 'liter', defaultPrice: 65 },
    doodh: { standardName: 'Pure Desi Cow Milk (A2)', category: 'Dairy', defaultUnit: 'liter', defaultPrice: 65 },
    ghee: { standardName: 'Pure Desi A2 Cow Ghee', category: 'Dairy', defaultUnit: 'kg', defaultPrice: 650 },
    घी: { standardName: 'Pure Desi A2 Cow Ghee (देसी घी)', category: 'Dairy', defaultUnit: 'kg', defaultPrice: 650 },
    cauliflower: { standardName: 'Fresh Cauliflower (फूलगोभी)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 26 },
    फूलगोभी: { standardName: 'Fresh Cauliflower (फूलगोभी)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 26 },
    gobi: { standardName: 'Fresh Cauliflower (गोभी)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 26 },
    mushroom: { standardName: 'Button Mushrooms (ताजा खुंब)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 140 },
    मशरूम: { standardName: 'Button Mushrooms (ताजा मशरूम)', category: 'Vegetables', defaultUnit: 'kg', defaultPrice: 140 },
};
/**
 * Intelligent NLP parser for Voice / Text commands
 */
function parseVoiceAction(prompt, role) {
    const lower = prompt.toLowerCase();
    // 1. Check for Navigation Commands
    if (lower.includes('show order') ||
        lower.includes('open order') ||
        lower.includes('mere order') ||
        lower.includes('ऑर्डर दिखाओ') ||
        lower.includes('ऑर्डर खोलो') ||
        lower.includes('ਆਰਡਰ')) {
        return {
            type: 'NAVIGATE',
            target: role === 'FARMER' ? 'orders' : 'my_orders',
            message: {
                en: 'Navigating to Orders section...',
                hi: 'ऑर्डर अनुभाग खोला जा रहा है...',
                pa: 'ਆਰਡਰ ਭਾਗ ਖੋਲ੍ਹਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
            },
        };
    }
    if (lower.includes('mandi price') ||
        lower.includes('mandi rate') ||
        lower.includes('mandi bhav') ||
        lower.includes('मंडी भाव') ||
        lower.includes('मंडी रेट') ||
        lower.includes('मंडी खोलो') ||
        lower.includes('ਮੰਡੀ')) {
        return {
            type: 'OPEN_MANDI',
            message: {
                en: 'Opening State-wise Mandi Benchmark Calculator...',
                hi: 'राज्यवार सरकारी मंडी भाव कैलकुलेटर खोला जा रहा है...',
                pa: 'ਮੰਡੀ ਕੈਲਕੁਲੇਟਰ ਖੋਲ੍ਹਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
            },
        };
    }
    if (lower.includes('show sales') ||
        lower.includes('show revenue') ||
        lower.includes('बिक्री दिखाओ') ||
        lower.includes('कमाई कितनी हुई') ||
        lower.includes('सेल रिपोर्ट')) {
        return {
            type: 'NAVIGATE',
            target: 'sales',
            message: {
                en: 'Navigating to Sales & Revenue Dashboard...',
                hi: 'बिक्री और राजस्व डैशबोर्ड खोला जा रहा है...',
                pa: 'ਵਿਕਰੀ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
            },
        };
    }
    if (lower.includes('show inventory') ||
        lower.includes('my products') ||
        lower.includes('स्टॉक दिखाओ') ||
        lower.includes('इन्वेंटरी खोलो') ||
        lower.includes('मेरी फसलें')) {
        return {
            type: 'NAVIGATE',
            target: 'inventory',
            message: {
                en: 'Navigating to your Farm Inventory...',
                hi: 'आपकी इन्वेंटरी खोली जा रही है...',
                pa: 'ਤੁਹਾਡਾ ਸਟਾਕ ਖੋਲ੍ਹਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
            },
        };
    }
    if (lower.includes('show market') ||
        lower.includes('open market') ||
        lower.includes('मार्केट दिखाओ') ||
        lower.includes('बाजार खोलो')) {
        return {
            type: 'NAVIGATE',
            target: 'marketplace',
            message: {
                en: 'Opening Customer Marketplace...',
                hi: 'कस्टमर मार्केटप्लेस खोला जा रहा है...',
                pa: 'ਮਾਰਕੀਟਪਲੇਸ ਖੋਲ੍ਹਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
            },
        };
    }
    // 2. Check for "Add Product" Voice Action
    // Matches patterns like:
    // "Add 50 kg potatoes at 25 rupees"
    // "50 किलो आलू 25 रुपये में जोड़ो"
    // "Add 100 kg basmati rice for 60"
    // "20 kg fresh tomatoes at 30"
    const isAddIntent = lower.includes('add') ||
        lower.includes('जोड़ो') ||
        lower.includes('जोड़ें') ||
        lower.includes('डालो') ||
        lower.includes('लिस्ट करो') ||
        lower.includes('list') ||
        lower.includes('new product');
    if (isAddIntent || /\d+\s*(kg|किलो|quntal|quintal|लीटर|liter)/i.test(lower)) {
        // Find quantity
        const qtyMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:kg|kgs|किलो|किलोग्राम|quntal|quintal|क्विंटल|liter|litre|लीटर|ltr|packet|पैकेट|दर्जन|dozen)?/i);
        const quantity = qtyMatch ? parseFloat(qtyMatch[1]) : 10;
        // Find unit
        let unit = 'kg';
        if (lower.includes('quntal') || lower.includes('quintal') || lower.includes('क्विंटल'))
            unit = 'quintal';
        else if (lower.includes('liter') || lower.includes('litre') || lower.includes('लीटर') || lower.includes('ltr'))
            unit = 'liter';
        else if (lower.includes('dozen') || lower.includes('दर्जन'))
            unit = 'dozen';
        else if (lower.includes('packet') || lower.includes('पैकेट'))
            unit = 'packet';
        // Find price (e.g., "at 25", "25 rupees", "25 रुपये", "₹25", "rate 30")
        const priceMatch = lower.match(/(?:at|for|rate|price|भाव|रुपये|रु|₹)\s*(\d+(?:\.\d+)?)/i) ||
            lower.match(/(\d+(?:\.\d+)?)\s*(?:rupees|rs|रुपये|रु|₹|per\s*kg|प्रति)/i);
        // Identify Crop
        let detectedCropKey = '';
        for (const key of Object.keys(CROP_DICTIONARY)) {
            if (lower.includes(key)) {
                detectedCropKey = key;
                break;
            }
        }
        if (detectedCropKey || qtyMatch) {
            const cropInfo = detectedCropKey ? CROP_DICTIONARY[detectedCropKey] : {
                standardName: 'Fresh Harvest Produce',
                category: 'Vegetables',
                defaultUnit: 'kg',
                defaultPrice: 30,
            };
            const finalPrice = priceMatch ? parseFloat(priceMatch[1]) : cropInfo.defaultPrice;
            return {
                type: 'ADD_PRODUCT',
                data: {
                    product_name: cropInfo.standardName,
                    category: cropInfo.category,
                    stock_quantity: quantity,
                    unit: unit || cropInfo.defaultUnit,
                    price_per_unit: finalPrice,
                    low_stock_threshold: 5,
                    storage_condition: 'FIELD_FRESH',
                    harvest_date: new Date().toISOString().split('T')[0],
                },
                message: {
                    en: `I have prepared the voice action to add **${quantity} ${unit} of ${cropInfo.standardName}** at **₹${finalPrice}/${unit}**. Please confirm below to add it to your live catalog!`,
                    hi: `मैंने **${cropInfo.standardName}** की **${quantity} ${unit}** मात्रा **₹${finalPrice}/${unit}** के भाव पर जोड़ने का विवरण तैयार किया है। कृपया नीचे दिए गए बटन से पुष्टि करें!`,
                    pa: `ਮੈਂ **${cropInfo.standardName}** ਦੇ **${quantity} ${unit}**, **₹${finalPrice}/${unit}** ਦੇ ਭਾਅ 'ਤੇ ਜੋੜਨ ਲਈ ਤਿਆਰ ਕਰ ਦਿੱਤਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਪੁਸ਼ਟੀ ਕਰੋ!`,
                },
            };
        }
    }
    return null;
}
const chatWithAI = async (req, res) => {
    try {
        const { prompt, role = 'CUSTOMER', language = 'en' } = req.body;
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }
        const langKey = language === 'hi' ? 'hi' : language === 'pa' ? 'pa' : 'en';
        const lowerPrompt = prompt.toLowerCase();
        const isFarmer = role.toUpperCase() === 'FARMER';
        // 1. Check for interactive voice/text actions first
        const action = parseVoiceAction(prompt, role);
        if (action) {
            return res.json({
                success: true,
                reply: action.message[langKey] || action.message.en,
                action,
                role,
                language: langKey,
            });
        }
        // 2. Check for Website Guidance
        const isWebsiteGuideQuery = lowerPrompt.includes('website') ||
            lowerPrompt.includes('how to use') ||
            lowerPrompt.includes('kaise use') ||
            lowerPrompt.includes('kaise chalaye') ||
            lowerPrompt.includes('kaise kaam') ||
            lowerPrompt.includes('उपयोग कैसे') ||
            lowerPrompt.includes('काम कैसे करता') ||
            lowerPrompt.includes('feature') ||
            lowerPrompt.includes('help') ||
            lowerPrompt.includes('मदद');
        if (isWebsiteGuideQuery) {
            const guideText = isFarmer
                ? KNOWLEDGE_RESPONSES.farmer.website_guide[langKey]
                : KNOWLEDGE_RESPONSES.customer.website_guide[langKey];
            return res.json({
                success: true,
                reply: guideText,
                role,
                language: langKey,
            });
        }
        // 3. Domain Knowledge Retrieval
        let reply = '';
        if (isFarmer) {
            if (lowerPrompt.includes('pest') ||
                lowerPrompt.includes('कीड़ा') ||
                lowerPrompt.includes('कीट') ||
                lowerPrompt.includes('disease') ||
                lowerPrompt.includes('spray')) {
                reply = KNOWLEDGE_RESPONSES.farmer.pest[langKey];
            }
            else if (lowerPrompt.includes('store') ||
                lowerPrompt.includes('storage') ||
                lowerPrompt.includes('भंडारण') ||
                lowerPrompt.includes('कोल्ड') ||
                lowerPrompt.includes('sprout')) {
                reply = KNOWLEDGE_RESPONSES.farmer.storage[langKey];
            }
            else if (lowerPrompt.includes('price') ||
                lowerPrompt.includes('mandi') ||
                lowerPrompt.includes('रेट') ||
                lowerPrompt.includes('भाव') ||
                lowerPrompt.includes('msp') ||
                lowerPrompt.includes('profit')) {
                reply = KNOWLEDGE_RESPONSES.farmer.pricing[langKey];
            }
            else {
                reply = `${KNOWLEDGE_RESPONSES.farmer.default[langKey]} \n\n${langKey === 'hi'
                    ? `आपके प्रश्न ("${prompt}") के लिए हमारा सुझाव है: आप सीधे बोलकर नया उत्पाद जोड़ सकते हैं (जैसे '50 किलो आलू 25 रुपये में जोड़ो') या सरकारी मंडी भाव कैलकुलेटर देख सकते हैं!`
                    : langKey === 'pa'
                        ? `ਤੁਹਾਡੇ ਸਵਾਲ ("${prompt}") ਬਾਰੇ: ਤੁਸੀਂ ਬੋਲ ਕੇ ਵੀ ਨਵਾਂ ਸਟਾਕ ਸ਼ਾਮਲ ਕਰ ਸਕਦੇ ਹੋ!`
                        : `Regarding your query ("${prompt}"): You can also speak commands like "Add 50 kg Potatoes at ₹25" to automatically add crops to your inventory, or ask me for step-by-step website guidance!`}`;
            }
        }
        else {
            if (lowerPrompt.includes('delivery') ||
                lowerPrompt.includes('deliver') ||
                lowerPrompt.includes('डिलीवरी') ||
                lowerPrompt.includes('पहुंच') ||
                lowerPrompt.includes('pincode')) {
                reply = KNOWLEDGE_RESPONSES.customer.delivery[langKey];
            }
            else if (lowerPrompt.includes('pay') ||
                lowerPrompt.includes('payment') ||
                lowerPrompt.includes('cash') ||
                lowerPrompt.includes('upi') ||
                lowerPrompt.includes('भुगतान') ||
                lowerPrompt.includes('पैसे')) {
                reply = KNOWLEDGE_RESPONSES.customer.payment[langKey];
            }
            else if (lowerPrompt.includes('fresh') ||
                lowerPrompt.includes('organic') ||
                lowerPrompt.includes('ताजा') ||
                lowerPrompt.includes('जैविक') ||
                lowerPrompt.includes('quality') ||
                lowerPrompt.includes('meter')) {
                reply = KNOWLEDGE_RESPONSES.customer.freshness[langKey];
            }
            else {
                reply = `${KNOWLEDGE_RESPONSES.customer.default[langKey]} \n\n${langKey === 'hi'
                    ? `आपने पूछा: "${prompt}"। हमारी सलाह है कि हमारे 'सब्जियां' और 'फल' अनुभाग में सीधे स्थानीय किसानों की सत्यापित लिस्टिंग देखें और हमारे AI फ्रेशनेस मीटर को चेक करें!`
                    : langKey === 'pa'
                        ? `ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ! ਤੁਸੀਂ ਕਿਸਾਨ ਨਾਲ ਸਿੱਧਾ ਚੈਟ ਵੀ ਕਰ ਸਕਦੇ ਹੋ।`
                        : `Regarding "${prompt}": You can filter products by state, compare fair Mandi prices, and check the AI Freshness Meter on every product card!`}`;
            }
        }
        return res.json({
            success: true,
            reply,
            role,
            language: langKey,
        });
    }
    catch (error) {
        console.error('AI Chatbot error:', error);
        return res.status(500).json({ success: false, message: 'AI Chatbot service error' });
    }
};
exports.chatWithAI = chatWithAI;
