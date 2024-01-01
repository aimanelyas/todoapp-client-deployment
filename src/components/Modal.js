import { useCallback, useState } from 'react'
import { useCookies } from 'react-cookie'

    const Modal = ({mode, setShowModal, getData, task}) => {

    const [cookies, setCookie, removeCookie] = useCookies()
    //create 2 mode which is create and edit mode. 2nd line is conditional to change from create to edit mode. No need to hard code mode = 'create' since already passed it thrugh the the prosps above.
    const editMode = mode === 'edit' ? true : false

//using useState to construct data variable using object state.
    const [data, setData] = useState({
        user_email: editMode ? task.user_email : cookies.Email,
        title: editMode ? task.title : null,
        progress: editMode ? task.progress : 50,
        date: editMode ? task.date : new Date()
    })

    const postData = async(e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                console.log('WORKED')
                setShowModal(false)
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const editData = async(e) => {
        e.preventDefault()
        try {
             const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
                method: "PUT",
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                setShowModal(false)
                getData()
            } 
        } catch (err) {
            console.error(err)
        }
    }

//extract name and value from the object that created from the form below. there's 2 input below with 2 different names, title and progress.
    const handleChange = (e) => {
        const {name, value} = e.target
    
//overwrite the old data with the new data. it will overwrite name which is title a
    setData(data => ({
        ...data,
        [name] : value
    }))

    console.log(data)
}

    return (
        <div className="overlay">
            <div className="modal">
                <div className="form-title-container">
                    <h3>Let's { mode } your task</h3>
                    <button onClick={() => setShowModal(false)}>X</button>
                </div>

                <form>
                    <input 
                    required
                    maxLength={30}
                    placeholder=" Your task goes here"
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                    />
                    <br />
                    <label for="range">Drag to select your current progress</label>
                    <input 
                    required
                    type="range"
                    id="range"
                    min="0"
                    max="100"
                    name="progress"
                    value={data.progress}
                    onChange={handleChange}
                    />
                    <input className={mode} type="submit" onClick={editMode ? editData : postData} />
                </form>
            </div>
        </div>
    )
}

export default Modal