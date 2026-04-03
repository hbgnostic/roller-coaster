// ============================================================
// CoasterVerse Data — timeline, trivia, cards, facts
// ============================================================

/* ---------- TIMELINE ---------- */
export interface TimelineEntry {
  year: number;
  title: string;
  detail: string;
  kidDetail: string;
}

export const timelineEntries: TimelineEntry[] = [
  { year: 1817, title: "Promenades Aériennes", detail: "The first wheeled roller coaster opens in Paris — riders descended a gentle slope on carts locked to a wooden track. The ride used gravity alone and reached roughly 30 mph.", kidDetail: "🎢 The very first roller coaster opened in Paris! It was made of wood and went about as fast as a car in a parking lot!" },
  { year: 1827, title: "Mauch Chunk Switchback Railway", detail: "A repurposed coal mine railway in Pennsylvania becomes a paid tourist attraction. The 9-mile gravity ride descended 2,322 feet of elevation at up to 50 mph.", kidDetail: "🏔️ A coal train in Pennsylvania became a roller coaster! People paid to ride a train DOWN a mountain — wheeee!" },
  { year: 1884, title: "Switchback Railway at Coney Island", detail: "LaMarcus Adna Thompson builds America's first purpose-built roller coaster at Coney Island. Riders paid 5¢ for a 6 mph ride down a 600-foot track.", kidDetail: "🎪 The first REAL roller coaster in America! It only cost a nickel and went slower than you can ride your bike!" },
  { year: 1895, title: "Flip Flap Railway", detail: "The first looping roller coaster. A perfectly circular loop produced up to 12 G of centripetal force — enough to cause neck injuries. Replaced quickly by the safer clothoid loop design.", kidDetail: "🔄 The first upside-down roller coaster! It was SO intense that people's necks hurt. Engineers had to redesign the loops!" },
  { year: 1927, title: "The Cyclone — Coney Island", detail: "Designed by Vernon Keenan, the Cyclone opens at Coney Island with an 85-foot first drop at 60 mph. Its tight track and aggressive laterals make it legendary. Still operating today.", kidDetail: "🌀 The famous Cyclone opened at Coney Island! It's almost 100 years old and you can STILL ride it today!" },
  { year: 1959, title: "Matterhorn Bobsleds — Disneyland", detail: "The world's first tubular steel-track roller coaster. Arrow Development's innovation of bending steel tubes allowed smoother, more complex track shapes — the foundation of modern coasters.", kidDetail: "🏰 Disneyland made the first roller coaster with smooth steel tubes! This invention changed coasters FOREVER!" },
  { year: 1975, title: "Corkscrew — Knott's Berry Farm", detail: "Arrow Dynamics installs the first modern inverting coaster with two corkscrews. Unlike the dangerous circular loops of the 1890s, these used clothoid geometry for safe 3–4 G inversions.", kidDetail: "🌀 The first coaster that turned you upside-down safely! Two corkscrews that spun you around — without hurting your neck!" },
  { year: 1976, title: "Revolution — Six Flags Magic Mountain", detail: "The first modern vertical loop on a coaster, designed by Anton Schwarzkopf. The loop used a teardrop/clothoid shape to keep G-forces between 3.5–4 G — thrilling but safe.", kidDetail: "⭕ The first big loop! It went straight up and over in a giant circle. Engineers made it egg-shaped so it felt amazing but safe!" },
  { year: 1989, title: "Magnum XL-200 — Cedar Point", detail: "Arrow Dynamics shatters the 200-foot barrier. At 205 ft tall and 72 mph, it inaugurates the 'hypercoaster' era. Its out-of-seat airtime redefined what coasters could deliver.", kidDetail: "🚀 The first coaster over 200 feet tall! That's taller than a 20-story building! It made you feel like you were FLYING out of your seat!" },
  { year: 1994, title: "Raptor — Cedar Point", detail: "B&M's inverted coaster suspends riders below the track with dangling feet. The 137-foot, 57 mph ride showed that inverted designs could be smooth, intense, and high-capacity.", kidDetail: "🦅 Your feet dangled in the air! You hung UNDER the track like a bird swooping through loops!" },
  { year: 2000, title: "Millennium Force — Cedar Point", detail: "Intamin's 310-foot, 93 mph giga coaster uses a cable lift hill and produces sustained floater airtime across its 6,595-foot layout. The first 'giga coaster' (300+ ft).", kidDetail: "🌟 The first coaster over 300 feet! That's like stacking 30 school buses on top of each other! It goes 93 mph — faster than most cars on the highway!" },
  { year: 2003, title: "Top Thrill Dragster — Cedar Point", detail: "Intamin's hydraulic launch catapults riders from 0 to 120 mph in 3.8 seconds up a 420-foot top hat. The first 'strata coaster' — over 400 feet tall.", kidDetail: "💨 Zero to 120 mph in less than 4 seconds! That's faster than a race car! Then you go over a 400-foot hill! INSANE!" },
  { year: 2005, title: "Kingda Ka — Six Flags Great Adventure", detail: "At 456 feet and 128 mph, Kingda Ka takes the height and speed records from Dragster. Uses a hydraulic launch generating 1.67 G of acceleration.", kidDetail: "👑 The tallest roller coaster EVER at 456 feet! That's taller than the Statue of Liberty! And it goes 128 mph!" },
  { year: 2010, title: "Formula Rossa — Ferrari World", detail: "A hydraulic-launched Intamin coaster reaching 149.1 mph — the fastest in the world. Riders wear goggles to protect from sand and insects at those speeds.", kidDetail: "🏎️ The FASTEST roller coaster in the world! 149 mph — faster than a cheetah, faster than most race cars! You have to wear GOGGLES!" },
  { year: 2012, title: "GateKeeper — Cedar Point", detail: "B&M's wing coaster places seats on either side of the track with nothing above or below. Riders experience a unique sensation of flight through its 170-foot keyhole element.", kidDetail: "✈️ You sit on the SIDE of the track with nothing above or below you! It feels like you're actually FLYING!" },
  { year: 2016, title: "Lightning Rod — Dollywood", detail: "RMC's launched wooden coaster — the first of its kind. A quad-down element delivers four consecutive moments of sustained airtime. Uses topper track on a wood structure.", kidDetail: "⚡ A WOODEN roller coaster with a launch! It pops you out of your seat FOUR times in a row!" },
  { year: 2018, title: "Steel Vengeance — Cedar Point", detail: "RMC converts the classic Mean Streak wooden coaster into a 205-foot hybrid with 30.4 seconds of airtime — more than any other coaster. Four inversions on a wood structure.", kidDetail: "🤠 They took an old wooden coaster and made it AMAZING! You feel weightless for over 30 seconds total — like being in space!" },
  { year: 2020, title: "Orion — Kings Island", detail: "B&M giga coaster with a 300-foot drop at 91 mph. Its compact 5,321-foot layout focuses on sustained negative-G parabolic hills.", kidDetail: "🪐 A 300-foot drop at 91 mph! The hills make you float out of your seat like an astronaut!" },
  { year: 2021, title: "Velocicoaster — Universal Orlando", detail: "Intamin's multi-launch masterpiece features a 155-foot top hat, zero-G stall, mosasaurus roll, and two LSM launches. Themed to Jurassic World with near-miss dinosaur encounters.", kidDetail: "🦖 You launch TWICE past real-looking dinosaurs! You go upside-down four times and it feels like a velociraptor is chasing you!" },
  { year: 2023, title: "Iron Gwazi — Busch Gardens Tampa", detail: "RMC hybrid conversion reaching 76 mph with a 206-foot drop at 91 degrees (beyond vertical). 12 airtime moments in a 4,075-foot layout.", kidDetail: "🐊 This coaster drops you MORE than straight down — it actually tilts you past vertical! You get 12 moments of floating!" },
  { year: 2025, title: "Top Thrill 2 — Cedar Point", detail: "Zamperla rebuilds the legendary Top Thrill Dragster as a two-spike shuttle coaster. A new LSM launch system replaces the unreliable hydraulic motors, reaching 120 mph.", kidDetail: "🔥 They rebuilt one of the fastest coasters with NEW technology! It launches you at 120 mph using giant magnets!" },
  { year: 2026, title: "The Future", detail: "Active developments include magnetic launch systems exceeding 150 mph, VR-enhanced rides, adaptive track systems, and AI-designed track profiles optimized for airtime and smoothness.", kidDetail: "🚀 The future is NOW! Coasters are getting faster, smarter, and more amazing every year! What will YOU dream up?" },
];

/* ---------- TRIVIA ---------- */
export interface TriviaQuestion {
  question: string;
  options: string[];
  answer: number; // index
  funFact: string;
  kidQuestion?: string;
  kidOptions?: string[];
  kidFunFact?: string;
}

export const triviaQuestions: TriviaQuestion[] = [
  { question: "What is the fastest roller coaster in the world?", options: ["Kingda Ka", "Formula Rossa", "Top Thrill Dragster", "Do-Dodonpa"], answer: 1, funFact: "Formula Rossa at Ferrari World Abu Dhabi reaches 149.1 mph. Riders must wear goggles!", kidQuestion: "Which roller coaster is the FASTEST in the whole world?", kidOptions: ["Kingda Ka", "Formula Rossa 🏎️", "Top Thrill Dragster", "Do-Dodonpa"], kidFunFact: "Formula Rossa goes 149 mph — faster than a cheetah! 🐆" },
  { question: "What is the tallest roller coaster in the world?", options: ["Top Thrill 2", "Superman: Escape from Krypton", "Kingda Ka", "Fury 325"], answer: 2, funFact: "Kingda Ka stands at 456 feet — taller than the Statue of Liberty at 305 feet.", kidQuestion: "Which coaster is the TALLEST?", kidOptions: ["Top Thrill 2", "Superman", "Kingda Ka 👑", "Fury 325"], kidFunFact: "Kingda Ka is 456 feet tall — taller than the Statue of Liberty! 🗽" },
  { question: "What does RMC stand for in roller coaster manufacturing?", options: ["Ride Manufacturing Corp", "Rocky Mountain Construction", "Roller Motor Company", "Rail & Metal Coasters"], answer: 1, funFact: "Rocky Mountain Construction, founded by Fred Grubb, revolutionized the industry by converting rough wooden coasters into smooth hybrid steel-on-wood thrill machines." },
  { question: "What type of loop shape do modern coasters use instead of a perfect circle?", options: ["Parabola", "Clothoid (Euler spiral)", "Ellipse", "Catenary"], answer: 1, funFact: "A clothoid loop gradually tightens its radius, reducing max G-forces from 12+ G (circle) to a comfortable 3.5–5 G.", kidQuestion: "Why aren't roller coaster loops perfectly round?", kidOptions: ["They look cooler", "Egg shapes are safer for your body", "Round ones break", "No reason"], kidFunFact: "Round loops would squish you with too much force! Egg-shaped loops keep it fun AND safe! 🥚" },
  { question: "What year did the first tubular steel roller coaster open?", options: ["1955", "1959", "1963", "1972"], answer: 1, funFact: "The Matterhorn Bobsleds at Disneyland in 1959 used Arrow Development's tubular steel track — the technology behind every modern coaster." },
  { question: "How does a launched coaster's LSM (Linear Synchronous Motor) work?", options: ["Compressed air", "Alternating magnetic fields propel fin-equipped trains", "Hydraulic pistons", "Gravity assist"], answer: 1, funFact: "LSMs use precisely timed electromagnetic fields to pull metal fins on the train forward — like a linear version of an electric motor." },
  { question: "What is 'airtime' on a roller coaster?", options: ["Time the ride operates daily", "The feeling of weightlessness over hills", "How long you're upside down", "Air resistance duration"], answer: 1, funFact: "Airtime occurs when you go over a hill fast enough that you experience less than 1 G — your body lifts off the seat. Enthusiasts measure it in seconds.", kidQuestion: "What's 'airtime' on a coaster?", kidOptions: ["When the ride opens", "Floating feeling over hills! 🎈", "Being upside-down", "Wind in your face"], kidFunFact: "It's when you go over a hill and your tummy floats — like the drop on a swing set, but BIGGER! 🎈" },
  { question: "What is the purpose of block brakes on a roller coaster?", options: ["To make the ride more thrilling", "To ensure two trains never occupy the same track section", "To slow down on turns", "To create special effects"], answer: 1, funFact: "Block brakes divide the track into sections. Only one train can be in each block at a time — this is how coasters safely run multiple trains." },
  { question: "Which coaster has the most inversions?", options: ["Smiler (14)", "Colossus (10)", "Banshee (7)", "Montu (7)"], answer: 0, funFact: "The Smiler at Alton Towers holds the record with 14 inversions — riders go upside-down 14 times in a single ride!" },
  { question: "What is a 'stall' element on a roller coaster?", options: ["When the ride breaks down", "An inverted hang where you float inverted at low speed", "A type of brake", "A queue management technique"], answer: 1, funFact: "A zero-G stall rolls you inverted and holds you there at the apex with near-zero gravity — you hang from your restraint in pure weightlessness." },
  { question: "What material are most modern coaster wheels made of?", options: ["Rubber", "Polyurethane/Nylon", "Steel", "Ceramic"], answer: 1, funFact: "Modern coaster trains use three sets of polyurethane wheels per assembly: road wheels (on top), side-friction wheels, and up-stop wheels (underneath) to keep the train locked to the rail." },
  { question: "What is the longest roller coaster in the world?", options: ["Steel Dragon 2000", "The Beast", "Fury 325", "Millennium Force"], answer: 0, funFact: "Steel Dragon 2000 at Nagashima Spa Land, Japan stretches 8,133 feet (1.54 miles) — you're on the track for over 4 minutes!" },
  { question: "How do magnetic (eddy current) brakes work on coasters?", options: ["Friction pads on wheels", "Permanent magnets induce currents in metal fins, creating opposing force", "Electromagnets grab the train", "Air resistance panels"], answer: 1, funFact: "Eddy current brakes never touch the train — magnets induce currents in copper or aluminum fins that naturally oppose motion. They're failsafe: no power needed." },
  { question: "What is the term for a coaster that exceeds 300 feet tall?", options: ["Mega coaster", "Hyper coaster", "Giga coaster", "Strata coaster"], answer: 2, funFact: "Coaster classifications: Hyper (200+ ft), Giga (300+ ft), Strata (400+ ft). Millennium Force (2000) was the first giga coaster." },
  { question: "What is a 'heartline roll'?", options: ["A banking turn", "A roll where the axis passes through the rider's heart/center of mass", "A loop named after its shape", "A type of launch"], answer: 1, funFact: "In a heartline roll, the track rotates around the rider's center of mass so they spin in place rather than being whipped around a wide arc. Extremely smooth sensation." },
  { question: "Which theme park has the most roller coasters?", options: ["Cedar Point", "Six Flags Magic Mountain", "Europa-Park", "Walt Disney World"], answer: 1, funFact: "Six Flags Magic Mountain holds the record with 20 roller coasters, narrowly beating Cedar Point's 17." },
  { question: "What coaster was the first to use a hydraulic launch?", options: ["Xcelerator", "Top Thrill Dragster", "Storm Runner", "Kingda Ka"], answer: 0, funFact: "Xcelerator at Knott's Berry Farm (2002) was the first Intamin hydraulic launch coaster, reaching 82 mph in 2.3 seconds." },
  { question: "What does a 'trim brake' do?", options: ["Stops the train completely", "Slightly reduces speed at specific points", "Trims the track length", "Adjusts the lap bar"], answer: 1, funFact: "Trim brakes reduce speed slightly at key points to manage forces and ride timing. Enthusiasts often dislike them because they reduce airtime." },
  { question: "What roller coaster type has riders standing up?", options: ["Floorless", "Stand-up", "Wing", "Inverted"], answer: 1, funFact: "Stand-up coasters by B&M were popular in the 90s but fell out of favor due to discomfort. Many have been converted to floorless sit-down coasters." },
  { question: "What is the purpose of the chain dog on a lift hill?", options: ["Decorative element", "Anti-rollback device that prevents the train from sliding backwards", "Connects the chain links", "A mascot name"], answer: 1, funFact: "The clicking sound you hear going up a lift hill is the anti-rollback dog catching on teeth in the track — if the chain breaks, the dog locks and holds the train." },
  { question: "What is 'tracking' in coaster enthusiast terminology?", options: ["Following a coaster's location", "How smoothly the train navigates transitions", "Mapping a coaster's path", "Recording ride footage"], answer: 1, funFact: "Good tracking means smooth, jerk-free transitions between elements. Poor tracking causes vibration and head-banging — a major complaint about rough coasters." },
  { question: "What is the steepest drop angle on any coaster?", options: ["90°", "95°", "97°", "Beyond vertical — some exceed 100°"], answer: 3, funFact: "Several coasters feature beyond-vertical drops (past 90°). TMNT Shellraiser has a 121.5° drop — you actually lean forward past straight down!" },
  { question: "Which manufacturer pioneered the 'wing coaster' design?", options: ["Intamin", "Vekoma", "B&M (Bolliger & Mabillard)", "Mack Rides"], answer: 2, funFact: "B&M introduced wing coasters where riders sit on either side of the track with nothing above or below — creating a sensation of flight." },
  { question: "What are 'laterals' on a roller coaster?", options: ["Side-to-side forces pushing you into the restraint", "Vertical drops", "A type of inversion", "Side-mounted cameras"], answer: 0, funFact: "Strong laterals push you sideways in your seat during unbanked turns. Some coasters are famous for aggressive laterals — the Cyclone at Coney Island is a prime example." },
  { question: "How fast can a hydraulic launch accelerate a coaster train?", options: ["0-60 in 5 seconds", "0-120 mph in under 4 seconds", "0-80 in 10 seconds", "0-50 in 2 seconds"], answer: 1, funFact: "Top Thrill Dragster's hydraulic launch went from 0 to 120 mph in 3.8 seconds — that's faster than a fighter jet catapult launch from an aircraft carrier!" },
  { question: "What does B&M stand for?", options: ["Busch & Merlin", "Bolliger & Mabillard", "Berg & Miller", "Brakes & Motors"], answer: 1, funFact: "Walter Bolliger and Claude Mabillard, Swiss engineers, founded B&M in 1988. They're responsible for many of the world's most popular coasters including Fury 325, Banshee, and Montu." },
  { question: "What is the world's oldest operating roller coaster?", options: ["Cyclone (1927)", "Leap-the-Dips (1902)", "Jack Rabbit (1920)", "Giant Dipper (1924)"], answer: 1, funFact: "Leap-the-Dips at Lakemont Park, Pennsylvania opened in 1902 and is a National Historic Landmark. It's a side-friction figure-eight design that reaches just 10 mph." },
  { question: "What innovation did Arrow Dynamics contribute to coasters?", options: ["Wooden track", "Tubular steel track and the modern looping coaster", "Hydraulic launches", "Magnetic brakes"], answer: 1, funFact: "Arrow Dynamics invented tubular steel track (Matterhorn 1959) and the modern loop (Corkscrew 1975). They made the modern coaster era possible." },
  { question: "What is 'stapling' in coaster lingo?", options: ["Fixing track sections", "When a ride operator pushes your restraint too tight", "A construction technique", "Attaching the chain"], answer: 1, funFact: "Getting 'stapled' means the ride operator pushed your lap bar down extra tight, reducing your airtime. Enthusiasts dread it!" },
  { question: "What is a 'flying coaster'?", options: ["A coaster with wings", "Riders are face-down in a prone (Superman) position", "A coaster that goes over water", "A launched coaster"], answer: 1, funFact: "Flying coasters like Tatsu and Manta rotate riders face-down so you soar through elements like Superman. B&M and Vekoma both make flying models." },
];

/* ---------- COASTER CARDS ---------- */
export type Rarity = "Common" | "Rare" | "Legendary";

export interface CoasterCard {
  id: string;
  name: string;
  park: string;
  year: number;
  type: "Wood" | "Steel" | "Hybrid" | "Launched";
  speed: number; // mph
  height: number; // feet
  length: number; // feet
  inversions: number;
  thrillRating: number; // 1–10
  rarity: Rarity;
  unlockMethod: string; // how to unlock
  kidComparison: string;
}

export const coasterCards: CoasterCard[] = [
  { id: "millennium-force", name: "Millennium Force", park: "Cedar Point", year: 2000, type: "Steel", speed: 93, height: 310, length: 6595, inversions: 0, thrillRating: 9, rarity: "Legendary", unlockMethod: "Visit 3 days", kidComparison: "As tall as a 30-story building!" },
  { id: "steel-vengeance", name: "Steel Vengeance", park: "Cedar Point", year: 2018, type: "Hybrid", speed: 74, height: 205, length: 5740, inversions: 4, thrillRating: 10, rarity: "Legendary", unlockMethod: "Complete 5 trivia", kidComparison: "You float for 30 whole seconds — like being in space!" },
  { id: "velocicoaster", name: "Velocicoaster", park: "Universal Orlando", year: 2021, type: "Launched", speed: 70, height: 155, length: 4700, inversions: 4, thrillRating: 10, rarity: "Legendary", unlockMethod: "Build 3 coasters", kidComparison: "Dinosaurs chase you at 70 mph!" },
  { id: "fury-325", name: "Fury 325", park: "Carowinds", year: 2015, type: "Steel", speed: 95, height: 325, length: 6602, inversions: 0, thrillRating: 9, rarity: "Rare", unlockMethod: "Complete 3 trivia", kidComparison: "Taller than the Statue of Liberty!" },
  { id: "the-beast", name: "The Beast", park: "Kings Island", year: 1979, type: "Wood", speed: 65, height: 135, length: 7359, inversions: 0, thrillRating: 8, rarity: "Rare", unlockMethod: "default", kidComparison: "The longest wooden coaster — it goes through the FOREST at night!" },
  { id: "kingda-ka", name: "Kingda Ka", park: "Six Flags Great Adventure", year: 2005, type: "Launched", speed: 128, height: 456, length: 3118, inversions: 0, thrillRating: 9, rarity: "Legendary", unlockMethod: "Visit 5 days", kidComparison: "128 mph — faster than a cheetah AND a race car!" },
  { id: "el-toro", name: "El Toro", park: "Six Flags Great Adventure", year: 2006, type: "Wood", speed: 70, height: 181, length: 4400, inversions: 0, thrillRating: 9, rarity: "Rare", unlockMethod: "Complete 1 trivia", kidComparison: "The most airtime on any wooden coaster!" },
  { id: "iron-gwazi", name: "Iron Gwazi", park: "Busch Gardens Tampa", year: 2022, type: "Hybrid", speed: 76, height: 206, length: 4075, inversions: 3, thrillRating: 10, rarity: "Rare", unlockMethod: "Build 1 coaster", kidComparison: "Drops you PAST straight down!" },
  { id: "formula-rossa", name: "Formula Rossa", park: "Ferrari World", year: 2010, type: "Launched", speed: 149, height: 171, length: 6562, inversions: 0, thrillRating: 8, rarity: "Legendary", unlockMethod: "Complete 10 trivia", kidComparison: "149 mph! You need GOGGLES to ride!" },
  { id: "the-cyclone", name: "The Cyclone", park: "Coney Island", year: 1927, type: "Wood", speed: 60, height: 85, length: 2640, inversions: 0, thrillRating: 7, rarity: "Common", unlockMethod: "default", kidComparison: "Almost 100 years old and still awesome!" },
  { id: "matterhorn", name: "Matterhorn Bobsleds", park: "Disneyland", year: 1959, type: "Steel", speed: 27, height: 80, length: 2134, inversions: 0, thrillRating: 5, rarity: "Common", unlockMethod: "default", kidComparison: "The coaster that started it ALL!" },
  { id: "x2", name: "X2", park: "Six Flags Magic Mountain", year: 2002, type: "Steel", speed: 76, height: 200, length: 3610, inversions: 2, thrillRating: 9, rarity: "Rare", unlockMethod: "Visit 2 days", kidComparison: "Your seat SPINS while you ride! Total chaos!" },
  { id: "lightning-rod", name: "Lightning Rod", park: "Dollywood", year: 2016, type: "Hybrid", speed: 73, height: 165, length: 3800, inversions: 0, thrillRating: 9, rarity: "Rare", unlockMethod: "Build 2 coasters", kidComparison: "A wooden coaster with a LAUNCH — the first ever!" },
  { id: "expedition-everest", name: "Expedition Everest", park: "Disney's Animal Kingdom", year: 2006, type: "Steel", speed: 50, height: 199, length: 4424, inversions: 0, thrillRating: 7, rarity: "Common", unlockMethod: "default", kidComparison: "You go BACKWARDS away from a Yeti!" },
  { id: "top-thrill-2", name: "Top Thrill 2", park: "Cedar Point", year: 2025, type: "Launched", speed: 120, height: 420, length: 2800, inversions: 0, thrillRating: 10, rarity: "Legendary", unlockMethod: "Complete 7 trivia", kidComparison: "120 mph using MAGNETS! The future is here!" },
  { id: "the-smiler", name: "The Smiler", park: "Alton Towers", year: 2013, type: "Steel", speed: 53, height: 98, length: 3838, inversions: 14, thrillRating: 8, rarity: "Rare", unlockMethod: "Complete 2 trivia", kidComparison: "14 times upside-down! More than ANY other coaster!" },
];

/* ---------- FACTS ---------- */
export const coasterFacts: string[] = [
  "The first roller coasters were ice slides in 17th-century Russia — riders sat on blocks of ice and slid down 70-foot wooden ramps!",
  "Cedar Point in Ohio is known as the 'Roller Coaster Capital of the World' with 17 coasters.",
  "The average roller coaster train weighs about 20,000 pounds fully loaded with riders.",
  "Roller coaster wheels come in sets of three: road wheels on top, side-friction wheels, and up-stop wheels underneath to prevent derailment.",
  "The clicking sound on a lift hill is the anti-rollback device — ratcheting teeth that prevent the train from sliding backwards.",
  "Formula Rossa accelerates so fast that riders must wear protective goggles against sand and insects.",
  "Steel Vengeance at Cedar Point has 30.4 seconds of airtime — the most of any coaster in the world.",
  "B&M (Bolliger & Mabillard) was founded by two Swiss engineers who previously worked at Intamin.",
  "Wooden roller coasters can expand up to 6 inches in hot weather due to thermal expansion of the lumber.",
  "The Smiler at Alton Towers holds the world record for most inversions: 14 in a single ride.",
  "Magnetic brakes on modern coasters never actually touch the train — they use eddy currents to slow it contactlessly.",
  "A rider on a roller coaster typically experiences between 3 and 6 G of force — fighter pilots experience similar loads.",
  "The chain on a typical lift hill moves at about 11–14 mph, but some high-speed lifts can reach 20+ mph.",
  "Roller coaster track is manufactured in sections and assembled on-site like a giant 3D puzzle.",
  "Intamin's hydraulic launch system can produce over 10,000 horsepower — more than 10 Formula 1 cars combined.",
  "The world's longest wooden coaster, The Beast, is 7,359 feet — nearly 1.4 miles of track through the woods.",
  "RMC (Rocky Mountain Construction) converts old rough wooden coasters into smooth hybrid thrill machines using steel-on-wood 'IBox' track.",
  "Walt Disney's Matterhorn Bobsleds (1959) was the world's first tubular steel coaster — the tech behind every modern coaster.",
  "Some coasters use water brakes — a scoop on the train dips into a trough of water at the end of the ride.",
  "The tallest roller coaster, Kingda Ka, is 456 feet tall — taller than the Great Pyramid of Giza (449 feet).",
  "A coaster train's polyurethane wheels are replaced every 1–3 days during peak season due to wear.",
  "The 'heartline' of a coaster is the imaginary line through the rider's center of mass — inversions designed around it feel smoother.",
  "Night rides are considered the best by enthusiasts because you can't see the track ahead — every element is a surprise.",
  "Arrow Dynamics invented both the tubular steel track AND the modern corkscrew inversion in the 1970s.",
  "Some coaster engineers use NASA-grade simulation software to model G-forces and rider biomechanics.",
  "The record for most coasters ridden in 24 hours is 78, achieved at multiple parks with precise scheduling.",
  "Velocicoaster at Universal Orlando cost an estimated $200 million to build — one of the most expensive coasters ever.",
];

/* ---------- KID-FRIENDLY FACTS ---------- */
export const kidFacts: string[] = [
  "🧊 The first roller coasters were made of ICE in Russia! People slid down giant ice ramps!",
  "🎢 Cedar Point has 17 roller coasters — imagine riding a different one for each day!",
  "🐘 A roller coaster train full of people weighs as much as TWO elephants!",
  "🔊 That click-click-click going up the hill? Those are safety teeth that stop the train from rolling back!",
  "🦟 Formula Rossa is SO fast you need goggles so bugs don't hit your face!",
  "🪶 Steel Vengeance makes you feel weightless for 30 seconds total — like floating in space!",
  "🇨🇭 B&M coasters are designed by Swiss engineers — the same country that makes great chocolate AND great coasters!",
  "🌡️ Wooden coasters grow taller in summer because the wood expands in the heat!",
  "🔄 The Smiler flips you upside-down 14 TIMES! Can you spin around 14 times without getting dizzy?",
  "🧲 Magnetic brakes slow down coasters WITHOUT touching them — like magic!",
  "🧑‍🚀 Riding a coaster can feel like being an astronaut — you experience the same forces as a rocket launch!",
  "⛓️ The chain pulling you up a hill moves about as fast as you ride your bike!",
  "🧩 Coaster tracks are built in pieces and put together like a GIANT puzzle!",
  "🏎️ A coaster's launch engine is more powerful than TEN race cars!",
  "🌲 The Beast goes through actual WOODS — it's like a coaster through a forest!",
  "🏰 Disneyland's Matterhorn was the FIRST modern roller coaster — thanks, Walt Disney!",
  "💦 Some coasters stop using a giant pool of water — the train's scoop splashes into it!",
  "🏛️ Kingda Ka is taller than the Great Pyramid in Egypt!",
  "🌙 Riding at NIGHT is the best — you can't see what's coming next! SURPRISE!",
  "👷 Coaster engineers use the same computer programs as NASA rocket scientists!",
  "🏆 Someone rode 78 different coasters in ONE DAY! That's a world record!",
  "🦖 Velocicoaster cost 200 MILLION dollars to build! That's a LOT of allowance money!",
  "💨 The fastest coaster goes 149 mph — a cheetah only goes 70! 🐆",
  "🎵 Coasters make music! Each part of the track creates different sounds as the train zooms over it!",
  "⚡ Lightning Rod at Dollywood is a wooden coaster that LAUNCHES you — the first one ever!",
];
