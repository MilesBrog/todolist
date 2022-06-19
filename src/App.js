import { useState, useEffect } from 'react';
import './App.css';

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
	const [isEditing, setIsEditing] = useState(false);
	const [currentTodo, setCurrendTodo] = useState({});

	function handleEditInputChange(e) {
		setCurrendTodo({ ...currentTodo, text: e.target.value })
		console.log("Current Todo", currentTodo);
	}

	useEffect(() => {
		localStorage.setItem("todoStorage", JSON.stringify(todos))
	}, [todos])

	function handleInputChange(e) {
		setTodo(e.target.value);
	}

	function handleFormSubmit(e) {

		e.preventDefault();

		if (todo !== "") {
			setTodos([
				...todos,
				{
					id: Math.floor(Math.random() * 1000),
					text: todo.trim(),
					finishstatus: false
				}
			])
		}
		
		setTodo("");
	}

	function handleDeleteClick(id) {
		const removeItem = todos.filter((data) => {
			return data.id !== id
		})

		setTodos(removeItem);
	}

	function handleEditClick(todo) {
		setIsEditing(true);
		setCurrendTodo({ ...todo })
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
			if(data.id === id) {
				if(data.finishstatus === false){
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
					<form onSubmit={handleEditFormSubmit}>
						<h2>Edit Todo</h2>
						<label htmlFor="editTodo">Edit todo:</label>
						<input
							type="text"
							placeholder="Edit todo"
							value={currentTodo.text}
							onChange={handleEditInputChange}
						/>
						<button type="submit"><i className="fa-solid fa-check" /></button>
						<button onClick={() => setIsEditing(false)}><i className="fa-solid fa-xmark" /></button>
					</form>) : (
					<form onSubmit={handleFormSubmit}>
						<input
							type="text"
							placeholder="Create a new todo"
							value={todo}
							onChange={handleInputChange}
						/>
						<i className="fa-solid fa-plus" onClick={handleFormSubmit} />
					</form>)
				}
			</div>
			<div className="list">
				<ul className="todo-list">
					{todos.map((todo) => (
						<li key={todo.id} className={todo.finishstatus ? "finish" : null}>
							<div className="first">
								<i className="fa-solid fa-check" onClick={() => handleFinish(todo.id)} />
							</div>
							<div className="center">
								<p>{todo.text}</p>
							</div>
							<div className="last">
								<i className="fa-solid fa-pencil" onClick={() => handleEditClick(todo)} />
								<i className="fa-solid fa-trash-can delete" onClick={() => handleDeleteClick(todo.id)} />
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default App;
