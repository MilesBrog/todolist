import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import format from 'date-fns/format';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";

const App = () => {
	const [todos, setTodos] = useState(() => {
		const saveTodos = localStorage.getItem("todoStorage");
		if (saveTodos) {
			return JSON.parse(saveTodos);
		}
		else {
			return [];
		}
	});
	const [todo, setTodo] = useState("");
	const [description, setDescription] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [canSave, setCanSave] = useState(false);
	const [debugWord, setDebugWord] = useState("");
	const [currentTodo, setCurrentTodo] = useState({});
	const [startTime, setStartTime] = useState();
	const [currentStartTime, setCurrentStartTime] = useState();
	const [endTime, setEndTime] = useState();
	const [currentEndTime, setCurrentEndTime] = useState();
	let checking = true;

	function handleEditInputChange(e) {
		setCurrentTodo({ ...currentTodo, text: e.target.value, startTime: format(currentStartTime, 'MMMM dd,yyyy'), endTime: format(currentEndTime, 'MMMM dd,yyyy') });
	}

	function handleEditDescriptionChange(e) {
		setCurrentTodo({ ...currentTodo, description:e.target.value , startTime: format(currentStartTime, 'MMMM dd,yyyy'), endTime: format(currentEndTime, 'MMMM dd,yyyy') });
	}

	function handleEditStartTime(date) {
		setCurrentStartTime(date);
		setCurrentTodo({ ...currentTodo, startTime: format(date, 'MMMM dd,yyyy') });
	}

	function handleEditEndTime(date) {
		setCurrentEndTime(date);
		setCurrentTodo({ ...currentTodo, endTime: format(date, 'MMMM dd,yyyy') });
	}

	function handleInputChange(e) {
		setTodo(e.target.value);
	}

	function handleInputDescriptionChange(e) {
		setDescription(e.target.value);
	}

	useEffect(() => {
		localStorage.setItem("todoStorage", JSON.stringify(todos))
	}, [todos])

	function checkCanSave() {
		if (startTime.getFullYear() <= endTime.getFullYear()) {
			if (startTime.getMonth() + 1 <= endTime.getMonth() + 1) {
				if (startTime.getDate() < endTime.getDate() && startTime.getMonth() + 1 === endTime.getMonth() + 1) {
					checking = true;
					setDebugWord("Your data is saved");
				}
				else if (startTime.getMonth() + 1 < endTime.getMonth() + 1) {
					checking = true;
					setDebugWord("Your data is saved");
				}
				else {
					checking = false;
					setDebugWord("Something went wrong. Please check 'Duration'");
				}
			}
			else {
				checking = false;
				setDebugWord("Something went wrong. Please check 'Duration'");
			}
		}
		else {
			checking = false;
			setDebugWord("Something went wrong. Please check 'Duration'");
		}
	}

	function handleFormSubmit(e) {

		e.preventDefault();
		checkCanSave();
		setCanSave(checking);

		if (todo !== "" && checking === true) {
			setTodos([
				...todos,
				{
					id: Math.floor(Math.random() * 1000),
					text: todo.trim(),
					description: description.trim(),
					finishstatus: false,
					startTime: format(startTime, 'MMMM dd,yyyy'),
					endTime: format(endTime, 'MMMM dd,yyyy')
				}
			])
		}

		setTodo("");
		setDescription("");
	}

	function handleDeleteClick(id) {
		const removeItem = todos.filter((data) => {
			return data.id !== id
		})

		setTodos(removeItem);
	}

	function handleEditClick(editTodo) {
		setIsEditing(true);
		setCurrentTodo({ ...editTodo })
		setCurrentStartTime(new Date(editTodo.startTime))
		setCurrentEndTime(new Date(editTodo.endTime))
	}

	function handleUpdateTodo(id, updatedTodo) {
		const updatedItem = todos.map((data) => {
			return data.id === id ? updatedTodo : data;
		});

		setIsEditing(false);
		setTodos(updatedItem);
	}

	function handleEditFormSubmit(e) {
		e.preventDefault();

		handleUpdateTodo(currentTodo.id, currentTodo);
	}

	function handleFinish(id) {
		const updataStatus = todos.map((data) => {
			if (data.id === id) {
				if (data.finishstatus === false) {
					data.finishstatus = true;
				}
				else {
					data.finishstatus = false;
				}
			}
			return data;
		});
		setTodos(updataStatus);
	}

	return (
		<div className="App">
			<header className="App-header">
				<h1>Todolist App</h1>
			</header>
			<div className="input-field">
				{isEditing ? (
					<form onSubmit={handleEditFormSubmit} className="input-left">
						<h2>Edit todo</h2>
						<input
							type="text"
							placeholder="Edit todo"
							value={currentTodo.text}
							onChange={handleEditInputChange}
						/>
						<input
							type="text"
							placeholder="Description"
							value={currentTodo.description}
							onChange={handleEditDescriptionChange}
						/>
						<div className="duration">
							<p>Duration</p>
							<DatePicker className="startDate"
								selected={currentStartTime}
								onChange={(date) => handleEditStartTime(date)}
								dateFormat="MM/dd/yyyy"
							/>
							<p>to</p>
							<DatePicker className="endDate"
								selected={currentEndTime}
								onChange={(date) => handleEditEndTime(date)}
								dateFormat="MM/dd/yyyy"
							/>
						</div>
					</form>) : (
					<form onSubmit={handleFormSubmit} className="input-left">
						<input
							type="text"
							placeholder="Create a new todo"
							value={todo}
							onChange={handleInputChange}
						/>
						<input
							type="text"
							placeholder="Description"
							value={description}
							onChange={handleInputDescriptionChange}
						/>
						<div className="duration">
							<p>Duration</p>
							<DatePicker className="startDate"
								selected={startTime}
								onChange={(date) => setStartTime(date)}
								dateFormat="MM/dd/yyyy"
							/>
							<p>to</p>
							<DatePicker className="endDate"
								selected={endTime}
								onChange={(date) => setEndTime(date)}
								dateFormat="MM/dd/yyyy"
							/>
						</div>
						<p className={canSave === true ? "save-success" : "save-fail"}>{debugWord}</p>
					</form>)
				}
				<div className="input-right">
					{isEditing ?
						<div className="input-left">
							<i className="fa-solid fa-check" onClick={handleEditFormSubmit} />
							<i className="fa-solid fa-xmark" onClick={() => setIsEditing(false)} />
						</div>
						: <i className="fa-solid fa-plus" onClick={handleFormSubmit} />}
				</div>
			</div>
			<div className="list">
				<ul className="todo-list">
					{todos.map((todoData) => (
						<li key={todoData.id} className={todoData.finishstatus ? "finish" : null}>
							<div className="first">
								<i className="fa-solid fa-check" onClick={() => handleFinish(todoData.id)} />
							</div>
							<div className="center">
								<p>Todo : {todoData.text}</p>
								<p>Description : {todoData.description}</p>
								<p>Duration : {todoData.startTime + " - " + todoData.endTime}</p>
							</div>
							<div className="last">
								<i className="fa-solid fa-pencil" onClick={() => handleEditClick(todoData)} />
								<i className="fa-solid fa-trash-can delete" onClick={() => handleDeleteClick(todoData.id)} />
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default App;
