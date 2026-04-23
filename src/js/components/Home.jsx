import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {

	const [myuser, setMyUser] = useState("Dylan");
	const [list, setList] = useState({});
	const [newTask, setnewTask] = useState("")
	const url = 'https://playground.4geeks.com/todo'

	const getUser = async () => {

		try {
			const resp = await fetch(url + '/users/' + myuser);
			console.log("Status GET:", resp.status);
			if (!resp.ok) { throw new Error }
			const data = await resp.json();
			return setList(data)

		} catch (error) {
			console.error("Falló getUser, intentando crear...");
			// 			
			createUser()
		}

	}
	//    creamos la funcion que crea mi usario para poder introducir informacion del usario
	const createUser = async () => {
		try {
			const resp = await fetch(url + '/users/' + myuser, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				}

			})
			if (!resp.ok) { throw new Error }
			const data = await resp.json();
			getUser();
			return data;


		} catch (error) {

		}



	}


	const handleChange = (e) => {

		setnewTask(e.target.value);


	}

	const handleSubmit = async (e) => {

		e.preventDefault();
		if (newTask.trim() === "") return;
		try {
			const resp = await fetch(url + '/todos/' + myuser, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(
					{
						label: newTask.trim(),
						is_done: false
					}

				)

			})
			if (!resp.ok) { throw new Error }
			const data = await resp.json();
			setnewTask("")
			getUser();
			return data;


		} catch (error) {

		}





	}

	const handleDelete = async (id) => {
		try {
			const resp = await fetch(url + '/todos/' + id, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json'
				}


			})
			if (!resp.ok) { throw new Error }

			return getUser()


		} catch (error) {

		}
	}
	const handleDone = async ({ label, is_done, id }) => {
		const formdata = {
			label,
			is_done: !is_done

		}
		try {
			const resp = await fetch(url + '/todos/' + id, {
				method: "PUT",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formdata)

			})
			if (!resp.ok) { throw new Error }
			const data = await resp.json();
			setnewTask("")
			getUser();
			return data;


		} catch (error) {



		}
	}
	useEffect(() => {

		getUser();


	}, [])



	// console.log(list)

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6">



					<h1 className="text-center mb-4"> Lista de tareas de  <span className="text-primay"> {list.name} </span>

					</h1>


					<form className="input-group mb-4" onSubmit={handleSubmit} >

						<input className="form-control" type="text" placeholder="añadir nueva tarea" value={newTask} onChange={handleChange}

						/>

						<button className="btn btn-primary" type="submit" >
							<i className="fa-solid fa-plus"></i> Añadir
						</button>
					</form>

					<ul className="list-group shadow-sm">

						{
						list.todos?.length===0 ?
						<li className="list-group-item">No tienes tareas pendientes</li> 
						:
						list.todos?.map(el => <li key={el.id} className={`list-group-item d-flex justify-content-between ${el.is_done ? 'text-decoration-line-through' : 'border'}`}> {el.label}
							<div >
								<button className="btn btn-danger me-2" onClick={() => handleDelete(el.id)}>
									<span className="fa-regular fa-trash-can ">
									</span>

								</button>
								<button className={`btn btn-outline-${!el.is_done? 'success':'danger'} `} 
								onClick={() => handleDone(el)}>
									<span className={`fa-solid ${el.is_done ? 'fa-xmark' : 'fa-check'}`}></span>
								</button>
							</div>

						</li>)}

					</ul>









				</div>

			</div>

		</div>
	);
};

export default Home;