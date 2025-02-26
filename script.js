// Array to store workouts
let workouts = [];

// Selecting elements
const formWorkout = document.getElementById('workout-form');
const workoutContainer = document.getElementById('workout-container');
const filterCheckboxes = document.querySelectorAll("input[type='checkbox']");
const userForm = document.querySelector('.user_form');
const userSummary = document.querySelector('.user_summary');

// Summary elements
const totalDistanceEl = document.getElementById('total-distance');
const totalTimeEl = document.getElementById('total-time');
const totalCaloriesEl = document.getElementById('total-calories');

const totalRunning = [];
const totalCycling = [];
const totalWalking = [];

let daysLeft = 0;
let targetWeightLoss = 0;

// Function to format date into a readable string
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString(undefined, options);
}

// Format numbers with commas and two decimal places
const formatNumber = (num, unit) =>
  `${num.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} ${unit}`;

///////////////////////////////////////////////////////////////////////////////
// Event during submission of user information
///////////////////////////////////////////////////////////////////////////////

userForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const fullName = document.getElementById('full-name').value;
  const age = document.getElementById('age').value;
  const height = document.getElementById('height').value;
  const currentWeight = document.getElementById('current-weight').value;
  const targetWeight = document.getElementById('target-weight').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const editButton = document.querySelector('.edit_button');

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate days left
  daysLeft = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // Calculate target weight loss
  targetWeightLoss = currentWeight - targetWeight;

  document.getElementById('summary-full-name').textContent = `${fullName}`;
  document.getElementById('summary-age').textContent = `${age}`;
  document.getElementById('summary-height').textContent = `${height} cm`;
  document.getElementById(
    'summary-current-weight'
  ).textContent = `${currentWeight} kg`;
  document.getElementById(
    'summary-target-weight'
  ).textContent = `${targetWeight} kg`;
  document.getElementById('summary-start-date').textContent = `${formatDate(
    startDate
  )}`;
  document.getElementById('summary-end-date').textContent = `${formatDate(
    endDate
  )}`;

  // Handle the Edit Feature
  editButton.addEventListener('click', function () {
    userSummary.style.display = 'none';
    userForm.style.display = 'flex';
  });

  // show and hide sections
  userSummary.style.display = 'flex';
  userForm.style.display = 'none';
  // console.log(daysLeft);
  // console.log(targetWeightLoss);
});

///////////////////////////////////////////////////////////////////////////////
// Event during submission of workout information
///////////////////////////////////////////////////////////////////////////////

formWorkout.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form refresh

  // Get user workout input
  let type = document.getElementById('workout-type').value;
  let distance = parseFloat(document.getElementById('distance').value);
  let time = parseFloat(document.getElementById('time').value);
  let calories = parseFloat(document.getElementById('calories').value);
  let date = document.getElementById('date').value;

  // Create workout object with unique ID
  let workout = { id: Date.now(), date, type, distance, time, calories };

  // Add to global array workouts
  workouts.push(workout);

  // Push data to corresponding array based on workout type
  if (type === 'Running') {
    totalRunning.push({ distance, calories, time });
  } else if (type === 'Cycling') {
    totalCycling.push({ distance, calories, time });
  } else if (type === 'Walking') {
    totalWalking.push({ distance, calories, time });
  }

  // Clear form
  formWorkout.reset();

  // Update UI
  displayWorkouts();
});

///////////////////////////////////////////////////////////////////////////////
// Function to update the display and handle the filter feature
///////////////////////////////////////////////////////////////////////////////

function displayWorkouts() {
  workoutContainer.innerHTML = ''; // Clear previous entries

  // Get selected filters
  let selectedFilters = Array.from(filterCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);
  console.log(selectedFilters);

  // Filter workouts based on selection
  let filteredWorkouts =
    selectedFilters.length === 0
      ? workouts // Show all if no filter selected
      : workouts.filter((workout) => selectedFilters.includes(workout.type));

  // Display filtered workouts
  filteredWorkouts.forEach((workout) => {
    let div = document.createElement('div');
    div.classList.add('workout');
    div.innerHTML = `
            ${formatDate(workout.date)} &nbsp &nbsp<strong>${
      workout.type
    }</strong><br>${formatNumber(workout.distance, ' m')} - ${formatNumber(
      workout.time,
      ' min'
    )} - ${formatNumber(workout.calories, ' cal')}
            <button class="deleteButton" onclick="deleteWorkout(${
              workout.id
            })">x</button>
        `;
    // update the container
    workoutContainer.appendChild(div);
  });

  // Update total calculations
  updateTotals(filteredWorkouts);
}

// Event listener for filtering
filterCheckboxes.forEach((cb) => {
  cb.addEventListener('change', displayWorkouts);
});

///////////////////////////////////////////////////////////////////////////////
// Function to update the total distance, calories, and time summary info
///////////////////////////////////////////////////////////////////////////////

function updateTotals(filteredWorkouts) {
  let totalDistance = filteredWorkouts.reduce((sum, w) => sum + w.distance, 0);
  let totalTime = filteredWorkouts.reduce((sum, w) => sum + w.time, 0);
  let totalCalories = filteredWorkouts.reduce((sum, w) => sum + w.calories, 0);

  // Update UI
  totalDistanceEl.textContent = formatNumber(totalDistance, 'm');
  totalTimeEl.textContent = formatNumber(totalTime, 'min');
  totalCaloriesEl.textContent = formatNumber(totalCalories, 'cal');
}

///////////////////////////////////////////////////////////////////////////////
// Function to handle the deletion of workout
///////////////////////////////////////////////////////////////////////////////

window.deleteWorkout = function (id) {
  // Find the workout to be deleted using the unique id
  const workoutToDelete = workouts.find((workout) => workout.id === id);

  if (workoutToDelete) {
    // Remove the workout's distance calories and time from the corresponding array
    if (workoutToDelete.type === 'Running') {
      const index = totalRunning.findIndex(
        (item) =>
          item.distance === workoutToDelete.distance &&
          item.calories === workoutToDelete.calories &&
          item.time === workoutToDelete.time
      );
      if (index !== -1) totalRunning.splice(index, 1);
    } else if (workoutToDelete.type === 'Cycling') {
      const index = totalCycling.findIndex(
        (item) =>
          item.distance === workoutToDelete.distance &&
          item.calories === workoutToDelete.calories &&
          item.time === workoutToDelete.time
      );
      if (index !== -1) totalCycling.splice(index, 1);
    } else if (workoutToDelete.type === 'Walking') {
      const index = totalWalking.findIndex(
        (item) =>
          item.distance === workoutToDelete.distance &&
          item.calories === workoutToDelete.calories &&
          item.time === workoutToDelete.time
      );
      if (index !== -1) totalWalking.splice(index, 1);
    }

    // Remove workout from the workouts array
    workouts = workouts.filter((workout) => workout.id !== id);

    // Update UI
    displayWorkouts();
  }
};

///////////////////////////////////////////////////////////////////////////////
// Function to handle the AI Recommendations
///////////////////////////////////////////////////////////////////////////////

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function generate() {
  const recoContainer = document.querySelector('.reco_container');
  const generateBtn = document.getElementById('get-recommendation');
  try {
    // Get the latest values before constructing the prompt
    const currentDaysLeft = daysLeft;
    const currentTargetWeightLoss = targetWeightLoss;

    // Ensure values are valid before making API call
    if (currentDaysLeft <= 0 || currentTargetWeightLoss <= 0) {
      console.error(
        'Invalid input: Ensure user data is entered before generating a recommendation.'
      );
      document.querySelector('.reco_container').textContent =
        'Please enter your user details first.';
      return;
    }

    // Show loading message & disable button
    recoContainer.innerHTML = `<p class="loading">⏳ Generating your workout plan... Please wait.</p>`;
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.5';

    // Calculate total values from each workout type
    const totalRunningStats = totalRunning.reduce(
      (acc, workout) => {
        acc.distance += workout.distance;
        acc.calories += workout.calories;
        acc.time += workout.time;
        return acc;
      },
      { distance: 0, calories: 0, time: 0 }
    );

    const totalCyclingStats = totalCycling.reduce(
      (acc, workout) => {
        acc.distance += workout.distance;
        acc.calories += workout.calories;
        acc.time += workout.time;
        return acc;
      },
      { distance: 0, calories: 0, time: 0 }
    );

    const totalWalkingStats = totalWalking.reduce(
      (acc, workout) => {
        acc.distance += workout.distance;
        acc.calories += workout.calories;
        acc.time += workout.time;
        return acc;
      },
      { distance: 0, calories: 0, time: 0 }
    );

    // Construct the prompt dynamically based on recorded workouts
    const prompt = `I have ${currentDaysLeft} days to lose ${currentTargetWeightLoss} kg.  
My current workouts are:  

  - **Walking**: ${totalWalkingStats.distance.toFixed(2)} m,  
    **Calories Burned**: ${totalWalkingStats.calories} cal,  
    **Time Spent**: ${totalWalkingStats.time} minutes  

  - **Cycling**: ${totalCyclingStats.distance.toFixed(2)} m,  
    **Calories Burned**: ${totalCyclingStats.calories} cal,  
    **Time Spent**: ${totalCyclingStats.time} minutes  

  - **Running**: ${totalRunningStats.distance.toFixed(2)} m,  
    **Calories Burned**: ${totalRunningStats.calories} cal,  
    **Time Spent**: ${totalRunningStats.time} minutes  

### **Workout Plan Format (Weekly Ranges):**  
Please provide a **structured** **weekly workout plan** in the following format:  

---
## **Weekly Workout Plan**  
📅 **Days Remaining:** [X]
🎯 **Target Weight Loss:** [X] kg

## **Weeks 1-X:**
🏃 **Focus**: [e.g., Building endurance / Burning fat / Improving strength]
🔹 **Workout Types**:
Running - XX meters - XX min - XX cal -- XX times per week
Cycling - XX meters -- XX min - XX cal -- XX times per week
Walking - XX meters - XX min - XX cal -- XX times per week
🔥 **Target Calories Burned per Week**: [X] cal
📌 **Recommendation**: [General advice on workout intensity & frequency]

(Repeat for additional weeks if needed

🔥 **Final Summary & Tips:**
- [Explain how this plan helps reach the goal]
- [Provide dietary & recovery suggestions]
- [Encouraging message for motivation]

---
**1kg of fat = 7,700 calories, 1,000 calories = 1 kcal.**
**Ensure the response follows this structured format and make it short as much as possible**
**Double check the data first before giving your recommendations**
**Ensure that the suggested numbers are realistic and possible to attain.**`;

    console.log(prompt);

    // Get the AI model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

    // Call AI API to generate content
    const result = await model.generateContent(prompt);

    // Get the response
    const response = await result.response;

    // Get the text from the response
    const text = await response.text();

    console.log(text);

    // handle the styling of the ai recommendation output
    document.querySelector('.reco_container').innerHTML = text
      .replace(/##\s*(.*)/g, '<h2>$1</h2>') // Convert ## Headings to <h2>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong>
      .replace(/\n/g, '<br>'); // Convert new lines to <br>
    //
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    document.querySelector('.reco_container').textContent =
      'Error generating recommendation.';
  }
  // Re-enable the button
  generateBtn.disabled = false;
  generateBtn.style.opacity = '1';
}

// Handle click event on the get recommendation button by calling the Generate function above
document
  .getElementById('get-recommendation')
  .addEventListener('click', generate);
