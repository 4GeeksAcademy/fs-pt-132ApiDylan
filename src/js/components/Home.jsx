import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {

	const [myuser, setMyUser] = useState("oscar");
	const [list, setList] = useState({});
	const [newTask, setnewTask] = useState("")
	const url = 'https://playground.4geeks.com/todo'

	const getUser = async () => {

		try {
			const resp = await fetch(url + '/users/' + myuser);

			if (!resp.ok) { throw new Error }
			const data = await resp.json();
			return setList(data)

		} catch (error) {
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
    const handleDone=async({label,is_done,id})=>{
		const formdata={label,
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





	return (
		<div className="text-center">

			<h1 className="text-center mt-5"> lista de tareas  de {list.name} </h1>


			<form className="mt-5" onSubmit={handleSubmit} >

				<input type="text" value={newTask} onChange={handleChange} />

				<input type="submit" value="enviar" />







			</form>






			<ul>

				{list.todos?.map(el => <li key={el.id} className= {el.is_done? 'bg-success': 'border'}> {el.label} <span className="fa-regular fa-trash-can" onClick={() => handleDelete(el.id)}>
					</span>
					<span className={`fa-solid ${el.is_done?'fa-xmark': 'fa-check' }`} onClick={() => handleDone(el)}></span> </li>)}

			</ul>











		</div>
	);
};

export default Home;