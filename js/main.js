// ===== State Management & Init =====
let recipes = [...window.INITIAL_RECIPES];
let favorites = [];
let ratings = {};
let notes = {};

// Local Storage keys
const STORAGE_FAVORITES = "campus_cravings_favorites";
const STORAGE_CUSTOM_RECIPES = "campus_cravings_custom_recipes";
const STORAGE_RATINGS = "campus_cravings_ratings";
const STORAGE_NOTES = "campus_cravings_notes";
const STORAGE_THEME = "campus_cravings_theme";

// Cooking mode state
let currentRecipe = null;
let currentServings = 1;
let activeStepIndex = 0;
let checkedIngredients = new Set();
let timerInterval = null;
let timerSeconds = 0;
let activeSpeech = null;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  loadDataFromStorage();
  initTheme();
  setupEventListeners();
  handleRouting();
});

// Load persistent data
function loadDataFromStorage() {
  // Load custom recipes
  try {
    const storedCustom = localStorage.getItem(STORAGE_CUSTOM_RECIPES);
    if (storedCustom) {
      const parsedCustom = JSON.parse(storedCustom);
      recipes = [...window.INITIAL_RECIPES, ...parsedCustom];
    }
  } catch (e) {
    console.error("Error parsing custom recipes", e);
  }

  // Load favorites
  try {
    const storedFavs = localStorage.getItem(STORAGE_FAVORITES);
    if (storedFavs) {
      favorites = JSON.parse(storedFavs);
    }
  } catch (e) {
    console.error("Error parsing favorites", e);
  }

  // Load ratings
  try {
    const storedRatings = localStorage.getItem(STORAGE_RATINGS);
    if (storedRatings) {
      ratings = JSON.parse(storedRatings);
    }
  } catch (e) {
    console.error("Error parsing ratings", e);
  }

  // Load notes
  try {
    const storedNotes = localStorage.getItem(STORAGE_NOTES);
    if (storedNotes) {
      notes = JSON.parse(storedNotes);
    }
  } catch (e) {
    console.error("Error parsing notes", e);
  }
}

// Save persistent data
function saveFavorites() {
  localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(favorites));
}

function saveCustomRecipes(customRecipes) {
  localStorage.setItem(STORAGE_CUSTOM_RECIPES, JSON.stringify(customRecipes));
}

function saveRatings() {
  localStorage.setItem(STORAGE_RATINGS, JSON.stringify(ratings));
}

function saveNotes() {
  localStorage.setItem(STORAGE_NOTES, JSON.stringify(notes));
}

// ===== Theme Toggle Logic =====
function initTheme() {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggleBtn");
  const storedTheme = localStorage.getItem(STORAGE_THEME);
  
  if (storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.classList.remove("dark-mode");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggleBtn");
  const isDark = body.classList.toggle("dark-mode");
  
  if (isDark) {
    localStorage.setItem(STORAGE_THEME, "dark");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    localStorage.setItem(STORAGE_THEME, "light");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// ===== SPA Hash Router =====
window.addEventListener("hashchange", handleRouting);

function handleRouting() {
  // Reset active cooking voice if any
  cancelVoiceSynthesis();

  const hash = window.location.hash || "#/";
  const viewContainer = document.getElementById("viewContainer");
  
  // Hide all views first
  document.querySelectorAll(".app-view").forEach(view => {
    view.classList.add("hidden");
  });

  // Home Route
  if (hash === "#/" || hash === "") {
    document.getElementById("home-view").classList.remove("hidden");
    renderHomeView();
    window.scrollTo(0, 0);
  }
  // Category Route
  else if (hash.startsWith("#/category/")) {
    const categoryName = hash.replace("#/category/", "").toLowerCase();
    document.getElementById("category-view").classList.remove("hidden");
    renderCategoryView(categoryName);
    window.scrollTo(0, 0);
  }
  // Recipe Detail Route
  else if (hash.startsWith("#/recipe/")) {
    const recipeId = hash.replace("#/recipe/", "");
    document.getElementById("recipe-view").classList.remove("hidden");
    renderRecipeView(recipeId);
    window.scrollTo(0, 0);
  }
  // Fallback
  else {
    window.location.hash = "#/";
  }
}

// ===== Helper: Render Recipe Grid Cards =====
function createRecipeCard(recipe) {
  const isFav = favorites.includes(recipe.id);
  const ratingVal = ratings[recipe.id] || null;
  const avgRating = calculateAverageRating(recipe.id);
  
  const ratingBadge = avgRating 
    ? `<div class="card-rating"><i class="fas fa-star"></i> <span>${avgRating.toFixed(1)}</span></div>`
    : `<div class="card-rating" style="color: var(--text-muted);"><i class="far fa-star"></i> <span>Unrated</span></div>`;
    
  return `
    <div class="recipe-card glass">
      <div class="card-img-wrapper">
        <img class="card-img" src="${recipe.image || 'images/default-food.jpg'}" alt="${recipe.name}" loading="lazy" />
        <button class="card-favorite-btn ${isFav ? 'active' : ''}" data-id="${recipe.id}" aria-label="Toggle Favorite">
          <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <div class="card-category-badge">
          <span>${getCategoryIcon(recipe.category)} ${recipe.category}</span>
        </div>
      </div>
      <div class="card-body">
        ${ratingBadge}
        <h3 class="card-title"><a href="#/recipe/${recipe.id}">${recipe.name}</a></h3>
        <p class="card-tagline">${recipe.tagline || ''}</p>
        <div class="card-meta">
          <span><i class="fas fa-clock"></i> ${recipe.prepTime + recipe.cookTime}m total</span>
          <span><i class="fas fa-pepper-hot"></i> ${recipe.tags[0] || 'Easy'}</span>
        </div>
      </div>
    </div>
  `;
}

function getCategoryIcon(category) {
  switch (category.toLowerCase()) {
    case "breakfast": return "🥞";
    case "lunch": return "🥗";
    case "dinner": return "🍛";
    default: return "🍽️";
  }
}

function calculateAverageRating(recipeId) {
  // If user rated, we use it. If not, simulate base ratings based on recipe ID length to give UI life
  if (ratings[recipeId]) {
    return ratings[recipeId];
  }
  // Base default ratings for realism
  const seeds = {
    pancakes: 4.8,
    omelette: 4.5,
    smoothie: 4.3,
    salad: 4.0,
    sandwich: 4.6,
    pasta: 4.7,
    paneer: 4.9,
    friedrice: 4.4,
    dal: 4.8
  };
  return seeds[recipeId] || null;
}

// ===== Home View Renderer =====
function renderHomeView() {
  const homeRecipeGrid = document.getElementById("homeRecipeGrid");
  const favoritesGrid = document.getElementById("favoritesGrid");
  const favoritesShelf = document.getElementById("favorites-shelf");
  
  // Render Cook Book Collection (All recipes)
  const query = document.getElementById("globalSearchBar").value.toLowerCase().trim();
  const activeTag = document.querySelector(".tag-chip.active")?.dataset.tag || "all";
  
  let filtered = recipes;
  
  // Apply Search
  if (query) {
    filtered = recipes.filter(r => 
      r.name.toLowerCase().includes(query) ||
      r.tagline.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(query))
    );
  }
  
  // Apply Tag Filters
  if (activeTag !== "all") {
    filtered = filtered.filter(r => r.tags.includes(activeTag));
  }
  
  // Generate Tag Chips
  renderTagChips();
  
  if (filtered.length === 0) {
    homeRecipeGrid.innerHTML = `
      <div class="no-results glass" style="grid-column: 1/-1; padding: 3rem; text-align: center; border-radius: var(--radius-md);">
        <i class="fas fa-search" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3>No recipes found</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Try adjusting your search query or tag filters.</p>
      </div>
    `;
  } else {
    homeRecipeGrid.innerHTML = filtered.map(createRecipeCard).join("");
  }
  
  // Render Favorites shelf
  const favRecipes = recipes.filter(r => favorites.includes(r.id));
  if (favRecipes.length > 0) {
    favoritesShelf.classList.remove("hidden");
    favoritesGrid.innerHTML = favRecipes.map(createRecipeCard).join("");
  } else {
    favoritesShelf.classList.add("hidden");
  }
  
  bindCardButtons();
}

function renderTagChips() {
  const container = document.getElementById("homeTagFilters");
  if (!container) return;
  
  // Get all unique tags
  const allTags = new Set();
  recipes.forEach(r => r.tags.forEach(t => allTags.add(t)));
  
  const currentActive = container.querySelector(".tag-chip.active")?.dataset.tag || "all";
  
  let html = `<span class="tag-chip ${currentActive === 'all' ? 'active' : ''}" data-tag="all">All Recipes</span>`;
  allTags.forEach(tag => {
    html += `<span class="tag-chip ${currentActive === tag ? 'active' : ''}" data-tag="${tag}">${tag}</span>`;
  });
  
  container.innerHTML = html;
  
  // Bind events
  container.querySelectorAll(".tag-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      container.querySelectorAll(".tag-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderHomeView();
    });
  });
}

// ===== Category View Renderer =====
function renderCategoryView(categoryName) {
  const categoryTitle = document.getElementById("categoryTitle");
  const categoryDescription = document.getElementById("categoryDescription");
  const categoryRecipeGrid = document.getElementById("categoryRecipeGrid");
  
  const formattedTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  categoryTitle.innerText = `${getCategoryIcon(categoryName)} ${formattedTitle} Recipes`;
  
  // Descriptions
  const descriptions = {
    breakfast: "Kickstart your lecture-filled day with easy, high-energy, and tasty breakfasts.",
    lunch: "Power through study sessions with balanced, fast-prepared midday lunch recipes.",
    dinner: "Wind down and satisfy your evening cravings with comforting and warm dinner options."
  };
  categoryDescription.innerText = descriptions[categoryName] || "Nourishing campus culinary collection.";
  
  // Filters
  const timeLimit = document.getElementById("timeFilter").value;
  const dietTag = document.getElementById("dietFilter").value;
  
  let filtered = recipes.filter(r => r.category.toLowerCase() === categoryName);
  
  // Apply duration limit
  if (timeLimit !== "all") {
    const maxMinutes = parseInt(timeLimit, 10);
    filtered = filtered.filter(r => (r.prepTime + r.cookTime) <= maxMinutes);
  }
  
  // Apply diet tag
  if (dietTag !== "all") {
    filtered = filtered.filter(r => r.tags.some(t => t.toLowerCase() === dietTag));
  }
  
  if (filtered.length === 0) {
    categoryRecipeGrid.innerHTML = `
      <div class="no-results glass" style="grid-column: 1/-1; padding: 3rem; text-align: center; border-radius: var(--radius-md);">
        <i class="fas fa-utensils" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3>No recipes match filters</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Try relaxing your time or diet selection.</p>
      </div>
    `;
  } else {
    categoryRecipeGrid.innerHTML = filtered.map(createRecipeCard).join("");
  }
  
  bindCardButtons();
}

// ===== Recipe Detail View Renderer =====
function renderRecipeView(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) {
    window.location.hash = "#/";
    return;
  }
  
  currentRecipe = recipe;
  currentServings = recipe.servings;
  checkedIngredients.clear();
  
  // Set details content
  document.getElementById("recipeTitleText").innerText = recipe.name;
  document.getElementById("recipeTagline").innerText = recipe.tagline || "";
  document.getElementById("recipeImage").src = recipe.image || "images/default-food.jpg";
  document.getElementById("recipeImage").alt = recipe.name;
  
  document.getElementById("statPrepTime").innerText = `${recipe.prepTime}m`;
  document.getElementById("statCookTime").innerText = recipe.cookTime ? `${recipe.cookTime}m` : "--";
  document.getElementById("statTotalTime").innerText = `${recipe.prepTime + recipe.cookTime}m`;
  
  // Dynamic tags
  const tagsContainer = document.getElementById("recipeTags");
  tagsContainer.innerHTML = recipe.tags.map(t => `<span class="recipe-tag-pill">${t}</span>`).join("");
  
  // Favorites button state
  const favBtn = document.getElementById("favoriteToggleBtn");
  if (favorites.includes(recipe.id)) {
    favBtn.classList.add("active");
    favBtn.innerHTML = '<i class="fas fa-heart text-danger"></i>';
  } else {
    favBtn.classList.remove("active");
    favBtn.innerHTML = '<i class="far fa-heart"></i>';
  }
  
  // Calculate and display average rating
  const avgRating = calculateAverageRating(recipe.id);
  const avgStarsDisplay = document.getElementById("avgStarsDisplay");
  const avgRatingText = document.getElementById("avgRatingText");
  
  if (avgRating) {
    avgStarsDisplay.innerHTML = getStarsHTML(avgRating);
    avgRatingText.innerText = `(${avgRating.toFixed(1)} / 5.0)`;
  } else {
    avgStarsDisplay.innerHTML = `<i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>`;
    avgRatingText.innerText = `(Unrated)`;
  }
  
  // Render Servings Stepper Value
  document.getElementById("servingsValue").innerText = currentServings;
  
  // Render ingredients and instructions
  renderIngredientsAndInstructions();
  
  // Populate Rating Note inputs
  const userRating = ratings[recipe.id] || 0;
  const userNote = notes[recipe.id] || "";
  
  setUserRatingStars(userRating);
  document.getElementById("userNotesInput").value = userNote;
  
  // Update back link to point to its category
  document.getElementById("recipeBackBtn").href = `#/category/${recipe.category}`;
}

function getStarsHTML(rating) {
  let stars = "";
  const fullStars = Math.floor(rating);
  const halfStar = (rating % 1) >= 0.4;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i === fullStars + 1 && halfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

function renderIngredientsAndInstructions() {
  if (!currentRecipe) return;
  
  // Servings multiplier
  const multiplier = currentServings / currentRecipe.servings;
  
  // Ingredients list
  const ingredientsList = document.getElementById("recipeIngredientsList");
  ingredientsList.innerHTML = currentRecipe.ingredients.map((ing, index) => {
    let quantityMarkup = "";
    if (ing.qty) {
      const scaledQty = ing.qty * multiplier;
      quantityMarkup = `<span class="qty-number">${window.formatFraction(scaledQty)}</span> `;
    }
    
    const isChecked = checkedIngredients.has(index);
    
    return `
      <li class="ingredient-item ${isChecked ? 'checked' : ''}" data-index="${index}">
        <input type="checkbox" class="ingredient-checkbox" id="ing-chk-${index}" ${isChecked ? 'checked' : ''} />
        <label for="ing-chk-${index}" class="ingredient-label-text">
          ${quantityMarkup}${ing.unit ? ing.unit + ' ' : ''}${ing.name}
        </label>
      </li>
    `;
  }).join("");
  
  // Bind ingredient checkbox click listeners
  ingredientsList.querySelectorAll(".ingredient-item").forEach(item => {
    const idx = parseInt(item.dataset.index, 10);
    const checkbox = item.querySelector(".ingredient-checkbox");
    
    // Listen to changes
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        item.classList.add("checked");
        checkedIngredients.add(idx);
      } else {
        item.classList.remove("checked");
        checkedIngredients.delete(idx);
      }
    });
  });

  // Instructions list
  const instructionsList = document.getElementById("recipeInstructionsList");
  instructionsList.innerHTML = currentRecipe.instructions.map(step => `
    <li>${step}</li>
  `).join("");
}

// Rating selection stars in the editor
function setUserRatingStars(rating) {
  const container = document.getElementById("userStarsInput");
  const stars = container.querySelectorAll(".star-star");
  
  stars.forEach(star => {
    const starVal = parseInt(star.dataset.rating, 10);
    if (starVal <= rating) {
      star.classList.replace("far", "fas");
      star.classList.add("active");
    } else {
      star.classList.replace("fas", "far");
      star.classList.remove("active");
    }
  });
}

// ===== Card Button Listeners Binding =====
function bindCardButtons() {
  // Favorite button clicks on cards
  document.querySelectorAll(".card-favorite-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const recipeId = btn.dataset.id;
      toggleFavoriteRecipe(recipeId);
      
      // Update UI state
      if (favorites.includes(recipeId)) {
        btn.classList.add("active");
        btn.querySelector("i").className = "fas fa-heart";
      } else {
        btn.classList.remove("active");
        btn.querySelector("i").className = "far fa-heart";
      }
      
      // Re-render favorites shelf if we are on the Home view
      if (window.location.hash === "#/" || window.location.hash === "") {
        renderHomeView();
      }
    });
  });
}

function toggleFavoriteRecipe(id) {
  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
  }
  saveFavorites();
}

// ===== Interactive Servings adjustment =====
function adjustServings(delta) {
  if (!currentRecipe) return;
  const newValue = currentServings + delta;
  if (newValue >= 1 && newValue <= 50) {
    currentServings = newValue;
    document.getElementById("servingsValue").innerText = currentServings;
    renderIngredientsAndInstructions();
  }
}

// ===== Rating & Note Save =====
function saveRecipeFeedback() {
  if (!currentRecipe) return;
  
  const userNotes = document.getElementById("userNotesInput").value.trim();
  
  // Find selected rating
  const activeStar = document.querySelector("#userStarsInput .star-star.active:last-of-type");
  const ratingValue = activeStar ? parseInt(activeStar.dataset.rating, 10) : 0;
  
  if (ratingValue > 0) {
    ratings[currentRecipe.id] = ratingValue;
    saveRatings();
  }
  
  notes[currentRecipe.id] = userNotes;
  saveNotes();
  
  // Trigger UI alert and re-render header details
  alert("Kitchen notes and rating saved successfully!");
  renderRecipeView(currentRecipe.id);
}

// ===== Fullscreen Cooking Mode Logic =====
function openCookingMode() {
  if (!currentRecipe) return;
  
  activeStepIndex = 0;
  
  // Populate UI
  document.getElementById("cookingRecipeTitle").innerText = currentRecipe.name;
  document.getElementById("cookingRecipeIcon").innerText = getCategoryIcon(currentRecipe.category);
  
  document.getElementById("cookingModeOverlay").classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent scrolling behind
  
  renderCookingStep();
}

function closeCookingMode() {
  cancelVoiceSynthesis();
  resetStepTimer();
  document.getElementById("cookingModeOverlay").classList.add("hidden");
  document.getElementById("cookingCelebrationScreen").classList.add("hidden");
  document.body.style.overflow = ""; // Re-enable scrolling
}

function renderCookingStep() {
  if (!currentRecipe) return;
  
  const totalSteps = currentRecipe.instructions.length;
  const activeStepText = currentRecipe.instructions[activeStepIndex];
  
  document.getElementById("activeStepText").innerText = activeStepText;
  
  // Progress Bar
  const progressPercent = Math.round((activeStepIndex / totalSteps) * 100);
  document.getElementById("cookingProgressBar").style.width = `${progressPercent}%`;
  document.getElementById("cookingStepIndexText").innerText = `Step ${activeStepIndex + 1} of ${totalSteps}`;
  document.getElementById("cookingPercentText").innerText = `${progressPercent}% Complete`;
  
  // Navigation button states
  document.getElementById("prevStepBtn").disabled = activeStepIndex === 0;
  
  const nextBtn = document.getElementById("nextStepBtn");
  if (activeStepIndex === totalSteps - 1) {
    nextBtn.innerHTML = 'Complete Cooking <i class="fas fa-check-double"></i>';
  } else {
    nextBtn.innerHTML = 'Next Step <i class="fas fa-chevron-right"></i>';
  }

  // Voice Speech Reset
  cancelVoiceSynthesis();
  const speakBtn = document.getElementById("voiceSpeakBtn");
  speakBtn.classList.remove("speaking");
  speakBtn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to step';
  
  // Smart timer loading (Check if active step specifies cooking times)
  resetStepTimer();
  loadSmartTimer(activeStepText);
}

function handleNextStep() {
  if (!currentRecipe) return;
  const totalSteps = currentRecipe.instructions.length;
  
  if (activeStepIndex < totalSteps - 1) {
    activeStepIndex++;
    renderCookingStep();
  } else {
    // Show celebration screen
    document.getElementById("cookingProgressBar").style.width = "100%";
    document.getElementById("cookingPercentText").innerText = "100% Complete";
    document.getElementById("cookingCelebrationScreen").classList.remove("hidden");
    triggerCelebrationSound();
  }
}

function handlePrevStep() {
  if (activeStepIndex > 0) {
    activeStepIndex--;
    renderCookingStep();
  }
}

// Smart Timer: parses instructions for times e.g. "cook for 2 minutes" or "simmer for 5-7 minutes"
function loadSmartTimer(text) {
  const timerCard = document.getElementById("cookingTimerCard");
  
  // RegEx match variations: "5 minutes", "2-3 minutes", "30 seconds"
  const minMatch = text.match(/(\d+)\s*-\s*(\d+)\s*min/i) || text.match(/(\d+)\s*(?:minutes|mins|minute|min)/i);
  const secMatch = text.match(/(\d+)\s*(?:seconds|secs|second|sec)/i);
  
  if (minMatch) {
    // Use upper limit for range (e.g. 5-7 minutes -> 7) or exact minutes
    const mins = minMatch[2] ? parseInt(minMatch[2], 10) : parseInt(minMatch[1], 10);
    timerSeconds = mins * 60;
    timerCard.style.opacity = "1";
    updateTimerDisplay();
  } else if (secMatch) {
    const secs = parseInt(secMatch[1], 10);
    timerSeconds = secs;
    timerCard.style.opacity = "1";
    updateTimerDisplay();
  } else {
    // If no time matches, default to 5 minutes but let timer card remain transparently active for customization
    timerSeconds = 300;
    updateTimerDisplay();
  }
}

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  document.getElementById("timerDisplay").innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function toggleStepTimer() {
  const btn = document.getElementById("timerToggleBtn");
  
  if (timerInterval) {
    // Pause
    clearInterval(timerInterval);
    timerInterval = null;
    btn.innerHTML = '<i class="fas fa-play"></i> Start';
  } else {
    // Start
    if (timerSeconds <= 0) return;
    btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        // Timer completed!
        clearInterval(timerInterval);
        timerInterval = null;
        btn.innerHTML = '<i class="fas fa-play"></i> Start';
        triggerTimerAlert();
      }
    }, 1000);
  }
}

function resetStepTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  document.getElementById("timerToggleBtn").innerHTML = '<i class="fas fa-play"></i> Start';
  
  // Reload smart timer duration for current step
  if (currentRecipe) {
    const stepText = currentRecipe.instructions[activeStepIndex];
    const minMatch = stepText.match(/(\d+)\s*-\s*(\d+)\s*min/i) || stepText.match(/(\d+)\s*(?:minutes|mins|minute|min)/i);
    const secMatch = stepText.match(/(\d+)\s*(?:seconds|secs|second|sec)/i);
    
    if (minMatch) {
      const mins = minMatch[2] ? parseInt(minMatch[2], 10) : parseInt(minMatch[1], 10);
      timerSeconds = mins * 60;
    } else if (secMatch) {
      timerSeconds = parseInt(secMatch[1], 10);
    } else {
      timerSeconds = 300; // default 5m
    }
  } else {
    timerSeconds = 0;
  }
  updateTimerDisplay();
}

function setTimerPreset(seconds) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("timerToggleBtn").innerHTML = '<i class="fas fa-play"></i> Start';
  }
  timerSeconds = seconds;
  updateTimerDisplay();
}

function triggerTimerAlert() {
  // Beep Sound Synthesis (using Web Audio API so no audio file files are needed!)
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play three successive beeps
    [0, 300, 600].forEach(delay => {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }, delay);
    });
  } catch (e) {
    console.error("Web audio beep failed", e);
  }
  alert("⏰ Timer completed for this cooking step!");
}

function triggerCelebrationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play a happy arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, index) => {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }, index * 100);
    });
  } catch (e) {
    console.error("Celebration sound failed", e);
  }
}

// Voice Synthesis step reader
function speakActiveStep() {
  if (!currentRecipe) return;
  const speakBtn = document.getElementById("voiceSpeakBtn");
  
  if (activeSpeech) {
    cancelVoiceSynthesis();
    speakBtn.classList.remove("speaking");
    speakBtn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to step';
    return;
  }
  
  const textToSpeak = document.getElementById("activeStepText").innerText;
  
  try {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    utterance.onend = () => {
      speakBtn.classList.remove("speaking");
      speakBtn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to step';
      activeSpeech = null;
    };
    
    utterance.onerror = () => {
      speakBtn.classList.remove("speaking");
      speakBtn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to step';
      activeSpeech = null;
    };
    
    speakBtn.classList.add("speaking");
    speakBtn.innerHTML = '<i class="fas fa-stop"></i> Stop reading';
    
    activeSpeech = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error("Speech Synthesis failed", e);
  }
}

function cancelVoiceSynthesis() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  activeSpeech = null;
}

// ===== Custom Recipe Form Creator =====
function openAddRecipeModal() {
  document.getElementById("addRecipeModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeAddRecipeModal() {
  document.getElementById("addRecipeModal").classList.add("hidden");
  document.body.style.overflow = "";
  document.getElementById("customRecipeForm").reset();
}

function handleCustomRecipeSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById("formRecipeName").value.trim();
  const category = document.getElementById("formRecipeCategory").value;
  const tagline = document.getElementById("formRecipeTagline").value.trim();
  const prepTime = parseInt(document.getElementById("formPrepTime").value, 10);
  const cookTime = parseInt(document.getElementById("formCookTime").value, 10);
  const servings = parseInt(document.getElementById("formServings").value, 10);
  const tagsStr = document.getElementById("formTags").value;
  const ingredientsStr = document.getElementById("formIngredients").value;
  const instructionsStr = document.getElementById("formInstructions").value;
  
  // Process tags
  const tags = tagsStr.trim()
    ? tagsStr.split(",").map(t => t.trim()).filter(t => t !== "")
    : ["Custom", "Easy"];
    
  // Process Ingredients
  const ingredientsLines = ingredientsStr.split("\n").map(l => l.trim()).filter(l => l !== "");
  const ingredients = ingredientsLines.map(parseIngredientLine).filter(i => i !== null);
  
  // Process Instructions
  const instructions = instructionsStr.split("\n").map(l => l.trim()).filter(l => l !== "");
  
  if (ingredients.length === 0 || instructions.length === 0) {
    alert("Please enter at least one valid ingredient and one instruction step.");
    return;
  }
  
  // Create recipe object
  const newId = "custom-" + Date.now();
  const newRecipe = {
    id: newId,
    name,
    category,
    icon: getCategoryIcon(category),
    image: getCategoryPlaceholderImage(category),
    prepTime,
    cookTime,
    servings,
    tags,
    tagline,
    ingredients,
    instructions
  };
  
  // Save to storage
  let storedCustom = [];
  try {
    const existing = localStorage.getItem(STORAGE_CUSTOM_RECIPES);
    if (existing) storedCustom = JSON.parse(existing);
  } catch (err) {
    console.error("Error reading custom list", err);
  }
  
  storedCustom.push(newRecipe);
  saveCustomRecipes(storedCustom);
  
  // Update state list
  recipes.push(newRecipe);
  
  // Success & Close
  alert("🎉 Custom recipe created successfully!");
  closeAddRecipeModal();
  
  // Route to the new recipe details
  window.location.hash = `#/recipe/${newId}`;
}

// Parses a single line e.g. "1 1/2 cups flour" or "1 clove garlic"
function parseIngredientLine(line) {
  line = line.trim();
  if (!line) return null;
  
  // Match fractions/decimals or integers e.g. "1/2", "1 1/2", "0.25", "2"
  const match = line.match(/^(\d+(?:\s+\d+\/\d+|\/\d+|\.\d+)?)\s*([a-zA-Z\.]+)?\s+(.+)$/);
  if (match) {
    const qtyStr = match[1];
    let unit = match[2] || "";
    let name = match[3];
    
    // Parse quantity
    let qty = null;
    if (qtyStr.includes("/")) {
      if (qtyStr.includes(" ")) {
        const parts = qtyStr.split(/\s+/);
        const whole = parseInt(parts[0], 10);
        const fracParts = parts[1].split("/");
        qty = whole + (parseInt(fracParts[0], 10) / parseInt(fracParts[1], 10));
      } else {
        const fracParts = qtyStr.split("/");
        qty = parseInt(fracParts[0], 10) / parseInt(fracParts[1], 10);
      }
    } else {
      qty = parseFloat(qtyStr);
    }
    
    // Clean and validate unit against common keywords
    const commonUnits = ["cup", "cups", "tbsp", "tbsp.", "tsp", "tsp.", "g", "ml", "clove", "cloves", "slice", "slices", "piece", "pieces", "can", "cans", "pinch", "pinches"];
    if (unit && !commonUnits.includes(unit.toLowerCase())) {
      // If it's not a common cooking unit, it's probably part of the name
      name = unit + " " + name;
      unit = "";
    }
    
    return { qty, unit, name };
  }
  
  // Fallback
  return { qty: null, unit: "", name: line };
}

function getCategoryPlaceholderImage(category) {
  // Use existing image assets as category fallbacks
  switch (category) {
    case "breakfast": return "images/pancakes.jpg";
    case "lunch": return "images/salad.jpg";
    case "dinner": return "images/dal.jpg";
    default: return "images/salad.jpg";
  }
}

// ===== Global Event Bindings =====
function setupEventListeners() {
  // Theme button
  document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);
  
  // Global Search bar
  const searchInput = document.getElementById("globalSearchBar");
  searchInput.addEventListener("input", () => {
    // Navigate home if search is initiated from categories or recipes
    if (window.location.hash !== "#/" && window.location.hash !== "") {
      window.location.hash = "#/";
    } else {
      renderHomeView();
    }
  });

  // Modal events
  document.getElementById("addRecipeBtn").addEventListener("click", openAddRecipeModal);
  document.getElementById("closeModalBtn").addEventListener("click", closeAddRecipeModal);
  document.getElementById("cancelFormBtn").addEventListener("click", closeAddRecipeModal);
  document.getElementById("customRecipeForm").addEventListener("submit", handleCustomRecipeSubmit);
  
  // Category View filters
  document.getElementById("timeFilter").addEventListener("change", () => {
    handleRouting();
  });
  document.getElementById("dietFilter").addEventListener("change", () => {
    handleRouting();
  });
  
  // Recipe details servings stepper
  document.getElementById("servingsMinus").addEventListener("click", () => adjustServings(-1));
  document.getElementById("servingsPlus").addEventListener("click", () => adjustServings(1));
  
  // Print button
  document.getElementById("recipePrintBtn").addEventListener("click", () => {
    window.print();
  });

  // Favorites toggle in recipe view
  document.getElementById("favoriteToggleBtn").addEventListener("click", () => {
    if (!currentRecipe) return;
    toggleFavoriteRecipe(currentRecipe.id);
    renderRecipeView(currentRecipe.id);
  });
  
  // Rating Editor star selection
  document.querySelectorAll("#userStarsInput .star-star").forEach(star => {
    star.addEventListener("click", () => {
      const rating = parseInt(star.dataset.rating, 10);
      setUserRatingStars(rating);
    });
  });
  
  // Save feedback
  document.getElementById("saveFeedbackBtn").addEventListener("click", saveRecipeFeedback);
  
  // Cooking mode controls
  document.getElementById("startCookingBtn").addEventListener("click", openCookingMode);
  document.getElementById("closeCookingBtn").addEventListener("click", closeCookingMode);
  document.getElementById("finishCookingBtn").addEventListener("click", closeCookingMode);
  
  document.getElementById("prevStepBtn").addEventListener("click", handlePrevStep);
  document.getElementById("nextStepBtn").addEventListener("click", handleNextStep);
  
  document.getElementById("voiceSpeakBtn").addEventListener("click", speakActiveStep);
  
  // Cooking Timer controls
  document.getElementById("timerToggleBtn").addEventListener("click", toggleStepTimer);
  document.getElementById("timerResetBtn").addEventListener("click", resetStepTimer);
  
  // Presets in Timer
  document.querySelectorAll("#timerPresets .preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const secs = parseInt(btn.dataset.time, 10);
      setTimerPreset(secs);
    });
  });
}
