import  { useEffect, useRef, useState } from 'react'

interface Cache {
  [id: string]: string;
}

const RedditInsight = () => {
   const [id, setId] = useState<string>("");
  const inp = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<string>("");
  const [cache, setCache] = useState<Cache>({});
  const [loading,setLoading] = useState<boolean>(false)
  const [error,setError] = useState<boolean>(false)
  const [disableSubmit,setDisableSubmit] = useState<boolean>(false)
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    console.log("in useeffect")
    
    if (id) {
      if (cache[id]) {
        setLoading(false)
        setDisableSubmit(true)
        typeWriter(cache[id]);
        setId("")
        return;
      }

      fetch(API_URL + id)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false)
          
           typeWriter(data.summary);
          if(inp.current){
            inp.current.value=""

          }
          setCache((prev) => ({ ...prev, [id]: data.summary }));
          setId("")
        });
    }
    
  }, [id]);




  function typeWriter(text: string, i = 0) {
    if (i >= text.length) {
    setDisableSubmit(false);
    return;
  }
  setSummary(text.slice(0, i + 1));
   setTimeout(() => typeWriter(text, i + 1), 50);

  }

  function summarize() {
    setError(false)
    setDisableSubmit(true)
    setLoading(true)
    const regx =
      /^https?:\/\/(?:www\.|old\.|m\.)?reddit\.com\/r\/([^\/]+)\/(?:comments|s)\/([A-Za-z0-9]+)(?:\/([^\/\?#]+)\/?)?(?:[\?#].*)?$/i;

    const matchingVars = inp?.current?.value?.match(regx);
    if (!matchingVars) {
      setError(true)
      setLoading(false)
      return;
    }
    // console.log(matchingVars[2]);
    setId(matchingVars[2]);
  }
  return (
    <div className="flex text-white h-screen items-center justify-center font-mono">
      <div className="flex flex-col items-center">
        <div className="text-center text-2xl mb-2">
          RedditInsight
          <div className="text-sm text-slate-500">summarize reddit thread</div>
        </div>
        {error ? <div className="md:w-[800px] min-h-96 md:min-h-48 mt-2 flex pl-4 text-red-600">Invalid URL</div> :<div className="w-4/5  md:w-[800px] text-sm md:text-lg mt-2 min-h-96 md:min-h-48 text-justify py-4 md:pl-4">{loading ?"thinking...": summary}</div>}
        <div className="flex absolute w-4/5 left-1/2 bottom-20 -translate-x-1/2 -translate-y-1/2 md:w-[800px] items-center justify-between rounded-full pr-2 bg-slate-800 md:h-16">
  
          <input
            ref={inp}
            placeholder="Paste a Reddit post URL — Summarize with AI "
            type="text"
            className="bg-transparent text-xs md:text-lg w-full h-10 rounded-lg outline-none p-4 "
          />
          <button onClick={summarize} disabled={disableSubmit} className="bg-slate-600 rounded-full p-1 md:p-2 flex justify-center items-center hover:bg-slate-700 w-6 h-6 md:w-10 md:h-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
            
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-send-horizontal-icon lucide-send-horizontal"
            >
              <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
              <path d="M6 12h16" />
            </svg>
          </button>
        </div>
        
      </div>
    </div>
  )
}

export default RedditInsight
