import type { Breed } from '../types/breed.js';

export const breeds: Breed[] = [
  {
    "id": "ragdoll",
    "name": "Ragdoll",
    "slug": "ragdoll",
    "tagline": "The gentle giant that goes limp with love",
    "description": "Ragdolls are large, docile cats known for their tendency to go limp when picked up — hence the name. They are incredibly affectionate and tend to follow their owners from room to room like puppies. Ragdolls have silky, semi-long coats that are surprisingly low-maintenance, and their bright blue eyes are a signature trait.\n\nFirst developed in California in the 1960s by breeder Ann Baker, Ragdolls are one of the most popular breeds worldwide. Their calm temperament makes them excellent companions for families, seniors, and anyone seeking a deeply bonded pet.\n\nDespite their large size, Ragdolls are gentle and non-aggressive. They prefer to stay indoors and are not particularly vocal, though they will make soft chirps when they want attention.",
    "origin": "North America",
    "size": "large",
    "coatLength": "long",
    "traits": {
      "energy": 4,
      "grooming": 5,
      "sociability": 9,
      "intelligence": 6,
      "vocalness": 3,
      "allergenLevel": 3,
      "childFriendly": 9,
      "dogFriendly": 8,
      "strangerFriendly": 7
    },
    "care": {
      "groomingFrequency": "2-3x/week",
      "dietNotes": "Feed high-quality protein-rich food. Prone to obesity — measure portions carefully.",
      "exerciseNeeds": "Moderate play sessions daily. Enjoys interactive toys but doesn't demand high activity.",
      "commonHealthIssues": ["Hypertrophic cardiomyopathy (HCM)", "Bladder stones", "Obesity"],
      "lifespan": { "min": 12, "max": 17 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?w=800&auto=format&fit=crop",
      "gallery": [
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&auto=format&fit=crop"
      ]
    },
    "tags": ["apartment", "lap-cat", "calm", "family-friendly", "dog-friendly", "first-time-owner"],
    "adoptionLinks": [
      { "label": "Ragdoll Fanciers Club International", "url": "https://www.rfci.net", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "maine-coon",
    "name": "Maine Coon",
    "slug": "maine-coon",
    "tagline": "The dog of the cat world — loyal, playful, enormous",
    "description": "Maine Coons are one of the largest domesticated cat breeds, known for their luxurious shaggy coat, tufted ears, and bushy tail. Originating in the northeastern United States, they are hardy cats built for cold weather, with a water-resistant coat and large, tufted paws that act like natural snowshoes.\n\nDespite their imposing size, Maine Coons are gentle, playful, and highly social. They are often described as 'dog-like' due to their tendency to follow owners around and their love of playing fetch. They are also quite chatty — known for their distinctive chirping and trilling sounds.\n\nMaine Coons are intelligent and enjoy puzzle toys and interactive play. They do well in families with children and other pets, making them one of the most versatile and beloved breeds.",
    "origin": "North America",
    "size": "large",
    "coatLength": "long",
    "traits": {
      "energy": 7,
      "grooming": 7,
      "sociability": 8,
      "intelligence": 8,
      "vocalness": 6,
      "allergenLevel": 3,
      "childFriendly": 9,
      "dogFriendly": 8,
      "strangerFriendly": 7
    },
    "care": {
      "groomingFrequency": "2-3x/week",
      "dietNotes": "High-protein diet recommended. Needs adequate calories due to large size. Watch for overeating.",
      "exerciseNeeds": "Active play daily — fetch, wand toys, climbing structures. Needs mental stimulation.",
      "commonHealthIssues": ["Hypertrophic cardiomyopathy (HCM)", "Hip dysplasia", "Spinal muscular atrophy"],
      "lifespan": { "min": 12, "max": 15 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop",
      "gallery": [
        "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400&auto=format&fit=crop"
      ]
    },
    "tags": ["family-friendly", "playful", "intelligent", "dog-friendly", "outdoor", "large-breed"],
    "adoptionLinks": [
      { "label": "Maine Coon Cat Club", "url": "https://www.mainecooncat.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "british-shorthair",
    "name": "British Shorthair",
    "slug": "british-shorthair",
    "tagline": "Dignified, calm, and perfectly content on your lap",
    "description": "The British Shorthair is one of the oldest and most established cat breeds in the world, with roots tracing back to ancient Rome. These cats are known for their round faces, dense plush coats, and stocky, muscular build — often compared to a 'teddy bear' appearance.\n\nBritish Shorthairs are calm and undemanding companions. They are not particularly lap cats but enjoy being in the same room as their humans. They adapt well to apartment living and are generally quiet and independent, making them ideal for working professionals.\n\nWhile not as playful as some breeds, British Shorthairs are intelligent and can be taught tricks. They get along well with children and other pets when properly introduced, and their easy-going nature makes them a top choice for first-time cat owners.",
    "origin": "United Kingdom",
    "size": "medium",
    "coatLength": "short",
    "traits": {
      "energy": 4,
      "grooming": 3,
      "sociability": 5,
      "intelligence": 6,
      "vocalness": 2,
      "allergenLevel": 3,
      "childFriendly": 7,
      "dogFriendly": 6,
      "strangerFriendly": 5
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "Monitor calorie intake — this breed is prone to obesity. High-quality balanced diet.",
      "exerciseNeeds": "Low to moderate. Interactive play 15-20 minutes daily is sufficient.",
      "commonHealthIssues": ["Hypertrophic cardiomyopathy (HCM)", "Polycystic kidney disease (PKD)", "Obesity"],
      "lifespan": { "min": 12, "max": 20 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800&auto=format&fit=crop",
      "gallery": [
        "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&auto=format&fit=crop"
      ]
    },
    "tags": ["apartment", "calm", "independent", "low-maintenance", "first-time-owner", "quiet"],
    "adoptionLinks": [
      { "label": "British Shorthair Cat Club", "url": "https://www.britishcat.co.uk", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "siamese",
    "name": "Siamese",
    "slug": "siamese",
    "tagline": "The most talkative, social, opinionated cat you'll ever meet",
    "description": "One of the oldest and most recognizable cat breeds, the Siamese is famous for its striking blue eyes, sleek body, and distinctive color-point coat pattern. Originating in Thailand (formerly Siam), this breed has been documented for centuries.\n\nSiamese cats are extremely social and vocal — they will have full conversations with their owners and demand attention throughout the day. They form deep bonds with their human families and do not do well when left alone for long periods.\n\nHighly intelligent and curious, Siamese cats need mental stimulation and thrive with interactive toys, puzzle feeders, and regular play. They are best suited for households where someone is home frequently.",
    "origin": "Asia",
    "size": "medium",
    "coatLength": "short",
    "traits": {
      "energy": 8,
      "grooming": 2,
      "sociability": 10,
      "intelligence": 9,
      "vocalness": 10,
      "allergenLevel": 2,
      "childFriendly": 7,
      "dogFriendly": 6,
      "strangerFriendly": 6
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "High-protein diet. Can be picky eaters — try several protein sources.",
      "exerciseNeeds": "High — needs daily interactive play, puzzle toys, and climbing opportunities.",
      "commonHealthIssues": ["Progressive retinal atrophy", "Amyloidosis", "Asthma/bronchial disease"],
      "lifespan": { "min": 15, "max": 20 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop",
      "gallery": [
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&auto=format&fit=crop"
      ]
    },
    "tags": ["vocal", "social", "intelligent", "active", "apartment", "bonded-pair"],
    "adoptionLinks": [
      { "label": "Siamese Cat Society", "url": "https://www.siamesecatsociety.com", "type": "registry" },
      { "label": "Siamese Rescue", "url": "https://www.siameserescue.org", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "bengal",
    "name": "Bengal",
    "slug": "bengal",
    "tagline": "Wild looks, domestic heart — the athlete of the cat world",
    "description": "Bengal cats have a striking appearance — their spotted or marbled coat gives them the look of a miniature wild leopard. They were developed by breeding domestic cats with Asian leopard cats, giving them their distinctive wild markings while maintaining a domestic temperament.\n\nBengals are highly energetic, intelligent, and curious cats that need plenty of stimulation. They love to climb, explore, and play in water — many Bengals will deliberately splash in water bowls or join their owners in the shower.\n\nThis breed is not recommended for first-time cat owners due to their high activity level and demanding nature. However, for active owners willing to provide enrichment, Bengals are deeply rewarding, affectionate companions.",
    "origin": "North America",
    "size": "medium",
    "coatLength": "short",
    "traits": {
      "energy": 10,
      "grooming": 2,
      "sociability": 7,
      "intelligence": 10,
      "vocalness": 7,
      "allergenLevel": 2,
      "childFriendly": 6,
      "dogFriendly": 6,
      "strangerFriendly": 5
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "High-protein, meat-first diet preferred. Some owners feed raw or high-quality wet food.",
      "exerciseNeeds": "Very high — needs 2+ hours of active play daily. Cat trees, leash walking, puzzle feeders.",
      "commonHealthIssues": ["Progressive retinal atrophy (PRA-b)", "Hypertrophic cardiomyopathy", "Flat-chested kitten syndrome"],
      "lifespan": { "min": 12, "max": 16 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&auto=format&fit=crop",
      "gallery": [
        "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400&auto=format&fit=crop"
      ]
    },
    "tags": ["active", "intelligent", "athletic", "experienced-owner", "playful", "unique"],
    "adoptionLinks": [
      { "label": "The International Bengal Cat Society", "url": "https://www.tibcs.com", "type": "registry" },
      { "label": "Bengal Rescue Network", "url": "https://www.bengalrescue.net", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "persian",
    "name": "Persian",
    "slug": "persian",
    "tagline": "The original lap cat — glamorous, serene, and devoted",
    "description": "Persians are one of the most popular and recognizable cat breeds, known for their flat faces, round heads, and extremely long, luxurious coats. They are calm, quiet, and extraordinarily affectionate — preferring peaceful environments and gentle handling.\n\nPersian cats are not particularly active or playful. They are content to drape themselves across furniture and be admired. Their serene personality makes them perfect for calm households, though they require significant grooming commitment.\n\nDue to their brachycephalic (flat-faced) features, Persians can have breathing difficulties and require regular cleaning of their facial folds. They are indoor-only cats that thrive in quiet, stable environments.",
    "origin": "Middle East",
    "size": "medium",
    "coatLength": "long",
    "traits": {
      "energy": 2,
      "grooming": 10,
      "sociability": 6,
      "intelligence": 5,
      "vocalness": 2,
      "allergenLevel": 4,
      "childFriendly": 5,
      "dogFriendly": 5,
      "strangerFriendly": 4
    },
    "care": {
      "groomingFrequency": "daily",
      "dietNotes": "High-quality food. Flat face can make eating messy — flat dishes recommended.",
      "exerciseNeeds": "Low — short play sessions are fine. Will not demand exercise.",
      "commonHealthIssues": ["Brachycephalic airway syndrome", "Polycystic kidney disease (PKD)", "Eye conditions"],
      "lifespan": { "min": 10, "max": 17 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&auto=format&fit=crop",
      "gallery": [
        "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400&auto=format&fit=crop"
      ]
    },
    "tags": ["calm", "lap-cat", "quiet", "apartment", "senior-friendly", "glamorous"],
    "adoptionLinks": [
      { "label": "Persian and Himalayan Cat Society", "url": "https://www.phcats.com", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "abyssinian",
    "name": "Abyssinian",
    "slug": "abyssinian",
    "tagline": "Ancient elegance meets boundless modern energy",
    "description": "The Abyssinian is one of the oldest known cat breeds, believed to have originated in ancient Egypt or Ethiopia. These slender, athletic cats are known for their distinctive ticked coat — each hair has bands of color — giving them a wild, exotic look.\n\nAbyssinians are extremely active and curious. They are always on the move, exploring every corner of their environment, climbing to high spots, and investigating anything new. They are social but on their own terms — affectionate without being clingy.\n\nThis breed thrives with plenty of space, interactive toys, and a stimulating environment. They do well with other active cats but are not suited to households where they'll be left alone for long periods.",
    "origin": "Africa",
    "size": "small",
    "coatLength": "short",
    "traits": {
      "energy": 9,
      "grooming": 2,
      "sociability": 7,
      "intelligence": 9,
      "vocalness": 4,
      "allergenLevel": 2,
      "childFriendly": 7,
      "dogFriendly": 7,
      "strangerFriendly": 6
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "High-protein diet to fuel their active lifestyle. Avoid overfeeding — stays naturally lean.",
      "exerciseNeeds": "Very high — needs daily interactive play. Cat trees, tunnels, puzzle feeders are essential.",
      "commonHealthIssues": ["Progressive retinal atrophy", "Pyruvate kinase deficiency", "Gingivitis"],
      "lifespan": { "min": 9, "max": 15 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
      "gallery": [
        "https://images.unsplash.com/photo-1501820434261-5bb046afcf6b?w=400&auto=format&fit=crop"
      ]
    },
    "tags": ["active", "intelligent", "athletic", "curious", "low-grooming", "experienced-owner"],
    "adoptionLinks": [
      { "label": "Abyssinian Cat Club", "url": "https://www.abyssiniancatclub.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "scottish-fold",
    "name": "Scottish Fold",
    "slug": "scottish-fold",
    "tagline": "Owl-eyed charmer with an irresistibly squishy personality",
    "description": "Scottish Folds are instantly recognizable by their unique folded ears, which give them an owl-like appearance. The fold results from a natural dominant gene mutation. Not all Folds have folded ears — those with straight ears are called Scottish Straights.\n\nThese cats are adaptable, calm, and highly affectionate. They tend to bond deeply with their primary person but are friendly to all family members. Scottish Folds love to sit in unusual positions — often sitting upright on their haunches — which owners find endlessly endearing.\n\nDue to the genetic nature of their folded ears, ethical breeding is important. Reputable breeders only breed Folds with Straights to prevent skeletal problems.",
    "origin": "United Kingdom",
    "size": "medium",
    "coatLength": "short",
    "traits": {
      "energy": 5,
      "grooming": 3,
      "sociability": 8,
      "intelligence": 7,
      "vocalness": 3,
      "allergenLevel": 3,
      "childFriendly": 8,
      "dogFriendly": 7,
      "strangerFriendly": 7
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "Balanced, high-quality diet. Monitor for joint issues and adjust activity accordingly.",
      "exerciseNeeds": "Moderate — daily play sessions. Can be prone to joint problems so avoid excessive jumping.",
      "commonHealthIssues": ["Osteochondrodysplasia (joint issues)", "Hypertrophic cardiomyopathy", "PKD"],
      "lifespan": { "min": 11, "max": 15 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop",
      "gallery": [
        "https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?w=400&auto=format&fit=crop"
      ]
    },
    "tags": ["apartment", "calm", "family-friendly", "adaptable", "unique", "affectionate"],
    "adoptionLinks": [
      { "label": "Scottish Fold Breeders", "url": "https://www.tica.org", "type": "breeder-directory" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "sphynx",
    "name": "Sphynx",
    "slug": "sphynx",
    "tagline": "Hairless, warm-blooded, and demanding of your undivided attention",
    "description": "The Sphynx is famous for its lack of fur — the result of a natural genetic mutation first observed in Toronto, Canada in 1966. Despite their alien appearance, Sphynx cats are warmly affectionate, people-oriented, and surprisingly soft to the touch (their skin feels like warm suede).\n\nSphynx cats are the definition of velcro cats — they want to be wherever their humans are, perched on shoulders, under blankets, or pressed against warm bodies. They are highly social and do not do well alone, so they thrive best in multi-pet households or with owners who work from home.\n\nWhile they don't shed fur, they do require regular bathing to remove oil buildup on their skin. They are often recommended for people with mild cat allergies as they produce fewer allergens.",
    "origin": "North America",
    "size": "medium",
    "coatLength": "hairless",
    "traits": {
      "energy": 8,
      "grooming": 6,
      "sociability": 10,
      "intelligence": 8,
      "vocalness": 6,
      "allergenLevel": 1,
      "childFriendly": 8,
      "dogFriendly": 8,
      "strangerFriendly": 9
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "High-calorie diet — hairless cats need more calories to regulate body temperature.",
      "exerciseNeeds": "High — very playful and energetic. Needs daily active play and climbing structures.",
      "commonHealthIssues": ["Hypertrophic cardiomyopathy (HCM)", "Skin conditions", "Hereditary myopathy"],
      "lifespan": { "min": 8, "max": 14 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["hypoallergenic", "velcro-cat", "social", "unique", "apartment", "active"],
    "adoptionLinks": [
      { "label": "Sphynx Cat Club", "url": "https://www.sphynxcat.com", "type": "registry" },
      { "label": "Sphynx Rescue", "url": "https://www.petfinder.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "norwegian-forest-cat",
    "name": "Norwegian Forest Cat",
    "slug": "norwegian-forest-cat",
    "tagline": "A Viking's companion — majestic, hardy, and self-sufficient",
    "description": "The Norwegian Forest Cat, or 'Wegie,' is a large, semi-long-haired breed that evolved in the harsh climate of Norway. Their thick, water-resistant double coat and strong, muscular body are perfectly adapted for outdoor survival, though they make wonderful indoor companions.\n\nNorwegian Forest Cats are friendly but independent. They are affectionate on their own terms — they enjoy being near their family but don't demand constant attention. They are excellent climbers and love to observe their territory from high vantage points.\n\nThis breed is gentle with children and typically gets along well with other pets. Their thick coat requires regular brushing, especially during seasonal shedding, but they are otherwise low-maintenance in temperament.",
    "origin": "Europe",
    "size": "large",
    "coatLength": "long",
    "traits": {
      "energy": 6,
      "grooming": 6,
      "sociability": 6,
      "intelligence": 7,
      "vocalness": 3,
      "allergenLevel": 4,
      "childFriendly": 8,
      "dogFriendly": 7,
      "strangerFriendly": 6
    },
    "care": {
      "groomingFrequency": "2-3x/week",
      "dietNotes": "High-protein diet. Large breed — measure portions to prevent obesity.",
      "exerciseNeeds": "Moderate — climbing structures are essential. Enjoys outdoor enclosures if available.",
      "commonHealthIssues": ["Hypertrophic cardiomyopathy", "Glycogen storage disease type IV", "Hip dysplasia"],
      "lifespan": { "min": 14, "max": 16 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["family-friendly", "independent", "large-breed", "outdoor", "calm", "dog-friendly"],
    "adoptionLinks": [
      { "label": "Norwegian Forest Cat Fanciers Association", "url": "https://www.nfcfa.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "burmese",
    "name": "Burmese",
    "slug": "burmese",
    "tagline": "Compact, silky, and desperately in love with their humans",
    "description": "Burmese cats are medium-sized, muscular cats with a surprisingly solid, heavy build — often described as 'bricks wrapped in silk.' They originated in Burma (Myanmar) and were brought to the United States in the 1930s.\n\nBurmese are extroverted, people-oriented cats that thrive on human interaction. They are playful well into adulthood and maintain a kitten-like personality throughout their lives. They will greet guests at the door and actively seek out laps to sit on.\n\nUnlike some demanding breeds, Burmese are adaptable and get along well with children, other cats, and cat-friendly dogs. They do best in homes where they have regular company, as they are prone to loneliness.",
    "origin": "Asia",
    "size": "medium",
    "coatLength": "short",
    "traits": {
      "energy": 7,
      "grooming": 2,
      "sociability": 9,
      "intelligence": 8,
      "vocalness": 5,
      "allergenLevel": 2,
      "childFriendly": 9,
      "dogFriendly": 8,
      "strangerFriendly": 8
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "Well-balanced diet. Dental hygiene is important for this breed.",
      "exerciseNeeds": "High — needs interactive play daily. Very dog-like in their enthusiasm for games.",
      "commonHealthIssues": ["Burmese head defect (BHD)", "Hypokalaemia", "Diabetes mellitus"],
      "lifespan": { "min": 16, "max": 18 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["social", "playful", "family-friendly", "low-grooming", "apartment", "velcro-cat"],
    "adoptionLinks": [
      { "label": "Burmese Cat Club", "url": "https://www.burmesecat.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "birman",
    "name": "Birman",
    "slug": "birman",
    "tagline": "Sacred temple cat — silky, gentle, and impossibly beautiful",
    "description": "The Birman, also called the Sacred Cat of Burma, is a color-pointed, semi-long-haired cat distinguished by its silky coat and striking white 'gloves' on each paw. According to legend, Birmans were companions to Kittah priests in Burma and were given blue eyes as a gift from a goddess.\n\nBirmans are gentle, calm, and highly affectionate. They love human company and are known for following their owners around curiously. Unlike Ragdolls, they are more inquisitive and playful, but still maintain a serene, gentle temperament.\n\nBirmans adapt well to indoor living and get along beautifully with children and other pets. Their semi-long coat is surprisingly tangle-resistant compared to other longhaired breeds.",
    "origin": "Asia",
    "size": "medium",
    "coatLength": "long",
    "traits": {
      "energy": 5,
      "grooming": 4,
      "sociability": 8,
      "intelligence": 7,
      "vocalness": 4,
      "allergenLevel": 3,
      "childFriendly": 9,
      "dogFriendly": 8,
      "strangerFriendly": 7
    },
    "care": {
      "groomingFrequency": "2-3x/week",
      "dietNotes": "High-quality balanced diet. Monitor weight — Birmans can be prone to obesity.",
      "exerciseNeeds": "Moderate — enjoys play but doesn't demand high activity levels.",
      "commonHealthIssues": ["Hypertrophic cardiomyopathy", "Spongiform degeneration", "Kidney disease"],
      "lifespan": { "min": 12, "max": 16 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1501820434261-5bb046afcf6b?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["calm", "gentle", "family-friendly", "apartment", "dog-friendly", "beautiful"],
    "adoptionLinks": [
      { "label": "Birman Fanciers Club", "url": "https://www.tica.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "russian-blue",
    "name": "Russian Blue",
    "slug": "russian-blue",
    "tagline": "Quiet, elegant, and fiercely loyal to their chosen person",
    "description": "The Russian Blue is prized for its striking silvery-blue coat, vivid green eyes, and naturally graceful expression that appears to be a slight smile. Originating near the port of Arkhangelsk in Russia, this breed was brought to Europe in the late 1800s.\n\nRussian Blues are reserved cats that form very deep bonds with their chosen person. They are shy around strangers but intensely loyal to their family. They are not clingy but enjoy being in the same room and will wait by the door for their owner to return.\n\nThis breed produces lower levels of Fel d 1 allergen than many other breeds, making them one of the better options for mild allergy sufferers. They are quiet, gentle, and make excellent companions for calm households.",
    "origin": "Europe",
    "size": "medium",
    "coatLength": "short",
    "traits": {
      "energy": 5,
      "grooming": 2,
      "sociability": 5,
      "intelligence": 7,
      "vocalness": 3,
      "allergenLevel": 1,
      "childFriendly": 6,
      "dogFriendly": 5,
      "strangerFriendly": 3
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "Measured portions — this breed can overeat if food is freely available.",
      "exerciseNeeds": "Moderate — enjoys play sessions but is happy with indoor life.",
      "commonHealthIssues": ["Bladder stones", "Obesity", "Dental disease"],
      "lifespan": { "min": 15, "max": 20 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["hypoallergenic", "quiet", "loyal", "apartment", "calm", "independent"],
    "adoptionLinks": [
      { "label": "Russian Blue Breeders Association", "url": "https://www.tica.org", "type": "breeder-directory" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "turkish-angora",
    "name": "Turkish Angora",
    "slug": "turkish-angora",
    "tagline": "Graceful, curious, and absolutely convinced they run the house",
    "description": "One of the oldest natural breeds in the world, the Turkish Angora originated in the Ankara region of Turkey. These elegant cats have a fine, silky single-layer coat — no woolly undercoat — which means less shedding than you'd expect from a longhaired cat.\n\nTurkish Angoras are athletic, playful, and highly intelligent. They love to be the center of attention and will invent games to entertain themselves and their families. They are curious about everything and will investigate every drawer, box, and bag in the house.\n\nThough independent, they form strong bonds with their family. They do well with other pets and children, though they prefer to be 'in charge.' White Turkish Angoras can be prone to hereditary deafness.",
    "origin": "Middle East",
    "size": "small",
    "coatLength": "long",
    "traits": {
      "energy": 8,
      "grooming": 4,
      "sociability": 8,
      "intelligence": 9,
      "vocalness": 6,
      "allergenLevel": 2,
      "childFriendly": 7,
      "dogFriendly": 6,
      "strangerFriendly": 7
    },
    "care": {
      "groomingFrequency": "2-3x/week",
      "dietNotes": "High-quality protein-rich diet. Active breed — no need to restrict calories if active.",
      "exerciseNeeds": "High — very playful and agile. Loves to climb and explore vertical spaces.",
      "commonHealthIssues": ["Hereditary ataxia", "HCM", "Deafness in white cats"],
      "lifespan": { "min": 12, "max": 18 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["playful", "intelligent", "active", "unique", "social", "agile"],
    "adoptionLinks": [
      { "label": "Turkish Angora Cat Club", "url": "https://www.tica.org", "type": "breeder-directory" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "devon-rex",
    "name": "Devon Rex",
    "slug": "devon-rex",
    "tagline": "Pixie ears, suede coat, and mischief in abundance",
    "description": "The Devon Rex is a unique breed with large bat-like ears, big eyes, high cheekbones, and a short, wavy coat that feels like soft suede. They were first discovered in Devon, England in 1959 as a natural mutation.\n\nDevon Rex cats are intensely social and playful. They are often compared to monkeys due to their acrobatic nature and love of climbing. They will perch on your shoulder, steal food from your plate, and somehow always be in the middle of whatever you're doing.\n\nThey have low shedding and their wavy coat produces fewer allergens, making them one of the better choices for mild allergy sufferers. Devon Rex cats love warmth and will seek out heated spots — including burrowing under blankets with their owners.",
    "origin": "United Kingdom",
    "size": "small",
    "coatLength": "short",
    "traits": {
      "energy": 9,
      "grooming": 2,
      "sociability": 9,
      "intelligence": 9,
      "vocalness": 5,
      "allergenLevel": 1,
      "childFriendly": 8,
      "dogFriendly": 8,
      "strangerFriendly": 8
    },
    "care": {
      "groomingFrequency": "monthly",
      "dietNotes": "High-quality diet. They tend to overeat — use puzzle feeders to slow them down.",
      "exerciseNeeds": "Very high — extremely playful and acrobatic. Needs cat trees and interactive play daily.",
      "commonHealthIssues": ["Devon Rex myopathy", "Hypertrophic cardiomyopathy", "Malassezia dermatitis"],
      "lifespan": { "min": 9, "max": 15 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["hypoallergenic", "playful", "social", "active", "unique", "apartment", "velcro-cat"],
    "adoptionLinks": [
      { "label": "Devon Rex Breed Club", "url": "https://www.tica.org", "type": "breeder-directory" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "siberian",
    "name": "Siberian",
    "slug": "siberian",
    "tagline": "The cold-weather acrobat with a hypoallergenic touch",
    "description": "Originating in the sub-zero forests of Russia, Siberian cats are large, strong, and highly agile. They possess a dense, water-repellent triple coat that protected them from the harsh winters. Despite their wild origins, they are exceptionally friendly and warm-natured pets.\n\nSiberians are active, playful, and love water — don't be surprised if they try to join you in the tub! They are also famous for their high jumping ability, often leaping onto high shelves or doors with ease.\n\nMany allergy sufferers report tolerating Siberian cats well. This is because they produce lower-than-average levels of Fel d 1, the protein responsible for most cat allergies, making them a very popular choice for families with mild allergies.",
    "origin": "Europe",
    "size": "large",
    "coatLength": "long",
    "traits": {
      "energy": 7,
      "grooming": 6,
      "sociability": 8,
      "intelligence": 8,
      "vocalness": 4,
      "allergenLevel": 2,
      "childFriendly": 9,
      "dogFriendly": 9,
      "strangerFriendly": 8
    },
    "care": {
      "groomingFrequency": "2-3x/week",
      "dietNotes": "Requires high-protein diet. Prone to slower maturation (up to 5 years) so ensure proper nutrients for growth.",
      "exerciseNeeds": "Moderate to high. Daily interactive games, climbing structures, and jumping exercises.",
      "commonHealthIssues": ["Hypertrophic cardiomyopathy (HCM)", "Polycystic kidney disease (PKD)", "Gum disease"],
      "lifespan": { "min": 12, "max": 15 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["hypoallergenic", "active", "family-friendly", "large-breed", "playful"],
    "adoptionLinks": [
      { "label": "Siberian Cat Club", "url": "https://www.siberiancatclub.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "american-shorthair",
    "name": "American Shorthair",
    "slug": "american-shorthair",
    "tagline": "The classic companion — easygoing, sturdy, and quiet",
    "description": "Originally bred to protect farm cargo from mice and rats, the American Shorthair is a robust, athletic breed with a gentle disposition. They are medium-sized cats with a muscular build and a dense, short coat that comes in a wide variety of colors and patterns, especially the classic silver tabby.\n\nAmerican Shorthairs are known for their balanced temperament. They are affectionate and enjoy family time, but they also possess an independent streak and are perfectly happy to entertain themselves while you are busy.\n\nThey adapt well to households with children and dogs. Their low-maintenance needs and easygoing lifestyle make them one of the most popular and stress-free breeds for first-time cat owners.",
    "origin": "North America",
    "size": "medium",
    "coatLength": "short",
    "traits": {
      "energy": 5,
      "grooming": 2,
      "sociability": 6,
      "intelligence": 7,
      "vocalness": 3,
      "allergenLevel": 3,
      "childFriendly": 8,
      "dogFriendly": 7,
      "strangerFriendly": 6
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "Prone to weight gain if overfed. Portion control is essential.",
      "exerciseNeeds": "Low to moderate. Daily play sessions and access to scratching posts.",
      "commonHealthIssues": ["Obesity", "HCM", "Hip dysplasia"],
      "lifespan": { "min": 15, "max": 20 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["apartment", "calm", "independent", "low-maintenance", "first-time-owner", "quiet"],
    "adoptionLinks": [
      { "label": "American Shorthair Breed Club", "url": "https://www.tica.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "somali",
    "name": "Somali",
    "slug": "somali",
    "tagline": "The fox-like beauty with high energy and a playful spirit",
    "description": "Often described as a long-haired Abyssinian, the Somali is a striking cat with a bushy tail, large ears, and a vibrant ticked coat that resembles a wild fox. They are highly intelligent, extremely active, and retain a kitten-like playfulness throughout their lives.\n\nSomalis are highly social and thrive on interaction with their human families. They are not typical lap cats, preferring to be in constant motion — fetching toys, climbing to the highest points of the room, or investigating anything new.\n\nTheir intelligence makes them highly trainable. They enjoy learning tricks, walking on a harness, and playing with puzzle feeders. They are best suited for active households that can provide plenty of mental and physical stimulation.",
    "origin": "Africa",
    "size": "medium",
    "coatLength": "medium",
    "traits": {
      "energy": 9,
      "grooming": 5,
      "sociability": 8,
      "intelligence": 9,
      "vocalness": 5,
      "allergenLevel": 3,
      "childFriendly": 8,
      "dogFriendly": 8,
      "strangerFriendly": 7
    },
    "care": {
      "groomingFrequency": "2-3x/week",
      "dietNotes": "Requires high-protein diet to support their active metabolism. Ensure fresh water is always available.",
      "exerciseNeeds": "Very high. Needs interactive toys, scratching structures, and daily play.",
      "commonHealthIssues": ["Renal amyloidosis", "Progressive retinal atrophy", "Gingivitis"],
      "lifespan": { "min": 11, "max": 16 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["active", "intelligent", "athletic", "curious", "social"],
    "adoptionLinks": [
      { "label": "Somali Cat Club", "url": "https://www.somalicatclub.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "chartreux",
    "name": "Chartreux",
    "slug": "chartreux",
    "tagline": "The silent French companion with a sweet smile",
    "description": "The Chartreux is a rare and historic French breed known for its beautiful blue-gray coat, copper/orange eyes, and a face structure that gives the appearance of a perpetual smile. Traditionally kept by Carthusian monks to catch rodents, they are quiet, dignified, and calm.\n\nChartreux cats are famous for their quiet nature. They rarely vocalize, preferring to chirp softly or communicate through eye contact and physical presence. They are highly observant and will silently follow you from room to room.\n\nDespite their muscular, heavy build, they are gentle and non-aggressive. They adapt well to new situations and make loving, unobtrusive companions for quiet households, single owners, and seniors.",
    "origin": "Europe",
    "size": "medium",
    "coatLength": "short",
    "traits": {
      "energy": 4,
      "grooming": 3,
      "sociability": 6,
      "intelligence": 7,
      "vocalness": 1,
      "allergenLevel": 3,
      "childFriendly": 8,
      "dogFriendly": 7,
      "strangerFriendly": 5
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "High-protein, moderate-calorie diet. Watch for potential urinary tract issues.",
      "exerciseNeeds": "Low to moderate. Short play sessions with wand toys or ball chasing.",
      "commonHealthIssues": ["Patellar luxation", "Polycystic kidney disease", "Struvite stones"],
      "lifespan": { "min": 12, "max": 15 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["calm", "quiet", "apartment", "low-maintenance", "first-time-owner"],
    "adoptionLinks": [
      { "label": "Chartreux Association", "url": "https://www.tica.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "balinese",
    "name": "Balinese",
    "slug": "balinese",
    "tagline": "A long-haired Siamese elegance without the heavy shedding",
    "description": "Essentially a long-haired Siamese, the Balinese features a silky, single-layer coat that lies close to the body, ending in a beautiful plume-like tail. They possess the same striking blue eyes, pointed coat colors, and vocal, affectionate personality as their short-haired cousins.\n\nDespite their longer coat, they lack a woolly undercoat, which means they shed significantly less and require less grooming than other long-haired cats. They are also believed to be one of the best choices for mild allergy sufferers due to lower Fel d 1 production.\n\nBalinese are highly social, chatty, and intelligent. They love to be involved in all family activities and form deep, lifetime bonds with their human companions.",
    "origin": "Asia",
    "size": "medium",
    "coatLength": "long",
    "traits": {
      "energy": 8,
      "grooming": 4,
      "sociability": 9,
      "intelligence": 9,
      "vocalness": 8,
      "allergenLevel": 2,
      "childFriendly": 8,
      "dogFriendly": 7,
      "strangerFriendly": 7
    },
    "care": {
      "groomingFrequency": "2-3x/week",
      "dietNotes": "Feed balanced, high-protein diet. Prone to pickiness — offer varied proteins.",
      "exerciseNeeds": "High. Enjoys climbing structures, puzzle toys, and playing retrieve.",
      "commonHealthIssues": ["Progressive retinal atrophy", "Amyloidosis", "HCM"],
      "lifespan": { "min": 15, "max": 20 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["vocal", "social", "intelligent", "active", "hypoallergenic"],
    "adoptionLinks": [
      { "label": "Balinese Cat Society", "url": "https://www.balinesecatsociety.com", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  },
  {
    "id": "toyger",
    "name": "Toyger",
    "slug": "toyger",
    "tagline": "A miniature tiger walking in your living room",
    "description": "Developed in the 1980s by crossing domestic shorthairs with Bengals, the Toyger is bred to look exactly like a miniature tiger. They feature a striking orange coat with dark vertical tiger-like stripes, circular head markings, and an athletic, rolling gait.\n\nDespite their wild, tiger-like appearance, Toygers are entirely domestic, gentle, and highly affectionate. They are outgoing, friendly, and love playing games like fetch or splashing in water.\n\nToygers are highly intelligent and curious. They get along well with children and other pets, making them a fantastic and unique choice for families seeking a wild aesthetic but a gentle, loving companion.",
    "origin": "North America",
    "size": "medium",
    "coatLength": "short",
    "traits": {
      "energy": 8,
      "grooming": 2,
      "sociability": 7,
      "intelligence": 8,
      "vocalness": 4,
      "allergenLevel": 3,
      "childFriendly": 7,
      "dogFriendly": 8,
      "strangerFriendly": 6
    },
    "care": {
      "groomingFrequency": "weekly",
      "dietNotes": "Meat-first high-quality protein diet to support active, muscular body.",
      "exerciseNeeds": "High. Cat trees, interactive play, and puzzle feeds are recommended.",
      "commonHealthIssues": ["HCM", "Feline cowpox", "Progressive retinal atrophy"],
      "lifespan": { "min": 10, "max": 15 }
    },
    "images": {
      "hero": "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800&auto=format&fit=crop",
      "gallery": []
    },
    "tags": ["active", "intelligent", "playful", "unique", "social"],
    "adoptionLinks": [
      { "label": "Toyger Cat Association", "url": "https://www.toyger.org", "type": "registry" },
      { "label": "Adopt a Pet", "url": "https://www.adoptapet.com", "type": "rescue" }
    ],
    "updatedAt": "2025-06-13T00:00:00Z"
  }
];
