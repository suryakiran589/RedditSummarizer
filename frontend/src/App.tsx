import { useEffect, useRef, useState } from "react"


function App() {
  const [id,setId] = useState("")
  const inp = useRef(null)
  const [summary,setSummary] = useState("")
  const [cache,setCache] = useState<any>({})

  useEffect(()=>{
    if(id){
      if(cache[id]){
        typeWriter(cache[id])
        return;
      }

      fetch("http://localhost:3000/"+id)
      .then((res) => res.json())
      .then(data => {
        console.log(data.summary)
        // setSummary(data.summary)
        typeWriter(data.summary)
        setCache(prev => ({...prev,[id]:data.summary}))
      })
    }
  },[id])

  useEffect(() =>{
    
  },[])

  function typeWriter(text:string,i=0){
    if(i < text.length){
      setSummary(text.substring(0,i+1))
      setTimeout(() => {
        typeWriter(text,i+1)
      }, 50);
    }
    
  }

  function summarize(){
    const regx= /^https?:\/\/(?:www\.|old\.|m\.)?reddit\.com\/r\/([^\/]+)\/comments\/([A-Za-z0-9]+)\/([^\/\?#]+)\/?(?:[\?#].*)?$/i;
    const matchingVars = inp?.current?.value.match(regx)
    console.log(matchingVars[2]) 
    setId(matchingVars[2])

  }
  return (
    <>
     <div>
      <input ref={inp} type="text" />
      <button onClick={summarize}>summarize</button>
     </div>
     <div>
      {summary}
     </div>
    </>
  )
}

export default App
