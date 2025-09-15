// Arrays of adjectives and nouns
const sillyAdjectives = [
  "Damp", "Flaccid", "Sassy", "Clumsy", "Wobbly", "Bouncy", "Spicy", "Squishy", "Cranky", "Snappy", 
  "Slippery", "Fuzzy", "Grumpy", "Puffy", "Sticky", "Wacky", "Jiggly", "Quirky", "Goofy", "Sleepy",
  "Loopy", "Lumpy", "Fluffy", "Dizzy", "Sloppy", "Lurking", "Baffled", "Grumpy", 
  "Lazy", "Rattled", "Cheeky", "Wimpy", "Twitchy", "Droopy", "Bumbling", "Nerdy", "Smelly", "Naughty",
  "Insecure", "Phished", "Unusable"
];

const sillyNouns = [
  "Noodle", "Pickle", "Muffin", "Pudding", "Wombat", "Tofu", "Sprinkles", "Pancake", "Nacho", "Biscuit", 
  "Wiggle", "Nugget", "Doodle", "Marshmallow", "Sprocket", "Pogo", "Cucumber", "Jellybean", "Waffle", "Popcorn",
  "Gizmo", "Taco", "Squirt", "Bubbles", "Chipmunk", "Cupcake", "Banana", "Lobster", "Zucchini", "Flapjack", 
  "Dumpling", "Monkey", "Slinky", "Goblin", "Sausage", "Yeti", "Plankton", "Weasel", "Gnome", "Turtle",
  "End-User", "Dev", "Hacker"
];

// Function to generate a random secret agent name
export function generateRandomName() {
  const randomAdjective = sillyAdjectives[Math.floor(Math.random() * sillyAdjectives.length)];
  const randomNoun = sillyNouns[Math.floor(Math.random() * sillyNouns.length)];
  return `${randomAdjective} ${randomNoun}`;
}