'use strict';

let tasks = []; // Stores all tasks locally
let settings = {
	theme: 'light'
}; 

// App Initialization
(() => {
	console.log('App Init')
	loadSettings();
	changeTheme();
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
		if (entry[0] !== 'settings') {
			tasks.push((JSON.parse(entry[1])));
		};
	};

	tasks.sort((a, b) => a.date - b.date);

}

// Counts tasks in local storage
function countTasks() {
	return localStorage.length;
}

// Event which happens on checkbox click
function checkboxClicked(id, checked) {
	const checkbox = document.getElementsByClassName(`checkbox-${id}`)[0];

	if (checked) {
		checkbox.setAttribute('checked', true);
		tasks.find(element => element.id === id).isChecked = true;
	} else {
		checkbox.setAttribute('checked', false);
		tasks.find(element => element.id === id).isChecked = false;
	}

	saveTasks();
	renderTasks();

	// console.log(tasks.find(element => element.id === id).isChecked);
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
		<div class="flex flex-row mt-2 p-4 rounded-lg border 

		${
			(settings.theme === 'dark') ? 
			(task.isChecked ? 'bg-emerald-900 border-emerald-700' : 'bg-gray-800 border-gray-700') : 
			(task.isChecked ? 'bg-green-200 border-green-300' : 'bg-gray-200 border-gray-300')
		}

		 form-check w-full div-${task.id}">
		  <input class="checkbox-${task.id} 
		  form-check-input appearance-none h-4 w-4 border rounded-sm 

		  ${
			(settings.theme === 'dark') ? 
			'bg-slate-600 checked:bg-green-700 checked:border-green-600 border-slate-500' : 
			'bg-white checked:bg-green-600 checked:border-green-500 border-gray-300'
		  }

		  focus:outline-none  
		  mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-3 ml-1 cursor-pointer " 
		  type="checkbox" value="" style="
		  transform: scale(1.5);
		  margin-top: auto;
		  margin-bottom: auto;
		  " onclick="checkboxClicked('${task.id}', checked);" ${task.isChecked ? 'checked' : ''}>
		  <label class="form-check-label inline-block 
		  
		  ${
			(settings.theme === 'dark') ? 
			(task.isChecked ? 'text-green-300' : 'text-gray-400') : 
			(task.isChecked ? 'text-green-800' : 'text-gray-700')
		}
		 
		  flex-1" 
		  style="
		  margin-top: auto;
		  margin-bottom: auto;
		  ">
			${task.text}
		  </label>
		  <button 
		  id="${tasks.id}"
		  onclick="removeTask('${task.id}')"
		  type="button" class="
		  
		  ${
			(settings.theme === 'dark') ? 
			(task.isChecked ? 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white') : 
			(task.isChecked ? 'bg-gray-500 text-gray-100 hover:bg-gray-600' : 'bg-gray-500 text-gray-100 hover:bg-gray-600')
		}
		 
		  inline-block rounded-full text-white leading-normal uppercase shadow-md 
		  hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 
		  active:shadow-lg transition duration-150 ease-in-out w-9 h-9">
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

function loadSettings() {
	if (localStorage.getItem('settings')) {
		settings = JSON.parse(localStorage.getItem('settings'));
	}
}

function saveSettings() {
	localStorage.setItem('settings', JSON.stringify(settings))
}

function changeThemeBtn() {
	settings.theme === 'dark' ? settings.theme = 'light' : settings.theme = 'dark';
	saveSettings();
	changeTheme();
}

function changeTheme() {
	console.log(settings.theme)

	const body = document.querySelector('body');
	const container = document.querySelector('main');
	const taskInput = document.querySelector('input.form-control');
	const themeBtn = document.querySelectorAll('button.themebtn');

	console.log(themeBtn[0].innerHTML);

	if (settings.theme === 'dark') {
		body.classList.remove('body-bg-light');
		body.classList.add('body-bg-dark');

		container.classList.remove('bg-white');
		container.classList.add('bg-slate-900');

		taskInput.classList.remove('bg-white');
		taskInput.classList.add('bg-slate-600');
		taskInput.classList.add('focus:bg-slate-700');
		taskInput.classList.remove('focus:bg-white');
		taskInput.classList.add('text-white');
		taskInput.classList.remove('text-gray-700');
		taskInput.classList.add('focus:text-gray-200');
		taskInput.classList.remove('focus:text-gray-700');
		taskInput.classList.add('border-slate-500');
		taskInput.classList.remove('border-gray-300');

		themeBtn[0].innerHTML =
		`<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
		class="w-6 h-6 mr-2" style="margin: auto;">
			<path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" class="stroke-white dark:stroke-white"></path>
			<path d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 
			20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836" class="stroke-white dark:stroke-white"></path>
		</svg>`
        themeBtn[0].classList.add('border-gray-700');
        themeBtn[0].classList.remove('border-gray-900');

	} else {
		body.classList.add('body-bg-light');
		body.classList.remove('body-bg-dark');

		container.classList.add('bg-white');
		container.classList.remove('bg-slate-900');

		taskInput.classList.add('bg-white');
		taskInput.classList.remove('bg-slate-600');
		taskInput.classList.remove('focus:bg-slate-700');
		taskInput.classList.add('focus:bg-white');
		taskInput.classList.remove('text-white');
		taskInput.classList.add('text-gray-700');
		taskInput.classList.remove('focus:text-gray-200');
		taskInput.classList.add('focus:text-gray-700');
		taskInput.classList.remove('border-slate-500');
		taskInput.classList.add('border-blue-400');

		themeBtn[0].innerHTML =
		`<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 mr-2"  style="margin: auto;">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M17.715 15.15A6.5 6.5 0 0 1 9 
			6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z" 
			class="fill-sky-400/20"></path>
			<path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 
			6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 
			7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 
			9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 
			9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 
			12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 
			0 6.553-2.327 7.622-5.537l-1.897-.632Z" class="fill-white"></path>
			<path fill-rule="evenodd" clip-rule="evenodd" d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 
			2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z" 
			class="fill-white"></path>
		</svg>`
        themeBtn[0].classList.remove('border-gray-700');
        themeBtn[0].classList.add('border-gray-900');

	}

	renderTasks()
}