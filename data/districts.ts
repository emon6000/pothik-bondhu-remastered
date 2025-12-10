import { District } from '../types';

export const districts: District[] = [
  // Barishal Division
  { 
    name: "Barguna", 
    bnName: "বরগুনা",
    aliases: ["Borguna"], 
    division: "Barishal",
    famousFoods: ["Hilsa Fish", "Dry Fish (Shutki)"],
    placesOfInterest: ["Fatrar Char", "Harinbaria Forest", "Bibir Chini Mosque", "Laldia Forest"],
    coordinates: { lat: 22.1520, lng: 90.1182 }
  },
  { 
    name: "Barishal", 
    bnName: "বরিশাল",
    aliases: ["Barisal"], 
    division: "Barishal",
    famousFoods: ["Hog Plum (Amra)", "Guava", "Hilsa Fish"],
    placesOfInterest: ["Durga Sagar", "Guthia Mosque", "Oxford Mission Church", "Floating Guava Market (nearby)"],
    coordinates: { lat: 22.7022, lng: 90.3696 }
  },
  { 
    name: "Bhola", 
    bnName: "ভোলা",
    aliases: [], 
    division: "Barishal",
    famousFoods: ["Buffalo Curd", "Hilsa Fish", "Coconut"],
    placesOfInterest: ["Char Kukri Mukri", "Monpura Island", "Jacob Tower", "Shahbazpur Gas Field"],
    coordinates: { lat: 22.6881, lng: 90.6445 }
  },
  { 
    name: "Jhalokati", 
    bnName: "ঝালকাঠি",
    aliases: ["Jhalakathi"], 
    division: "Barishal",
    famousFoods: ["Lalkalai", "Guava", "Flattened Rice (Chira)"],
    placesOfInterest: ["Kirtipasha Zamindar Bari", "Sher-e-Bangla Fazlul Haque's House", "Sujabad Kella", "Floating Guava Market"],
    coordinates: { lat: 22.6423, lng: 90.2003 }
  },
  { 
    name: "Patuakhali", 
    bnName: "পটুয়াখালী",
    aliases: ["Potuakhali"], 
    division: "Barishal",
    famousFoods: ["Misti Paan", "Hilsa", "Watermelon"],
    placesOfInterest: ["Kuakata Sea Beach", "Sonar Char", "Fatrar Char", "Water Museum"],
    coordinates: { lat: 22.3541, lng: 90.3181 }
  },
  { 
    name: "Pirojpur", 
    bnName: "পিরোজপুর",
    aliases: ["Perojpur"], 
    division: "Barishal",
    famousFoods: ["Malta", "Hog Plum", "Coconut"],
    placesOfInterest: ["Rayerkati Zamindar Bari", "Baleshwar River Bridge", "Mojher Char", "Kuriana Floating Market"],
    coordinates: { lat: 22.5781, lng: 89.9982 }
  },

  // Chattogram Division
  { 
    name: "Bandarban", 
    bnName: "বান্দরবান",
    aliases: ["Bandarbon"], 
    division: "Chattogram",
    famousFoods: ["Bamboo Chicken", "Nappi", "Hill Tracts Pineapple"],
    placesOfInterest: ["Nilgiri", "Nafakhum", "Boga Lake", "Golden Temple", "Keokradong"],
    coordinates: { lat: 22.1963, lng: 92.2198 }
  },
  { 
    name: "Brahmanbaria", 
    bnName: "ব্রাহ্মণবাড়িয়া",
    aliases: ["Bramonbaria"], 
    division: "Chattogram",
    famousFoods: ["Chhanamukhi Sweet", "Talsash Sweet", "Cock Fighter Roosters"],
    placesOfInterest: ["Akhaura Land Port", "Ulchapara Mosque", "Kalvairab Statue", "Arifail Mosque"],
    coordinates: { lat: 23.9601, lng: 91.1124 }
  },
  { 
    name: "Chandpur", 
    bnName: "চাঁদপুর",
    aliases: [], 
    division: "Chattogram",
    famousFoods: ["Hilsa Fish (Ilish)", "Malai Ice Cream"],
    placesOfInterest: ["Mohona (Padma-Meghna-Dakatia confluence)", "Raktotjoba", "Angikar"],
    coordinates: { lat: 23.2341, lng: 90.6622 }
  },
  { 
    name: "Chattogram", 
    bnName: "চট্টগ্রাম",
    aliases: ["Chittagong", "CTG"], 
    division: "Chattogram",
    famousFoods: ["Mezban Beef", "Bela Biscuit", "Shutki (Dried Fish)", "Bakarkhani"],
    placesOfInterest: ["Patenga Sea Beach", "Foy's Lake", "Naval Academy", "Ethnological Museum", "Guliakhali Beach"],
    coordinates: { lat: 22.3569, lng: 91.7832 }
  },
  { 
    name: "Cumilla", 
    bnName: "কুমিল্লা",
    aliases: ["Comilla"], 
    division: "Chattogram",
    famousFoods: ["Rasmalai", "Khadi Cloth", "Tille"],
    placesOfInterest: ["Shalban Vihara", "Mainamati War Cemetery", "Dharmasagar Dighi", "Kotbari"],
    coordinates: { lat: 23.4576, lng: 91.1809 }
  },
  { 
    name: "Cox's Bazar", 
    bnName: "কক্সবাজার",
    aliases: ["Cox Bazar", "Cox's Bazaar"], 
    division: "Chattogram",
    famousFoods: ["Seafood", "Dry Fish (Shutki)", "Achar"],
    placesOfInterest: ["World's Longest Sea Beach", "Himchari National Park", "Inani Beach", "Saint Martin's Island", "Marine Drive"],
    coordinates: { lat: 21.4272, lng: 92.0058 }
  },
  { 
    name: "Feni", 
    bnName: "ফেনী",
    aliases: [], 
    division: "Chattogram",
    famousFoods: ["Khonderaru", "Ghee"],
    placesOfInterest: ["Muhuri Dam", "Bijoy Singh Dighi", "Chand Gazi Bhuiyan Mosque", "Shomsher Gazi Dighi"],
    coordinates: { lat: 23.0159, lng: 91.3976 }
  },
  { 
    name: "Khagrachhari", 
    bnName: "খাগড়াছড়ি",
    aliases: ["Khagrachari"], 
    division: "Chattogram",
    famousFoods: ["Bamboo Shoot Curry", "Pajon", "Hill Pineapple"],
    placesOfInterest: ["Alutila Cave", "Risang Waterfall", "Richhang Waterfall", "Horticulture Park"],
    coordinates: { lat: 23.1322, lng: 91.9490 }
  },
  { 
    name: "Lakshmipur", 
    bnName: "লক্ষ্মীপুর",
    aliases: ["Laxmipur"], 
    division: "Chattogram",
    famousFoods: ["Buffalo Curd", "Soybean"],
    placesOfInterest: ["Dalal Bazar Zamindar Bari", "Khoa Sagor Dighi", "Ramganj Sreerampur Rajbari"],
    coordinates: { lat: 22.9443, lng: 90.8282 }
  },
  { 
    name: "Noakhali", 
    bnName: "নোয়াখালী",
    aliases: [], 
    division: "Chattogram",
    famousFoods: ["Coconut Naru", "Pitha", "Buffalo Milk Curd"],
    placesOfInterest: ["Nijhum Dwip", "Gandhi Ashram", "Bajra Shahi Mosque", "Musapur Closure"],
    coordinates: { lat: 22.8724, lng: 91.0973 }
  },
  { 
    name: "Rangamati", 
    bnName: "রাঙ্গামাটি",
    aliases: ["Rangamati Hill District"], 
    division: "Chattogram",
    famousFoods: ["Kaptai Lake Fish", "Bamboo Chicken", "Local Wine"],
    placesOfInterest: ["Kaptai Lake", "Hanging Bridge", "Shuvolong Waterfall", "Sajek Valley", "Polwel Park"],
    coordinates: { lat: 22.6533, lng: 92.1789 }
  },

  // Dhaka Division
  { 
    name: "Dhaka", 
    bnName: "ঢাকা",
    aliases: ["Dacca"], 
    division: "Dhaka",
    famousFoods: ["Kacchi Biryani", "Old Dhaka Bakarkhani", "Haji Biryani", "Borhani"],
    placesOfInterest: ["Lalbagh Fort", "Ahsan Manzil", "National Parliament House", "Dhakeshwari Temple", "Liberation War Museum"],
    coordinates: { lat: 23.8103, lng: 90.4125 }
  },
  { 
    name: "Faridpur", 
    bnName: "ফরিদপুর",
    aliases: [], 
    division: "Dhaka",
    famousFoods: ["Date Molasses (Khejur Gur)", "Padma Hilsa"],
    placesOfInterest: ["River Research Institute", "Kanaipur Zamindar Bari", "House of Pallikabi Jasimuddin"],
    coordinates: { lat: 23.6061, lng: 89.8406 }
  },
  { 
    name: "Gazipur", 
    bnName: "গাজীপুর",
    aliases: [], 
    division: "Dhaka",
    famousFoods: ["Jackfruit", "Guava"],
    placesOfInterest: ["Bhawal National Park", "Nuhash Polli", "Safari Park", "Bhawal Rajbari"],
    coordinates: { lat: 24.0023, lng: 90.4264 }
  },
  { 
    name: "Gopalganj", 
    bnName: "গোপালগঞ্জ",
    aliases: ["Gopalgonj"], 
    division: "Dhaka",
    famousFoods: ["Rasogolla", "Kotaliapara Sweets"],
    placesOfInterest: ["Mausoleum of Father of the Nation", "Tungipara", "Orakandi Thakur Bari"],
    coordinates: { lat: 23.0051, lng: 89.8262 }
  },
  { 
    name: "Kishoreganj", 
    bnName: "কিশোরগঞ্জ",
    aliases: ["Kishoregonj"], 
    division: "Dhaka",
    famousFoods: ["Balish Misti (Pillow Sweet)", "Nakshi Pitha"],
    placesOfInterest: ["Nikli Haor", "Sholakia Eid Gah", "Jangalbari Fort", "Pagla Mosque"],
    coordinates: { lat: 24.4331, lng: 90.7766 }
  },
  { 
    name: "Madaripur", 
    bnName: "মাদারীপুর",
    aliases: [], 
    division: "Dhaka",
    famousFoods: ["Rasogolla", "Date Molasses"],
    placesOfInterest: ["Mithapur Zamindar Bari", "Raja Ram Temple", "Shakuni Lake"],
    coordinates: { lat: 23.1646, lng: 90.1944 }
  },
  { 
    name: "Manikganj", 
    bnName: "মানিকগঞ্জ",
    aliases: ["Manikgonj"], 
    division: "Dhaka",
    famousFoods: ["Date Molasses (Patali Gur)", "Hilsa of Padma"],
    placesOfInterest: ["Baliati Zamindar Bari", "Teota Zamindar Bari", "Aricha Ghat"],
    coordinates: { lat: 23.8617, lng: 90.0003 }
  },
  { 
    name: "Munshiganj", 
    bnName: "মুন্সীগঞ্জ",
    aliases: ["Munshigonj", "Bikrampur"], 
    division: "Dhaka",
    famousFoods: ["Patkhir", "Project Hilsa"],
    placesOfInterest: ["Idrakpur Fort", "Baba Adam's Mosque", "Jagadish Chandra Bose's House", "Mawa Ghat"],
    coordinates: { lat: 23.5422, lng: 90.5358 }
  },
  { 
    name: "Narayanganj", 
    bnName: "নারায়ণগঞ্জ",
    aliases: ["Narayangonj"], 
    division: "Dhaka",
    famousFoods: ["Hoseni Sweets", "Pond Fish"],
    placesOfInterest: ["Sonargaon Folk Art Museum", "Panam City", "Hajiganj Fort", "Kadam Rasul Shrine"],
    coordinates: { lat: 23.6238, lng: 90.5000 }
  },
  { 
    name: "Narsingdi", 
    bnName: "নরসিংদী",
    aliases: ["Norshingdi"], 
    division: "Dhaka",
    famousFoods: ["Sagor Banana", "Lolotpuri Sweet"],
    placesOfInterest: ["Wari-Bateshwar Ruins", "Dream Holiday Park", "Balapur Zamindar Bari"],
    coordinates: { lat: 23.9322, lng: 90.7154 }
  },
  { 
    name: "Rajbari", 
    bnName: "রাজবাড়ী",
    aliases: [], 
    division: "Dhaka",
    famousFoods: ["Chamcham", "Padma Fish"],
    placesOfInterest: ["Goalundo Ghat", "Rajbari Museum", "Kalyan Dighi"],
    coordinates: { lat: 23.7638, lng: 89.6467 }
  },
  { 
    name: "Shariatpur", 
    bnName: "শরীয়তপুর",
    aliases: [], 
    division: "Dhaka",
    famousFoods: ["Hilsa Fish", "Spices"],
    placesOfInterest: ["Haturia Zamindar Bari", "Modern Fantasy Kingdom", "Fateh Jangpur Fort"],
    coordinates: { lat: 23.2183, lng: 90.3523 }
  },
  { 
    name: "Tangail", 
    bnName: "টাঙ্গাইল",
    aliases: [], 
    division: "Dhaka",
    famousFoods: ["Porabari Chamcham", "Pineapple of Madhupur"],
    placesOfInterest: ["Mohera Zamindar Bari", "Madhupur National Park", "Atia Mosque", "201 Dome Mosque"],
    coordinates: { lat: 24.2513, lng: 89.9167 }
  },

  // Khulna Division
  { 
    name: "Bagerhat", 
    bnName: "বাগেরহাট",
    aliases: [], 
    division: "Khulna",
    famousFoods: ["Shrimp", "Coconut", "Date Juice"],
    placesOfInterest: ["Sixty Dome Mosque (Shat Gombuj Masjid)", "Sundarbans", "Khan Jahan Ali Shrine", "Mongla Port"],
    coordinates: { lat: 22.6552, lng: 89.7895 }
  },
  { 
    name: "Chuadanga", 
    bnName: "চুয়াডাঙ্গা",
    aliases: [], 
    division: "Khulna",
    famousFoods: ["Date Molasses", "Paan (Betel Leaf)"],
    placesOfInterest: ["Ghol Dariyapur Baor", "Thakurpur Mosque", "Carew & Co"],
    coordinates: { lat: 23.6420, lng: 88.8562 }
  },
  { 
    name: "Jashore", 
    bnName: "যশোর",
    aliases: ["Jessore"], 
    division: "Khulna",
    famousFoods: ["Date Molasses", "Nakshi Kantha", "Jamtola Sweets"],
    placesOfInterest: ["Michael Madhusudan Dutt's Bari", "Benapole Land Port", "Collectorate Building"],
    coordinates: { lat: 23.1634, lng: 89.2182 }
  },
  { 
    name: "Jhenaidah", 
    bnName: "ঝিনাইদহ",
    aliases: ["Jhenaidah"], 
    division: "Khulna",
    famousFoods: ["Banana", "Date Molasses"],
    placesOfInterest: ["Naldanga Temple Complex", "Barobazar Historical Site", "Miar Dalan"],
    coordinates: { lat: 23.5449, lng: 89.1726 }
  },
  { 
    name: "Khulna", 
    bnName: "খুলনা",
    aliases: [], 
    division: "Khulna",
    famousFoods: ["Chui Jhal Beef", "Sandesh", "Prawns"],
    placesOfInterest: ["Sundarbans", "Khan Jahan Ali Bridge (Rupsha)", "Khulna Divisional Museum", "Hiron Point"],
    coordinates: { lat: 22.8456, lng: 89.5403 }
  },
  { 
    name: "Kushtia", 
    bnName: "কুষ্টিয়া",
    aliases: [], 
    division: "Khulna",
    famousFoods: ["Kulfi Malai", "Til Khaja"],
    placesOfInterest: ["Lalon Shah's Shrine", "Rabindranath Tagore's Kuthibari", "Hardinge Bridge"],
    coordinates: { lat: 23.9013, lng: 89.1205 }
  },
  { 
    name: "Magura", 
    bnName: "মাগুরা",
    aliases: [], 
    division: "Khulna",
    famousFoods: ["Famous for Nabaganga River Fish", "Khamar Para Sweets"],
    placesOfInterest: ["Sreepur Zamindar Bari", "Siddheshwari Mot", "Magura Park"],
    coordinates: { lat: 23.4855, lng: 89.4198 }
  },
  { 
    name: "Meherpur", 
    bnName: "মেহেরপুর",
    aliases: [], 
    division: "Khulna",
    famousFoods: ["Mango", "Roskadamba Sweet"],
    placesOfInterest: ["Mujibnagar Memorial Complex", "Amjhupi Nilkuthi", "Ballavpur Church"],
    coordinates: { lat: 23.7622, lng: 88.6318 }
  },
  { 
    name: "Narail", 
    bnName: "নড়াইল",
    aliases: [], 
    division: "Khulna",
    famousFoods: ["Peda Sandesh", "Date Molasses"],
    placesOfInterest: ["SM Sultan Complex", "Narail Victoria College", "Niribili Picnic Spot"],
    coordinates: { lat: 23.1725, lng: 89.5127 }
  },
  { 
    name: "Satkhira", 
    bnName: "সাতক্ষীরা",
    aliases: [], 
    division: "Khulna",
    famousFoods: ["Sandesh", "Mango", "Sundarbans Honey"],
    placesOfInterest: ["Sundarbans (Mandarbariya)", "Nalta Sharif", "Mozaffar Garden", "Tetulia Jami Mosque"],
    coordinates: { lat: 22.7185, lng: 89.0705 }
  },

  // Mymensingh Division
  { 
    name: "Jamalpur", 
    bnName: "জামালপুর",
    aliases: [], 
    division: "Mymensingh",
    famousFoods: ["Chhanar Polao", "Nakshi Kantha items"],
    placesOfInterest: ["Jamuna Fertilizer Factory", "Lauchapra Pahar", "Gandhi Ashram"],
    coordinates: { lat: 24.9375, lng: 89.9378 }
  },
  { 
    name: "Mymensingh", 
    bnName: "ময়মনসিংহ",
    aliases: [], 
    division: "Mymensingh",
    famousFoods: ["Muktagacha Monda", "Jackfruit"],
    placesOfInterest: ["Shashi Lodge", "Bangladesh Agricultural University", "Shilpacharya Zainul Abedin Sangrahashala", "Muktagacha Rajbari"],
    coordinates: { lat: 24.7471, lng: 90.4203 }
  },
  { 
    name: "Netrokona", 
    bnName: "নেত্রকোনা",
    aliases: ["Netrakona"], 
    division: "Mymensingh",
    famousFoods: ["Balish Misti (Pillow Sweets)", "Fish of Haor"],
    placesOfInterest: ["Birishiri", "Bijoypur White Clay Hill", "Ranikhong Church", "Durgapur"],
    coordinates: { lat: 24.8710, lng: 90.7277 }
  },
  { 
    name: "Sherpur", 
    bnName: "শেরপুর",
    aliases: [], 
    division: "Mymensingh",
    famousFoods: ["Chhanar Payesh", "Monda"],
    placesOfInterest: ["Ghazni Abakash", "Modhutila Eco Park", "Rajar Pahar"],
    coordinates: { lat: 25.0205, lng: 90.0153 }
  },

  // Rajshahi Division
  { 
    name: "Bogura", 
    bnName: "বগুড়া",
    aliases: ["Bogra"], 
    division: "Rajshahi",
    famousFoods: ["Bogurar Doi (Curd)", "Kotkoti"],
    placesOfInterest: ["Mahasthangarh", "Behula Lakshindar Gokul Medh", "Kherua Mosque", "Nawabbari Palace"],
    coordinates: { lat: 24.8481, lng: 89.3730 }
  },
  { 
    name: "Chapainawabganj", 
    bnName: "চাঁপাইনবাবগঞ্জ",
    aliases: ["Nawabganj", "Chapai"], 
    division: "Rajshahi",
    famousFoods: ["Mango", "Kalai Ruti", "Roshomalai"],
    placesOfInterest: ["Choto Sona Mosque", "Tahanapara", "Rohanpur Octagonal Tomb"],
    coordinates: { lat: 24.5965, lng: 88.2775 }
  },
  { 
    name: "Joypurhat", 
    bnName: "জয়পুরহাট",
    aliases: ["Joypurhat"], 
    division: "Rajshahi",
    famousFoods: ["Patla Khanjir", "Litchi"],
    placesOfInterest: ["Paharpur Buddhist Vihara (nearby)", "Lockma Rajbari", "Hinda-Kashba Shahi Mosque"],
    coordinates: { lat: 25.1015, lng: 89.0259 }
  },
  { 
    name: "Naogaon", 
    bnName: "নওগাঁ",
    aliases: [], 
    division: "Rajshahi",
    famousFoods: ["Pera Sandesh", "Mango"],
    placesOfInterest: ["Paharpur Buddhist Vihara (Somapura Mahavihara)", "Kusumba Mosque", "Dubalhati Rajbari"],
    coordinates: { lat: 24.8101, lng: 88.9425 }
  },
  { 
    name: "Natore", 
    bnName: "নাটোর",
    aliases: ["Nator"], 
    division: "Rajshahi",
    famousFoods: ["Kachagolla"],
    placesOfInterest: ["Natore Rajbari", "Uttara Ganabhaban", "Chalan Beel"],
    coordinates: { lat: 24.4102, lng: 89.0076 }
  },
  { 
    name: "Pabna", 
    bnName: "পাবনা",
    aliases: [], 
    division: "Rajshahi",
    famousFoods: ["Ghee", "Pabna Saree", "Pera Sweet"],
    placesOfInterest: ["Paksey Hardinge Bridge", "Ishwardi Railway Junction", "Hemayetpur Mental Hospital", "Gajna Beel"],
    coordinates: { lat: 24.0064, lng: 89.2372 }
  },
  { 
    name: "Rajshahi", 
    bnName: "রাজশাহী",
    aliases: [], 
    division: "Rajshahi",
    famousFoods: ["Mango", "Rajshahi Silk", "Kalai Ruti"],
    placesOfInterest: ["Varendra Research Museum", "Bagha Mosque", "Puthia Temple Complex", "Padma Garden"],
    coordinates: { lat: 24.3733, lng: 88.6011 }
  },
  { 
    name: "Sirajganj", 
    bnName: "সিরাজগঞ্জ",
    aliases: ["Sirajgonj"], 
    division: "Rajshahi",
    famousFoods: ["Panitowa", "Doi (Curd)", "Handloom Saree"],
    placesOfInterest: ["Bangabandhu Bridge (Jamuna Bridge)", "Rabindra Kuthibari (Shahjadpur)", "Navaratna Temple"],
    coordinates: { lat: 24.4534, lng: 89.7008 }
  },

  // Rangpur Division
  { 
    name: "Dinajpur", 
    bnName: "দিনাজপুর",
    aliases: [], 
    division: "Rangpur",
    famousFoods: ["Litchi", "Kataribhog Rice", "Papad"],
    placesOfInterest: ["Kantajew Temple", "Ramsagar Dighi", "Nayabad Mosque", "Shopnopuri Artificial Amusement Park"],
    coordinates: { lat: 25.6217, lng: 88.6355 }
  },
  { 
    name: "Gaibandha", 
    bnName: "গাইবান্ধা",
    aliases: [], 
    division: "Rangpur",
    famousFoods: ["Rosmonjuri", "Roshomalai"],
    placesOfInterest: ["Balashi Ghat", "Dreamland", "Mirer Bagan"],
    coordinates: { lat: 25.3288, lng: 89.5281 }
  },
  { 
    name: "Kurigram", 
    bnName: "কুড়িগ্রাম",
    aliases: [], 
    division: "Rangpur",
    famousFoods: ["Khirmohan", "Sweets"],
    placesOfInterest: ["Dharla Bridge", "Chilmari Port", "Shahi Mosque"],
    coordinates: { lat: 25.8072, lng: 89.6295 }
  },
  { 
    name: "Lalmonirhat", 
    bnName: "লালমনিরহাট",
    aliases: [], 
    division: "Rangpur",
    famousFoods: ["Tobacco", "Corn", "Tea"],
    placesOfInterest: ["Tin Bigha Corridor", "Teesta Barrage", "Burimari Land Port"],
    coordinates: { lat: 25.9165, lng: 89.4532 }
  },
  { 
    name: "Nilphamari", 
    bnName: "নীলফামারী",
    aliases: [], 
    division: "Rangpur",
    famousFoods: ["Domar Sandesh", "Tobacco"],
    placesOfInterest: ["Nilsagar", "Chini Mosque", "Teesta Barrage (Dalia Point)"],
    coordinates: { lat: 25.9318, lng: 88.8560 }
  },
  { 
    name: "Panchagarh", 
    bnName: "পঞ্চগড়",
    aliases: ["Panchagar"], 
    division: "Rangpur",
    famousFoods: ["Tea", "Oranges", "Rocks (Stone)"],
    placesOfInterest: ["Tetulia", "Banglabandha Zero Point", "Kanchenjunga View Point", "Mirzapur Shahi Mosque"],
    coordinates: { lat: 26.3411, lng: 88.5542 }
  },
  { 
    name: "Rangpur", 
    bnName: "রংপুর",
    aliases: [], 
    division: "Rangpur",
    famousFoods: ["Haribhanga Mango", "Tobacco", "Siliguri Rice"],
    placesOfInterest: ["Tajhat Landlord's Palace", "Vinnya Jagat", "Rangpur Zoo", "Carmichael College"],
    coordinates: { lat: 25.7439, lng: 89.2752 }
  },
  { 
    name: "Thakurgaon", 
    bnName: "ঠাকুরগাঁও",
    aliases: [], 
    division: "Rangpur",
    famousFoods: ["Suryapuri Mango", "Haribhanga Mango"],
    placesOfInterest: ["Baliadangi Suryapuri Mango Tree", "Fun City", "Jagannathpur Temple"],
    coordinates: { lat: 26.0337, lng: 88.4617 }
  },

  // Sylhet Division
  { 
    name: "Habiganj", 
    bnName: "হবিগঞ্জ",
    aliases: ["Hobiganj"], 
    division: "Sylhet",
    famousFoods: ["Tea", "Orange", "Pineapple"],
    placesOfInterest: ["Satchari National Park", "Remacri", "Shankhanidhi Pilgrimage"],
    coordinates: { lat: 24.3840, lng: 91.4169 }
  },
  { 
    name: "Moulvibazar", 
    bnName: "মৌলভীবাজার",
    aliases: ["Moulvi Bazar"], 
    division: "Sylhet",
    famousFoods: ["Seven Layer Tea", "Tea", "Lemon"],
    placesOfInterest: ["Lawachara National Park", "Madhabkunda Waterfall", "Baikka Beel", "Ham Ham Waterfall"],
    coordinates: { lat: 24.4829, lng: 91.7649 }
  },
  { 
    name: "Sunamganj", 
    bnName: "সুনামগঞ্জ",
    aliases: ["Sunamgonj"], 
    division: "Sylhet",
    famousFoods: ["Fish", "Shutki", "Tanguar Haor Fish"],
    placesOfInterest: ["Tanguar Haor", "Shimul Bagan", "Niladri Lake", "Hason Raja Museum"],
    coordinates: { lat: 25.0662, lng: 91.4073 }
  },
  { 
    name: "Sylhet", 
    bnName: "সিলেট",
    aliases: [], 
    division: "Sylhet",
    famousFoods: ["Satkora Beef", "Tea", "Pitha"],
    placesOfInterest: ["Jaflong", "Ratargul Swamp Forest", "Shah Jalal Dargah", "Bisanakandi", "Lalakhal"],
    coordinates: { lat: 24.8949, lng: 91.8687 }
  }
];