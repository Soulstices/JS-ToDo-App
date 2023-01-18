'use strict';

let tasks = []; // Stores all tasks locally

// App Initialization
(() => {
	console.log('App Init')
	loadTasks();
	renderTasks();
})();

// Event which happens on "ADD" button click
function addTaskBtn() {
	const taskText = document.getElementsByClassName('form-control')[0].value;
	if (taskText) {
		addTask(taskText);
		saveTasks();

		document.getElementsByClassName('form-control')[0].value = '';
	}
}

// Creates a new task, pushes it to tasks array and renders it
function addTask(text, isChecked = false) {

	const newTask = {
		id: generateUID(),
		text,
		isChecked,
		date: Date.now()
	}

	renderTask(tasks[tasks.push(newTask) - 1]);
}

// Saves all tasks from tasks array to local storage
function saveTasks() {
	for (const task of tasks) {
		localStorage.setItem(task.id, JSON.stringify(task));
	}
}

// Gets all tasks from local storage, loads them to tasks array and sorts them by date
function loadTasks() {
	tasks = [];

	for (const entry of Object.entries(localStorage)) {
		tasks.push((JSON.parse(entry[1])));
	}

	tasks.sort((a, b) => a.date - b.date);

}

// Counts tasks in local storage
function countTasks() {
	return localStorage.length;
}

// Event which happens on checkbox click
function checkboxClicked(id, checked) {
	const div = document.getElementsByClassName(`div-${id}`)[0];
	const checkbox = document.getElementsByClassName(`checkbox-${id}`)[0];

	if (checked) {
		div.classList.add('bg-green-200');
		div.classList.remove('bg-gray-200');
		checkbox.setAttribute('checked', true);
		tasks.find(element => element.id === id).isChecked = true;
	} else {
		div.classList.remove('bg-green-200');
		div.classList.add('bg-gray-200');
		checkbox.setAttribute('checked', false);
		tasks.find(element => element.id === id).isChecked = false;
	}

	saveTasks();

	console.log(tasks.find(element => element.id === id).isChecked);
}

// Remove single task
function removeTask(id) {
	localStorage.removeItem(id);
	loadTasks();
	renderTasks();
}

// Generate unique ID for a task
// Not the best way, because Math.random() can cause issues
function generateUID() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Render a single task
function renderTask(task) {
		const container = document.getElementById('task-list');
		const html = `<div class="flex w-full" >
		<div class="flex flex-row mt-2 p-4 rounded-lg ${task.isChecked ? 'bg-green-200' : 'bg-gray-200'}
		 form-check w-full div-${task.id}">
		  <input class="checkbox-${task.id} 
		  form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white 
		  checked:bg-green-600 checked:border-green-600 focus:outline-none transition duration-200 
		  mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-3 ml-1 cursor-pointer " 
		  type="checkbox" value="" style="
		  transform: scale(1.5);
		  margin-top: auto;
		  margin-bottom: auto;
		  " onclick="checkboxClicked('${task.id}', checked);" ${task.isChecked ? 'checked' : ''}>
		  <label class="form-check-label inline-block text-gray-700 flex-1" 
		  style="
		  margin-top: auto;
		  margin-bottom: auto;
		  ">
			${task.text}
		  </label>
		  <button 
		  id="${tasks.id}"
		  onclick="removeTask('${task.id}')"
		  type="button" class="inline-block rounded-full bg-gray-500 text-white leading-normal uppercase shadow-md 
		  hover:bg-gray-600 hover:shadow-lg focus:bg-gray-600 focus:shadow-lg focus:outline-none focus:ring-0 
		  active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out w-9 h-9">
		  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 12 16" height="16px" width="16px" 
		  xmlns="http://www.w3.org/2000/svg" style="margin: auto;">
		  <path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 
		  6.52l3.75-3.75 1.48 1.48L7.48 8z" class=""></path></svg>
		</button>
	
		</div>
	  </div>`;
	
	  container.innerHTML = html + container.innerHTML;
};

// Render list of all tasks
function renderTasks() {
	const container = document.getElementById('task-list');
	container.innerHTML = '';

	for (const task of tasks) {
		renderTask(task);
	};
};

// Add a task when input box is active and Enter is pressed
document.getElementsByClassName('form-control')[0].addEventListener("keydown", () => {
	if(window.event.keyCode=='13'){
        addTaskBtn();
    }
});