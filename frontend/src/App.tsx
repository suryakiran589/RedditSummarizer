import { useEffect, useRef, useState } from "react";

interface Cache {
  [id: string]: string;
}

function App() {
  const [id, setId] = useState("");
  const inp = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState("");
  const [cache, setCache] = useState<Cache>({});
  const [loading,setLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log("in useeffect")
    if (id) {
      if (cache[id]) {
        setLoading(false)
        typeWriter(cache[id]);
        return;
      }

      fetch("http://localhost:3000/" + id)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.summary);
          setLoading(false)
          typeWriter(data.summary);
          setCache((prev) => ({ ...prev, [id]: data.summary }));
          setId("")
        });
    }
  }, [id]);



  function typeWriter(text: string, i = 0) {
    if (i < text.length) {
      setSummary(text.substring(0, i + 1));
      setTimeout(() => {
        typeWriter(text, i + 1);
      }, 50);
    }
  }

  function summarize() {
    setLoading(true)
    const regx =
      /^https?:\/\/(?:www\.|old\.|m\.)?reddit\.com\/r\/([^\/]+)\/comments\/([A-Za-z0-9]+)\/([^\/\?#]+)\/?(?:[\?#].*)?$/i;
    const matchingVars = inp?.current?.value?.match(regx);
    if (!matchingVars) {
      return;
    }
    console.log(matchingVars[2]);
    setId(matchingVars[2]);
  }
  return (
    <div className="flex text-white h-screen items-center justify-center font-mono">
      <div>
        <div className="flex items-center justify-between rounded-3xl pr-2 bg-slate-800 h-20">
          <input
            ref={inp}
            placeholder="paste your reddit link"
            type="text"
            className="bg-transparent min-w-[500px] h-10 rounded-lg outline-none p-4 "
          />
          <button onClick={summarize} className="bg-slate-600 rounded-full  flex justify-center items-center  w-10 h-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-send-horizontal-icon lucide-send-horizontal"
            >
              <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
              <path d="M6 12h16" />
            </svg>
          </button>
        </div>
        <div className="w-[600px] min-h-48 flex pl-4">{loading ?"thinking...": summary}</div>
      </div>
    </div>
  );
}

export default App;
