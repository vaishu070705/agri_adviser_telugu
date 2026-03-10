// Translations for Telugu and English
export type Language = 'en' | 'te';

export const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.registration": { en: "Registration", te: "నమోదు" },
  "nav.cropRecommendation": { en: "Crop Recommendation", te: "పంట సిఫార్సు" },
  "nav.diseaseDetection": { en: "Disease Detection", te: "వ్యాధి గుర్తింపు" },
  "nav.yieldPrediction": { en: "Yield Prediction", te: "దిగుబడి అంచనా" },
  "nav.healthScore": { en: "Health Score", te: "ఆరోగ్య స్కోరు" },
  "nav.farmEconomics": { en: "Farm Economics", te: "వ్యవసాయ ఆర్థికశాస్త్రం" },
  "nav.alerts": { en: "Alerts", te: "హెచ్చరికలు" },
  "nav.reports": { en: "Reports", te: "నివేదికలు" },
  "nav.admin": { en: "Admin Dashboard", te: "అడ్మిన్ డాష్‌బోర్డ్" },
  "nav.workers": { en: "Workers", te: "కార్మికులు" },
  "nav.fertilizerAdvisor": { en: "Fertilizer Advisor", te: "ఎరువుల సలహాదారు" },
  "nav.pesticideRecommendation": { en: "Pesticide Recommendation", te: "పురుగుమందు సిఫార్సు" },
  "nav.profitEstimation": { en: "Profit Estimation", te: "లాభం అంచనా" },
  
  // Common
  "common.submit": { en: "Submit", te: "సమర్పించు" },
  "common.analyze": { en: "Analyze", te: "విశ్లేషించు" },
  "common.predict": { en: "Predict", te: "అంచనా" },
  "common.download": { en: "Download", te: "డౌన్‌లోడ్" },
  "common.reset": { en: "Reset", te: "రీసెట్" },
  "common.name": { en: "Name", te: "పేరు" },
  "common.email": { en: "Email", te: "ఇమెయిల్" },
  "common.phone": { en: "Phone", te: "ఫోన్" },
  "common.state": { en: "State", te: "రాష్ట్రం" },
  "common.district": { en: "District", te: "జిల్లా" },
  "common.mandal": { en: "Mandal", te: "మండలం" },
  "common.landSize": { en: "Land Size (acres)", te: "భూమి పరిమాణం (ఎకరాలు)" },
  "common.soilType": { en: "Soil Type", te: "నేల రకం" },
  "common.crop": { en: "Crop", te: "పంట" },
  "common.season": { en: "Season", te: "సీజన్" },
  "common.result": { en: "Result", te: "ఫలితం" },
  "common.confidence": { en: "Confidence", te: "నమ్మకం" },
  "common.risk": { en: "Risk Level", te: "ప్రమాద స్థాయి" },
  "common.low": { en: "Low", te: "తక్కువ" },
  "common.medium": { en: "Medium", te: "మధ్యస్థం" },
  "common.high": { en: "High", te: "ఎక్కువ" },
  "common.mild": { en: "Mild", te: "తేలిక" },
  "common.moderate": { en: "Moderate", te: "మధ్యస్థం" },
  "common.severe": { en: "Severe", te: "తీవ్రమైన" },
  "common.language": { en: "Language", te: "భాష" },
  "common.telugu": { en: "Telugu", te: "తెలుగు" },
  "common.english": { en: "English", te: "ఇంగ్లీష్" },
  "common.teluguSummary": { en: "Telugu Summary", te: "తెలుగు సారాంశం" },

  // Registration
  "reg.title": { en: "Farmer Registration", te: "రైతు నమోదు" },
  "reg.subtitle": { en: "Register to access AI-powered agricultural advisory", te: "AI ఆధారిత వ్యవసాయ సలహా కోసం నమోదు చేయండి" },
  "reg.success": { en: "Registration successful! Welcome to AgriAdvisory.", te: "నమోదు విజయవంతం! AgriAdvisory కి స్వాగతం." },
  "reg.prefLanguage": { en: "Preferred Language", te: "ఇష్టమైన భాష" },

  // Crop Recommendation
  "crop.title": { en: "Crop Recommendation System", te: "పంట సిఫార్సు వ్యవస్థ" },
  "crop.subtitle": { en: "Get AI-powered crop recommendations based on soil and weather data", te: "నేల మరియు వాతావరణ డేటా ఆధారంగా AI పంట సిఫార్సులు పొందండి" },
  "crop.nitrogen": { en: "Nitrogen (N)", te: "నత్రజని (N)" },
  "crop.phosphorus": { en: "Phosphorus (P)", te: "భాస్వరం (P)" },
  "crop.potassium": { en: "Potassium (K)", te: "పొటాషియం (K)" },
  "crop.ph": { en: "pH Level", te: "pH స్థాయి" },
  "crop.temperature": { en: "Temperature (°C)", te: "ఉష్ణోగ్రత (°C)" },
  "crop.humidity": { en: "Humidity (%)", te: "తేమ (%)" },
  "crop.rainfall": { en: "Rainfall (mm)", te: "వర్షపాతం (mm)" },
  "crop.recommended": { en: "Recommended Crop", te: "సిఫార్సు చేసిన పంట" },
  "crop.topFactors": { en: "Top 3 Influencing Factors", te: "ముఖ్యమైన 3 ప్రభావ కారకాలు" },
  "crop.featureImportance": { en: "Feature Importance", te: "లక్షణ ప్రాముఖ్యత" },

  // Disease Detection
  "disease.title": { en: "Crop Disease Detection", te: "పంట వ్యాధి గుర్తింపు" },
  "disease.subtitle": { en: "Upload a crop image to detect diseases", te: "వ్యాధులను గుర్తించడానికి పంట చిత్రాన్ని అప్‌లోడ్ చేయండి" },
  "disease.upload": { en: "Upload Image", te: "చిత్రాన్ని అప్‌లోడ్ చేయండి" },
  "disease.severity": { en: "Severity", te: "తీవ్రత" },
  "disease.treatment": { en: "Treatment Steps", te: "చికిత్స దశలు" },
  "disease.qualityWarning": { en: "⚠️ Image quality may be low. Results might be less accurate.", te: "⚠️ చిత్ర నాణ్యత తక్కువగా ఉండవచ్చు. ఫలితాలు తక్కువ ఖచ్చితంగా ఉండవచ్చు." },

  // Yield
  "yield.title": { en: "Yield Prediction", te: "దిగుబడి అంచనా" },
  "yield.subtitle": { en: "Estimate crop yield based on conditions", te: "పరిస్థితుల ఆధారంగా పంట దిగుబడిని అంచనా వేయండి" },
  "yield.estimated": { en: "Estimated Yield", te: "అంచనా దిగుబడి" },
  "yield.range": { en: "Yield Range", te: "దిగుబడి శ్రేణి" },

  // Health Score
  "health.title": { en: "Crop Health Score", te: "పంట ఆరోగ్య స్కోరు" },
  "health.subtitle": { en: "Overall health assessment of your crop", te: "మీ పంట యొక్క మొత్తం ఆరోగ్య అంచనా" },
  "health.diseaseImpact": { en: "Disease Severity Impact", te: "వ్యాధి తీవ్రత ప్రభావం" },
  "health.nutrientImpact": { en: "Nutrient Balance Impact", te: "పోషక సమతుల్యత ప్రభావం" },
  "health.yieldImpact": { en: "Yield Risk Impact", te: "దిగుబడి ప్రమాద ప్రభావం" },

  // Farm Economics
  "econ.title": { en: "Farm Economics", te: "వ్యవసాయ ఆర్థికశాస్త్రం" },
  "econ.subtitle": { en: "Calculate costs, revenue, and profit", te: "ఖర్చులు, ఆదాయం మరియు లాభాన్ని లెక్కించండి" },
  "econ.fertilizerCost": { en: "Fertilizer Cost (₹)", te: "ఎరువుల ఖర్చు (₹)" },
  "econ.laborCost": { en: "Labor Cost (₹)", te: "శ్రమ ఖర్చు (₹)" },
  "econ.irrigationCost": { en: "Irrigation Cost (₹)", te: "సాగునీటి ఖర్చు (₹)" },
  "econ.totalCost": { en: "Total Cost", te: "మొత్తం ఖర్చు" },
  "econ.revenue": { en: "Expected Revenue", te: "అంచనా ఆదాయం" },
  "econ.profit": { en: "Profit Estimate", te: "లాభం అంచనా" },
  "econ.estimatedYield": { en: "Estimated Yield (quintals)", te: "అంచనా దిగుబడి (క్వింటాళ్ళు)" },

  // Alerts
  "alert.title": { en: "Smart Alert System", te: "స్మార్ట్ హెచ్చరిక వ్యవస్థ" },
  "alert.subtitle": { en: "Automated alerts for critical conditions", te: "క్లిష్టమైన పరిస్థితులకు ఆటోమేటెడ్ హెచ్చరికలు" },
  "alert.type": { en: "Alert Type", te: "హెచ్చరిక రకం" },
  "alert.priority": { en: "Priority", te: "ప్రాధాన్యత" },
  "alert.emailPreview": { en: "Email Preview", te: "ఇమెయిల్ ప్రివ్యూ" },
  "alert.smsPreview": { en: "SMS Preview", te: "SMS ప్రివ్యూ" },
  "alert.voicePreview": { en: "Voice Call Message", te: "వాయిస్ కాల్ సందేశం" },
  "alert.history": { en: "Alert History", te: "హెచ్చరిక చరిత్ర" },

  // Reports
  "report.title": { en: "Comprehensive Report", te: "సమగ్ర నివేదిక" },
  "report.subtitle": { en: "Download complete farm analysis report", te: "పూర్తి వ్యవసాయ విశ్లేషణ నివేదికను డౌన్‌లోడ్ చేయండి" },

  // Admin
  "admin.title": { en: "Admin Dashboard", te: "అడ్మిన్ డాష్‌బోర్డ్" },
  "admin.totalFarmers": { en: "Total Registered Farmers", te: "మొత్తం నమోదైన రైతులు" },
  "admin.stateDistribution": { en: "State-wise Distribution", te: "రాష్ట్ర వారీ పంపిణీ" },
  "admin.commonCrops": { en: "Most Recommended Crops", te: "ఎక్కువగా సిఫార్సు చేసిన పంటలు" },
  "admin.commonDiseases": { en: "Common Diseases", te: "సాధారణ వ్యాధులు" },
  "admin.totalAlerts": { en: "Total Alerts Generated", te: "మొత్తం హెచ్చరికలు" },
  "admin.modelUsage": { en: "Model Usage Statistics", te: "మోడల్ వాడకం గణాంకాలు" },

  // Workers
  "workers.title": { en: "Farm Workers", te: "వ్యవసాయ కార్మికులు" },
  "workers.subtitle": { en: "Find and hire farm workers for your needs", te: "మీ అవసరాలకు వ్యవసాయ కార్మికులను కనుగొనండి" },
  "workers.join": { en: "Join as Worker", te: "కార్మికుడిగా చేరండి" },
  "workers.browse": { en: "Browse Workers", te: "కార్మికులను చూడండి" },
  "workers.skills": { en: "Skills", te: "నైపుణ్యాలు" },
  "workers.available": { en: "Available", te: "అందుబాటులో" },
  "workers.call": { en: "Call", te: "కాల్ చేయండి" },
  "workers.message": { en: "Message", te: "సందేశం" },

  // Fertilizer
  "fert.title": { en: "Fertilizer Advisor", te: "ఎరువుల సలహాదారు" },
  "fert.subtitle": { en: "Get fertilizer recommendations for your crop", te: "మీ పంట కోసం ఎరువుల సిఫార్సులు పొందండి" },

  // Pesticide
  "pest.title": { en: "Pesticide Recommendation", te: "పురుగుమందు సిఫార్సు" },
  "pest.subtitle": { en: "Get pesticide recommendations based on detected disease", te: "గుర్తించిన వ్యాధి ఆధారంగా పురుగుమందు సిఫార్సులు పొందండి" },

  // Profit
  "profit.title": { en: "Profit Estimation", te: "లాభం అంచనా" },
  "profit.subtitle": { en: "Detailed profit analysis based on your inputs", te: "మీ ఇన్‌పుట్‌ల ఆధారంగా వివరమైన లాభ విశ్లేషణ" },

  // Chatbot
  "chat.title": { en: "AgriBot Assistant", te: "అగ్రిబాట్ సహాయకుడు" },
  "chat.placeholder": { en: "Ask me anything about farming...", te: "వ్యవసాయం గురించి ఏదైనా అడగండి..." },
  "chat.welcome": { en: "Hello! I'm AgriBot. How can I help you today?", te: "నమస్కారం! నేను అగ్రిబాట్. ఈ రోజు మీకు ఎలా సహాయం చేయగలను?" },

  // Footer
  "footer.builtBy": { en: "Built by AgriAdvisory", te: "AgriAdvisory చే నిర్మించబడింది" },
};
