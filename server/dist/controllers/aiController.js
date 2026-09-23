"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAI = void 0;
// Intelligent Agriculture & Customer Support Knowledge Base
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
        default: {
            en: "Hello Kisan brother/sister! I am Kisan Mitra AI. I can guide you on crop management, pest protection, organic certification, optimum harvest timing, and pricing strategies to maximize your farm profit. What question do you have today?",
            hi: "नमस्ते किसान भाई/बहन! मैं हूँ किसान मित्र AI। मैं आपको फसल सुरक्षा, जैविक खाद, भंडारण, सरकारी MSP योजनाओं और सीधे ग्राहक बिक्री से अधिक मुनाफा कमाने में मदद कर सकता हूँ। आज आप क्या जानना चाहते हैं?",
            pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਕਿਸਾਨ ਮਿੱਤਰ AI ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਖੇਤੀਬਾੜੀ, ਕੀਟ ਨਿਯੰਤਰਣ ਅਤੇ ਵਧੀਆ ਕੀਮਤਾਂ ਬਾਰੇ ਪੂਰੀ ਜਾਣਕਾਰੀ ਦੇ ਸਕਦਾ ਹਾਂ।",
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
            en: "Unlike supermarket produce that sits in distribution warehouses for 5-10 days, products on FarmerInventory are harvested only after your order is confirmed, preserving peak nutritional density and natural aroma.",
            hi: "सुपरमार्केट की बासी सब्जियों के विपरीत, FarmerInventory पर उत्पाद आपके ऑर्डर की पुष्टि के बाद ही खेत से तोड़े जाते हैं, जिससे उनकी प्राकृतिक ताजगी और संपूर्ण पोषण बना रहता है।",
            pa: "FarmerInventory 'ਤੇ ਹਰ ਸਬਜ਼ੀ ਅਤੇ ਫਲ ਬਿਲਕੁਲ ਤਾਜ਼ਾ ਹੁੰਦਾ ਹੈ ਜੋ ਖੇਤਾਂ ਤੋਂ ਸਿੱਧਾ ਤੁਹਾਡੇ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ।",
        },
        default: {
            en: "Welcome to FarmerInventory! I am your AI Assistant. I can help you find fresh seasonal produce, check order status, understand organic farming practices, or provide delicious farm-to-table recipes. How can I assist you?",
            hi: "FarmerInventory में आपका स्वागत है! मैं आपका AI सहायक हूँ। मैं आपको ताज़ी मौसमी उपज खोजने, ऑर्डर ट्रैक करने, ऑनलाइन/COD पेमेंट और किसान से सीधे संपर्क में सहायता कर सकता हूँ। मैं आपकी क्या मदद करूँ?",
            pa: "FarmerInventory ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਤਾਜ਼ੀਆਂ ਸਬਜ਼ੀਆਂ, ਆਰਡਰ ਟ੍ਰੈਕਿੰਗ ਜਾਂ ਭੁਗਤਾਨ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
        },
    },
};
const chatWithAI = async (req, res) => {
    try {
        const { prompt, role = 'CUSTOMER', language = 'en' } = req.body;
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }
        const langKey = language === 'hi' ? 'hi' : language === 'pa' ? 'pa' : 'en';
        const lowerPrompt = prompt.toLowerCase();
        const isFarmer = role.toUpperCase() === 'FARMER';
        let reply = '';
        if (isFarmer) {
            if (lowerPrompt.includes('pest') || lowerPrompt.includes('कीड़ा') || lowerPrompt.includes('कीट') || lowerPrompt.includes('disease') || lowerPrompt.includes('spray')) {
                reply = KNOWLEDGE_RESPONSES.farmer.pest[langKey];
            }
            else if (lowerPrompt.includes('store') || lowerPrompt.includes('storage') || lowerPrompt.includes('भंडारण') || lowerPrompt.includes('कोल्ड') || lowerPrompt.includes('sprout')) {
                reply = KNOWLEDGE_RESPONSES.farmer.storage[langKey];
            }
            else if (lowerPrompt.includes('price') || lowerPrompt.includes('mandi') || lowerPrompt.includes('रेट') || lowerPrompt.includes('भाव') || lowerPrompt.includes('msp') || lowerPrompt.includes('profit')) {
                reply = KNOWLEDGE_RESPONSES.farmer.pricing[langKey];
            }
            else {
                reply = `${KNOWLEDGE_RESPONSES.farmer.default[langKey]} \n\n${langKey === 'hi'
                    ? `आपके प्रश्न ("${prompt}") के लिए हमारा सुझाव है: जैविक खेती और सीधे ग्राहक वितरण से आपको अपनी उपज का सर्वोत्तम मूल्य मिल सकता है। अतिरिक्त जानकारी के लिए कृपया अपने उत्पाद का नाम बताएं!`
                    : langKey === 'pa'
                        ? `ਤੁਹਾਡੇ ਸਵਾਲ ("${prompt}") ਬਾਰੇ: ਖੇਤ ਤੋਂ ਸਿੱਧੀ ਵਿਕਰੀ ਨਾਲ ਮੁਨਾਫਾ ਵਧੇਗਾ।`
                        : `Regarding your query ("${prompt}"): Prioritize clean post-harvest sorting, packaging in breathable crates, and updating your stock threshold so customers get the freshest batch!`}`;
            }
        }
        else {
            if (lowerPrompt.includes('delivery') || lowerPrompt.includes('deliver') || lowerPrompt.includes('डिलीवरी') || lowerPrompt.includes('पहुंच') || lowerPrompt.includes('pincode')) {
                reply = KNOWLEDGE_RESPONSES.customer.delivery[langKey];
            }
            else if (lowerPrompt.includes('pay') || lowerPrompt.includes('payment') || lowerPrompt.includes('cash') || lowerPrompt.includes('upi') || lowerPrompt.includes('भुगतान') || lowerPrompt.includes('पैसे')) {
                reply = KNOWLEDGE_RESPONSES.customer.payment[langKey];
            }
            else if (lowerPrompt.includes('fresh') || lowerPrompt.includes('organic') || lowerPrompt.includes('ताजा') || lowerPrompt.includes('जैविक') || lowerPrompt.includes('quality')) {
                reply = KNOWLEDGE_RESPONSES.customer.freshness[langKey];
            }
            else {
                reply = `${KNOWLEDGE_RESPONSES.customer.default[langKey]} \n\n${langKey === 'hi'
                    ? `आपने पूछा: "${prompt}"। हमारी सलाह है कि हमारे 'सब्जियां' और 'फल' अनुभाग में सीधे स्थानीय किसानों की सत्यापित लिस्टिंग देखें और सीधे चैट के माध्यम से किसान से बात करें!`
                    : langKey === 'pa'
                        ? `ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ! ਤੁਸੀਂ ਕਿਸਾਨ ਨਾਲ ਸਿੱਧਾ ਚੈਟ ਵੀ ਕਰ ਸਕਦੇ ਹੋ।`
                        : `Regarding "${prompt}": You can filter products by state, compare fair Mandi prices with our calculator, and message the grower directly via the "Chat with Farmer" button on any product!`}`;
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
