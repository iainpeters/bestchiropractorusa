// Parse all source data files and generate chiropractors.json
import { readFileSync, writeFileSync } from 'fs';

// Source data
const articlesRaw = readFileSync('/root/godmode/artifacts/lovable-content-prompt.md', 'utf8');
const ratingsRaw = readFileSync('/root/godmode/artifacts/google-ratings.md', 'utf8');
const formIdsRaw = readFileSync('/root/godmode/artifacts/ghl-form-ids.md', 'utf8');

// Parse ratings
const ratingMap = {};
for (const line of ratingsRaw.split('\n')) {
  const m = line.match(/\|\s*\d+\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*([\d.]+|NO GBP)\s*\|\s*([\d,-]+)\s*\|/);
  if (m) {
    const practice = m[1].trim();
    const doctor = m[2].trim();
    const rating = m[3] === 'NO GBP' ? null : parseFloat(m[3]);
    const reviews = m[4] === '-' ? null : parseInt(m[4].replace(',', ''));
    ratingMap[doctor] = { practice, rating, reviews };
  }
}

// Parse form IDs
const formIdMap = {};
for (const line of formIdsRaw.split('\n')) {
  const m = line.match(/\|\s*([\w-]+)\s*\|\s*(\w+)\s*\|/);
  if (m && m[1] !== 'Slug') {
    formIdMap[m[1].trim()] = m[2].trim();
  }
}

// Parse articles
const articleMap = {};
const articleBlocks = articlesRaw.split(/---\n\n\*\*slug:\s*/);
for (const block of articleBlocks) {
  const slugMatch = block.match(/^([\w-]+)\*\*/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  const titleMatch = block.match(/articleTitle:\s*"(.+?)"/);
  const articleMatch = block.match(/article:\s*"([\s\S]+?)"\n/);
  if (titleMatch && articleMatch) {
    articleMap[slug] = {
      articleTitle: titleMatch[1],
      article: articleMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
    };
  }
}

// Full chiropractor data from the live site JSON-LD + homepage
// Manually compiled from scraping
const chiropractors = [
  {
    slug: "dr-brendan-allen-newington-ct",
    doctorName: "Dr. Brendan Allen",
    credentials: "DC",
    practiceName: "100% Chiropractic Newington",
    city: "Newington",
    state: "CT",
    fullState: "Connecticut",
    address: "3313 Berlin Turnpike, Newington, CT",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8am-12pm & 2pm-6pm; Tue 2pm-6pm; Fri 8am-12pm",
    specialties: ["Corrective Chiropractic Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care", "Family Wellness"]
  },
  {
    slug: "dr-asia-barclay-fayetteville-ga",
    doctorName: "Dr. Asia Barclay",
    credentials: "DC",
    practiceName: "Barclay Chiropractic & Wellness",
    city: "Fayetteville",
    state: "GA",
    fullState: "Georgia",
    address: "1240 Highway 54, Fayetteville, GA",
    phone: "(678) 596-7632",
    website: "",
    hours: "",
    specialties: ["Pain Relief", "Sciatica", "Headaches/Migraines"],
    services: ["Chiropractic Care", "Rehabilitation", "Pain Relief"]
  },
  {
    slug: "dr-charly-swanberg-temecula-ca",
    doctorName: "Dr. Charly Swanberg",
    credentials: "DC",
    practiceName: "Zenyth Chiropractic",
    city: "Temecula",
    state: "CA",
    fullState: "California",
    address: "32909 Temecula Parkway, Temecula, CA",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8:30am-12pm & 2pm-5:30pm; Tue 2pm-5:30pm",
    specialties: ["Family Health", "Corrective Care", "Wellness"],
    services: ["Spinal Adjustment", "Corrective Care", "Family Wellness"]
  },
  {
    slug: "dr-greg-tonnesen-st-johns-fl",
    doctorName: "Dr. Gregory Tonnesen",
    credentials: "DC",
    practiceName: "100% Chiropractic Saint Johns",
    city: "St. Johns",
    state: "FL",
    fullState: "Florida",
    address: "2050 St Johns Parkway, Suite 107, St. Johns, FL 32259",
    phone: "",
    website: "",
    hours: "Mon 8am-12pm & 2pm-6pm; Tue 2pm-6pm; Wed-Thu 8am-12pm & 2pm-6pm; Fri 8am-12pm",
    specialties: ["Corrective Chiropractic Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-yahdi-cotto-aurora-co",
    doctorName: "Dr. Yahdi D. Cotto-Jorge",
    credentials: "DC",
    practiceName: "Spine By Design Studio",
    city: "Aurora",
    state: "CO",
    fullState: "Colorado",
    address: "14151 E Cedar Ave, Aurora, CO",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8am-12pm & 2pm-6pm; Tue 2pm-6pm",
    specialties: ["Family Chiropractic", "Pain Relief", "Mobility"],
    services: ["Spinal Adjustment", "Prenatal Care", "Pediatric Care"]
  },
  {
    slug: "dr-marielis-montalvo-perez-davie-fl",
    doctorName: "Dr. Marielis Montalvo Perez",
    credentials: "DC",
    practiceName: "100% Chiropractic Davie",
    city: "Davie",
    state: "FL",
    fullState: "Florida",
    address: "8570 Stirling Road, Davie, FL",
    phone: "",
    website: "",
    hours: "Mon 8am-12pm & 2pm-6pm; Tue 2pm-6pm; Wed-Thu 8am-12pm & 2pm-6pm; Fri 8am-12pm",
    specialties: ["Chiropractic Care", "Massage & Stretch Therapy", "Nutritional Supplements"],
    services: ["Spinal Adjustment", "Massage Therapy", "Stretch Therapy", "Nutritional Counseling"]
  },
  {
    slug: "dr-zach-anthony-mcdonough-ga",
    doctorName: "Dr. Zachary Anthony",
    credentials: "DC",
    practiceName: "100% Chiropractic McDonough",
    city: "McDonough",
    state: "GA",
    fullState: "Georgia",
    address: "3512 Highway 155 North, McDonough, GA",
    phone: "",
    website: "",
    hours: "Mon 8am-12pm & 2pm-6pm; Tue 2pm-6pm; Wed-Thu 8am-12pm & 2pm-6pm",
    specialties: ["Corrective Chiropractic Care", "Family Wellness", "Community Health"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-andre-white-calhoun-ga",
    doctorName: "Dr. Andre White",
    credentials: "DC",
    practiceName: "Calhoun Chiropractic",
    city: "Calhoun",
    state: "GA",
    fullState: "Georgia",
    address: "136 W Belmont Drive, Calhoun, GA",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 9am-12pm & 2pm-6pm; Tue 2pm-6pm; Sat 9am-12pm",
    specialties: ["Chiropractic Care", "Exercise Physiology", "Wellness"],
    services: ["Spinal Adjustment", "Exercise Therapy", "Wellness Care"]
  },
  {
    slug: "dr-joe-richardson-troy-mi",
    doctorName: "Dr. Joe Richardson",
    credentials: "DC",
    practiceName: "100% Chiropractic Troy",
    city: "Troy",
    state: "MI",
    fullState: "Michigan",
    address: "3134 Rochester Road, Troy, MI",
    phone: "",
    website: "",
    hours: "Mon 8am-6pm; Tue 2pm-6pm; Wed-Thu 8am-6pm; Fri 8am-12pm",
    specialties: ["Corrective Chiropractic Care", "Family Wellness", "Natural Healing"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-mona-panchal-la-habra-ca",
    doctorName: "Dr. Mona Panchal",
    credentials: "DC",
    practiceName: "100% Chiropractic La Habra",
    city: "La Habra",
    state: "CA",
    fullState: "California",
    address: "1921 W Imperial Highway, La Habra, CA",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8am-12pm & 2pm-6pm; Tue 2pm-6pm; Fri 8am-12pm",
    specialties: ["Chiropractic Care", "Auto Accidents", "Workers Comp"],
    services: ["Spinal Adjustment", "Auto Accident Treatment", "Workers Comp"]
  },
  {
    slug: "dr-todd-marquis-columbus-oh",
    doctorName: "Dr. Todd Marquis",
    credentials: "PhD",
    practiceName: "Restore Family Chiropractic",
    city: "Columbus",
    state: "OH",
    fullState: "Ohio",
    address: "175 E Campus View Boulevard, Columbus, OH",
    phone: "",
    website: "",
    hours: "",
    specialties: ["MaxLiving", "Corrective Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care", "SoftWave Therapy"]
  },
  {
    slug: "dr-terry-fourre-canton-ga",
    doctorName: "Dr. Teresa Grace Fourre",
    credentials: "DC, CNMT",
    practiceName: "100% Chiropractic Canton",
    city: "Canton",
    state: "GA",
    fullState: "Georgia",
    address: "9266 Knox Bridge Highway, Canton, GA",
    phone: "",
    website: "",
    hours: "",
    specialties: ["Corrective Chiropractic Care", "Neuro Muscular Therapy"],
    services: ["Spinal Adjustment", "Neuro Muscular Therapy", "Corrective Care"]
  },
  {
    slug: "dr-chris-stewart-bowling-green-ky",
    doctorName: "Dr. Christopher Stewart",
    credentials: "DC",
    practiceName: "100% Chiropractic Bowling Green",
    city: "Bowling Green",
    state: "KY",
    fullState: "Kentucky",
    address: "5833 Scottsville Road, Suite 202, Bowling Green, KY",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8am-12pm & 2pm-6pm; Tue 2pm-6pm; Fri 8am-12pm",
    specialties: ["Corrective Chiropractic Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-bryen-bell-beaverton-or",
    doctorName: "Dr. Bryen A. Bell",
    credentials: "DC",
    practiceName: "True Potential Chiropractic",
    city: "Beaverton",
    state: "OR",
    fullState: "Oregon",
    address: "8283 SW Cirrus Drive, Beaverton, OR",
    phone: "",
    website: "",
    hours: "",
    specialties: ["Family Corrective Care", "Athletes", "Prenatal"],
    services: ["Spinal Adjustment", "Active Release Therapy", "Pediatric Care", "Sports Chiropractic"]
  },
  {
    slug: "dr-jessica-tew-cumming-ga",
    doctorName: "Dr. Jessica Tew",
    credentials: "DC",
    practiceName: "100% Chiropractic North Cumming",
    city: "Cumming",
    state: "GA",
    fullState: "Georgia",
    address: "2633 Freedom Parkway, Cumming, GA",
    phone: "",
    website: "",
    hours: "",
    specialties: ["Corrective Chiropractic Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-nicolas-kellerman-austin-tx",
    doctorName: "Dr. Nicolas Kellerman",
    credentials: "DC",
    practiceName: "100% Chiropractic Austin Rosedale",
    city: "Austin",
    state: "TX",
    fullState: "Texas",
    address: "3800 N Lamar Boulevard, Austin, TX",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8am-12pm & 2pm-6pm; Tue 2pm-6pm",
    specialties: ["Sports Chiropractic", "Family Care", "Active Release Therapy"],
    services: ["Spinal Adjustment", "Active Release Therapy", "Acupuncture"]
  },
  {
    slug: "dr-bryna-waters-nashville-tn",
    doctorName: "Dr. Bryna Waters Sutter",
    credentials: "DC",
    practiceName: "100% Chiropractic West Nashville",
    city: "Nashville",
    state: "TN",
    fullState: "Tennessee",
    address: "4110 Charlotte Avenue, Nashville, TN",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8am-12pm & 2pm-6pm; Tue 2pm-6pm",
    specialties: ["Corrective Chiropractic Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-angie-recendez-arlington-heights-il",
    doctorName: "Dr. Angie Recendez",
    credentials: "DC",
    practiceName: "Bright Futures Chiropractic",
    city: "Arlington Heights",
    state: "IL",
    fullState: "Illinois",
    address: "657 E Golf Road, Suite 301, Arlington Heights, IL",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 9:30am-12pm & 3pm-6pm; Tue 3pm-6pm; Fri 9:30am-1pm",
    specialties: ["Pediatric Chiropractic", "Prenatal Care", "Webster Certified (ICPA)"],
    services: ["Pediatric Chiropractic", "Prenatal Care", "Webster Technique"]
  },
  {
    slug: "dr-james-williams-lake-charles-la",
    doctorName: "Dr. James Williams",
    credentials: "DC, MVCOI",
    practiceName: "100% Chiropractic Lake Charles",
    city: "Lake Charles",
    state: "LA",
    fullState: "Louisiana",
    address: "2301 E Prien Lake Road, Lake Charles, LA",
    phone: "",
    website: "",
    hours: "Mon 8am-11am; Tue, Thu 1pm-7pm; Wed 8am-11am & 1pm-5:30pm; Fri 9am-12pm",
    specialties: ["Corrective Care", "Personal Injury"],
    services: ["Spinal Adjustment", "Corrective Care", "Personal Injury Treatment"]
  },
  {
    slug: "dr-tara-breske-parker-co",
    doctorName: "Dr. Tara Breske",
    credentials: "DC",
    practiceName: "Healix Chiropractic",
    city: "Parker",
    state: "CO",
    fullState: "Colorado",
    address: "10161 S Parker Road, Parker, CO",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8am-12pm & 2pm-6pm; Tue 2pm-6pm; Fri 8am-12pm",
    specialties: ["Spinal Adjustments", "Wellness Care", "Massage"],
    services: ["Spinal Adjustment", "Wellness Care", "Massage Therapy"]
  },
  {
    slug: "dr-sara-nelson-knoxville-tn",
    doctorName: "Dr. Sara Nelson",
    credentials: "DC",
    practiceName: "Freedom Chiropractic",
    city: "Knoxville",
    state: "TN",
    fullState: "Tennessee",
    address: "7827 Montvue Center Way, Knoxville, TN",
    phone: "",
    website: "",
    hours: "Mon, Thu 10:30am-1:30pm & 3:30pm-6:30pm; Tue 3:30pm-6:30pm; Wed 9am-12pm & 2pm-5pm",
    specialties: ["Nervous System Centered Chiropractic", "Pediatric", "Prenatal"],
    services: ["Nervous System Chiropractic", "Pediatric Care", "Prenatal Care"]
  },
  {
    slug: "dr-angel-santos-grand-rapids-mi",
    doctorName: "Dr. Angel Santos",
    credentials: "DC",
    practiceName: "100% Chiropractic Grand Rapids",
    city: "Grand Rapids",
    state: "MI",
    fullState: "Michigan",
    address: "2321 East Beltline Avenue NE, Suite D, Grand Rapids, MI",
    phone: "",
    website: "",
    hours: "",
    specialties: ["Corrective Chiropractic Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-kris-barnhill-gainesville-fl",
    doctorName: "Dr. Kris Barnhill",
    credentials: "DC",
    practiceName: "100% Chiropractic Gainesville",
    city: "Gainesville",
    state: "FL",
    fullState: "Florida",
    address: "4411 NW 8th Avenue, Suite C, Gainesville, FL",
    phone: "",
    website: "",
    hours: "",
    specialties: ["Corrective Chiropractic Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-jerren-stines-fort-mill-sc",
    doctorName: "Dr. Jerren Stines",
    credentials: "DC",
    practiceName: "Vibrant Family Chiropractic",
    city: "Fort Mill",
    state: "SC",
    fullState: "South Carolina",
    address: "506 Mercantile Place, Suite 105, Fort Mill, SC",
    phone: "",
    website: "",
    hours: "",
    specialties: ["Structural Spinal Correction", "MaxLiving", "Pediatric"],
    services: ["Structural Correction", "MaxLiving", "Pediatric Care"]
  },
  {
    slug: "dr-adam-tedder-suwanee-ga",
    doctorName: "Dr. Adam Tedder",
    credentials: "DC",
    practiceName: "Clear Path Family Chiropractic",
    city: "Suwanee",
    state: "GA",
    fullState: "Georgia",
    address: "1500 Peachtree Industrial Boulevard, Suite 290, Suwanee, GA",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 10am-1pm & 3pm-6pm",
    specialties: ["Upper Cervical Care", "Pediatrics", "Perinatal Care"],
    services: ["Upper Cervical Chiropractic", "Pediatric Care", "Perinatal Care"]
  },
  {
    slug: "dr-ted-valley-des-peres-mo",
    doctorName: "Dr. Ted Valley",
    credentials: "DC",
    practiceName: "100% Chiropractic Des Peres",
    city: "Des Peres",
    state: "MO",
    fullState: "Missouri",
    address: "1084 N. Ballas Road, Des Peres, MO",
    phone: "",
    website: "",
    hours: "",
    specialties: ["Posture Analysis", "Fit3D Scanner", "Corrective Care"],
    services: ["Spinal Adjustment", "Posture Analysis", "Fit3D Scanning"]
  },
  {
    slug: "dr-ghazal-eslamy-san-clemente-ca",
    doctorName: "Dr. Ghazal Eslamy",
    credentials: "DC",
    practiceName: "Pacific Pointe Chiropractic",
    city: "San Clemente",
    state: "CA",
    fullState: "California",
    address: "903 Calle Amanecer, Suite 310, San Clemente, CA",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 9am-7pm; Tue 10am-4pm; Sat 10:30am-1pm",
    specialties: ["Musculoskeletal Conditions", "Spinal Care", "Non-invasive Pain Relief"],
    services: ["Spinal Adjustment", "Musculoskeletal Treatment", "Pain Relief"]
  },
  {
    slug: "dr-will-bevis-tallahassee-fl",
    doctorName: "Dr. William Bevis",
    credentials: "DC",
    practiceName: "100% Chiropractic Tallahassee",
    city: "Tallahassee",
    state: "FL",
    fullState: "Florida",
    address: "1378 Timberlane Road, Tallahassee, FL",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8am-12pm & 2pm-6pm; Tue 2pm-6pm",
    specialties: ["Corrective Chiropractic Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-jaclyn-becker-plano-tx",
    doctorName: "Dr. Jaclyn Becker",
    credentials: "DC",
    practiceName: "Elite Chiropractic",
    city: "Plano",
    state: "TX",
    fullState: "Texas",
    address: "340 Coit Road, Suite 500b, Plano, TX",
    phone: "",
    website: "",
    hours: "",
    specialties: ["Chiropractic Care", "Corrective Care"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "dr-darby-thomas-littleton-co",
    doctorName: "Dr. Darby Thomas",
    credentials: "DC",
    practiceName: "100% Chiropractic Littleton",
    city: "Littleton",
    state: "CO",
    fullState: "Colorado",
    address: "8055 W Bowles Avenue, Suite 1000, Littleton, CO",
    phone: "",
    website: "",
    hours: "Mon, Wed, Thu 8am-12pm & 2pm-6pm; Tue 1pm-5:30pm",
    specialties: ["Corrective Chiropractic Care", "Family Wellness"],
    services: ["Spinal Adjustment", "Corrective Care"]
  },
  {
    slug: "orange-chiropractic-orange-va",
    doctorName: "Dr. Eileen Whelan & Dr. Terry Whelan",
    credentials: "DC",
    practiceName: "Orange Chiropractic & Family Fitness",
    city: "Orange",
    state: "VA",
    fullState: "Virginia",
    address: "325 N Madison Road, Orange, VA",
    phone: "",
    website: "",
    hours: "",
    specialties: ["Chiropractic Care", "SoftWave Therapy", "Family Fitness"],
    services: ["Spinal Adjustment", "SoftWave Therapy", "Family Fitness"]
  },
  {
    slug: "dr-kathryn-russell-niceville-fl",
    doctorName: "Dr. Kathryn Russell",
    credentials: "DC",
    practiceName: "Russell Chiropractic",
    city: "Niceville",
    state: "FL",
    fullState: "Florida",
    address: "350 W John Sims Pkwy, Unit 401, Niceville, FL 32578",
    phone: "(850) 678-8049",
    website: "https://russellchiropracticcare.com/",
    hours: "Mon-Wed 8am-11:30am & 3-6pm; Thu 3-6pm; Fri by appointment",
    specialties: ["Wellness Care", "Chronic Injury Treatment", "Holistic Approach"],
    services: ["Spinal Adjustment", "Wellness Care", "Chronic Injury Treatment"]
  },
  {
    slug: "dr-dana-huebner-shawnee-ks",
    doctorName: "Dr. Dana Huebner",
    credentials: "DC",
    practiceName: "New Hope Chiropractic",
    city: "Shawnee",
    state: "KS",
    fullState: "Kansas",
    address: "Shawnee, KS",
    phone: "(913) 962-7408",
    website: "",
    hours: "",
    specialties: ["Neurologically-Focused Pediatric Chiropractic", "Family Care", "Prenatal"],
    services: ["Pediatric Chiropractic", "Family Care", "Prenatal Care"]
  },
  {
    slug: "dr-ron-martin-odessa-fl",
    doctorName: "Dr. Ron Martin",
    credentials: "DC",
    practiceName: "Preserve Chiropractic and Wellness",
    city: "Odessa",
    state: "FL",
    fullState: "Florida",
    address: "15989 Preserve Marketplace Blvd, Odessa, FL 33556",
    phone: "(813) 749-7200",
    website: "",
    hours: "",
    specialties: ["Chiropractic Care", "Stretch Therapy", "Stem Wave"],
    services: ["Spinal Adjustment", "Stretch Therapy", "Stem Wave"]
  }
];

// Enrich with ratings, articles, and form IDs
for (const chiro of chiropractors) {
  // Ratings - match by doctor name
  const ratingKeys = Object.keys(ratingMap);
  const matchKey = ratingKeys.find(k => {
    const simpleName = chiro.doctorName.replace(/^Dr\.\s*/, '').split(',')[0].trim();
    return k.includes(simpleName.split(' ').pop());
  });
  
  // Better matching: use slug-based approach for ratings
  for (const [doc, data] of Object.entries(ratingMap)) {
    const lastName = doc.replace(/^Dr\.\s*/, '').split(' ').pop();
    const chiroLast = chiro.doctorName.replace(/^Dr\.\s*/, '').replace(/\s*(Sutter|Perez|Jorge).*$/, '').split(' ').pop();
    if (lastName === chiroLast || chiro.practiceName.includes(data.practice.split(' ')[0])) {
      chiro.rating = data.rating;
      chiro.reviewCount = data.reviews;
      break;
    }
  }
  
  // Form IDs
  const formSlug = chiro.slug;
  chiro.ghlFormId = formIdMap[formSlug] || null;
  
  // Articles
  const artData = articleMap[chiro.slug];
  if (artData) {
    chiro.articleTitle = artData.articleTitle;
    chiro.article = artData.article;
  } else {
    chiro.articleTitle = `About ${chiro.practiceName}`;
    chiro.article = '';
  }
}

// Hard-code the ratings we know from the scraped data
const knownRatings = {
  "dr-brendan-allen-newington-ct": { rating: 5.0, reviews: 23 },
  "dr-asia-barclay-fayetteville-ga": { rating: null, reviews: null },
  "dr-charly-swanberg-temecula-ca": { rating: 4.7, reviews: 47 },
  "dr-greg-tonnesen-st-johns-fl": { rating: 5.0, reviews: 141 },
  "dr-yahdi-cotto-aurora-co": { rating: 4.7, reviews: 327 },
  "dr-marielis-montalvo-perez-davie-fl": { rating: 4.6, reviews: 31 },
  "dr-zach-anthony-mcdonough-ga": { rating: 4.7, reviews: 105 },
  "dr-andre-white-calhoun-ga": { rating: null, reviews: null },
  "dr-joe-richardson-troy-mi": { rating: 4.9, reviews: 82 },
  "dr-mona-panchal-la-habra-ca": { rating: 4.9, reviews: 60 },
  "dr-todd-marquis-columbus-oh": { rating: 4.9, reviews: 323 },
  "dr-terry-fourre-canton-ga": { rating: 4.9, reviews: 133 },
  "dr-chris-stewart-bowling-green-ky": { rating: 4.7, reviews: 40 },
  "dr-bryen-bell-beaverton-or": { rating: 5.0, reviews: 429 },
  "dr-jessica-tew-cumming-ga": { rating: 4.9, reviews: 177 },
  "dr-nicolas-kellerman-austin-tx": { rating: 4.9, reviews: 63 },
  "dr-bryna-waters-nashville-tn": { rating: null, reviews: null },
  "dr-angie-recendez-arlington-heights-il": { rating: 4.8, reviews: 69 },
  "dr-james-williams-lake-charles-la": { rating: 4.8, reviews: 313 },
  "dr-tara-breske-parker-co": { rating: 4.7, reviews: 133 },
  "dr-sara-nelson-knoxville-tn": { rating: 4.9, reviews: 493 },
  "dr-angel-santos-grand-rapids-mi": { rating: 4.9, reviews: 509 },
  "dr-kris-barnhill-gainesville-fl": { rating: 4.8, reviews: 33 },
  "dr-jerren-stines-fort-mill-sc": { rating: 5.0, reviews: 164 },
  "dr-adam-tedder-suwanee-ga": { rating: 5.0, reviews: 436 },
  "dr-ted-valley-des-peres-mo": { rating: 4.9, reviews: 85 },
  "dr-ghazal-eslamy-san-clemente-ca": { rating: 5.0, reviews: 81 },
  "dr-will-bevis-tallahassee-fl": { rating: 4.8, reviews: 206 },
  "dr-jaclyn-becker-plano-tx": { rating: 5.0, reviews: 105 },
  "dr-darby-thomas-littleton-co": { rating: 5.0, reviews: 87 },
  "orange-chiropractic-orange-va": { rating: null, reviews: null },
  "dr-kathryn-russell-niceville-fl": { rating: 5.0, reviews: 427 },
  "dr-dana-huebner-shawnee-ks": { rating: 5.0, reviews: 93 },
  "dr-ron-martin-odessa-fl": { rating: 4.9, reviews: 23 }
};

for (const chiro of chiropractors) {
  const kr = knownRatings[chiro.slug];
  if (kr) {
    chiro.rating = kr.rating;
    chiro.reviewCount = kr.reviews;
  }
}

// Known form IDs from the file
const knownFormIds = {
  "dr-adam-tedder-suwanee-ga": "gQt22RGYX2IBUFSDqZcb",
  "dr-andre-white-calhoun-ga": "reJFzpP9LzaCUcBP0NuZ",
  "dr-angel-santos-grand-rapids-mi": "b1hsSiaivdFRkozwv68u",
  "dr-angie-recendez-arlington-heights-il": "JiaLDIUj1i25DLOE1nfG",
  "dr-asia-barclay-fayetteville-ga": "lhk0uwi2hi840TU1NNan",
  "dr-bryna-waters-nashville-tn": "DalecKYmBhx4h9oA2zlD",
  "dr-chris-stewart-bowling-green-ky": "kV3LSsYbuI3pJY9SKPDc",
  "dr-dana-huebner-shawnee-ks": "US1iSjyXKBSU8lD7wvsj",
  "dr-ghazal-eslamy-san-clemente-ca": "dHm1qxkKPLXtDfD5TX5G",
  "dr-greg-tonnesen-st-johns-fl": "shO8n3IViRcW9SR1vMjo",
  "dr-james-williams-lake-charles-la": "I11KZQurRDyzS1ECJAXg",
  "dr-jerren-stines-fort-mill-sc": "50XXXlNP591xt7Y2jyKD",
  "dr-jessica-tew-cumming-ga": "daQd5Ko3q4plfUA8qoBD",
  "dr-kathryn-russell-niceville-fl": "251vT49t4Hg5ZIUjozV6",
  "dr-marielis-montalvo-perez-davie-fl": "8sEvFf8I8IpqR2hcHoZw",
  "dr-mona-panchal-la-habra-ca": "bOsiAmFUgKdWGhrZ4bcI",
  "dr-ron-martin-odessa-fl": "gW0hHaJO0LQeAZ8aupmL",
  "dr-tara-breske-parker-co": "OAOEJyiFag1BAmtfblgd",
  "dr-ted-valley-des-peres-mo": "BWHUgVKIOwEzmkyc7sUA",
  "dr-terry-fourre-canton-ga": "DxJheKE0mkJKyi5zC3ml",
  "dr-todd-marquis-columbus-oh": "9Dj01IYrMqZq6Y56CrHj",
  "dr-yahdi-cotto-aurora-co": "mY6cPx00dkmiX1GO5VOY"
};

for (const chiro of chiropractors) {
  chiro.ghlFormId = knownFormIds[chiro.slug] || null;
}

writeFileSync('src/data/chiropractors.json', JSON.stringify(chiropractors, null, 2));
console.log(`✅ Generated ${chiropractors.length} chiropractor profiles`);
console.log(`   With ratings: ${chiropractors.filter(c => c.rating).length}`);
console.log(`   With articles: ${chiropractors.filter(c => c.article).length}`);
console.log(`   With form IDs: ${chiropractors.filter(c => c.ghlFormId).length}`);
