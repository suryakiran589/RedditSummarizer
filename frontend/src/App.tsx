import { useEffect } from "react"


function App() {

  useEffect(()=>{
    fetch("http://localhost:3000/123")
    .then((res) => res.json())
    .then(data => {
      console.log(data)
    })
  },[])
  return (
    <>
     surya
    </>
  )
}

export default App
