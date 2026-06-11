// ===== Recipe Vault Database =====

window.INITIAL_RECIPES = [
  {
    id: "pancakes",
    name: "Fluffy Pancakes",
    category: "breakfast",
    icon: "🥞",
    image: "images/pancakes.jpg",
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    tags: ["Vegetarian", "Sweet", "Classic"],
    tagline: "Light, airy, and golden pancakes perfect for a weekend breakfast.",
    ingredients: [
      { qty: 1, unit: "cup", name: "flour" },
      { qty: 1, unit: "tbsp", name: "sugar" },
      { qty: 1, unit: "tsp", name: "baking powder" },
      { qty: 1, unit: "", name: "egg" },
      { qty: 1, unit: "cup", name: "milk" }
    ],
    instructions: [
      "Mix the dry ingredients (flour, sugar, baking powder) together in a bowl.",
      "Whisk in the egg and milk until the batter is smooth and free of large lumps.",
      "Heat a lightly oiled non-stick pan over medium heat.",
      "Pour or scoop the batter onto the pan (about 1/4 cup for each pancake).",
      "Cook until bubbles pop on the surface, then flip and cook the other side until golden brown (about 2 minutes per side)."
    ]
  },
  {
    id: "omelette",
    name: "Cheese Omelette",
    category: "breakfast",
    icon: "🧀",
    image: "images/omelette.jpg",
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    tags: ["Vegetarian", "Savoury", "High-Protein"],
    tagline: "A classic folded omelette with a warm, melty cheese center.",
    ingredients: [
      { qty: 2, unit: "", name: "eggs" },
      { qty: 2, unit: "tbsp", name: "milk" },
      { qty: 0.25, unit: "cup", name: "shredded cheese" },
      { qty: 1, unit: "tsp", name: "butter or oil" },
      { qty: null, unit: "", name: "Salt and pepper to taste" }
    ],
    instructions: [
      "Crack eggs into a bowl and whisk thoroughly with the milk, salt, and pepper.",
      "Heat a non-stick pan over medium heat and melt the butter (or add oil).",
      "Pour in the egg mixture, tilting the pan to coat the bottom, and cook undisturbed for 1–2 minutes.",
      "Sprinkle the shredded cheese over half of the omelette.",
      "Fold the other half over the cheese, cook for another 1-2 minutes until cheese melts, and serve hot."
    ]
  },
  {
    id: "smoothie",
    name: "Banana Smoothie",
    category: "breakfast",
    icon: "🍌",
    image: "images/smoothie.jpg",
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    tags: ["Vegetarian", "Healthy", "Quick"],
    tagline: "Creamy, refreshing banana smoothie dusted with cinnamon.",
    ingredients: [
      { qty: 1, unit: "", name: "ripe banana" },
      { qty: 0.5, unit: "cup", name: "yogurt or milk (dairy or plant-based)" },
      { qty: 1, unit: "tbsp", name: "honey or maple syrup (optional)" },
      { qty: 0.25, unit: "tsp", name: "cinnamon (optional)" },
      { qty: null, unit: "", name: "3-4 ice cubes" }
    ],
    instructions: [
      "Peel the ripe banana and slice it into small chunks.",
      "Add banana pieces, yogurt/milk, honey, ice cubes, and cinnamon to a blender.",
      "Blend on high speed for 30–60 seconds until completely smooth and creamy.",
      "Pour into a tall glass, dust with extra cinnamon if desired, and serve immediately."
    ]
  },
  {
    id: "salad",
    name: "Green Salad",
    category: "lunch",
    icon: "🥗",
    image: "images/salad.jpg",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    tags: ["Vegan", "Gluten-Free", "Low-Calorie"],
    tagline: "A crisp, colorful, and nourishing bowl of raw summer greens.",
    ingredients: [
      { qty: 2, unit: "cups", name: "mixed greens" },
      { qty: 1, unit: "", name: "cucumber, sliced" },
      { qty: 1, unit: "", name: "tomato, chopped" },
      { qty: 0.25, unit: "", name: "red onion, thinly sliced" },
      { qty: null, unit: "", name: "Salad dressing of choice" }
    ],
    instructions: [
      "Thoroughly wash and pat dry the mixed salad greens.",
      "Chop and slice the cucumber, tomatoes, and red onion.",
      "Toss all the cut vegetables and salad greens together in a large bowl.",
      "Drizzle with your favorite dressing right before serving and toss well."
    ]
  },
  {
    id: "sandwich",
    name: "Grilled Sandwich",
    category: "lunch",
    icon: "🥪",
    image: "images/sandwich.jpg",
    prepTime: 10,
    cookTime: 5,
    servings: 1,
    tags: ["Vegetarian", "Crispy", "Cheesy"],
    tagline: "Crispy toasted bread loaded with sliced vegetables and melted cheese.",
    ingredients: [
      { qty: 2, unit: "slices", name: "bread" },
      { qty: 0.25, unit: "cup", name: "shredded cheese" },
      { qty: 0.25, unit: "", name: "onion, sliced" },
      { qty: 0.25, unit: "", name: "tomato, sliced" },
      { qty: 0.25, unit: "", name: "cucumber, sliced" },
      { qty: null, unit: "", name: "Butter or olive oil for grilling" },
      { qty: null, unit: "", name: "Salt, pepper, and chaat masala to taste" }
    ],
    instructions: [
      "Spread butter or brush olive oil on one side of both bread slices.",
      "On the unbuttered side, layer onion, tomato, and cucumber slices.",
      "Sprinkle salt, pepper, chaat masala, and shredded cheese over the vegetables.",
      "Close the sandwich and grill on a sandwich press or in a frying pan over medium heat until both sides are golden brown and crispy, and the cheese is fully melted."
    ]
  },
  {
    id: "pasta",
    name: "Veggie Pasta",
    category: "lunch",
    icon: "🍝",
    image: "images/pasta.jpg",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    tags: ["Vegetarian", "Savory", "Hearty"],
    tagline: "Penne pasta tossed in rich tomato sauce and stir-fried garden vegetables.",
    ingredients: [
      { qty: 1, unit: "cup", name: "penne or fusilli pasta" },
      { qty: 0.5, unit: "cup", name: "chopped vegetables (bell peppers, carrots, zucchini)" },
      { qty: 2, unit: "tbsp", name: "olive oil" },
      { qty: 1, unit: "clove", name: "garlic, minced" },
      { qty: 0.5, unit: "cup", name: "tomato puree or sauce" },
      { qty: null, unit: "", name: "Salt, pepper, and chili flakes to taste" },
      { qty: null, unit: "", name: "Fresh basil or oregano (optional)" }
    ],
    instructions: [
      "Boil the pasta in a pot of salted water until 'al dente'. Drain and set aside.",
      "Heat olive oil in a pan and sauté the minced garlic for about 30 seconds.",
      "Add the chopped vegetables and stir-fry for 3-4 minutes until tender-crisp.",
      "Pour in the tomato sauce and stir in the spices (salt, pepper, chili flakes) and herbs.",
      "Add the cooked pasta to the pan, toss well to coat in sauce, and simmer for 1-2 minutes. Serve warm with grated cheese."
    ]
  },
  {
    id: "paneer",
    name: "Paneer Curry",
    category: "dinner",
    icon: "🧀",
    image: "images/paneer.jpg",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    tags: ["Vegetarian", "Spicy", "Rich"],
    tagline: "Tender cottage cheese cubes simmered in a creamy, spiced tomato gravy.",
    ingredients: [
      { qty: 200, unit: "g", name: "paneer (cottage cheese), cubed" },
      { qty: 1, unit: "", name: "onion, finely chopped" },
      { qty: 2, unit: "", name: "tomatoes, pureed" },
      { qty: 1, unit: "tsp", name: "ginger-garlic paste" },
      { qty: 0.5, unit: "tsp", name: "turmeric" },
      { qty: 1, unit: "tsp", name: "coriander powder" },
      { qty: 0.5, unit: "tsp", name: "chili powder" },
      { qty: 2, unit: "tbsp", name: "cream or yogurt" },
      { qty: 2, unit: "tbsp", name: "oil or ghee" },
      { qty: null, unit: "", name: "Salt and fresh coriander to garnish" }
    ],
    instructions: [
      "Heat oil or ghee in a pan and sauté the chopped onions until golden brown.",
      "Add ginger-garlic paste and sauté for another minute.",
      "Pour in tomato puree and cook over medium heat until the oil begins to separate.",
      "Stir in the spices: turmeric, coriander powder, chili powder, and salt.",
      "Add the cubed paneer and cook gently for 2-3 minutes.",
      "Whisk in cream or yogurt, reduce heat, and simmer for another 2-3 minutes. Garnish with fresh coriander."
    ]
  },
  {
    id: "friedrice",
    name: "Veg Fried Rice",
    category: "dinner",
    icon: "🍚",
    image: "images/friedrice.jpg",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    tags: ["Vegan", "Chinese-Style", "Quick"],
    tagline: "Stir-fried rice tossed with colorful garden veggies and savory soy sauce.",
    ingredients: [
      { qty: 1, unit: "cup", name: "cooked rice (preferably chilled)" },
      { qty: 0.25, unit: "cup", name: "chopped carrots" },
      { qty: 0.25, unit: "cup", name: "green peas" },
      { qty: 0.25, unit: "cup", name: "chopped capsicum" },
      { qty: 2, unit: "tbsp", name: "soy sauce" },
      { qty: 1, unit: "tbsp", name: "oil" },
      { qty: null, unit: "", name: "Salt and pepper to taste" },
      { qty: null, unit: "", name: "Chopped spring onions for garnish" }
    ],
    instructions: [
      "Heat oil in a large wok or pan over medium-high heat.",
      "Add chopped carrots, green peas, and capsicum. Stir-fry rapidly for 3-4 minutes.",
      "Add the chilled cooked rice and toss it thoroughly with the vegetables.",
      "Drizzle soy sauce, and sprinkle salt and pepper. Stir-fry for 2-3 minutes until heated through.",
      "Garnish with chopped spring onions and serve immediately."
    ]
  },
  {
    id: "dal",
    name: "Mixed Dal Tadka",
    category: "dinner",
    icon: "🌿",
    image: "images/dal.jpg",
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    tags: ["Vegetarian", "Gluten-Free", "Comfort Food"],
    tagline: "Creamy lentils tempered with sizzling cumin, garlic, and ghee.",
    ingredients: [
      { qty: 0.5, unit: "cup", name: "toor dal (split pigeon peas)" },
      { qty: 0.25, unit: "cup", name: "moong dal (yellow split lentils)" },
      { qty: 1, unit: "", name: "onion, finely chopped" },
      { qty: 1, unit: "", name: "tomato, chopped" },
      { qty: 1, unit: "tsp", name: "cumin seeds" },
      { qty: 2, unit: "cloves", name: "garlic, minced" },
      { qty: 0.25, unit: "tsp", name: "turmeric" },
      { qty: 0.5, unit: "tsp", name: "chili powder" },
      { qty: 2, unit: "tsp", name: "ghee or oil" },
      { qty: null, unit: "", name: "Salt and coriander leaves to garnish" }
    ],
    instructions: [
      "Wash dals and pressure-cook them with turmeric, salt, and 2 cups of water for 3-4 whistles (or simmer in a pot for 25 mins) until soft.",
      "Heat ghee or oil in a small pan, add cumin seeds, and let them splutter. Then add minced garlic and sauté for 30 seconds.",
      "Add chopped onions and sauté until golden brown. Add tomatoes and cook until soft and mushy.",
      "Sprinkle in chili powder, then pour this tempering (tadka) into the cooked dal.",
      "Stir well, simmer for 5 minutes, garnish with coriander leaves, and serve with rice or flatbread."
    ]
  }
];

// Utility: format decimal quantities to fractions
window.formatFraction = function(value) {
  if (value === null || value === undefined || isNaN(value)) return "";
  if (Number.isInteger(value)) return value.toString();
  
  const tolerance = 0.01;
  const whole = Math.floor(value);
  const fraction = value - whole;
  
  let fracText = "";
  if (Math.abs(fraction - 0.25) < tolerance) fracText = "1/4";
  else if (Math.abs(fraction - 0.5) < tolerance) fracText = "1/2";
  else if (Math.abs(fraction - 0.75) < tolerance) fracText = "3/4";
  else if (Math.abs(fraction - 0.33) < tolerance || Math.abs(fraction - 0.333) < tolerance) fracText = "1/3";
  else if (Math.abs(fraction - 0.66) < tolerance || Math.abs(fraction - 0.667) < tolerance) fracText = "2/3";
  else if (Math.abs(fraction - 0.2) < tolerance) fracText = "1/5";
  else if (Math.abs(fraction - 0.125) < tolerance) fracText = "1/8";
  else {
    // If not a simple fraction, round to 1 decimal place
    const rounded = Math.round(value * 10) / 10;
    return rounded.toString();
  }
  
  if (whole > 0) {
    return `${whole} ${fracText}`;
  }
  return fracText;
};
